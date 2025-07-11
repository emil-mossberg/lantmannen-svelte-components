declare global {
  interface Window {
    MagentoBridgeState: { cart: {}; customer: {} };
  }
}

import { type CartType } from "../../schemas/Cart";
import { type CustomerInfoType } from "../../schemas/Customer";

const _useBridge = () => {
  const isLoggedIn =
    document.getElementById("svelte-information")?.dataset.loggedIn === "1";

  const storeId = Number(
    document.getElementById("svelte-information")?.dataset.storeId
  );

  // TO DO scape from DOM
  const locale = "fi";

  function formatDate(date: string) {
    if (locale === "fi") {
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    }

    // Default: return as-is (YYYY-MM-DD) for Swedish
    return date;
  }

  const cart = $state<{ value: CartType | null }>({ value: null });

  const customer = $state<{ value: CustomerInfoType | null }>({ value: null });

  function onCartUpdated(e: Event) {
    const customEvent = e as CustomEvent;
    cart.value = customEvent.detail.cart;
  }

  function onCustomerUpdated(e: Event) {
    const customEvent = e as CustomEvent;
    customer.value = customEvent.detail.customer;
  }

  function handleIntialState(e: Event) {
    const customEvent = e as CustomEvent;
    cart.value = customEvent.detail.cart;
    customer.value = customEvent.detail.customer;
  }

  // TO Do use parser here for type safety?
  // TO DO make sure this works
  // cart.value = window.MagentoBridgeState.cart;
  // customer.value = window.MagentoBridgeState.customer;

  window.addEventListener("magento:cartUpdated", onCartUpdated);
  window.addEventListener("magento:customerUpdated", onCustomerUpdated);
  window.addEventListener("magento:initialState", handleIntialState);

  return {
    customer,
    cart,
    isLoggedIn,
    storeId,
    formatDate,
  };
};

export const useBridgeSingleton = _useBridge();
