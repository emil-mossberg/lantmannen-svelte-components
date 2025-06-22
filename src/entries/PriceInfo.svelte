<script lang="ts">
  import { usePriceStockSingleton } from "../lib/stores/usePriceStockSingleton.svelte";

  const { productPrice, requestPrice, testPriceCall } = usePriceStockSingleton;

  type Props = {
    id: string;
    prefSalesQuantity: number,
  };

  const { id, number = 1 }: Props = $props();

  requestPrice(id);

  let product = $derived(productPrice.value[id]);
</script>

<div>{id}</div>
{#if product}

  <div>{`Id:${id} - Price ${product.price_info.extension_attributes.lma_line_amount}`}</div>
{/if}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
