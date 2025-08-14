import { z } from 'zod'

import { CartInformationSchema } from '@lib/schemas/CartInformation'
import { PriceSchema } from '@lib/schemas/Price'
import { StockSchema } from '@lib/schemas/Stock'

export const CampaignItemSchema = z.object({
    campaign_id: z.string(),
    campaign_name: z.string(),
    campaign_period_type:  z.string().nullable(), 
    campaign_type: z.string(),
    order_date: z.string(), 
    period: z.string().nullable(), 
    prices: z.array(PriceSchema),
    stocks: z.array(StockSchema),
})

export const CampaignSchema = z.object({
    cart_information: CartInformationSchema,
    items: z.array(CampaignItemSchema),
})

export type CampaignItem = z.infer<typeof CampaignItemSchema>
export type Campaign = z.infer<typeof CampaignSchema>
