<script lang="ts">
  import { t } from 'svelte-i18n'

  import stockFetch from '../lib/stores/StockFetch.svelte'
  import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

  import IconStock from '../lib/Icons/icon-in-stock.svg'

  import { type StockProps } from '../schemas/StockProps'
  import Spinner from '../lib/components/Spinner.svelte'

  const { prefSalesQty, sku, isBulk, isBulkFi, isPdpCard }: StockProps =
    $props()

  let stockPromise = $state(
    isBulkFi
      ? stockFetch.getPromise(sku, prefSalesQty, 'TO')
      : stockFetch.getPromise(sku, prefSalesQty),
  )
</script>

{#await stockPromise}
  <div class="tw-min-h-[58px]">
    <Spinner />
  </div>
{:then stock}
  <div>
    {#if isPdpCard}
      <span class="tw-font-bold">{$t('availability')}</span>
    {/if}

    <div
      class={`tw-flex tw-items-center tw-gap-3 ${isPdpCard ? 'tw-rounded tw-border tw-border-alto tw-mt-3 tw-p-4' : 'tw-min-h-[34px]'}`}
    >
      <img src={IconStock} alt="stock icon" />
      {#if !stock.in_stock && !stock.allow_backorder}
        <!-- TO DO add logic for isLocalWarehouse -->
        <span class="tw-text-xs tw-leading-6">{$t('outOfStock')}</span>
      {:else if (isBulk && (stock.in_stock || stock.allow_backorder)) || (!isBulk && stock.in_stock)}
        <span class="tw-text-xs tw-leading-6">{$t('inStock')}</span>
      {:else if !isBulk && !stock.in_stock && stock.allow_backorder}
        <span class="tw-text-xs tw-leading-6"
          >{bridgeSingleton.formatDate(stock.in_stock_date)}</span
        >
      {/if}
    </div>
  </div>
{/await}
