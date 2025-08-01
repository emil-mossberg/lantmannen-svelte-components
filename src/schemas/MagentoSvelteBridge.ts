import { z } from 'zod'
import { localeCodeSchema } from './Locale'

export const MagentoSvelteBridgeSchema = z.object({
    storeId: z.string().transform(Number),
    locale: localeCodeSchema,
    loggedIn: z.string().optional().transform(val => val === '1'),
    configShowListPrice: z.string().optional().transform(val => val === '1'),
    configShowVatPercentage: z.string().optional().transform(val => val === '1'),
    configShowInclVatPdp: z.string().optional().transform(val => val === '1'),
    configShowExclVatPdp: z.string().optional().transform(val => val === '1'),
    configShowInclVatPlp: z.string().optional().transform(val => val === '1'),
    configShowExclVatPlp: z.string().optional().transform(val => val === '1'),
    configPaymentCampaignEnabled: z.string().optional().transform(val => val === '1'),
    configPaymentCampaign: z.string().optional().default(''),
    showDeliveryPlanner: z.string().optional().transform(val => val === '1'),
    tonnagePackageType: z
        .string()
        .optional()
        .transform((val) =>
            val && val.trim() !== '' ? val.split(',').map((s) => s.trim()) : []
        ),
})


export type SvelteBridgeData = z.infer<typeof MagentoSvelteBridgeSchema>