<script lang="ts">
  import Counter from "./lib/Counter.svelte";

  console.log("component!");
  console.log('BASE URL is this it', window.BASE_URL);

  let postcode = $state(13456);

  async function testAjax() {
    const url =
      "https://app.lmagri-cloud-develop.test/rest/V1/lma-api/postcode-check/";
    const data = {
      quoteId: "2797403",
      postcode: String(postcode),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE' // Uncomment if needed
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function testStock() {
    const url =
      "https://app.lmagri-cloud-develop.test/fi/rest/V1/lma-api/product-stock-guest/";

    const data = {
      customerNumber: "",
      items: [
        {
          itemNumber: 921250,
          quantity: 1,
        },
        {
          itemNumber: 923884,
          quantity: 1,
        },
        {
          itemNumber: 924220,
          quantity: 1,
        },
        {
          itemNumber: 924274,
          quantity: 1,
        },
        {
          itemNumber: 924302,
          quantity: 1,
        },
        {
          itemNumber: 924350,
          quantity: 1,
        },
        {
          itemNumber: 924590,
          quantity: 1,
        },
        {
          itemNumber: 924630,
          quantity: 1,
        },
        {
          itemNumber: 938912,
          quantity: 1,
        },
        {
          itemNumber: 939052,
          quantity: 1,
        },
        {
          itemNumber: 946240,
          quantity: 1,
        },
        {
          itemNumber: 970072,
          quantity: 1,
        },
        {
          itemNumber: 986134,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockFinderData: data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>

<main class="svelte-component">
  <h1 class="text-red-400">Lantmännen Component Test</h1>
  <button onclick={testAjax}>Test Ajax PostCode</button>
  <button onclick={testStock}>Test Ajax Stock</button>
  <input type="text" bind:value={postcode} />

  <div>TEST TEST TEST TEST3</div>
  <div class="card text-3xl font-bold underline bg-gray-200">
    <Counter />
  </div>
</main>

<style>
</style>
