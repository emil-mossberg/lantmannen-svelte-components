<script lang="ts">
    import { t } from 'svelte-i18n'

    import { type PriceType } from '../schemas/Price'

    import { usePriceStockSingleton } from '../lib/stores/usePriceStockSingleton.svelte'
    import stockFetch from '../lib/stores/StockFetch.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

    import IconStock from '../lib/Icons/in-stock.svg'

    const { testPSSCall } = usePriceStockSingleton

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
            return !bridgeSingleton.cart.value?.items.some(
                (item) => item.product_sku === sku
            )
        }

        return true
    })

    let stockPromise = $state(stockFetch.getPromise(sku, prefSalesQuantity))

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))

    // TO DO : refactor this into its own class, that caches previously fetched responses
    const pssProto = async (value: PriceType) => {
        console.log(value)

        return fetch(`https://dummyjson.com/products`).then((r) => r.json())
    }
</script>

{#await Promise.all([pricePromise, stockPromise])}
    No price or stock yet - add Skeleton
{:then [price, stock]}
<!-- TO DO : Switch Check PSS boolean -->
{#if price.price_cached}
        <div>DOING MORE</div>
        {#await pssProto(price)}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            <div>HERE should the PSS table for viewing be</div>
            {#each campaign.products as item}
                <div>
                    {item.title}
                </div>
            {/each}
            data
        {/await}
    {/if}
    <div class="tw-flex tw-gap-4">
        <QtyIncrement {qtyIncrement} {id} />
        <DeliveryWizard
            {isBulk}
            useModal={useModal()}
            {id}
            {prefSalesQuantity}
        />
    </div>
    
{/await}

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

<button type="button" onclick={testPSSCall}>TEST PSS</button>
