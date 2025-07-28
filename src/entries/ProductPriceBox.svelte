<script lang="ts">
    import { t } from 'svelte-i18n'

    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import Price from '../lib/components/Price.svelte'

    import { type PriceType } from '../schemas/Price'

    type Props = {
        id: string
        prefSalesQty: number
        newProduct: boolean
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
        prefSalesQty,
        unitMeasure,
        packagingType,
        newProduct = false,
        qtyIncrement,
        palletDiscountInformation,
        showPalletAttribute,
        priceBoxUnit,
        prefSalesQtyUnit,
    }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQty))

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

{#snippet PriceWUnit(price: number, disabledPrice = false)}
    <Price {price} {priceBoxUnit} {disabledPrice} />
{/snippet}

{#snippet DiscountBox(text: string)}
    <div
        class="tw-border tw-border-desert tw-text-desert tw-flex tw-justify-center tw-p-1 tw-my-2 tw-font-normal tw-text-xs tw-leading-6"
    >
        {text}
    </div>
{/snippet}

{#snippet PriceRow(
    price: PriceType,
    isPss: boolean,
    withVat: boolean,
    vatLabel: string
)}
    {@const priceInfo = price.price_info.extension_attributes}
    {@const suffix = withVat ? '_inc_vat' : ''}
    <!-- NOTE inconsistent naming here -->
    {@const customerPrice =
        priceInfo[withVat ? 'lma_valid_price_inc_vat' : 'lma_customer_price']}
    {@const listPrice = priceInfo[`lma_list_price${suffix}`]}
    {@const profixPrice = priceInfo[`lma_profix_price${suffix}`]}
    {@const campaignPrice = priceInfo[`lma_campaign_price${suffix}`]}
    {#if bridgeSingleton.showListPrice && priceInfo.lma_list_price}
        <div>Implement List price header here</div>
        <!-- TO DO : Add list price header Headers, check template -->
    {/if}
    <!-- NO VAT PRICE ROW -->
    <div class="tw-flex tw-py-2">
        {#if !isPss}
            <!-- REGULAR PRICE COLUMN -->
            <div class="tw-w-1/2 tw-mr-4">
                {#if hasDiscountPrice(price)}
                    {@render PriceWUnit(campaignPrice)}
                {/if}
                {@render PriceWUnit(customerPrice, hasDiscountPrice(price))}
            </div>
        {/if}
        {#if bridgeSingleton.showListPrice && listPrice}
            <!-- LIST PRICE COLUMN -->
            <div>
                {#if hasProfixPrice(price)}
                    {@render PriceWUnit(profixPrice)}
                {/if}
                {@render PriceWUnit(listPrice, hasProfixPrice(price))}
            </div>
        {/if}
        {#if !isPss || bridgeSingleton.showListPrice}
            <!-- PRICE LABEL COLUMN -->
            <div class="tw-w-1/2 tw-text-right">
                <span class="tw-font-normal tw-text-xs tw-leading-6">
                    {vatLabel}
                </span>
            </div>
        {/if}
    </div>
{/snippet}

{#await pricePromise}
    Price spinner
{:then price}
    {@const isPss =
        !!price.price_info.extension_attributes?.lma_campaign_is_pre_season}

    <div class="tw-min-h-[40px] tw-relative">
        <div class="tw-border-b tw-border-alto">
            {@render PriceRow(price, isPss, false, $t('exclVAT'))}
        </div>

        {@render PriceRow(
            price,
            isPss,
            true,
            bridgeSingleton.showVatPercentage
                ? `${$t('inclVAT')} (${[
                      price.price_info.extension_attributes.lma_vat_percentage,
                  ]} %)`
                : $t('inclVAT')
        )}
    </div>
    {#if showPalletAttribute}
        <div>{palletDiscountInformation}</div>
    {/if}
    {#if price.price_info.extension_attributes?.lma_campaign_fixed_due_date && !isPss}
        <!-- TO DO : this need date format -->
        {@render DiscountBox(
            $t('orderNowPay', {
                values: {
                    date: price.price_info.extension_attributes
                        ?.lma_campaign_fixed_due_date,
                },
            })
        )}
    {/if}
    {#if price.price_info.extension_attributes?.lma_campaign_payment_terms}
        {@render DiscountBox($t('paymentTerms'))}
    {/if}
    {#if prefSalesQty}
        {@const prefAndUnit = `${prefSalesQty} ${prefSalesQtyUnit}`}
        <span class="tw-text-xs tw-leading-6">
            {#if price.price_info.extension_attributes?.lma_is_pallet_discount}
                {$t('bestPricePalletQty', {
                    values: {
                        qty: prefAndUnit,
                    },
                })}
            {:else}
                {$t('palletQty', {
                    values: {
                        qty: prefAndUnit,
                    },
                })}
            {/if}
        </span>
    {/if}

    <div class="tw-absolute tw-left-[20px] tw-top-0 tw-z-[1]">
        <!-- TO DO : Talk to sofia about this and continue -->
        {#if isPss || price.price_info.extension_attributes?.lma_customer_price_is_campaign}
            IS PSS
        {/if}
    </div>
{:catch error}
    Error loading price: {error.message}
{/await}
