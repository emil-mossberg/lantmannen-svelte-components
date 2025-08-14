import { z } from 'zod'
import { transformPrefSalesQty, isBulkPackaging } from '@lib/utils/transformHelpers'

export const StockPropsSchema = z
  .instanceof(HTMLElement)
  .transform((el) => {
    return el.dataset
  })
  .pipe(
    z
      .object({
        sku: z.string().min(1),
        isVirtualProduct: z.string().transform((val) => val === '1'),
        isPdpCard: z.string().nullable().transform((val) => val === '1'),
        prefSalesQty: z.string().transform(transformPrefSalesQty),
        packagingType: z.string().nullable(),
        packagingTypeSe: z.string().nullable(),
      })
      .transform((data) => {
        return {
          sku: data.sku,
          prefSalesQty: data.prefSalesQty,
          isBulk: isBulkPackaging(data.packagingType, data.packagingTypeSe),
          isBulkFi : isBulkPackaging(data.packagingType),
          isPdpCard: data.isPdpCard,
          isVirtualProduct: data.isVirtualProduct,
        }
      }),
  )

export type StockProps = z.infer<typeof StockPropsSchema>