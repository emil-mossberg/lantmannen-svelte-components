import { z } from 'zod'

import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export const PricePropsSchema = z
  .object({
    id: z.string().min(1),
    prefSalesQty: z
      .string()
      .nullable()
      .transform((val) => {
        const num = Number(val)

        return Number.isNaN(num) || num === 0 ? 1 : num
      }),
    newProduct: z.string().transform((val) => val === '1'),
    palletDiscountInformation: z.string().nullable(),
    showPalletAttribute: z
      .string()
      .nullable()
      .transform((val) => val === '1'),
    priceBoxUnit: z.string().nullable().default(''),
    prefSalesQtyUnit: z.string().nullable().default(''),
    packagingType: z.string().nullable(),
  })
  .transform((data) => {
    const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(
      data.packagingType ?? '',
    )

    return {
      id: data.id,
      prefSalesQty: data.prefSalesQty,
      newProduct: data.newProduct,
      palletDiscountInformation: data.palletDiscountInformation,
      showPalletAttribute: data.showPalletAttribute,
      priceBoxUnit: data.priceBoxUnit,
      prefSalesQtyUnit: data.prefSalesQtyUnit,
      isBulkFi,
    }
  })

export type StockProps = z.infer<typeof PricePropsSchema>
