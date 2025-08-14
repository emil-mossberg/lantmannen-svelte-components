import z from 'zod'

import { DeliveryAddressSchema } from '@lib/schemas/DeliveryAddress'
import { DeliveryMethodSchema } from '@lib/schemas/DeliveryMethod'

export const DeliveryInfoSchema = z.object({
  address: DeliveryAddressSchema.nullable(),
  method: DeliveryMethodSchema.nullable(),
  date: z.string(),
  campaignId: z.string().nullable(),
  qty: z.number(),
})

export type DeliveryInfo = z.infer<typeof DeliveryInfoSchema>
