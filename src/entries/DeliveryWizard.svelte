<script lang="ts">
  import Button from "../lib/Button.svelte";
  import SelectWrapper from "../lib/SelectWrapper.svelte";
  import SelectDate from "../lib/SelectDate.svelte";
  import Modal from "../lib/Modal.svelte";

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from "../dummyData";

  // TO DO type it
  let deliveryMethod = $state({});
  let deliveryAddress = $state({});
  let deliveryDateFrom = $state("2025-06-08");
  let deliveryDateTo = $state("2025-06-18");
  let deliveryType = $state("bulk");

  // TO DO get this as props from magento
  const productType: "bulk" | "packaged" = $state("bulk");
</script>

<Modal textButton="Köp">
  <h4>{`Beställ ${deliveryType === "bulk" ? deliveryType : ""}`}</h4>
  <SelectWrapper
    text="Leveransmethod:"
    bind:value={deliveryMethod}
    items={productType === "bulk"
      ? bulkDeliveryMethods
      : packageDeliveryMethods}
    label="delivery_method_name"
    itemId="delivery_method"
  />
  <SelectWrapper
    text="Leveransadress:"
    bind:value={deliveryAddress}
    items={productType === "bulk"
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
    bind:deliveryFrom={deliveryDateFrom}
    deliveryTo={deliveryDateTo}
  />

  <Button
    text={`Beställ ${deliveryType === "bulk" ? deliveryType : ""}`}
    class="min-w-[260px]"
  />
</Modal>
