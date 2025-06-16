// TO DO move this to correct file
declare global {
  interface Window {
    BASE_URL: string;
  }
}

const _usePriceStock = () => {
  // TO TO need customer number from brideSingleton
  // Fetch both in parallell with Promise.all Ofcourse
  // add Price and Stock to maps, since not rendered by the stock, or is there other way, maybe derived, ask chat
  // TEST ON PLP with injected skus from Magento / Adobe commerce

  // TO DO rename to products, when have price and stock
  const productPrice = $state<{value: {[key:string]: {}}}>({ value: {} });

  // TO DO type it to sku (right now id)
  const queue = new Set();
  let timer: number | null = null;

  // TO DO make all dynamic here
  async function fetchPrice() {
    const items = Array.from(queue).map((item) => ({
      itemNumber: item,
      quantity: 1,
    }));

    queue.clear();
    timer = null;

    if (items.length === 0) return;

    const url = `${window.BASE_URL}/rest/V1/lma-api/product-prices-guest/`;

    const priceFinderData = {
      customerNumber: null,
      items,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ priceFinderData }),
        headers: { "Content-Type": "application/json" },
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
