<script lang="ts">
  import Sheet from "../lib/Sheet.svelte";
  import Button from "../lib/Button.svelte";
  import SelectDate from "../lib/SelectDate.svelte";
  import SelectWrapper from "../lib/SelectWrapper.svelte";

  import { useBridgeSingleton } from "../lib/stores/useBridgeSingleton.svelte";
  // TO DO use in future
  // import IconCart from "../assets/icons/icon-cart.svg";

  const { cart } = useBridgeSingleton;

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

{#snippet header()}
  Leveransplaneraren
{/snippet}

{#snippet body()}
  <div
    class="tw-flex tw-justify-between tw-align-middle tw-px-6 tw-py-4 tw-border-b"
  >
    {#if cart.value.items}
      <span>
        {`${cart.value.items.length} Varor`}
      </span>
      <span>{`Total( Excl VAT): ${cart.value.subtotalAmount}`}</span>
    {/if}
  </div>
  <ul class="tw-h-full tw-overflow-auto">
    {#each deliveries as delivery, index}
      <li class="tw-py-3 tw-px-6 tw-mb-2 [&:not(:last-child)]:tw-border-b">
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
              <span class="tw-text-sm tw-text-right"
                >{`Pris: ${item.pris}`}</span
              >
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
  <div class="tw-flex tw-justify-center tw-items-center tw-py-3 tw-border-t">
    <Button
      text="Gå till varukorgen"
      onclick={() =>
        (window.location.href = window.BASE_URL + "checkout/cart/")}
    />
  </div>
{/snippet}

<div class="tw-fixed tw-right-0 tw-top-0 tw-z-[110]">
  <Sheet textButton="Leveransplaneraren" {header} {body} />
</div>
