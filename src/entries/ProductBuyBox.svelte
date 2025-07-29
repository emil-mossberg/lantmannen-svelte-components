<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

    import DeliveryWizard from './DeliveryWizard.svelte'
    import QtyIncrement from '../lib/components/QtyIncrement.svelte'

    type Props = {
        id: string
        sku: string
        prefSalesQuantity: number
        isBulk: boolean
        qtyIncrement: number
        isBulkFi: boolean
        isPdpCard?: boolean
    }

    const {
        id,
        prefSalesQuantity,
        sku,
        isBulk,
        qtyIncrement,
        isBulkFi,
        isPdpCard = false,
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

    let stockPromise = $state(
        isBulkFi
            ? stockFetch.getPromise(sku, prefSalesQuantity, 'TO')
            : stockFetch.getPromise(sku, prefSalesQuantity)
    )

    let pricePromise = $state(
        isBulkFi
            ? priceFetch.getPromise(id, prefSalesQuantity, 'TO')
            : priceFetch.getPromise(id, prefSalesQuantity)
    )
</script>

{#await Promise.all([pricePromise, stockPromise])}
    No price or stock yet - add Skeleton
{:then [price, stock]}
    <!-- TO DO : Switch Check PSS boolean -->
    {#if price.price_cached && isPdpCard}
        {#await pssFetch.fetchPSSCampaigns(id)}
            <p>Loading PSS Campaign View table...</p>
        {:then campaign}
            DONE
        {/await}
        {#await pssFetch.pssProto('1')}
            <p>Loading PSS Campaign View table...</p>
        {:then campaign}
            {campaign.json.title}
        {/await}
    {/if}
    <div class="tw-flex tw-gap-4">
        <!-- TO DO : Dynamic PSS boolean here -->
        <QtyIncrement {qtyIncrement} {id} />
        <DeliveryWizard
            {isBulk}
            isPSS={true}
            useModal={useModal()}
            {id}
            {prefSalesQuantity}
        />
    </div>
    {#if qtyIncrement > 1}
        <div class="tw-text-sm">
            {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
        </div>
    {/if}
{/await}
