import { ZodType, type ZodTypeDef, z } from 'zod'
import { PriceSchema, type Price } from '@lib/schemas/Price'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function validateWithSchema<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  value: unknown,
  fallback?: T,
): T {
  const result = schema.safeParse(value)
  if (result.success) {
    return result.data
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error('Validation failed')
}

export const toUtcDateString = (timestamp: number) => {
  const date = new Date(timestamp)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toUtcMidnightTimestamp = (dateStr: string) => {
  const [yearStr, monthStr, dayStr] = dateStr.split('-')
  return Date.UTC(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr))
}

export const scrollLock = (locked: boolean) => {
  if (locked) {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const scrollY = window.scrollY

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.marginRight = `${scrollBarWidth}px`
    document.body.style.overflow = 'hidden'
  } else {
    const scrollY = parseInt(document.body.style.top || '0') * -1

    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.marginRight = ''
    document.body.style.overflow = ''

    window.scrollTo(0, scrollY)
  }
}

// TO DO Fix typing body?

export const fetchPOST = (url: string, body: string) => {
  return fetch(url, {
    method: 'POST',
    body: body,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
}

export const safeParseWithLogging = <T>(
  schema: z.ZodType<T>,
  input: unknown,
) => {
  const result = schema.safeParse(input)
  if (!result.success) {
    console.error(`Failed to parse with schema:`, result.error)
  }
  return result
}

export const createMoveElement = (id: string) => {
  const target = document.getElementById(id)

  return (element: HTMLElement) => {
    if (target) {
      target.appendChild(element)
    } else {
      console.warn('Target element #destination not found')
    }
  }
}

// Work around to be able to attach information from price call to fotorama
export const moveBadgesOnPDP = () => {
  window.addEventListener('priceFinderData-fetched', function (event) {
    const customEvent = event as CustomEvent<{
      items: Price[]
    }>

    const stage = document.getElementsByClassName('fotorama__stage')

    if (stage.length) {
      const priceBox = document.querySelector(
        '.product-info-main [id*="svelte-product-price-box"]',
      )

      if (priceBox instanceof HTMLElement) {
        const productId = priceBox.dataset.id

        const isNewProduct = priceBox.dataset.newProduct === '1'

        const price = PriceSchema.parse(
          customEvent.detail.items.find(
            (product: Price) => String(product.product_id) == productId,
          ),
        )

        const isCampaign =
          price.price_info.extension_attributes.lma_campaign_is_pre_season ||
          price.price_info.extension_attributes.lma_customer_price_is_campaign

        const buildBadge = (text: string, classes: string) => {
          const div = document.createElement('div')
          div.classList = `tw-text-white tw-mb-2 tw-p-2 tw-font-bold ${classes}`

          div.textContent = text

          return div
        }

        if (isNewProduct || isCampaign) {
          const badgeList = document.createElement('div')
          badgeList.classList = 'tw-absolute tw-top-0 tw-z-[1] tw-left-[20px]'

          if (isCampaign) {
            badgeList.appendChild(
              buildBadge(
                magentoSvelteBridge.locale === 'sv_SE'
                  ? 'Kampanj!'
                  : 'Kampanja!',
                'tw-bg-desert',
              ),
            )
          }

          if (isNewProduct) {
            badgeList.appendChild(
              buildBadge(
                magentoSvelteBridge.locale === 'sv_SE' ? 'Nyhet' : 'Uutuus!',
                'tw-bg-steel-blue tw-inline-block',
              ),
            )
          }

          stage[0].appendChild(badgeList)
        }
      }
    }
  })
}
