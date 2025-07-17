<script lang="ts">
    import priceFetch from '../lib/stores/usePriceSingleton.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

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
        showPalletAttribute
    }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))
</script>

<div>{isBuyable}</div>
<div>Product Price box WIP</div>

{#await pricePromise}
    LOADING
{:then price}
    {price.product_sku}
{/await}
