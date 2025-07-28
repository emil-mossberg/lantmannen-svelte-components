<script lang="ts">
    import bridgeSingleton from '../stores/MagentoSvelteBridge.svelte'

    type Props = {
        price: number
        basicUnit?: string
    }

    const { price, basicUnit }: Props = $props()

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
    class="tw-font-lantmannenSerif tw-font-bold tw-text-[1.125rem] tw-leading-[1.2]"
>
    {formattedPrice}
    {#if basicUnit}
        {basicUnit}
    {/if}
</div>
