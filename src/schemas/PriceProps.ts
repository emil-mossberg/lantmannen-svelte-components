import { z } from 'zod'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export const PricePropsSchema = z
  .instanceof(HTMLElement)
  .transform((el) => {
    return el.dataset
  })
  .pipe(
    z
      .object({
        id: z.string().min(1),
        prefSalesQty: z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) || num === 0 ? 1 : num
        }),
        packagingType: z.string(),
        newProduct: z.string().transform((val) => val === '1'),
        palletDiscountInformation: z.string(),
        showPalletAttribute: z.string().transform((val) => val === '1'),
        priceBoxUnit: z.string(),
        prefSalesQtyUnit: z.string(),
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
      }),
  )

export type PriceProps = z.infer<typeof PricePropsSchema>