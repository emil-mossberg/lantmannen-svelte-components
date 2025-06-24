<script lang="ts">
  import { usePriceStockSingleton } from "../lib/stores/usePriceStockSingleton.svelte";
  import { useBridgeSingleton } from "../lib/stores/useBridgeSingleton.svelte";

  const {
    productPrice,
    requestPrice,
    productStock,
    requestStock,
    testPriceCall,
    testPSSCall,
  } = usePriceStockSingleton;

  const { formatDate } = useBridgeSingleton;

  import DeliveryWizard from "./DeliveryWizard.svelte";
  import Button from "../lib/Button.svelte";

  type Props = {
    id: string;
    sku: string;
    prefSalesQuantity: number;
    isBulk: boolean;
    isBulkInFi?: boolean;
  };

  const { id, prefSalesQuantity, sku, isBulk, isBulkInFi = false }: Props = $props();

  requestPrice(id, prefSalesQuantity);
  requestStock(sku, prefSalesQuantity);

  let price = $derived(productPrice.value[id]);
  let stock = $derived(productStock.value[sku]);
</script>


<!-- Price information  -->
{#if price}
  <div>
    {`Id:${id} - Price ${price.price_info.extension_attributes.lma_line_amount}`}
  </div>
{/if}
<DeliveryWizard />
<Button text="Buy button" onclick={()=> console.log('click') } disabled={!price && !stock} />
<!-- Stock information  --> 
{#if stock}
  {#if !stock.in_stock && !stock.allow_backorder}
    <!-- TO DO add logic for isLocalWarehouse -->
    <!-- TO DO add translations  -->
    <span>Out of stock</span>
  {:else if (isBulk && (stock.in_stock || stock.allow_backorder)) || (!isBulk && stock.in_stock)}
    <span>In stock</span>
  {:else if !isBulk && !stock.in_stock && stock.allow_backorder}
    <span>{formatDate(stock.in_stock_date)}</span>
  {/if}
{/if}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
<button type="button" onclick={testPSSCall}>TEST PSS</button>