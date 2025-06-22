<script lang="ts">
  import { usePriceStockSingleton } from "../lib/stores/usePriceStockSingleton.svelte";

  const { productPrice, requestPrice, testPriceCall } = usePriceStockSingleton;

  type Props = {
    sku: string;
  };

  const { sku }: Props = $props();

  requestPrice(sku);

  // TO DO rename and Type it
  let product = $derived(productPrice.value[sku]);
</script>

<div>{sku}</div>
{#if product}
  <div>Price</div>
  <div>{product.price_info.extension_attributes.lma_line_amount}</div>
{/if}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
