<script lang="ts">
  import { onMount } from 'svelte'
  
  import { t } from 'svelte-i18n'

  import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'
  import priceFetch from '../lib/stores/PriceFetch.svelte'
  import PriceShow from '../lib/components/PriceShow.svelte'
  import Spinner from '../lib/components/Spinner.svelte'

  import { type Price } from '../schemas/Price'

  type Props = {
    id: string
    prefSalesQty: number
    newProduct: boolean
    palletDiscountInformation: string | null
    showPalletAttribute: boolean
    priceBoxUnit: string | null
    prefSalesQtyUnit: string | null
    isBulkFi: boolean
  }

  const {
    id,
    prefSalesQty,
    newProduct = false,
    palletDiscountInformation,
    showPalletAttribute,
    priceBoxUnit,
    prefSalesQtyUnit,
    isBulkFi,
  }: Props = $props()

  let pricePromise = $state(
    isBulkFi
      ? priceFetch.getPromise(id, prefSalesQty, 'TO')
      : priceFetch.getPromise(id, prefSalesQty),
  )

  const hasDiscountPrice = (price: Price) => {
    return (
      !!price.price_info.extension_attributes.lma_campaign_price &&
      !price.price_info.extension_attributes.lma_campaign_is_pre_season
    )
  }

  const hasProfixPrice = (price: Price) => {
    return !!price.price_info.extension_attributes.lma_profix_price
  }

  
  // A very un-pretty way of establishing that we are in a PDP Card, since component is loaded from same template in Magento
  // Improve when possible
  
  let element: HTMLElement | undefined
  let isPDPCard = $state(false)

  onMount(() => {
    isPDPCard = !!element?.closest('.product-info-main')
  })
</script>

{#snippet DiscountBox(text: string)}
  <div
    class="tw-border tw-border-desert tw-text-desert tw-flex tw-justify-center tw-p-1 tw-my-2 tw-font-normal tw-text-xs tw-leading-6"
  >
    {text}
  </div>
{/snippet}

{#snippet PriceRow(
  price: Price,
  isPss: boolean,
  withVat: boolean,
  vatLabel: string,
)}
  {@const priceInfo = price.price_info.extension_attributes}
  {@const suffix = withVat ? '_inc_vat' : ''}
  <!-- NOTE inconsistent naming here from backend -->
  {@const customerPrice =
    priceInfo[withVat ? 'lma_valid_price_inc_vat' : 'lma_customer_price']}
  {@const listPrice = priceInfo[`lma_list_price${suffix}`]}
  {@const profixPrice = priceInfo[`lma_profix_price${suffix}`]}
  {@const campaignPrice = priceInfo[`lma_campaign_price${suffix}`]}
  {@const discountPrice = hasDiscountPrice(price)}

  <!-- NO VAT PRICE ROW -->
  <div class="tw-flex tw-py-2">
    <!-- REGULAR PRICE COLUMN -->
    <div class="tw-flex-1 tw-mr-4">
      {#if discountPrice}
        <PriceShow
          price={campaignPrice}
          {priceBoxUnit}
          isCampaignPrice={true}
        />
      {/if}
      <PriceShow
        price={customerPrice}
        disabledPrice={discountPrice}
        {priceBoxUnit}
      />
    </div>
    {#if bridgeSingleton.showListPrice && listPrice}
      <!-- LIST PRICE COLUMN -->
      <div class="tw-flex-1 tw-mr-4">
        {#if hasProfixPrice(price)}
          <PriceShow
            price={profixPrice}
            {priceBoxUnit}
            isCampaignPrice={true}
          />
        {/if}
        <PriceShow
          price={listPrice}
          headerStyling={false}
          {priceBoxUnit}
          disabledPrice={hasProfixPrice(price)}
        />
      </div>
    {/if}
    {#if !isPss || bridgeSingleton.showListPrice}
      <!-- PRICE LABEL COLUMN -->
      <div class="tw-flex-1 tw-mr-4 tw-text-right">
        <span class="tw-font-normal tw-text-xs tw-leading-6">
          {vatLabel}
        </span>
      </div>
    {/if}
  </div>
{/snippet}

<div bind:this={element}>
  {#await pricePromise}
    <Spinner />
  {:then price}
    {@const isPss =
      !!price.price_info.extension_attributes?.lma_campaign_is_pre_season}
    <div class="tw-min-h-[40px] tw-relative">
      {#if bridgeSingleton.showListPrice && price.price_info.extension_attributes?.lma_list_price}
        <div class="tw-flex">
          <div class="tw-flex-1 tw-mr-4 tw-text-xs tw-leading-6 tw-font-bold">
            {hasDiscountPrice(price) ? $t('discountPrice') : $t('normalPrice')}
          </div>
          <div class="tw-flex-1 tw-mr-4 tw-text-xs tw-leading-6 tw-font-bold">
            {price.price_info.extension_attributes?.lma_list_price
              ? $t('listPrice')
              : ''}
          </div>
          <div class="tw-flex-1 tw-mr-4"></div>
        </div>
      {/if}

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
          : $t('inclVAT'),
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
        }),
      )}
    {/if}
    {#if price.price_info.extension_attributes?.lma_campaign_payment_terms}
      {@render DiscountBox($t('paymentTerms'))}
    {/if}
    {#if prefSalesQty > 1}
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
        IS PSS, need badge
      {/if}
    </div>
  {:catch error}
    Error loading price: {error.message}
  {/await}
</div>
