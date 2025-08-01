import { mount } from 'svelte'
import './app.css'

import { setupI18n } from './lib/localization'

import SvelteTester from './entries/SvelteTester.svelte'
import ProductBuyBox from './entries/ProductBuyBox.svelte'
import ProductPriceBox from './entries/ProductPriceBox.svelte'
import ProductStockBox from './entries/ProductStockBox.svelte'
import CheckoutAcess from './entries/CheckoutAcess.svelte'
import StickyMessages from './entries/StickyMessages.svelte'
import { StockPropsSchema } from './schemas/StockProps'
import { PricePropsSchema } from './schemas/PriceProps'
import { BuyBoxPropsSchema } from './schemas/BuyProps'

import { extractDataAttributes } from './lib/helpers'

setupI18n()

// Logic Checkout acess component, includes logic for delivery planner or old flow

const checkoutAcessMountPoint = document.getElementById('svelte-checkout-acess')

const checkoutAcess = mount(CheckoutAcess, {
    target: checkoutAcessMountPoint!,
})

// Logic Product Buy Box component(s)


document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
    const rawProps = extractDataAttributes(el, [
        'id',
        'sku',
        'pref-sales-qty',
        'is-pdp-card',
        'qty-increment',
        'packaging-type',
        'price-box-unit',
        'packaging-type-se',
        'is-buyable'
    ])

    const parsed = BuyBoxPropsSchema.safeParse(rawProps)

    if (!parsed.success) {
        console.error(
            'Failed to parse props, skip mounting Buy component:',
            parsed.error
        )
        return
    }

    mount(ProductBuyBox, {
        target: el,
        props: parsed.data,
    })
})

// Logic Product Price box component

document.querySelectorAll('[id^="svelte-product-price-box-"]').forEach((el) => {
    const rawProps = extractDataAttributes(el, [
        'id',
        'pref-sales-qty',
        'packaging-type',
        'new-product',
        'pallet-discount-information',
        'show-pallet-attribute',
        'price-box-unit',
        'pref-sales-qty-unit'
    ])

    const parsed = PricePropsSchema.safeParse(rawProps)

       if (!parsed.success) {
        console.error(
            'Failed to parse props, skip mounting Price component:',
            parsed.error
        )
        return
    }
    
    mount(ProductPriceBox, {
        target: el,
        props: parsed.data,
    })
})

// Logic Product Stock box component

document.querySelectorAll('[id^="svelte-product-stock-box-"]').forEach((el) => {
    const rawProps = extractDataAttributes(el, [
        'sku',
        'pref-sales-qty',
        'packaging-type',
        'packaging-type-se',
    ])

    const parsed = StockPropsSchema.safeParse(rawProps)

    if (!parsed.success) {
        console.error(
            'Failed to parse props, skip mounting Stock component:',
            parsed.error
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

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
    target: document.getElementById('svelte-tester')!,
})
