import { z } from 'zod'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export const PricePropsSchema = z
  .instanceof(Element)
  .transform((el) => {
    const get = (attr: string) => {
      const val = el.getAttribute(`data-${attr}`)
      return val === null ? null : val
    }
    return {
      id: get('id'),
      'pref-sales-qty': get('pref-sales-qty'),
      'packaging-type': get('packaging-type'),
      'new-product': get('new-product'),
      'pallet-discount-information': get('pallet-discount-information'),
      'show-pallet-attribute': get('show-pallet-attribute'),
      'price-box-unit': get('price-box-unit'),
      'pref-sales-qty-unit': get('pref-sales-qty-unit'),
    }
  })
  .pipe(
    z
      .object({
        id: z.string().min(1),
        'pref-sales-qty': z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) || num === 0 ? 1 : num
        }),
        'packaging-type': z.string(),
        'new-product': z.string().transform((val) => val === '1'),
        'pallet-discount-information': z.string(),
        'show-pallet-attribute': z.string().transform((val) => val === '1'),
        'price-box-unit': z.string(),
        'pref-sales-qty-unit': z.string(),
      })
      .transform((data) => {
        const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(
          data['packaging-type'] ?? '',
        )

        return {
          id: data.id,
          prefSalesQty: data['pref-sales-qty'],
          newProduct: data['new-product'],
          palletDiscountInformation: data['pallet-discount-information'],
          showPalletAttribute: data['show-pallet-attribute'],
          priceBoxUnit: data['price-box-unit'],
          prefSalesQtyUnit: data['pref-sales-qty-unit'],
          isBulkFi,
        }
      }),
  )

export type PriceProps = z.infer<typeof PricePropsSchema>
