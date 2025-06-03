import { mount } from 'svelte'
import './app.css'
import ProductPageInfo from './entries/ProductPageInfo.svelte'
import DeliveryPlanner from './entries/DeliveryPlanner.svelte'
import App from './entries/App.svelte'


const productPageInfo = mount(ProductPageInfo, {
  target: document.getElementById('product-page-info')!,
})

const deliveryPlanner = mount(DeliveryPlanner, {
  target: document.getElementById('delivery-planner')!,
})

const app = mount(App, {
  target: document.getElementById('app')!,
})

// export default app
