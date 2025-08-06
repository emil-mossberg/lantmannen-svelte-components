<script lang="ts">
  import { t } from 'svelte-i18n'

  import Sheet from '../lib/components/Sheet.svelte'
  import Button from '../lib/components/Button.svelte'
  import SelectDate from '../lib/components/SelectDate.svelte'
  import SelectWrapper from '../lib/components/SelectWrapper.svelte'
  import IconCart from '../lib/IconsDynamic/IconCart.svelte'
  import PriceShow from '../lib/components/PriceShow.svelte'
  import DatePicker from '../lib/components/DatePicker.svelte'

  import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'

  import {
    bulkDeliveryMethods,
    packageDeliveryMethods,
    bulkAddress,
    packageAddresses,
  } from '../dummyData'

  const deliveries = $state([
    {
      type: 'bulk',
      adress: '101-1',
      deliveryDateFrom: '2025-06-12',
      deliveryDateTo: '2025-06-20',
      deliveryMethod: '023',
      items: [
        {
          name: 'Galant Ordinär p bk',
          sku: '400205',
          quantity: 1000,
          pris: '19 008,00 kr',
        },
      ],
    },
    {
      type: 'bulk',
      adress: '101-2',
      deliveryDateFrom: '2025-06-12',
      deliveryDateTo: '2025-06-20',
      deliveryMethod: '023',
      items: [
        {
          name: 'Lamm 500 p bk',
          sku: '400288',
          quantity: 15000,
          pris: '5 820,00 kr',
        },
      ],
    },
    {
      type: 'package',
      adress: '101',
      deliveryDateFrom: '2025-06-12',
      deliveryDateTo: '2025-06-20',
      deliveryMethod: '011',
      items: [
        {
          name: 'Galant Ordinär p ss',
          sku: '924630',
          quantity: 1000,
          pris: '4 744,00 kr',
        },
        {
          name: 'Contact 5L',
          sku: '301918',
          quantity: 5,
          pris: '324,00 kr',
        },
      ],
    },
  ])

  // TO DO : Could this be a problem with PSS that has same sku twice in cart
  // TO DO : Use this in ajax call to get deliveries info instead of multiple times inline in template when that ajax call is used
  const findProductInCart = (sku: string) => {
    return bridgeSingleton.cart.value?.items.find(
      (item) => item.product_sku === sku,
    )
  }

  let showSheet = $state(false)

  const goToCart = () => {
    window.location.href = window.BASE_URL + 'checkout/cart/'
  }

  // TO DO update to correct for logged in
  const goToCheckout = () => {
    window.location.href = window.BASE_URL + 'checkout/#shipping'
  }
</script>

{#snippet cartButtonContent(deliveryPlanner: boolean = true)}
  <div class="tw-relative">
    <IconCart />
    {#if bridgeSingleton.cart.value}
      <span
        class="tw-absolute tw-top-[-6px] tw-right-[-4px] tw-bg-green-pea tw-text-white tw-px-[6px] tw-py-[4px] tw-leading-none tw-rounded-md tw-text-xs tw-font-bold"
        >{bridgeSingleton.cart.value.items.length}</span
      >
    {/if}
  </div>
  <div class="tw-flex tw-flex-col tw-items-start">
    {#if deliveryPlanner}
      <div>
        {$t('deliveryPlanner')}
      </div>
    {/if}
    {#if bridgeSingleton.cart.value}
      <div class="tw-flex">
        <PriceShow price={bridgeSingleton.cart.value.subtotalAmount} />
        <span class="tw-text-xs tw-leading-6">{$t('exVAT')}</span>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet header()}
  {$t('deliveryPlanner')}
{/snippet}

{#snippet body()}
  <div
    class="tw-flex tw-justify-between tw-align-middle tw-px-6 tw-pb-4 tw-border-b"
  >
    {#if bridgeSingleton.cart.value?.items}
      <span>
        {`${bridgeSingleton.cart.value.items.length} Varor`}
      </span>
      <div class="tw-flex tw-gap-1">
        <span>{$t('total:')}</span>
        <PriceShow price={bridgeSingleton.cart.value.subtotalAmount} />
      </div>
    {/if}
  </div>
  <ul class="tw-h-full tw-overflow-auto">
    {#each deliveries as delivery, index}
      <li class="tw-py-3 tw-px-6 tw-mb-2 [&:not(:last-child)]:tw-border-b">
        <h5 class="tw-mb-3">
          {`${$t('deliveryCount', { values: { count: index + 1, note: delivery.type === 'bulk' ? $t('bulkSilo') : '' } })}`}
        </h5>
        <SelectWrapper
          text={$t('deliveryMethod:')}
          bind:value={delivery.deliveryMethod}
          items={delivery.type === 'bulk'
            ? bulkDeliveryMethods
            : packageDeliveryMethods}
          label="delivery_method_name"
          itemId="delivery_method"
        />
        <SelectWrapper
          text={$t('deliveryAddress:')}
          bind:value={delivery.adress}
          items={delivery.type === 'bulk'
            ? bulkAddress.map((item) => ({
                ...item,
                address: `${item.address}, Silo: ${item.siloId}`,
                addressId: `${item.addressId}-${item.siloId}`,
              }))
            : packageAddresses}
          label="address"
          itemId="addressId"
        />

        {#if delivery.type === 'bulk'}
          <DatePicker
            label={$t('deliveryDate:')}
            bind:deliveryDate={delivery.deliveryDateFrom}
            disabledFrom="2025-09-24"
            hoverDistance={3}
            disabledDates={['2025-08-08', '2025-08-15']}
          />
        {/if}
        
        <ul>
          {#each delivery.items as item}
            <li class="tw-flex">
              <img
                class="tw-h-[100x] tw-w-[100px]"
                src={findProductInCart(item.sku)?.product_image.src}
                alt={findProductInCart(item.sku)?.product_image.alt}
              />
              <div>
                <div>
                  <span class="tw-font-bold tw-text-sm"
                    >{findProductInCart(item.sku)?.product_name}</span
                  >
                </div>
                <div>
                  <span class="tw-text-sm tw-text-right"
                    >{`Antal: ${findProductInCart(item.sku)?.qty}`}</span
                  >
                </div>
                <div>
                  <span class="tw-text-sm tw-text-right"
                    >{`Pris: ${findProductInCart(item.sku)?.product_price_value.incl_tax}`}</span
                  >
                </div>
                <div>
                  <span class="tw-text-sm"
                    >{`${$t('sku')}: ${findProductInCart(item.sku)?.product_sku}`}</span
                  >
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
  <div
    class="tw-flex tw-justify-center tw-gap-4 tw-items-center tw-p-3 tw-border-t tw-flex-wrap"
  >
    <Button onclick={goToCart}>{$t('goToCart')}</Button>
    <Button onclick={goToCheckout}>{$t('goToCheckout')}</Button>
  </div>
{/snippet}

<div
  class="tw-fixed tw-right-3 tw-top-3 tw-z-[110] tw-border tw-border-charcoal tw-rounded-md tw-bg-white tw-min-w-[260px] tw-overflow-hidden"
>
  {#if bridgeSingleton.showDeliveryPlanner && bridgeSingleton.cart.value?.items && bridgeSingleton.cart.value?.items.length}
    <button
      onclick={() => (showSheet = true)}
      class="tw-clear-button tw-flex tw-gap-4 tw-px-3 tw-py-2 tw-items-center tw-bg-white hover:tw-bg-white"
    >
      {@render cartButtonContent()}
    </button>
    <Sheet {header} {body} bind:showSheet />
  {:else}
    <button
      class="tw-clear-button tw-flex tw-gap-4 tw-p-3 tw-items-center"
      onclick={goToCart}
      >{@render cartButtonContent(false)}
    </button>
  {/if}
</div>
