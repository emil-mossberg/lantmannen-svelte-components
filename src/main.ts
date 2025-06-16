import { mount } from "svelte";
import "./app.css";
import ProductPageInfo from "./entries/ProductPageInfo.svelte";
import DeliveryPlanner from "./entries/DeliveryPlanner.svelte";
import DeliveryWizard from './entries/DeliveryWizard.svelte'
import SvelteTester from "./entries/SvelteTester.svelte";
import PriceInfo from "./entries/PriceInfo.svelte";

// Logic Product Page Info component

const productPageInfo = mount(ProductPageInfo, {
  target: document.getElementById("product-page-info")!,
});

// Logic Delivery Planner component

const plannerMountPoint = document.getElementById("delivery-planner");

const showDeliveryPlanner = !!plannerMountPoint.dataset.showDeliveryPlanner;

const deliveryPlanner = mount(DeliveryPlanner, {
  target: plannerMountPoint!,
  props: {
    showDeliveryPlanner,
  },
});


// Logic Delivery Planner component

const deliveryWizard = mount(DeliveryWizard, {
  target: document.getElementById('svelte-delivery-wizard')!,
})


// Logic Price Area component(s)

document.querySelectorAll('[id^="svelte-price-info-"]').forEach((el) => {
  const id = el.id;
  const sku = id.replace("svelte-price-info-", "");

  mount(PriceInfo, {
    target: el,
    props: { sku },
  });
});

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
  target: document.getElementById("svelte-tester")!,
});