// TO DO move this to correct file
declare global {
  interface Window {
    BASE_URL: string;
  }
}


import { useBridgeSingleton } from "./useBridgeSingleton.svelte";



const _usePriceStock = () => {
  const { customer, isLoggedIn } = useBridgeSingleton;  


  // Fetch both in parallell with Promise.all Ofcourse
  // add Price and Stock to maps, since not rendered by the stock, or is there other way, maybe derived, ask chat
  // TEST ON PLP with injected skus from Magento / Adobe commerce



  // TO DO rename to products, when have price and stock
  const productPrice = $state<{ value: { [key: string]: {} } }>({ value: {} });

  // TO DO right now its id, but should be SKU
  const queue = new Set<string>();
  let timer: number | null = null;

  
  async function fetchPrice() {
    console.log("CALLED!");
    const items = Array.from(queue).map((item) => ({
      itemNumber: item,
      quantity: 1, // TO DO make this dynamic
    }));

    queue.clear();
    timer = null;

    if (items.length === 0) return;

    const isCustomerReady = isLoggedIn && (!customer || Object.keys(customer).length === 0);

    console.log(isLoggedIn);
    console.log('isCustomerReady', isCustomerReady);

      if (!isCustomerReady) {
        console.log("Waiting for customer data before fetching prices");
        // Retry after short delay
        setTimeout(fetchPrice, 200);
        return;
      }
      console.log(Object.keys(customer).length === 0);
      console.log(!customer);
      console.log('Loaded customer?', customer);

    // TO DO need to toggle here depending if logged in or not
    // const url = `${window.BASE_URL}rest/V1/lma-api/product-prices/`;
    // const "19040960"
    const url = `${window.BASE_URL}rest/V1/lma-api/product-prices/`;
    const customerNumber = "10000003"
    
    const priceFinderData = {
      customerNumber, // TO DO make dynamic
      items,
    };

    try {
      const response = await fetch(url, {
        method: "POST",

        body: JSON.stringify({ priceFinderData }),
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json();

      // TO DO should be sku
      const resultAsObj = result.items.reduce((acc, item) => {
        acc[item.product_id] = item;
        return acc;
      }, {});

      productPrice.value = { ...productPrice.value, ...resultAsObj };
    } catch (error) {
      console.log("fetchPrice Failed");
    }
  }

  function scheduleFetch() {
    if (timer) return;
    timer = setTimeout(fetchPrice, 100); // 100ms debounce
  }

  function requestPrice(sku: string) {
    if (productPrice.value[sku]) {
      return;
    }

    queue.add(sku);
    scheduleFetch();
  }

  return {
    productPrice,
    requestPrice,
  };
};

export const usePriceStockSingleton = _usePriceStock();
