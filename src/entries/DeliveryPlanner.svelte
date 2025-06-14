<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { slide } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  import Button from "../lib/Button.svelte";
  import Select from "../lib/Select.svelte";
  import SelectDate from "../lib/SelectDate.svelte";

  import { useBridgeSingleton } from '../lib/stores/useBridgeSingleton.svelte'

  const { testData, testMethod } = useBridgeSingleton

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from "../dummyData";

  let visible = $state(false);

  const deliveries = $state([
    {
      type: "bulk",
      adress: "101",
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
      adress: "101",
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
      adress: "101",
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

  function handleCartUpdate(e: Event) {
        console.log('cart updated!', e);
  }

  function handleIntialState(e: Event) {
        console.log('Initial state!', e);
  }

//   onMount(() => {
//     const state = window.MagentoBridgeState;

//     console.log('Initial cart:', state?.cart);

//     console.log('Initial customer:', state?.customer);

//     console.log('mounting!');

//     window.addEventListener('magento:cartUpdated', handleCartUpdate);
//     window.addEventListener('magento:initialState', handleIntialState);
// });

//   onDestroy(() => {

//     window.removeEventListener('magento:cartUpdated', handleCartUpdate);
//   })

</script>

<div class="fixed right-0 top-0 z-[110]">
  <div>{testData.value}</div>
  <Button text="TEST STUFF" onclick={testMethod}/>
  <Button text="Leveransplaneraren" onclick={() => (visible = !visible)} />
</div>
{#if visible}
  <div
    class="w-[600px] h-full fixed top-0 border bg-white text-charcoal right-0 z-[110] overflow-auto "
    transition:slide={{ axis: "x", duration: 400, easing: cubicIn }}
  >
    <div class="flex justify-between p-6">
      <h1 class="font-bold text-[1.625rem] leading-[1.2] text-charcoal">
        Leveransplaneraren
      </h1>
      <button class="" onclick={() => (visible = false)}> Stäng</button>
    </div>
    <ul>
      {#each deliveries as delivery, index}
        <li class="py-3 px-6 mb-2 border-b">
          <h4 class="mb-2 font-bold text-[1.125rem] leading-[1.2]">
            {`Leverans ${index + 1} ${delivery.type === "bulk" ? "(Bulkleverans - silo krävs)" : ""}`}
          </h4>
          {#if delivery.type === "bulk"}
            <Select
              label="Leveransmetod:"
              options={bulkDeliveryMethods}
              bind:value={delivery.deliveryMethod}
              valueFormatter={(value) => {
                return value.delivery_method;
              }}
              labelFormatter={(value) => {
                return value.delivery_method_name;
              }}
            />
            <Select
              label="Leveransadress:"
              options={bulkAddress}
              bind:value={delivery.adress}
              valueFormatter={(value) => {
                return value.addressId;
              }}
              labelFormatter={(value) => {
                return `${value.address}, Silo ${value.siloId}`;
              }}
            />
          {:else if delivery.type === "package"}
            <Select
              label="Leveransmetod:"
              options={packageDeliveryMethods}
              bind:value={delivery.deliveryMethod}
              valueFormatter={(value) => {
                return value.delivery_method;
              }}
              labelFormatter={(value) => {
                return value.delivery_method_name;
              }}
            />
            <Select
              label="Leveransadress:"
              options={packageAddresses}
              bind:value={delivery.adress}
              valueFormatter={(value) => {
                return value.addressId;
              }}
              labelFormatter={(value) => {
                return value.address;
              }}
            />
          {/if}
          <SelectDate bind:deliveryFrom={delivery.deliveryDateFrom}  deliveryTo={delivery.deliveryDateTo} />
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
