import { mount } from 'svelte'
import './app.css'

import { setupI18n } from '@lib/localization'

import ProductBuyBox from '@lib/entries/ProductBuyBox.svelte'
import ProductPriceBox from '@lib/entries/ProductPriceBox.svelte'
import ProductStockBox from '@lib/entries/ProductStockBox.svelte'
import CheckoutAcess from '@lib/entries/CheckoutAcess.svelte'
import StickyMessages from '@lib/entries/StickyMessages.svelte'
import PdpBadges from '@lib/entries/PDPBadges.svelte'
import { StockPropsSchema } from '@lib/schemas/StockProps'
import { PricePropsSchema } from '@lib/schemas/PriceProps'
import { BuyBoxPropsSchema } from '@lib/schemas/BuyProps'

import { safeParseWithLogging } from '@lib/utils/helpers'

setupI18n('fi_FI').then(() => {
  // Logic Checkout acess component, includes logic for delivery planner or old flow

  const checkoutAcessMountPoint = document.getElementById(
    'svelte-checkout-acess',
  )

  const checkoutAcess = mount(CheckoutAcess, {
    target: checkoutAcessMountPoint!,
  })

  // Logic Product Buy Box component(s)

  document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
    const parsed = BuyBoxPropsSchema.safeParse(el)

    if (!parsed.success) {
      console.error(
        'Failed to parse props, skip mounting Buy component:',
        parsed.error,
      )
      return
    }

    mount(ProductBuyBox, {
      target: el,
      props: parsed.data,
    })
  })

  // Logic Product Price box component

  document
    .querySelectorAll('[id^="svelte-product-price-box-"]')
    .forEach((el) => {
      const parsed = PricePropsSchema.safeParse(el)

      if (!parsed.success) {
        console.error(
          'Failed to parse props, skip mounting Price component:',
          parsed.error,
        )
        return
      }

      mount(ProductPriceBox, {
        target: el,
        props: parsed.data,
      })
    })

  // Logic Product Badge component

  // TO DO add if for PDP

  document.querySelectorAll('[id^="svelte-pdp-badges-"]')

  // Logic Product Stock box component

  document
    .querySelectorAll('[id^="svelte-product-stock-box-"]')
    .forEach((el) => {
      const parsed = StockPropsSchema.safeParse(el)

      if (!parsed.success) {
        console.error(
          'Failed to parse props, skip mounting Stock component:',
          parsed.error,
        )
        return
      }

      mount(ProductStockBox, {
        target: el,
        props: parsed.data,
      })
    })

  // Logic Svelte Sticky message component

  const stickyMessages = mount(StickyMessages, {
    target: document.getElementById('svelte-sticky-messages')!,
  })
})
