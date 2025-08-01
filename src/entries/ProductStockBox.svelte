<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

    import IconStock from '../lib/Icons/in-stock.svg'

    import { type ProductStock } from '../schemas/ProductStock';

    type Props = {
        isBulk: boolean
        isBulkFi: boolean
        sku: string
        prefSalesQuantity: number
    }

    const { prefSalesQuantity, sku, isBulk, isBulkFi }: ProductStock = $props()

    let stockPromise = $state(
        isBulkFi
            ? stockFetch.getPromise(sku, prefSalesQuantity, 'TO')
            : stockFetch.getPromise(sku, prefSalesQuantity)
    )
</script>

{#await stockPromise}
    Loading Stock Spinner
{:then stock}
    <div>
        <span class="tw-font-bold">{$t('availability')}</span>
        <div
            class="tw-p-4 tw-mt-3 tw-rounded tw-border tw-border-alto tw-flex tw-items-center tw-gap-3"
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
