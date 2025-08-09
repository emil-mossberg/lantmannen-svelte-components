import { z } from 'zod'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export const BuyBoxPropsSchema = z
  .instanceof(Element)
  .transform((el) => {
    const get = (attr: string) => {
      const val = el.getAttribute(`data-${attr}`)
      return val === null ? null : val
    }

    return {
      id: get('id'),
      sku: get('sku'),
      isVirtualProduct: get('is-virtual-product'),
      prefSalesQty: get('pref-sales-qty'),
      packagingType: get('packaging-type'),
      packagingTypeSe: get('packaging-type-se'),
      qtyIncrement: get('qty-increment'),
      qtyMin: get('qty-min'),
      isPdpCard: get('is-pdp-card'),
      // isBuyable: get('is-buyable'),
      priceBoxUnit: get('price-box-unit'),
    }
  })
  .pipe(
    z
      .object({
        id: z.string().min(1),
        sku: z.string().min(1),
        isVirtualProduct: z.string().transform((val) => val === '1'),
        prefSalesQty: z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) || num === 0 ? 1 : num
        }),
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
        // isBuyable: z.string().transform((val) => val === '1'),
        priceBoxUnit: z.string().nullable().default(''),
      })
      .transform((data) => {
        const effectivePackagingType =
          data.packagingType || data.packagingTypeSe || ''
        const isBulk = magentoSvelteBridge.tonnagePackageType.includes(
          effectivePackagingType,
        )
        const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(
          data.packagingType ?? '',
        )

        return {
          id: data.id,
          sku: data.sku,
          prefSalesQty: data.prefSalesQty,
          qtyIncrement: data.qtyIncrement,
          qtyMin: data.qtyMin,
          isPdpCard: data.isPdpCard,
          // isBuyable: data.isBuyable,
          priceBoxUnit: data.priceBoxUnit,
          isBulk,
          isBulkFi,
          isVirtualProduct: data.isVirtualProduct,
        }
      }),
  )

export type BuyBoxProps = z.infer<typeof BuyBoxPropsSchema>
