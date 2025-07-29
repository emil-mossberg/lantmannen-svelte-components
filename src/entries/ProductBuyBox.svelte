<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

    import DeliveryWizard from './DeliveryWizard.svelte'
    import QtyIncrement from '../lib/components/QtyIncrement.svelte'
    import PriceShow from '../lib/components/PriceShow.svelte'

    type Props = {
        id: string
        sku: string
        prefSalesQuantity: number
        isBulk: boolean
        qtyIncrement: number
        isBulkFi: boolean
        isPdpCard?: boolean
        priceBoxUnit: string
        isBuyable: boolean
    }

    const {
        id,
        prefSalesQuantity,
        sku,
        isBulk,
        qtyIncrement,
        isBulkFi,
        isPdpCard = false,
        priceBoxUnit,
        isBuyable,
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
    {@const isPss =
        !!price.price_info.extension_attributes.lma_campaign_is_pre_season}
    {#if isPss && isPdpCard}
        {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQuantity > 1 ? prefSalesQuantity : 1, isBuyable: isBuyable ? 1 : 0 } )}
            <p>PSS Spinner</p>
        {:then data}
            <ul>
                {#each data.items as campaign}
                    <li
                        class="tw-border tw-flex tw-border-alto tw-p-4 tw-mb-4 tw-justify-between"
                    >
                        <h6>{campaign.campaign_name}</h6>
                        <PriceShow
                            price={campaign.prices[0].price_info
                                .extension_attributes.lma_campaign_price}
                            isCampaignPrice={true}
                            {priceBoxUnit}
                        />
                        <span class="tw-text-xs tw-leading-6"
                            >{$t('exVAT')}</span
                        >
                    </li>
                {/each}
            </ul>
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
            {prefSalesQuantity}
        />
    </div>
    {#if qtyIncrement > 1}
        <div class="tw-text-sm">
            {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
        </div>
    {/if}
{/await}
