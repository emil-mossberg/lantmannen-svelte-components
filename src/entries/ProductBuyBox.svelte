<script lang="ts">
  import { t } from 'svelte-i18n'

  import stockFetch from '../lib/stores/StockFetch.svelte'
  import priceFetch from '../lib/stores/PriceFetch.svelte'
  import pssFetch from '../lib/stores/PssFetch.svelte'
  import cartStateTracker from '../lib/stores/CartStateTracker.svelte'
  import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

  import QtyIncrement from '../lib/components/QtyIncrement.svelte'
  import PssList from '../lib/components/PSSList.svelte'
  import InfoBox from '../lib/components/InfoBox.svelte'
  import Button from '../lib/components/Button.svelte'
  import SelectWrapper from '../lib/components/SelectWrapper.svelte'
  import DatePicker from '../lib/components/DatePicker.svelte'
  import Modal from '../lib/components/Modal.svelte'
  import ButtonBuyCircle from '../lib/components/ButtonBuyCircle.svelte'
  import { type BuyBoxProps } from '../schemas/BuyProps'

  // TO DO remove TEMP dummy data
  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from '../dummyData'

  import { type DeliveryInfo } from '../schemas/DeliveryInfo'

  const {
    id,
    prefSalesQty,
    sku,
    isBulk,
    qtyIncrement,
    isBulkFi,
    isPdpCard = false,
    priceBoxUnit,
    isBuyable,
  }: BuyBoxProps = $props()

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
    // TO DO use this also

    // if (cartStateTracker.inProgress) return false

    // If we dont use modal we dont care about setting delivery information, its known
    if (!showModal) return false

    return !delivery.method || !delivery.address
  })

  // Not very pretty fix for being able to close modal after buy button is pressed
  // typ="submit" and click event on same button does not work well together

  $effect(() => {
    const items = bridgeSingleton.cart.value?.items
    if (items?.some((product) => product.product_id === id)) {
      showModal = false
    }
  })

  let pssPage = $state(true)

  let showModal = $state(false)

  const useModal = $derived.by(() => {
    if (!bridgeSingleton.showDeliveryPlanner) return false

    // Keep using modal as long as its visible (or if its bulk), check for change when closing
    if (isBulk || showModal) return true

    if (bridgeSingleton.cart.value?.items) {
      return !bridgeSingleton.cart.value?.items.some(
        (item) => item.product_sku === sku,
      )
    }

    return true
  })

  const buyButtonLabel = $t('order', {
    values: { type: isBulk ? $t('bulk') : '' },
  })

  const setBuyInProgress = () => {
    console.log('setBuyInProgress')
  }
</script>

{#snippet buyButton(text: string)}
  <Button
    fullWidth={true}
    type="submit"
    class="min-w-[260px]"
    disabled={disableBuyButton}>{text}</Button
  >
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
    text="Leveransmethod:"
    bind:value={delivery.method}
    items={isBulk ? bulkDeliveryMethods : packageDeliveryMethods}
    label="delivery_method_name"
    itemId="delivery_method"
    placeholder="Välj leveransmetod"
  />
  <SelectWrapper
    text="Leveransadress:"
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
  <label for="">Leveransdatum:</label>
  <div class="tw-mb-6">
    <DatePicker
      bind:deliveryDate={delivery.date}
      disabledFrom="2025-09-24"
      hoverDistance={3}
      disabledDates={['2025-08-08', '2025-08-15']}
    />
  </div>

  {@render buyButton(buyButtonLabel)}
{/snippet}

{#snippet pssBody()}
  {@render stepControl()}
  {#if pssPage}
    {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 }, )}
      <p>Loading PSS Campaign...</p>
    {:then campaign}
      <PssList
        campaigns={campaign}
        {priceBoxUnit}
        bind:campaignId={delivery.campaignId}
        enableRadio={true}
      />
      <Button
        fullWidth={true}
        disabled={!delivery.campaignId}
        onclick={() => (pssPage = false)}>{$t('selectDeliveryInfo')}</Button
      >
    {/await}
  {:else}
    {@render deliveryData()}
  {/if}
{/snippet}



{#await Promise.all([pricePromise, stockPromise])}
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

  <div class="tw-mb-4">
    {#if !isPss && pssFetch.cartInfo?.cart_has_pay_campaign}
      <InfoBox
        text={$t('M4DisabledCartM4', {
          values: { name: pssFetch.cartInfo.pay_campaign_name },
        })}
      />
    {/if}
  </div>
  <!-- Load PSS info on pageload on PDP -->
  {#if isPss && isPdpCard}
    {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 }, )}
      <p>PSS Spinner</p>
    {:then data}
      <PssList campaigns={data} {priceBoxUnit} />
    {/await}
  {/if}
  <div class="tw-flex tw-gap-4">
    <QtyIncrement {qtyIncrement} {id} bind:qty={delivery.qty} />
    {#if useModal}
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
          type="button"
          onclick={() => (showModal = true)}>{$t('buyProduct')}</Button
        >
      {:else}
        <ButtonBuyCircle onclick={() => (showModal = true)} />
      {/if}
    {:else if isPdpCard}
      {@render buyButton(buyButtonLabel)}
    {:else}
      <ButtonBuyCircle
        disabled={disableBuyButton}
        type="submit"
        onclick={setBuyInProgress}
      />
    {/if}
  </div>
{/await}
