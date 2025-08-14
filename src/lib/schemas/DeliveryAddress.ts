import z from 'zod'

export const DeliveryAddressSchema = z.object({
    address: z.string(),
    adressId: z.string(),
})

export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>