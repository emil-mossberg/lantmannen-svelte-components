<script lang="ts">
    import { t } from 'svelte-i18n'

    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import Price from '../lib/components/Price.svelte'

    import { type PriceType } from '../schemas/Price'

    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
        isBuyable: boolean
        spun: string | null
        packagingType: string | null
        unitMeasure: string | null
        qtyIncrement: number
        palletDiscountInformation: string | null
        showPalletAttribute: boolean
        priceBoxUnit: string
        prefSalesQtyUnit: string
    }

    const {
        id,
        prefSalesQuantity,
        spun,
        unitMeasure,
        packagingType,
        newProduct = false,
        isBuyable,
        qtyIncrement,
        palletDiscountInformation,
        showPalletAttribute,
        priceBoxUnit,
        prefSalesQtyUnit,
    }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))

    const hasDiscountPrice = (price: PriceType) => {
        return (
            !!price.price_info.extension_attributes.lma_campaign_price &&
            price.price_info.extension_attributes.lma_campaign_is_pre_season
        )
    }

    const hasProfixPrice = (price: PriceType) => {
        return !!price.price_info.extension_attributes.lma_profix_price
    }
</script>

{#snippet PriceWUnit(price: number)}
    <Price {price} {priceBoxUnit} />
{/snippet}

{#snippet PriceRow(price: Price)}
    ROW!!!
    {@render PriceWUnit(price)}
{/snippet}

{#await pricePromise}
    LOADING
{:then price}
    {@const priceInfo = price.price_info.extension_attributes}
    {@const isPss = !!priceInfo?.lma_campaign_is_pre_season}

    <div class="tw-min-h-[40px] tw-relative">
        {@render PriceRow(42424242)}
        {#if bridgeSingleton.showListPrice && priceInfo.lma_list_price}
            <div>Implement List price header here</div>
            <!-- TO DO : Add list price header Headers, check template -->
        {/if}
        <!-- NO VAT PRICE ROW -->
        <div class="tw-flex tw-border-b tw-border-alto tw-py-2">
            {#if !isPss}
                <!-- REGULAR PRICE COLUMN -->
                <div class="tw-w-1/2 tw-mr-4">
                    {#if hasDiscountPrice(price)}
                        <!-- TO DO is this correct design for discountPrice -->

                        {@render PriceWUnit(priceInfo.lma_campaign_price)}
                    {/if}
                    {@render PriceWUnit(priceInfo.lma_customer_price)}
                </div>
            {/if}
            {#if bridgeSingleton.showListPrice && priceInfo.lma_list_price}
                <!-- LIST PRICE COLUMN -->
                <div>
                    {#if hasProfixPrice(price)}
                        {@render PriceWUnit(priceInfo.lma_profix_price)}

                        <!-- TO DO improve only needing list price once here, I think its due to using strikethrough in first instance -->
                        {@render PriceWUnit(priceInfo.lma_list_price)}
                    {:else}
                        {@render PriceWUnit(priceInfo.lma_list_price)}
                    {/if}
                </div>
            {/if}
            {#if !isPss || bridgeSingleton.showListPrice}
                <!-- PRICE LABEL COLUMN -->
                <div class="tw-w-1/2 tw-text-right">
                    <span class="tw-font-normal tw-text-sm tw-leading-6">
                        {$t('exclVAT')}
                    </span>
                </div>
            {/if}
        </div>
    </div>
{:catch error}
    Error loading price: {error.message}
{/await}
