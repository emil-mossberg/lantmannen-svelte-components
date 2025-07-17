<script lang="ts">

    import priceFetch from '../lib/stores/usePriceSingleton.svelte';
    
    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
    }

    const { id, prefSalesQuantity, newProduct = false }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))
</script>

<div>Product Price box WIP</div>

{#await pricePromise}
    LOADING
{:then price}
    {price.product_sku}
{/await}
