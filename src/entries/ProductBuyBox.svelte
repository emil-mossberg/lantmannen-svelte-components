<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

    import DeliveryWizard from '../lib/components/DeliveryWizard.svelte'
    import QtyIncrement from '../lib/components/QtyIncrement.svelte'
    import PssList from '../lib/components/PSSList.svelte'
    import InfoBox from '../lib/components/InfoBox.svelte'

    import { type BuyBoxProps } from '../schemas/BuyProps'

    const {
        id,
        prefSalesQty,
        sku,
        isBulk,
        qtyIncrement,
        isBulkFi,
        isPdpCard = false,
        priceBoxUnit,
        isBuyable,
    }: BuyBoxProps = $props()

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
            ? stockFetch.getPromise(sku, prefSalesQty, 'TO')
            : stockFetch.getPromise(sku, prefSalesQty)
    )

    let pricePromise = $state(
        isBulkFi
            ? priceFetch.getPromise(id, prefSalesQty, 'TO')
            : priceFetch.getPromise(id, prefSalesQty)
    )
</script>

{#await Promise.all([pricePromise, stockPromise])}
    No price or stock yet - add Skeleton
{:then [price, stock]}
    {@const isPss =
        !!price.price_info.extension_attributes.lma_campaign_is_pre_season}

    {#if isPss && pssFetch.cartInfo?.cart_has_pay_campaign}
        <InfoBox
            text={$t('M4DisabledCartM4', {
                values: { name: pssFetch.cartInfo.pay_campaign_name },
            })}
        />
    {/if}

    {#if isPss && isPdpCard}
        {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 } )}
            <p>PSS Spinner</p>
        {:then data}
            <PssList campaigns={data} {priceBoxUnit} />
        {/await}
    {/if}
    <div class="tw-flex tw-gap-4">
        <QtyIncrement {qtyIncrement} {id} />
        <DeliveryWizard
            {isBulk}
            isPSS={isPss}
            useModal={useModal()}
            {id}
            {isBuyable}
            {prefSalesQty}
            {priceBoxUnit}
        />
    </div>
    {#if qtyIncrement > 1}
        <div class="tw-text-sm">
            {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
        </div>
    {/if}
{/await}
