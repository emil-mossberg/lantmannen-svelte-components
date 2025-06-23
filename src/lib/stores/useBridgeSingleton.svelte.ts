declare global {
  interface Window {
    MagentoBridgeState: { cart: {}; customer: {} };
  }
}

import { CartSchema, type CartType } from "../../schemas/Cart";

const _useBridge = () => {
  const isLoggedIn =
    document.getElementById("svelte-information")?.dataset.loggedIn === "1";

  const storeId =
    Number(document.getElementById("svelte-information")?.dataset.storeId);
  
  const cart = $state<{ value: CartType | null }>({ value: null });

  const customer = $state({ value: {} });

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
    storeId
  };
};

export const useBridgeSingleton = _useBridge();
