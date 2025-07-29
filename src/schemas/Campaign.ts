import { z } from 'zod'

import { CartInformationSchema } from './CartInformation'
import { PriceSchema } from './Price'
import { StockSchema } from './Stock'

export const CampaignItemSchema = z.object({
    campaign_id: z.string(),
    campaign_name: z.string(),
    campaign_period_type: z.null(), // or z.string().nullable() if it might become a string
    campaign_type: z.string(),
    order_date: z.string(), // optionally use z.coerce.date() if you want to parse it
    period: z.string().nullable(), // TO DO fix this, dont think its string
    prices: z.array(PriceSchema),
    stocks: z.array(StockSchema),
})

export const CampaignSchema = z.object({
    cart_information: CartInformationSchema,
    items: z.array(CampaignItemSchema),
})

export type CampaignItem = z.infer<typeof CampaignItemSchema>
export type Campaign = z.infer<typeof CampaignSchema>
