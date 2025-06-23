<script lang="ts">
  import { usePriceStockSingleton } from "../lib/stores/usePriceStockSingleton.svelte";

  import DeliveryWizard from "./DeliveryWizard.svelte";

  const {
    productPrice,
    requestPrice,
    productStock,
    requestStock,
    testPriceCall,
  } = usePriceStockSingleton;

  type Props = {
    id: string;
    sku: string;
    prefSalesQuantity: number;
  };

  // Scraped from magento element
  const { id, prefSalesQuantity, sku }: Props = $props();

  requestPrice(id, prefSalesQuantity);
  requestStock(sku, prefSalesQuantity);

  let price = $derived(productPrice.value[id]);
  let stock = $derived(productStock.value[sku]);
</script>

<div>{id}</div>
{#if price}
  <div>
    {`Id:${id} - Price ${price.price_info.extension_attributes.lma_line_amount}`}
  </div>
{/if}
<DeliveryWizard />
{#if stock}
  <div>{`Id:${id} - Stock ${stock.quantity}`}</div>
{/if}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
