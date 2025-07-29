import { z } from 'zod'

export const CustomerInfoSchema = z.object({
    assortment: z.string(), // e.g. "000040,LBL1"
    credit_status: z.string(), // e.g. "0"
    current_company_number: z.string(), // e.g. "10000003"
    customer_group: z.string(), // e.g. "140"
    data_id: z.number(), // e.g. 1750685614
    e2_customer_list_json: z.string(), // still a string, not parsed
    fake_campaigns: z.string(), // can be empty
    firstname: z.string(),
    fullname: z.string(),
    payment_method: z.string(),
    silo_exist: z.boolean(),
    user_email: z.string().email(),
    user_first_name: z.string(),
    user_last_name: z.string(),
    valid_campaigns: z.string(), // e.g. comma-separated string of IDs
    websiteId: z.string(),
})

export type CustomerInfo = z.infer<typeof CustomerInfoSchema>
