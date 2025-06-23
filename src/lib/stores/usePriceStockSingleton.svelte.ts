// TO DO move this to correct file
declare global {
  interface Window {
    BASE_URL: string;
  }
}

import { useBridgeSingleton } from "./useBridgeSingleton.svelte";

import { REST_PRICE, REST_PRICE_GUEST, REST_STOCK_GUEST } from "../constants";

// TO DO move to type
type FetchManagerParams<T> = {
  storeId: number,
  isLoggedIn: boolean;
  getCustomerNumber: () => string | null;
  url: string;
   bodyWrapperKey: string;
  resultMapper: (responseData: any) => Record<string, T>;
};

type FetchManager<T> = {
  data: {
    value: Record<string, T>;
  };
  request: (key: string, quantity: number) => void;
};

// TO DO update this to be the real thing

type PriceResultItem = {
  sku: string;
  price: string;
};

function createFetchManager<T>(params: FetchManagerParams<T>): FetchManager<T> {
  const { isLoggedIn, getCustomerNumber, url, resultMapper, bodyWrapperKey, storeId } = params;


  const data = $state<{ value: Record<string, T> }>({ value: {} });
  const queue = new Map<string, number>();
  let timer: number | null = null;

  async function fetchQueued() {
    const items = Array.from(queue.entries()).map(([key, quantity]) => ({
      itemNumber: key,
      quantity,
    }));

    if (items.length === 0) return;

    const customerNumber = getCustomerNumber();

    if (isLoggedIn && !customerNumber) {
      setTimeout(fetchQueued, 50);
      return;
    }

    queue.clear();
    timer = null;

    const bodyData = {
      [bodyWrapperKey]: {
        items,
        storeId,
        customerNumber: isLoggedIn ? customerNumber : null,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(bodyData),
        credentials: "same-origin",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/json; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json();
      const mapped = resultMapper(result);
      console.log(mapped);
      data.value = { ...data.value, ...mapped };
      
    } catch (e) {
      console.error("Fetch failed", e);
    }
  }

  function scheduleFetch() {
    if (!timer) {
      timer = setTimeout(fetchQueued, 10);
    }
  }

  function request(key: string, quantity: number) {
    if (data.value[key]) return;
    queue.set(key, quantity);
    scheduleFetch();
  }


  return { data, request };
}

const _usePriceStock = () => {
  const { customer, isLoggedIn, storeId } = useBridgeSingleton;

  const priceManager = createFetchManager<PriceResultItem>({
    storeId,
    isLoggedIn,
    getCustomerNumber: () => customer.value?.current_company_number ?? null,
    url: `${window.BASE_URL}${isLoggedIn ? REST_PRICE : REST_PRICE_GUEST}`,
    bodyWrapperKey: 'priceFinderData',
    resultMapper: (response) =>
      response.items.reduce(
        (acc: Record<string, PriceResultItem>, item: any) => {
          acc[item.product_id] = item;
          return acc;
        },
        {}
      ),
  });

  const { data: productPrice, request: requestPrice } = priceManager;

  // TO DO switch type
  const stockManager = createFetchManager<PriceResultItem>({
    storeId,
    isLoggedIn,
    getCustomerNumber: () => customer.value?.current_company_number ?? null,
    url: `${window.BASE_URL}${REST_STOCK_GUEST}`,
    bodyWrapperKey: 'stockFinderData',
    resultMapper: (response) =>
      response.items.reduce(
        (acc: Record<string, PriceResultItem>, item: any) => {
          acc[item.item_number] = item;
          return acc;
        },
        {}
      ),
  });

  const { data: productStock, request: requestStock } = stockManager;

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
    productStock,
    requestStock,
    testPriceCall,
  };
};

export const usePriceStockSingleton = _usePriceStock();
