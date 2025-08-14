<script lang="ts">
  import bridgeSingleton from '../stores/MagentoSvelteBridge.svelte'

  type Props = {
    price: number
    priceBoxUnit?: string | null
    disabledPrice?: boolean
    isCampaignPrice?: boolean
    headerStyling?: boolean
    headerSize?: 'lg' | 'sm'
  }

  const {
    price,
    priceBoxUnit,
    disabledPrice = false,
    isCampaignPrice = false,
    headerStyling = true,
    headerSize = 'lg',
  }: Props = $props()

  const formatMap = {
    fi_FI: {
      code: 'fi-FI',
      currency: 'EUR',
    },
    sv_SE: {
      code: 'SV-SE',
      currency: 'SEK',
    },
  }

  const formattedPrice = $derived.by(() => {
    const format = formatMap[bridgeSingleton.locale]

    return new Intl.NumberFormat(format.code, {
      style: 'currency',
      currency: format.currency,
    }).format(price)
  })
</script>

<div
  class={`tw-flex tw-gap-[3px] tw-items-center ${disabledPrice ? 'tw-line-through' : ''}`}
>
  <span
    class={`${headerStyling ? (headerSize === 'lg' ? 'tw-font-lantmannenSerif tw-font-bold tw-text-[1.125rem] tw-leading-[1.2]' : 'tw-font-lantmannenSerif tw-font-bold tw-text-sm tw-leading-[1.2]') : 'tw-text-xs tw-leading-6'} ${disabledPrice && 'tw-text-xs tw-leading-6 tw-font-normal'} ${isCampaignPrice && 'tw-text-desert'}`}
  >
    {formattedPrice}
  </span>

  <span
    class={`tw-text-xs tw-leading-6 ${isCampaignPrice && 'tw-text-desert'}`}
  >
    {priceBoxUnit ? ` / ${priceBoxUnit}` : ''}
  </span>
</div>
