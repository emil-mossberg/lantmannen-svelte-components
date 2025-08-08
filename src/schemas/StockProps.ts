import { z } from 'zod'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export const StockPropsSchema = z

  .instanceof(Element)
  .transform((el) => {
    const get = (attr: string) => {
      const val = el.getAttribute(`data-${attr}`)
      return val === null ? null : val
    }

    return {
      sku: get('sku'),
      'is-virtual-product': get('is-virtual-product'),
      'is-pdp-card': get('is-pdp-card'),
      'pref-sales-qty': get('pref-sales-qty'),
      'packaging-type': get('packaging-type'),
      'packaging-type-se': get('packaging-type-se'),
    }
  })

  .pipe(
    z
      .object({
        sku: z.string().min(1),
        'is-virtual-product': z.string().transform((val) => val === '1'),
        'is-pdp-card': z
          .string()
          .nullable()
          .transform((val) => val === '1'),
        'pref-sales-qty': z.string().transform((val) => {
          const num = Number(val)
          return Number.isNaN(num) ? 1 : num
        }),
        'packaging-type': z.string(),
        'packaging-type-se': z.string(),
      })
      .transform((data) => {
        const effectivePackagingType =
          data['packaging-type'] || data['packaging-type-se'] || ''
        const isBulk = magentoSvelteBridge.tonnagePackageType.includes(
          effectivePackagingType,
        )
        const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(
          data['packaging-type'] ?? '',
        )

        return {
          sku: data.sku,
          prefSalesQty: data['pref-sales-qty'],
          isBulk,
          isBulkFi,
          isPdpCard: data['is-pdp-card'],
          isVirtualProduct: data['is-virtual-product'],
        }
      }),
  )

export type StockProps = z.infer<typeof StockPropsSchema>
