<script lang="ts">
    import { usePriceSingleton } from '../lib/stores/usePriceSingleton.svelte'

    const { priceFetchBatcher } = usePriceSingleton
    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
    }

    const { id, prefSalesQuantity, newProduct = false }: Props = $props()

    let pricePromise = $state(priceFetchBatcher.getPromise(id, prefSalesQuantity))
</script>

<div>Product Price box WIP</div>

{#await pricePromise}
    LOADING
{:then price}
    {price.product_sku}
{/await}
