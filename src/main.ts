import { mount } from 'svelte'
import './app.css'

import { setupI18n } from './lib/localization'

import SvelteTester from './entries/SvelteTester.svelte'
import ProductBuyBox from './entries/ProductBuyBox.svelte'
import ProductPriceBox from './entries/ProductPriceBox.svelte'
import CheckoutAcess from './entries/CheckoutAcess.svelte'

setupI18n()

const packageTypeList = document
    .getElementById('svelte-information')
    ?.getAttribute('data-tonnage-package-type')
    ?.split(',')

// Logic Checkout acess component, includes logic for delivery planner or old flow

const checkoutAcessMountPoint = document.getElementById('svelte-checkout-acess')

const checkoutAcess = mount(CheckoutAcess, {
    target: checkoutAcessMountPoint!,
})

// Logic Product Buy Box component(s)

document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-buy-box-', '')

    const sku = el.getAttribute('data-sku') as string // TO DO is there a better solution?

    const packagingType = el.getAttribute('data-packaging-type')
        ? el.getAttribute('data-packaging-type')
        : el.getAttribute('data-packaging-type-se')

    const usedPackagingTypeAttr = el.hasAttribute('data-packaging-type')
        ? 'data-packaging-type'
        : 'data-packaging-type-se'

    const isBulk = packageTypeList?.includes(packagingType ?? '') ?? false

    const isBulkInFinland =
        isBulk && usedPackagingTypeAttr === 'data-packaging-type'

    const prefSalesQuantityAttr = el.getAttribute('data-pref-sales-quantity')
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1

    const qtyIncrement = Number(el.getAttribute('data-qty-increment') ?? 1) || 1

    const isNew = el.getAttribute('data-product-is-new') === '1'


    mount(ProductBuyBox, {
        target: el,
        props: { id, prefSalesQuantity, sku, isBulk, qtyIncrement },
    })
})

// Logic Product Price box component

document.querySelectorAll('[id^="svelte-product-price-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-price-box-', '')
    const prefSalesQuantityAttr = el.getAttribute(
        'data-product-pref-sales-quantity'
    )
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1
    const newProduct = el.getAttribute('data-product-is-new') === '1'
    const isBuyable = el.getAttribute('data-product-is-buyable') === '1'
    const spun = el.getAttribute('data-product-spun')
    const unitMeasure = el.getAttribute('data-product-unit-measure')
    const packagingType = el.getAttribute('data-product-packaging-type')
    const basicUnit = el.getAttribute('data-product-basic-unit')
    const qtyIncrement =
        Number(el.getAttribute('product-data-qty-increment') ?? 1) || 1
    const palletDiscountInformation = el.getAttribute('data-product-pallet-discount-information')
    const showPalletAttribute = el.getAttribute('data-product-show-pallet-attribute') === '1'
    
    mount(ProductPriceBox, {
        target: el,
        props: {
            id,
            prefSalesQuantity,
            newProduct,
            spun,
            unitMeasure,
            packagingType,
            basicUnit,
            isBuyable,
            qtyIncrement,
            palletDiscountInformation,
            showPalletAttribute
        },
    })
})

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
    target: document.getElementById('svelte-tester')!,
})
