import { z } from 'zod'

import magentoSvelteBridge from '../lib/stores/MagentoSvelteBridge.svelte'


export const StockPropsSchema = z
    .object({
        sku: z.string().min(1),
        prefSalesQuantity: z
            .string()
            .nullable()
            .transform((val) => {
                const num = Number(val)
                return Number.isNaN(num) ? 1 : num
            }),
        packagingType: z.string().optional(),
        packagingTypeSe: z.string().optional(),
    })
    .transform((data) => {
        const effectivePackagingType =
            data.packagingType || data.packagingTypeSe || ''
        const isBulk = magentoSvelteBridge.tonnagePackageType.includes(
            effectivePackagingType
        )
        const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(
            data.packagingType ?? ''
        )

        return {
            sku: data.sku,
            prefSalesQuantity: data.prefSalesQuantity,
            isBulk,
            isBulkFi,
        }
    })

export type StockProps = z.infer<typeof StockPropsSchema>
