const _useBridge = () => {
  
  const testData = $state({ value: Math.random() });


  const testMethod = () => {
    testData.value = Math.random();
  };


  // TO DO create type for this
  const cart = $state({value: {}})

  function handleCartUpdate(e: Event) {

	cart.value = e.detail

  }

  function handleIntialState(e: Event) {
	cart.value = e.detail.cart
  }

  const state = window.MagentoBridgeState;


  

//   console.log("Initial cart:", state?.cart);

//   console.log("Initial customer:", state?.customer);

  window.addEventListener("magento:cartUpdated", handleCartUpdate);
  window.addEventListener("magento:initialState", handleIntialState);

  return {
    testMethod,
    testData,
	cart
  };
};

export const useBridgeSingleton = _useBridge();
