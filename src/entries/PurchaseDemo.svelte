<script lang="ts">
  import Button from "../lib/Button.svelte";
  import Select from "../lib/Select.svelte";
  import SelectDate from "../lib/SelectDate.svelte";

  import { useBridgeSingleton } from "../lib/stores/useBridgeSingleton.svelte";

  const { testData, testMethod, cart } = useBridgeSingleton;

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from "../dummyData";

  let showModal = $state(false);
  let deliveryMethod = $state("");
  let deliveryAddress = $state("");
  let deliveryDateFrom = $state("2025-06-08");
  let deliveryDateTo = $state("2025-06-18");
  let deliveryType = $state("bulk");

  const showBulk = () => {
    showModal = true;
    deliveryType = "bulk";
  };

  const showPackage = () => {
    showModal = true;
    deliveryType = "packaged";
  };
</script>

<div>{testData.value}</div>
<div>{cart.value.subtotalAmount}</div>
{#each cart.value.items as item}
  {item.product_sku}
{/each}
{#if showModal}
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 border z-[110] w-[500px]"
  >
    <div class="flex justify-between items-center mb-4">
      <h4 class="font-bold text-[1.125rem] leading-[1.2]">
        {`Beställ ${deliveryType === "bulk" ? deliveryType : ""}`}
      </h4>
      <button onclick={() => (showModal = false)}>Stäng</button>
    </div>

    {#if deliveryType === "bulk"}
      <Select
        label="Leveransmetod:"
        options={bulkDeliveryMethods}
        bind:value={deliveryMethod}
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
        bind:value={deliveryAddress}
        valueFormatter={(value) => {
          return value.addressId;
        }}
        labelFormatter={(value) => {
          return `${value.address}, Silo ${value.siloId}`;
        }}
      />
    {:else if deliveryType === "packaged"}
      <Select
        label="Leveransmetod:"
        options={packageDeliveryMethods}
        bind:value={deliveryMethod}
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
        bind:value={deliveryAddress}
        valueFormatter={(value) => {
          return value.addressId;
        }}
        labelFormatter={(value) => {
          return value.address;
        }}
      />
    {/if}
    <SelectDate
      bind:deliveryFrom={deliveryDateFrom}
      deliveryTo={deliveryDateTo}
    />
    <div class="w-full flex justify-center mt-8">
      <Button
        text={`Beställ ${deliveryType === "bulk" ? deliveryType : ""}`}
        onclick={() => (showModal = false)}
        class="min-w-[260px]"
      />
    </div>
  </div>
{/if}

<div class="flex flex-col gap-4">
  <div>
    <Button text="Bulk" onclick={showBulk} class="min-w-[260px]" />
  </div>
  <div>
    <Button
      text="Package första gången"
      onclick={showPackage}
      class="min-w-[260px]"
    />
  </div>
</div>
