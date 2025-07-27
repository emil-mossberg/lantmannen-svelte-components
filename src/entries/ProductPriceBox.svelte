<script lang="ts">
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import Price from '../lib/components/Price.svelte'

    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
        isBuyable: boolean
        spun: string | null
        packagingType: string | null
        unitMeasure: string | null
        basicUnit: string | null
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
        basicUnit,
        newProduct = false,
        isBuyable,
        qtyIncrement,
        palletDiscountInformation,
        showPalletAttribute,
        priceBoxUnit,
        prefSalesQtyUnit,
    }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))
</script>

{#await pricePromise}
    LOADING
{:then price}
    {@const priceInfo = price.price_info.extension_attributes}
    {@const isPss = !!priceInfo?.lma_campaign_is_pre_season}

    <div class="tw-min-h-[40px] tw-relative">
        {#if bridgeSingleton.showListPrice && priceInfo.lma_list_price}
            <div>Implement List price header here</div>
            <!-- TO DO : Add list price header Headers, check template -->
        {/if}
        {#if !isPss}
            <div>
                <!-- TO DO : Add  discount, check template -->
                <!-- TO DO : Format below -->
                <Price price={priceInfo.lma_customer_price} />
                <Price price={120000.4} />
                {priceInfo.lma_customer_price}
                {priceBoxUnit}
            </div>
        {/if}
        {#if !isPss || bridgeSingleton.showListPrice}
            <div>EXCL VAT</div>
            <!-- TO DO : Add  list price column -->
        {/if}
    </div>
{:catch error}
    Error loading price: {error.message}
{/await}
