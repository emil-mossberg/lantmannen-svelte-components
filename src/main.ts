import { mount } from "svelte";
import "./app.css";

import { setupI18n } from "./lib/localization";

// Entry level components
import ProductPageInfo from "./entries/ProductPageInfo.svelte";
import DeliveryPlanner from "./entries/DeliveryPlanner.svelte";
import SvelteTester from "./entries/SvelteTester.svelte";
import ProductBuyBox from "./entries/ProductBuyBox.svelte";

// Logic Product Page Info component
setupI18n();

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


// Logic Product Buy Box component(s)

document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
  const elementId = el.id;
  const id = elementId.replace("svelte-product-buy-box-", "");

  const sku = el.getAttribute("data-sku");

  const prefSalesQuantityAttr = el.getAttribute("data-pref-sales-quantity");
  const prefSalesQuantity = prefSalesQuantityAttr
    ? Number(prefSalesQuantityAttr)
    : 1;

    // TO DO type here sku
  mount(ProductBuyBox, {
    target: el,
    props: { id, prefSalesQuantity,  sku },
  });
});

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
  target: document.getElementById("svelte-tester")!,
});
