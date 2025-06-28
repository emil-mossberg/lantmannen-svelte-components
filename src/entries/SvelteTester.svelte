<script lang="ts">
  import SelectWrapper from "../lib/components/SelectWrapper.svelte";

    import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
  } from "../dummyData";


  let test = $state();

  let parentHover = $state(false);
  let isActive = $state(false);
</script>

<div>SVELTE TESTER!!</div>
  <SelectWrapper
    bind:value={test}
    text="Leveransmethod:"
    items={bulkDeliveryMethods}
    label="delivery_method_name"
    itemId="delivery_method"
    sPlaceholder="Välj leveransmetod"
  />



