import { mount } from 'svelte'
import './app.css'

import { setupI18n } from './lib/localization'

// Entry level components
import ProductPageInfo from './entries/ProductPageInfo.svelte'
import DeliveryPlanner from './entries/DeliveryPlanner.svelte'
import SvelteTester from './entries/SvelteTester.svelte'
import ProductBuyBox from './entries/ProductBuyBox.svelte'

// Logic Product Page Info component
setupI18n()

const productPageInfo = mount(ProductPageInfo, {
    target: document.getElementById('product-page-info')!,
})

// Logic Delivery Planner component

const packageTypeList = document
    .getElementById('svelte-information')
    ?.getAttribute('data-tonnage-package-type')
    ?.split(',')

const plannerMountPoint = document.getElementById('delivery-planner')

const showDeliveryPlanner = !!plannerMountPoint.dataset.showDeliveryPlanner

const deliveryPlanner = mount(DeliveryPlanner, {
    target: plannerMountPoint!,
    props: {
        showDeliveryPlanner,
    },
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

    console.log('isNew', isNew)

    mount(ProductBuyBox, {
        target: el,
        props: { id, prefSalesQuantity, sku, isBulk, qtyIncrement },
    })
})

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
    target: document.getElementById('svelte-tester')!,
})
