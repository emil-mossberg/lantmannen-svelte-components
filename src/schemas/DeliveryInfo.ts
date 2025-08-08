import z from 'zod'

import { DeliveryAddressSchema } from './DeliveryAddress'
import { DeliveryMethodSchema } from './DeliveryMethod'

export const DeliveryInfoSchema = z.object({
  address: DeliveryAddressSchema.nullable(),
  method: DeliveryMethodSchema.nullable(),
  date: z.string(),
  campaignId: z.string().nullable(),
  qty: z.number(),
})

export type DeliveryInfo = z.infer<typeof DeliveryInfoSchema>
