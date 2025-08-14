import { z } from 'zod'
import {
  transformPrefSalesQty,
  isBulkPackaging,
} from '@lib/utils/transformHelpers'

export const BuyBoxPropsSchema = z
  .instanceof(HTMLElement)
  .transform((el) => el.dataset)
  .pipe(
    z
      .object({
        id: z.string().min(1),
        sku: z.string().min(1),
        isBuyable: z.string().transform((val) => val === '1'),
        isVirtualProduct: z.string().transform((val) => val === '1'),
        prefSalesQty: z.string().transform(transformPrefSalesQty),
        packagingType: z.string().nullable(),
        packagingTypeSe: z.string().nullable(),
        qtyIncrement: z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) || num <= 0 ? 1 : num
        }),
        qtyMin: z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) || num <= 0 ? 1 : num
        }),
        isPdpCard: z.string().transform((val) => val === '1'),
        priceBoxUnit: z.string().nullable().default(''),
      })
      .transform((data) => {
        return {
          id: data.id,
          sku: data.sku,
          prefSalesQty: data.prefSalesQty,
          qtyIncrement: data.qtyIncrement,
          qtyMin: data.qtyMin,
          isPdpCard: data.isPdpCard,
          priceBoxUnit: data.priceBoxUnit,
          isBulk: isBulkPackaging(data.packagingType, data.packagingTypeSe),
          isBulkFi: isBulkPackaging(data.packagingType),
          isVirtualProduct: data.isVirtualProduct,
          isBuyable: data.isBuyable,
        }
      }),
  )

export type BuyBoxProps = z.infer<typeof BuyBoxPropsSchema>
