import { z } from 'zod'


// TO DO add what else is needed
export const CampaignSchema = z.object({
  campaign_id: z.string(),
  campaign_name: z.string(),
  campaign_period_type: z.null(), // or z.string().nullable() if it might become a string
  campaign_type: z.string(),
  order_date: z.string(), // optionally use z.coerce.date() if you want to parse it
})

export type Campaign = z.infer<typeof CampaignSchema>