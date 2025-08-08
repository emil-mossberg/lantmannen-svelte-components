import { z } from 'zod'

import magentoSvelteBridge from '../lib/stores/MagentoSvelteBridge.svelte'

export const StockPropsSchema = z
    .object({
        sku: z.string().min(1),
        isVirtualProduct: z.string().nullable().transform(val => val === '1'),
        isPdpCard: z
            .string()
            .nullable()
            .transform((val) => val === '1'),
        prefSalesQty: z
            .string()
            .nullable()
            .transform((val) => {
                const num = Number(val)
                return Number.isNaN(num) ? 1 : num
            }),
        packagingType: z.string().nullable(),
        packagingTypeSe: z.string().nullable(),
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
            prefSalesQty: data.prefSalesQty,
            isBulk,
            isBulkFi,
            isPdpCard: data.isPdpCard,
            isVirtualProduct: data.isVirtualProduct
        }
    })

export type StockProps = z.infer<typeof StockPropsSchema>
