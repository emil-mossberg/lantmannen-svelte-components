<script lang="ts">
    import { t } from 'svelte-i18n'

    import { usePriceStockSingleton } from '../lib/stores/usePriceStockSingleton.svelte'
    import stockFetch from '../lib/stores/StockFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'
    
    import IconStock from '../lib/Icons/in-stock.svg'

    const { testPriceCall, testPSSCall } = usePriceStockSingleton
    
    import DeliveryWizard from './DeliveryWizard.svelte'
    import QtyIncrement from '../lib/components/QtyIncrement.svelte'

    type Props = {
        id: string
        sku: string
        prefSalesQuantity: number
        isBulk: boolean
        qtyIncrement: number
        isBulkInFi?: boolean
    }
    
    const {
        id,
        prefSalesQuantity,
        sku,
        isBulk,
        qtyIncrement,
        isBulkInFi = false,
    }: Props = $props()

    // Not using this also means not sending any additional form values to backend, this is why it is disabled if setting is not turn on
    const useModal = $derived(() => {
        if (!bridgeSingleton.showDeliveryPlanner) return false
        if (isBulk) return true

        if (bridgeSingleton.cart.value?.items) {
            return !bridgeSingleton.cart.value?.items.some((item) => item.product_sku === sku)
        }

        return true
    })

    let stockPromise = $state(
        stockFetch.getPromise(sku, prefSalesQuantity)
    )
</script>

<div>IN HERE</div>

<div class="tw-flex tw-gap-4">
    <QtyIncrement {qtyIncrement} {id} />
    <DeliveryWizard {isBulk} useModal={useModal()} />
</div>

{#if qtyIncrement > 1}
    <div class="tw-text-sm">
        {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
    </div>
{/if}

{#await stockPromise}
    Loading Stock Spinner
{:then stock}
    <div>
        <span>{$t('availability')}</span>
        <div
            class="tw-p-4 tw-mt-3 tw-rounded tw-border tw-border-alto tw-flex tw-items-center tw-gap-3"
        >
            <img src={IconStock} alt="stock icon" />
            {#if !stock.in_stock && !stock.allow_backorder}
                <!-- TO DO add logic for isLocalWarehouse -->
                <span>{$t('outOfStock')}</span>
            {:else if (isBulk && (stock.in_stock || stock.allow_backorder)) || (!isBulk && stock.in_stock)}
                <span>{$t('inStock')}</span>
            {:else if !isBulk && !stock.in_stock && stock.allow_backorder}
                <span>{bridgeSingleton.formatDate(stock.in_stock_date)}</span>
            {/if}
        </div>
    </div>
{/await}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
<button type="button" onclick={testPSSCall}>TEST PSS</button>
