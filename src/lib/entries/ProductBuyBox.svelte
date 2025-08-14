<script lang="ts">
  import { t } from 'svelte-i18n'

  import stockFetch from '@lib/stores/StockFetch.svelte'
  import priceFetch from '@lib/stores/PriceFetch.svelte'
  import pssFetch from '@lib/stores/PssFetch.svelte'
  import cartStateTracker from '@lib/stores/CartStateTracker.svelte'
  import bridgeSingleton from '@lib/stores/MagentoSvelteBridge.svelte'

  import QtyIncrement from '@lib/components/QtyIncrement.svelte'
  import PssList from '@lib/components/PSSList.svelte'
  import InfoBox from '@lib/components/InfoBox.svelte'
  import Button from '@lib/components/Button.svelte'
  import SelectWrapper from '@lib/components/SelectWrapper.svelte'
  import DatePicker from '@lib/components/DatePicker.svelte'
  import Modal from '@lib/components/Modal.svelte'
  import ButtonBuyCircle from '@lib/components/ButtonBuyCircle.svelte'
  import Spinner from '@lib/components/Spinner.svelte'
  import { type BuyBoxProps } from '@lib/schemas/BuyProps'

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from '../../dummyData'

  import { type DeliveryInfo } from '@lib/schemas/DeliveryInfo'

  const {
    id,
    prefSalesQty,
    sku,
    isBulk,
    qtyIncrement,
    isBulkFi,
    isPdpCard = false,
    priceBoxUnit,
    isVirtualProduct,
    qtyMin,
    isBuyable,
  }: BuyBoxProps = $props()

  const buttonId = $props.id()

  // Fetch data

  let stockPromise = $state(
    isBulkFi
      ? stockFetch.getPromise(sku, prefSalesQty, 'TO')
      : stockFetch.getPromise(sku, prefSalesQty),
  )

  let pricePromise = $state(
    isBulkFi
      ? priceFetch.getPromise(id, prefSalesQty, 'TO')
      : priceFetch.getPromise(id, prefSalesQty),
  )

  // Delivery information for product purchase (Delivery info, PSS and quantity)

  const delivery = <DeliveryInfo>$state({
    method: null,
    address: null,
    date: '2025-08-23',
    campaignId: null,
    qty: qtyIncrement,
  })

  // Component UI controll functionality

  const disableBuyButton = $derived.by(() => {
    // If we dont use modal we dont care about setting delivery information, its known
    if (!showModal) return false

    return !delivery.method || !delivery.address
  })

  let pssPage = $state(true)

  let showModal = $state(false)

  const useModal = $derived.by(() => {
    if (!bridgeSingleton.showDeliveryPlanner) return false

    // Keep using modal as long as its visible (or if its bulk), check for change when closing
    if (isBulk || showModal) return true

    // TO DO right now this derived is strange, but we need to add here check if a package product is in cart already

    return true
  })

  const buyButtonLabel = isBulk ? $t('orderBulk') : $t('order')

  // / TO DO add setting here for not using this or whever
  const hasPaymentCampaign = $derived.by(
    () => pssFetch.cartInfo?.cart_has_pay_campaign,
  )

  let showCartSpinner = $state(false)

  const clickBuyButton = () => {
    document.getElementById(`${buttonId}-${sku}`)?.click()
    cartStateTracker.inProgress.value = true
    showCartSpinner = true
  }

  let validationError: string | null = $state(null)

  // TO DO does this have to be in onMount and cleaned up?
  window.addEventListener('magento:cartUpdated', function () {
    showCartSpinner = false
    showModal = false
  })
</script>

{#snippet buyButton(text: string)}
  <Button
    onclick={clickBuyButton}
    fullWidth={true}
    class="min-w-[260px]"
    disabled={disableBuyButton ||
      cartStateTracker.inProgress.value ||
      !!validationError}
  >
    {#if showCartSpinner}
      <Spinner />
    {:else}
      {text}
    {/if}
  </Button>
{/snippet}

{#snippet stepButton(
  count: number,
  text: string,
  done: boolean,
  current: boolean,
  disabled: boolean,
  onclick: () => void,
)}
  <button
    class="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-clear-button"
    type="button"
    {disabled}
    {onclick}
  >
    <div
      class={`tw-flex tw-items-center tw-justify-center tw-w-[32px] tw-h-[32px] tw-rounded-full tw-border tw-border-charcoal tw-font-bold ${current && 'tw-bg-tannenbaum tw-text-white'} ${done && 'tw-bg-charcoal tw-text-white'}`}
    >
      {count}
    </div>
    {text}
  </button>
{/snippet}

{#snippet stepControl()}
  <div class="tw-flex tw-gap-4 tw-justify-center tw-items-center tw-mb-6">
    {@render stepButton(
      1,
      $t('selectCampaign'),
      !!delivery.campaignId,
      pssPage,
      false,
      () => (pssPage = true),
    )}
    <div class="tw-w-[40px] tw-h-px tw-bg-alto"></div>
    {@render stepButton(
      2,
      $t('selectDeliveryInfo'),
      false,
      !pssPage,
      !delivery.campaignId,
      () => (pssPage = false),
    )}
  </div>
{/snippet}

{#snippet deliveryData()}
  <SelectWrapper
    text={$t('deliveryMethod')}
    bind:value={delivery.method}
    items={isBulk ? bulkDeliveryMethods : packageDeliveryMethods}
    label="delivery_method_name"
    itemId="delivery_method"
    placeholder="Välj leveransmetod"
  />
  <SelectWrapper
    text={$t('deliveryAddress')}
    bind:value={delivery.address}
    items={isBulk
      ? bulkAddress.map((item) => ({
          ...item,
          address: `${item.address}, Silo: ${item.siloId}`,
          addressId: `${item.addressId}-${item.siloId}`,
        }))
      : packageAddresses}
    label="address"
    itemId="addressId"
    placeholder="Välj leveransaddress"
  />
  {#if isBulk}
    <div class="tw-mb-6">
      <DatePicker
        bind:deliveryDate={delivery.date}
        label={$t('deliveryDate:')}
        disabledFrom="2025-09-24"
        dateRange={3}
        disabledDates={['2025-08-08', '2025-08-15', '2025-08-25']}
      />
    </div>
  {/if}

  {@render buyButton(buyButtonLabel)}
{/snippet}

{#snippet pssBody()}
  {@render stepControl()}
  {#if pssPage}
    {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 }, )}
      <Spinner />
    {:then campaign}
      <PssList
        campaigns={campaign}
        {priceBoxUnit}
        bind:campaignId={delivery.campaignId}
        enableRadio={true}
      />
      {#if bridgeSingleton.showDeliveryPlanner}
        <Button
          fullWidth={true}
          disabled={!delivery.campaignId}
          onclick={() => (pssPage = false)}>{$t('selectDeliveryInfo')}</Button
        >
      {:else}
        {@render buyButton(buyButtonLabel)}
      {/if}
    {/await}
  {:else if bridgeSingleton.showDeliveryPlanner}
    {@render deliveryData()}
  {/if}
{/snippet}
{#await isVirtualProduct ? Promise.all( [pricePromise], ) : Promise.all( [pricePromise, stockPromise], )}
  <!-- For disabled state -->
  <div class="tw-flex tw-gap-4">
    <QtyIncrement {qtyIncrement} {id} bind:qty={delivery.qty} />
    {#if isPdpCard}
      <Button disabled={true} fullWidth={true}>{$t('buyProduct')}</Button>
    {:else}
      <ButtonBuyCircle disabled={true} />
    {/if}
  </div>
{:then [price, stock]}
  {@const isPss =
    !!price.price_info.extension_attributes.lma_campaign_is_pre_season}

  {#if !isPss && pssFetch.cartInfo?.cart_has_pay_campaign}
    <div class="tw-mb-4">
      <InfoBox
        text={$t('M4DisabledCartM4', {
          values: { name: pssFetch.cartInfo.pay_campaign_name },
        })}
      />
    </div>
  {/if}

  <!-- Load PSS info on pageload on PDP -->
  {#if isPss && isPdpCard}
    {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 }, )}
      <Spinner />
    {:then data}
      <PssList campaigns={data} {priceBoxUnit} />
    {/await}
  {/if}
  <div class="tw-flex tw-gap-4">
    <QtyIncrement
      {qtyIncrement}
      {id}
      bind:qty={delivery.qty}
      bind:error={validationError}
    />
    {#if useModal || isPss}
      {#if isPss}
        <Modal
          textButton={$t('buyProduct')}
          header={buyButtonLabel}
          body={pssBody}
          bind:showModal
        />
      {:else}
        <Modal
          textButton={$t('buyProduct')}
          header={buyButtonLabel}
          body={deliveryData}
          bind:showModal
        />
      {/if}

      {#if isPdpCard}
        <Button
          fullWidth={true}
          disabled={(!isPss && hasPaymentCampaign) || !!validationError}
          type="button"
          onclick={() => (showModal = true)}>{$t('buyProduct')}</Button
        >
      {:else}
        <ButtonBuyCircle
          onclick={() => (showModal = true)}
          disabled={(!isPss && hasPaymentCampaign) ||
            cartStateTracker.inProgress.value ||
            !!validationError}
        />
      {/if}
    {:else if isPdpCard}
      {@render buyButton(buyButtonLabel)}
    {:else}
      <ButtonBuyCircle
        showSpinner={showCartSpinner}
        disabled={disableBuyButton ||
          cartStateTracker.inProgress.value ||
          !!validationError}
        onclick={clickBuyButton}
      />
    {/if}
  </div>
{/await}
{#if qtyIncrement > 1 && isPdpCard}
  <span class="tw-text-xs tw-inline-block tw-mt-2">
    {`${$t('buyInQty')} ${qtyIncrement}`}
  </span>
{/if}
{#if qtyMin > 1 && !isVirtualProduct && isPdpCard}
  <span class="tw-text-xs tw-inline-block tw-mt-2">
    {`${$t('minQty')} ${qtyMin}`}
  </span>
{/if}
<!-- Work around to be able to use onclick handler and add product to cart at the same time -->
<Button class="tw-hidden" id={`${buttonId}-${sku}`} type="submit"></Button>
