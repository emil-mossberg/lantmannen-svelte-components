import { z } from 'zod'

export const CartInformationSchema = z.object({
  cart_has_pay_campaign: z.boolean(),
  cart_is_empty: z.boolean(),
  pay_campaign_id: z.string(),
  pay_campaign_name: z.string(),
})

export type CartInformation = z.infer<typeof CartInformationSchema>