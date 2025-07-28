<script lang="ts">
    import bridgeSingleton from '../stores/MagentoSvelteBridge.svelte'

    type Props = {
        price: number
        priceBoxUnit?: string
    }

    const { price, priceBoxUnit }: Props = $props()
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

<div class="tw-flex">
    <span
        class="tw-font-lantmannenSerif tw-font-bold tw-text-[1.125rem] tw-leading-[1.2]"
    >
        {formattedPrice}
    </span>

    <span class="tw-font-normal tw-text-xs tw-leading-6">
        {priceBoxUnit ? `/${priceBoxUnit}` : ''}
    </span>
</div>
