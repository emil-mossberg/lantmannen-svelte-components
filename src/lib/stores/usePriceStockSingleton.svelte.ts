// TO DO move this to correct file
declare global {
  interface Window {
    BASE_URL: string;
  }
}

import { useBridgeSingleton } from "./useBridgeSingleton.svelte";

import { REST_PRICE, REST_PRICE_GUEST } from "../constants";

const _usePriceStock = () => {
  const { customer, isLoggedIn } = useBridgeSingleton;

  // TO DO 
  // Fetch both in parallell with Promise.all
  // Keep Price and stock separate for now since one is id and other is skue
  

  const productPrice = $state<{ value: { [key: string]: {} } }>({ value: {} });

  // TO DO right now its id, but should be SKU
  const queue = new Set<string>();
  let timer: number | null = null;

  async function fetchPrice() {

    const items = Array.from(queue).map((item) => ({
      itemNumber: Number(item),
      quantity: 1, // TO DO make this dynamic
    }));

    if (items.length === 0) return;

    const needsToWait =
      isLoggedIn &&
      (!customer.value || Object.keys(customer.value).length === 0);
    
    if (needsToWait) {
      // Retry after short delay
    
      setTimeout(fetchPrice, 10);
      return;
    }

    queue.clear();
    timer = null;

    const url = isLoggedIn
      ? `${window.BASE_URL}${REST_PRICE}`
      : `${window.BASE_URL}${REST_PRICE_GUEST}`;

    const priceFinderData = {
      items,
      storeId: 1,
      customerNumber: isLoggedIn ? customer.value.current_company_number : null,
    };

    try {
      const response = await fetch(url, {
        method: "POST",

        body: JSON.stringify({ priceFinderData }),
        credentials: "same-origin",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/json; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json();

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
    timer = setTimeout(fetchPrice, 10); // 100ms debounce
  }

  function requestPrice(id: string, quantity: number) {
    if (productPrice.value[id]) {
      return;
    }

    queue.add(id);
    scheduleFetch();
  }

  async function testPriceCall() {
    const priceFinderData = {
      items: [{ itemNumber: 441863, quantity: 1 }],
      storeId: 1,
      customerNumber: null,
    };

    try {
      const response = await fetch(`${window.BASE_URL}${REST_PRICE_GUEST}`, {
        method: "POST",

        body: JSON.stringify({ priceFinderData }),
        credentials: "same-origin",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/json; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json();

      const resultAsObj = result.items.reduce((acc, item) => {
        acc[item.product_id] = item;
        return acc;
      }, {});

      productPrice.value = { ...productPrice.value, ...resultAsObj };
    } catch (error) {
      console.log("fetchPrice Failed");
    }
  }

  return {
    productPrice,
    requestPrice,
    testPriceCall,
  };
};

export const usePriceStockSingleton = _usePriceStock();
