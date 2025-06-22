declare global {
  interface Window {
    MagentoBridgeState: { cart: {}; customer: {} };
  }
}

const _useBridge = () => {
  // TO DO add boolean for if user is logged in
  // const isLoggedIn = document.getElementById('is-customer-logged-in')?.textContent.trim() === '1';

  // TO DO should work without reactivity
  let isLoggedIn = $state(
    document.getElementById("is-customer-logged-in")?.textContent?.trim() ===
      "1"
  );

  // TO DO create type for this
  const cart = $state({ value: {} });

  const customer = $state({ value: {} });

  function handleCartUpdate(e: Event) {
    cart.value = e.detail;
  }

  function handleCustomerUpdate(e: Event) {
    customer.value = e.detail;
  }

  function handleIntialState(e: Event) {
    cart.value = e.detail.cart;
    customer.value = e.detail.customer;
  }

  // cart.value = window.MagentoBridgeState.cart;
  // customer.value = window.MagentoBridgeState.customer;

  //   console.log("Initial cart:", state?.cart);

  //   console.log("Initial customer:", state?.customer);

  window.addEventListener("magento:cartUpdated", handleCartUpdate);
  window.addEventListener("magento:customerUpdated", handleCustomerUpdate);
  window.addEventListener("magento:initialState", handleIntialState);

  return {
    customer,
    cart,
    isLoggedIn,
  };
};

export const useBridgeSingleton = _useBridge();
