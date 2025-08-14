import { z } from 'zod'
import { localeCodeSchema } from '@lib/schemas/Locale'

const boolFromString = z.string().transform((v) => v === '1')
const numFromString = z.string().transform(Number)

const datasetSchema = z.object({
  storeId: numFromString,
  locale: localeCodeSchema,
  loggedIn: boolFromString,
  configShowListPrice: boolFromString,
  configShowVatPercentage: boolFromString,
  configShowInclVatPdp: boolFromString,
  configShowExclVatPdp: boolFromString,
  configShowInclVatPlp: boolFromString,
  configShowExclVatPlp: boolFromString,
  vatEnabled: boolFromString,
  showDeliveryBox: boolFromString,
  configPaymentCampaignEnabled: boolFromString,
  configPaymentCampaign: z.string().default(''),
  showDeliveryPlanner: boolFromString,
  tonnagePackageType: z
    .string()
    .transform((v) =>
      v && v.trim() !== '' ? v.split(',').map((s) => s.trim()) : [],
    ),
})

export const MagentoSvelteBridgeSchema = z
  .instanceof(HTMLElement, {
    message: '#svelte-information must be an HTMLElement',
  })
  .transform((el) => el.dataset) // Now we only have dataset
  .pipe(datasetSchema) // Validate/transform dataset into final object

export type SvelteBridgeData = z.infer<typeof datasetSchema>
