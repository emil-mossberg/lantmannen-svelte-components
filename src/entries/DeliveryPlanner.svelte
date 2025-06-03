<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  // let visible = $state(false);
  let visible = $state(true);

  // TO DO dummy data to show design, use this

  // TO DO add data for package delivery methods, adresses, delivery dates

  const bulkDeliveryMethods = $state([
    { delivery_method: "020", delivery_method_name: "Bulk 3 dagar" },
    { delivery_method: "021", delivery_method_name: "Bulk Fast Dag" },

    { delivery_method: "023", delivery_method_name: "Bulk 2 dagar" },
  ]);

  const packageDeliveryMethods = [
    {
      delivery_method: "010",
      delivery_method_name: "Flak Normal, Lantmännen lossar",
    },
    {
      delivery_method: "011",
      delivery_method_name: "Flak Normal, Kund lossar",
    },
    {
      delivery_method: "012",
      delivery_method_name: "Flak Express, Kund lossar, Område A",
    },
    {
      delivery_method: "013",
      delivery_method_name: "Flak Express Lantmännen lossar Omr A",
    },
    { delivery_method: "040", delivery_method_name: "Egen transport" },
  ];

  const bulkAddress = [
    { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 1, addressId: 101 },
    { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 2, addressId: 101 },
    { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 3, addressId: 101 },
    { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 4, addressId: 101 },
    {
      address: "Birger Jarlsgatan 26, 216 12 Limhamn",
      siloId: 4,
      addressId: 202,
    },
    {
      address: "Birger Jarlsgatan 26, 216 12 Limhamn",
      siloId: 5,
      addressId: 202,
    },
    { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 7, addressId: 303 },
    { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 8, addressId: 303 },
    { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 10, addressId: 404 },
    { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 9, addressId: 404 },
  ];

  const packageAddresses = [
    { address: "Dybäcksgatan 5, 216 20 Malmö", addressId: 101 },
    { address: "Birger Jarlsgatan 26, 216 12 Limhamn", addressId: 202 },
    { address: "Lovisas Gata 5, 218 51 Klagshamn", addressId: 303 },
    { address: "Paddelgränd 8, 216 11 Limhamn", addressId: 404 },
  ];

  const deliveries = $state([
    {
      type: "bulk",
      adress: 101,
      deliveryDateFrom: "2025-06-12",
      deliveryDateTo: "2025-06-20",
      deliveryMethod: "023",
      items: [
        {
          name: "Galant Ordinär p bk",
          sku: "400205",
          quantity: 1000,
          pris: "19 008,00 kr",
        },
      ],
    },
    {
      type: "bulk",
      adress: 101,
      deliveryDateFrom: "2025-06-12",
      deliveryDateTo: "2025-06-20",
      deliveryMethod: "023",
      items: [
        {
          name: "Lamm 500 p bk",
          sku: "400288",
          quantity: 15000,
          pris: "5 820,00 kr",
        },
      ],
    },
    {
      type: "package",
      adress: 101,
      deliveryDateFrom: "2025-06-12",
      deliveryDateTo: "2025-06-20",
      deliveryMethod: "011",
      items: [
        {
          name: "Galant Ordinär p ss",
          sku: "404846",
          quantity: 1000,
          pris: "4 744,00 kr",
        },
        {
          name: "Contact 5L",
          sku: "301918",
          quantity: 5,
          pris: "324,00 kr",
        },
      ],
    },
  ]);
</script>

<button
  class="fixed right-0 top-0 border border-green-700 hover:bg-tannenbaum p-2 bg-green-pea text-white z-[110]"
  onclick={() => (visible = !visible)}
>
  Leveransplaneraren
</button>
{#if visible}
  <div
    class="w-[600px] h-full fixed top-0 border bg-white text-charcoal right-0 z-[110] overflow-auto"
    transition:slide={{ axis: "x", duration: 400, easing: cubicIn }}
  >
    <div class="flex justify-between p-6">
      <h1 class="font-bold text-[1.625rem] leading-[1.2]">
        Leveransplaneraren
      </h1>
      <button class="" onclick={() => (visible = false)}> Stäng</button>
    </div>
    <ul>
      {#each deliveries as delivery, index}
        <li class="py-3 px-6 mb-2 border-b">
          <h4 class="mb-2 font-bold text-[1.125rem] leading-[1.2]">
            {`Leverans ${index + 1} ${delivery.type === 'bulk' ? '(Bulkleverans - silo krävs)' : ''}`}
          </h4>

          <div class="mb-3">
            <label class="block" for="">Leveransmetod:</label>
            <select
              bind:value={delivery.deliveryMethod}
              class="border border-gray-200 w-full px-2 py-1"
            >
              {#if delivery.type === "bulk"}
                {#each bulkDeliveryMethods as option}
                  <option value={option.delivery_method}
                    >{option.delivery_method_name}</option
                  >
                {/each}
              {:else if delivery.type === "package"}
                {#each packageDeliveryMethods as option}
                  <option value={option.delivery_method}
                    >{option.delivery_method_name}</option
                  >
                {/each}
              {/if}
            </select>
          </div>
          <div class="mb-3">
            <label class="block" for="">Leveransadress:</label>
            <select
              bind:value={delivery.adress}
              class="border border-gray-200 w-full py-1 px-2"
            >
              {#if delivery.type === "bulk"}
                {#each bulkAddress as option}
                  <option value={option.addressId}>{`${option.address}, Silo ${option.siloId}`}</option>
                {/each}
              {:else if delivery.type === "package"}
                {#each packageAddresses as option}
                  <option value={option.addressId}>{option.address}</option>
                {/each}
              {/if}
            </select>
          </div>
          <div class="mb-4">
            <label class="block" for="">Önskat leveransintervall:</label>
            <div>
              <input
                type="text"
                bind:value={delivery.deliveryDateFrom}
                class="border px-2 py-1"
              />
              <span>{delivery.deliveryDateTo}</span>
            </div>
          </div>
          <h6 class="mb-2 font-bold">Produkter</h6>
          <ul>
            {#each delivery.items as item}
              <li class="grid grid-cols-2 grid-rows-2 mb-3 ml-8">
                <span class="font-bold text-sm">{item.name}</span>
                <span class="text-sm text-right">{`Pris: ${item.pris}`}</span>
                <span class="text-sm">{`Artikelnummer: ${item.sku}`}</span>
                <span class="text-sm text-right"
                  >{`Antal: ${item.quantity}`}</span
                >
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
{/if}
