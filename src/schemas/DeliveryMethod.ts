import z from 'zod'

export const DeliveryMethodSchema = z.object({
    delivery_method: z.string(),
    delivery_method_name: z.string(),
})


export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>