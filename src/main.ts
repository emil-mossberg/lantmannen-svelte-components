import { mount } from 'svelte'
import './app.css'

import { setupI18n } from './lib/localization'

import magentoSvelteBridge from './lib/stores/MagentoSvelteBridge.svelte'


import SvelteTester from './entries/SvelteTester.svelte'
import ProductBuyBox from './entries/ProductBuyBox.svelte'
import ProductPriceBox from './entries/ProductPriceBox.svelte'
import ProductStockBox from './entries/ProductStockBox.svelte'
import CheckoutAcess from './entries/CheckoutAcess.svelte'
import StickyMessages from './entries/StickyMessages.svelte'

setupI18n()

// Logic Checkout acess component, includes logic for delivery planner or old flow

const checkoutAcessMountPoint = document.getElementById('svelte-checkout-acess')

const bulkHelper = (el: Element) => {
    const packagingTypeFi = el.getAttribute('data-packaging-type')
    const packagingTypeSe = el.getAttribute('data-packaging-type-se')

    const packagingType = packagingTypeFi ? packagingTypeFi : packagingTypeSe

    const isBulk = magentoSvelteBridge.tonnagePackageType.includes(packagingType ?? '') ?? false

    const isBulkFi = magentoSvelteBridge.tonnagePackageType.includes(packagingTypeFi ?? '') ?? false

    return {isBulk, isBulkFi}
}

const checkoutAcess = mount(CheckoutAcess, {
    target: checkoutAcessMountPoint!,
})

// Logic Product Buy Box component(s)

document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-buy-box-', '')

    const sku = el.getAttribute('data-sku') as string // TO DO is there a better solution?

    const { isBulk, isBulkFi} = bulkHelper(el)

    const prefSalesQuantityAttr = el.getAttribute('data-pref-sales-quantity')
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1

    const qtyIncrement = Number(el.getAttribute('data-qty-increment') ?? 1) || 1

    const isNew = el.getAttribute('data-product-is-new') === '1'

    const isPdpCard = el.getAttribute('data-is-pdp-card') === '1'
    const isBuyable = el.getAttribute('data-is-buyable') === '1'

    const priceBoxUnit = el.getAttribute('data-config-price-box-unit') ?? ''

    mount(ProductBuyBox, {
        target: el,
        props: {
            id,
            prefSalesQuantity,
            sku,
            isBulk,
            isBulkFi,
            qtyIncrement,
            isPdpCard,
            priceBoxUnit,
            isBuyable
        },
    })
})

// Logic Product Price box component

document.querySelectorAll('[id^="svelte-product-price-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-price-box-', '')
    const prefSalesQuantityAttr = el.getAttribute(
        'data-product-pref-sales-quantity'
    )
    const prefSalesQty = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1
    const newProduct = el.getAttribute('data-product-is-new') === '1'

    const isBulkFi =
        magentoSvelteBridge.tonnagePackageType.includes(
            el.getAttribute('data-product-packaging-type') ?? ''
        ) ?? false

    const qtyIncrement =
        Number(el.getAttribute('product-data-qty-increment') ?? 1) || 1
    const palletDiscountInformation = el.getAttribute(
        'data-product-pallet-discount-information'
    )
    const showPalletAttribute =
        el.getAttribute('data-product-show-pallet-attribute') === '1'
    const priceBoxUnit = el.getAttribute('data-config-price-box-unit') ?? ''
    const prefSalesQtyUnit =
        el.getAttribute('data-config-pref-sales-qty-unit') ?? ''

    mount(ProductPriceBox, {
        target: el,
        props: {
            id,
            prefSalesQty,
            newProduct,
            qtyIncrement,
            palletDiscountInformation,
            showPalletAttribute,
            priceBoxUnit,
            prefSalesQtyUnit,
            isBulkFi,
        },
    })
})

// Logic Product Stock box component

document.querySelectorAll('[id^="svelte-product-stock-box-"]').forEach((el) => {
    const prefSalesQuantityAttr = el.getAttribute(
        'data-product-pref-sales-quantity'
    )
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1

    const { isBulk, isBulkFi} = bulkHelper(el)

    const sku = el.getAttribute('data-sku') as string // TO DO is there a better solution?

    mount(ProductStockBox, {
        target: el,
        props: {
            prefSalesQuantity,
            isBulk,
            isBulkFi,
            sku,
        },
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
