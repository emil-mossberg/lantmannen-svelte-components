<script lang="ts">
  import Button from "../lib/components/Button.svelte";
  import SelectWrapper from "../lib/components/SelectWrapper.svelte";
  import Modal from "../lib/components/Modal.svelte";

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from "../dummyData";

  type Props = {
    isBulk: boolean;
  };

  const { isBulk }: Props = $props();

  // TO DO type it
  let deliveryMethod = $state(null);
  let deliveryAddress = $state(null);
</script>

{#snippet header()}
  {`Beställ ${isBulk ? " bulk" : ""}`}
{/snippet}

{#snippet body()}
  <SelectWrapper
    text="Leveransmethod:"
    bind:value={deliveryMethod}
    items={isBulk ? bulkDeliveryMethods : packageDeliveryMethods}
    label="delivery_method_name"
    itemId="delivery_method"
    sPlaceholder="Välj leveransmetod"
  />
  <SelectWrapper
    text="Leveransadress:"
    bind:value={deliveryAddress}
    items={isBulk
      ? bulkAddress.map((item) => ({
          ...item,
          address: `${item.address}, Silo: ${item.siloId}`,
          addressId: `${item.addressId}-${item.siloId}`,
        }))
      : packageAddresses}
    label="address"
    itemId="addressId"
    sPlaceholder="Valj leveransaddress"
  />
  <Button
    class="min-w-[260px]"
  >{`Beställ ${isBulk ? " bulk" : ""}`}</Button>
{/snippet}

<Modal textButton="Köp produkten" {header} {body} />
