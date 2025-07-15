<script lang="ts">
    import { usePriceStockSingleton } from '../lib/stores/usePriceStockSingleton.svelte'

    const { productPrice, requestPrice } = usePriceStockSingleton

    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
    }

    const { id, prefSalesQuantity, newProduct = false }: Props = $props()

    // TO DO : I do this derived line in other component, can refactor out somehow
    let price = $derived(productPrice.value[id])
</script>

<div>IS new {newProduct}</div>
<div>Product Price box WIP</div>
<!-- Price information  -->
{#if price}
    <div>
        {`Id:${id} - Price ${price.price_info.extension_attributes.lma_line_amount}`}
    </div>
{/if}
