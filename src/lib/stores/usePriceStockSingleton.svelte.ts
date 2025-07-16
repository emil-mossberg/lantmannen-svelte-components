// TO DO move this to correct file
declare global {
  interface Window {
    BASE_URL: string;
  }
}



import {REST_PRICE_GUEST } from "../constants";



const _usePriceStock = () => {


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

  async function testPSSCall() {
    const priceFinderData = {
      items: [{ itemNumber: 284903, quantity: 1, isBuyable: 1 }],
      storeId: 11,
      customerNumber: "10000003",
    };

    try {
      const response = await fetch(`${window.BASE_URL}${'rest/V1/lma-api/pre-season-campaign/'}`, {
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
    testPriceCall,
    testPSSCall,
  };
};

export const usePriceStockSingleton = _usePriceStock();
