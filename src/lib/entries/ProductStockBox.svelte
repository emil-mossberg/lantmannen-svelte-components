<script lang="ts">
  import { t } from 'svelte-i18n'
  import { onMount } from 'svelte'

  import stockFetch from '@lib/stores/StockFetch.svelte'
  import bridgeSingleton from '@lib/stores/MagentoSvelteBridge.svelte'

  import IconStock from '@lib/Icons/icon-in-stock.svg'

  import { type StockProps } from '@lib/schemas/StockProps'
  import { type Stock } from '@lib/schemas/Stock'
  import Spinner from '@lib/components/Spinner.svelte'

  import iconDeliveryExpress from '@lib/Icons/icon-delivery-express.svg'
  import iconDeliveryPackage from '@lib/Icons/icon-delivery-package.svg'
  import iconDeliveryPickup from '@lib/Icons/icon-delivery-pickup.svg'

  let element: HTMLElement | undefined

  let isPDPCard = $state(false)

  onMount(() => {
    isPDPCard = !!element?.closest('.product-info-main')
  })

  const {
    prefSalesQty,
    sku,
    isBulk,
    isBulkFi,
    isPdpCard,
    isVirtualProduct,
  }: StockProps = $props()


  let stockPromise = $state(
    isBulkFi
      ? stockFetch.getPromise(sku, prefSalesQty, 'TO')
      : stockFetch.getPromise(sku, prefSalesQty),
  )

  const getDeliveryMethods = (data: Stock) => {
    const deliveryInfo = [
      {
        label: $t('pickupDelivery'),
        icon: iconDeliveryPickup,
        show: data.pickup_delivery,
      },
      {
        label: $t('expressDelivery'),
        icon: iconDeliveryExpress,
        show: data.express_delivery,
      },
      {
        label: $t('packageDelivery'),
        icon: iconDeliveryPackage,
        show: data.package_delivery,
      },
      {
        label: `${$t('expressDelivery')}: ${data.current_available_stock}`,
        icon: iconDeliveryExpress,
        show: !!+data.current_available_stock,
      },
    ]

    const filteredDeliveryInfo = deliveryInfo.filter((item) => item.show)

    // Not a pretty solution, should not have side effects in functions
    if (filteredDeliveryInfo.length && isPDPCard) {
      const el = document.getElementById('lm-sheet-delivery.methods')

      if (el) {
        el.style.display = 'block'
      }
    }

    return filteredDeliveryInfo
  }
</script>

<div bind:this={element}>
  {#if isVirtualProduct}
    <div
      class={`tw-flex tw-gap-3 ${isPdpCard ? 'tw-rounded tw-border tw-border-alto tw-mt-3 tw-p-4' : 'tw-min-h-[34px]'}`}
    >
      <img src={IconStock} alt="stock icon" /><span
        class="tw-text-xs tw-leading-6">{$t('inStock')}</span
      >
    </div>
  {:else}
    {#await stockPromise}
      <div class="tw-min-h-[58px]">
        <Spinner />
      </div>
    {:then stock}
      <div>
        {#if isPdpCard}
          <span class="tw-font-bold">{$t('availability')}</span>
        {/if}

        <div
          class={`tw-flex tw-gap-3 ${isPdpCard ? 'tw-rounded tw-border tw-border-alto tw-mt-3 tw-p-4' : 'tw-min-h-[34px]'}`}
        >
          <img src={IconStock} alt="stock icon" />
          {#if !stock.in_stock && !stock.allow_backorder}
            <!-- TO DO add logic for isLocalWarehouse -->
            <span class="tw-text-xs tw-leading-6">{$t('outOfStock')}</span>
          {:else if (isBulk && (stock.in_stock || stock.allow_backorder)) || (!isBulk && stock.in_stock)}
            <span class="tw-text-xs tw-leading-6">{$t('inStock')}</span>
          {:else if !isBulk && !stock.in_stock && stock.allow_backorder}
            <span class="tw-text-xs tw-leading-6"
              >{bridgeSingleton.formatDate(stock.in_stock_date)}</span
            >
          {/if}
        </div>
      </div>

      {#if bridgeSingleton.showDeliveryBox}
        {@const deliverMethods = getDeliveryMethods(stock)}
        <div class={`${isPDPCard ? 'tw-mt-4' : 'tw-mt-3'}`}>
          {#if isPdpCard}
            <span class="tw-font-bold">{$t('deliveryOptions')}</span>
          {/if}
          <div
            class={`tw-mt-3 ${isPDPCard ? 'tw-p-4 tw-rounded tw-border tw-border-alto' : ''}`}
          >
            {#if deliverMethods.length}
              <ul class={`${!isPDPCard && 'tw-flex'}`}>
                {#each deliverMethods as method}
                  <li class="tw-flex tw-gap-3">
                    <img
                      src={method.icon}
                      alt="delivery method"
                      class="tw-h-[20px] tw-w-[20px]"
                    />
                    {#if isPDPCard}
                      <span class="tw-text-xs">{method.label}</span>
                    {/if}
                  </li>
                {/each}
              </ul>
            {:else}
              <div class="tw-flex tw-gap-3">
                <img
                  src={iconDeliveryExpress}
                  alt="delivery method"
                  class="tw-h-[20px] tw-w-[20px]"
                />
                <span class="tw-text-xs">{$t('availableMethodInCheckout')}</span
                >
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {:catch error}
      {$t('errorStock')}
    {/await}
  {/if}
</div>
