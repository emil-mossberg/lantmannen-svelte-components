<script lang="ts">
    import { t } from 'svelte-i18n'

    import { usePriceStockSingleton } from '../lib/stores/usePriceStockSingleton.svelte'
    import { useBridgeSingleton } from '../lib/stores/useBridgeSingleton.svelte'

    import IconStock from '../lib/Icons/in-stock.svg'

    const {
        productPrice,
        requestPrice,
        productStock,
        requestStock,
        testPriceCall,
        testPSSCall,
    } = usePriceStockSingleton

    const { formatDate, cart } = useBridgeSingleton

    console.log(cart)

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

    requestPrice(id, prefSalesQuantity)
    requestStock(sku, prefSalesQuantity)

    let price = $derived(productPrice.value[id])
    let stock = $derived(productStock.value[sku])

    const useModal = $derived(() => {
        // TO DO temp added
        return true
        if (isBulk) return true

        if (cart.value?.items) {
            return !cart.value?.items.some((item) => item.product_sku === sku)
        }

        return false
    })
</script>

<!-- Price information  -->
{#if price}
    <div>
        {`Id:${id} - Price ${price.price_info.extension_attributes.lma_line_amount}`}
    </div>
{/if}

<div class="tw-flex tw-gap-4">
    <QtyIncrement {qtyIncrement} {id} />
    <DeliveryWizard {isBulk} useModal={useModal()} />
</div>
{#if qtyIncrement > 1}
    <div class="tw-text-sm">
        {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
    </div>
{/if}

<!-- Stock information  -->
{#if stock}
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
                <span>{formatDate(stock.in_stock_date)}</span>
            {/if}
        </div>
    </div>
{/if}

<button type="button" onclick={testPriceCall}>TEST call Price APP</button>
<button type="button" onclick={testPSSCall}>TEST PSS</button>
