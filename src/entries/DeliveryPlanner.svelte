<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  import Button from "../lib/Button.svelte";
  import SelectDate from "../lib/SelectDate.svelte";
  import SelectWrapper from "../lib/SelectWrapper.svelte";

  import { useBridgeSingleton } from "../lib/stores/useBridgeSingleton.svelte";

  import IconCart from '../assets/icons/icon-cart.svg'

  const { cart } = useBridgeSingleton;
  
  console.log(cart);
  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from "../dummyData";

  type Props = {
    showDeliveryPlanner: boolean;
  };

  const { showDeliveryPlanner }: Props = $props();

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
</script>

<div class="tw-fixed tw-right-0 tw-top-0 tw-z-[110]">
    <img src="{IconCart}" alt="" />
  <Button text="Leveransplaneraren" onclick={() => (visible = !visible)} />
</div>
{#if visible}
  <div
    class="tw-w-[600px] tw-h-full tw-fixed tw-top-0 tw-border tw-bg-white tw-right-0 tw-z-[110] tw-overflow-auto"
    transition:slide={{ axis: "x", duration: 400, easing: cubicIn }}
  >
    <div class="tw-flex tw-justify-between tw-p-6">
      <h3>Leveransplaneraren</h3>
      <button class="" onclick={() => (visible = false)}> Stäng</button>
    </div>
    <ul>
      {#each deliveries as delivery, index}
        <li class="tw-py-3 tw-px-6 tw-mb-2 tw-border-b">
          <h5>
            {`Leverans ${index + 1} ${delivery.type === "bulk" ? "(Bulkleverans - silo krävs)" : ""}`}
          </h5>
          {delivery.deliveryMethod.delivery_method}
          <SelectWrapper
            text="Leveransmethod:"
            bind:value={delivery.deliveryMethod}
            items={delivery.type === "bulk"
              ? bulkDeliveryMethods
              : packageDeliveryMethods}
            label="delivery_method_name"
            itemId="delivery_method"
          />
          <SelectWrapper
            text="Leveransadress:"
            bind:value={delivery.adress}
            items={delivery.type === "bulk"
              ? bulkAddress.map((item) => ({
                  ...item,
                  address: `${item.address}, Silo: ${item.siloId}`,
                  addressId: `${item.addressId}-${item.siloId}`,
                }))
              : packageAddresses}
            label="address"
            itemId="addressId"
          />
          <SelectDate
            bind:deliveryFrom={delivery.deliveryDateFrom}
            deliveryTo={delivery.deliveryDateTo}
          />
          <h6 class="mb-2">Produkter</h6>
          <ul>
            {#each delivery.items as item}
              <li class="tw-grid tw-grid-cols-2 tw-grid-rows-2 tw-mb-3 tw-ml-8">
                <span class="tw-font-bold tw-text-sm">{item.name}</span>
                <span class="tw-text-sm tw-text-right">{`Pris: ${item.pris}`}</span>
                <span class="tw-text-sm">{`Artikelnummer: ${item.sku}`}</span>
                <span class="tw-text-sm tw-text-right"
                  >{`Antal: ${item.quantity}`}</span
                >
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
    <div>{cart.value.subtotalAmount}</div>
    {#each cart.value.items as item}
      {item.product_sku}
    {/each}

    <Button text="Gå till varukorgen" onclick={() => window.location.href = window.BASE_URL + 'checkout/cart/'} />

  </div>
{/if}
