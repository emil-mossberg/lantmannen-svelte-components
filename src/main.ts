import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import App2 from './App2.svelte'
import DeliveryPlanner from './DeliveryPlanner.svelte'


const app = mount(App, {
  target: document.getElementById('app')!,
})

const app2 = mount(App2, {
  target: document.getElementById('app2')!,
})

const deliveryPlanner = mount(DeliveryPlanner, {
  target: document.getElementById('delivery-planner')!,
})

export default app
