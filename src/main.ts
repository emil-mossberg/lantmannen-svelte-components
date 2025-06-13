import { mount } from 'svelte'
import './app.css'
import ProductPageInfo from './entries/ProductPageInfo.svelte'
import DeliveryPlanner from './entries/DeliveryPlanner.svelte'
import PurchaseDemo from './entries/PurchaseDemo.svelte'



const productPageInfo = mount(ProductPageInfo, {
  target: document.getElementById('product-page-info')!,
})

const deliveryPlanner = mount(DeliveryPlanner, {
  target: document.getElementById('delivery-planner')!,
})

const purchaseDemo = mount(PurchaseDemo, {
  target: document.getElementById('purchase-demo')!,
})

// export default app
