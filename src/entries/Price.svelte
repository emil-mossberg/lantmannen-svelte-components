<script lang="ts">
    type Props = {
        price: number
        basicUnit?: string
    }

    const { price, basicUnit }: Props = $props()

    // TO DO take a locale also dynamically
    const tempFormat = 'fi'

    const formatMap = {
        fi: {
            code: 'fi-FI',
            currency: 'EUR',
        },
        se: {
            code: 'SV-SE',
            currency: 'SEK',
        },
    }

    const formattedPrice = $derived.by(() => {
        const format = formatMap[tempFormat]

        return new Intl.NumberFormat(format.code, {
            style: 'currency',
            currency: format.currency,
        }).format(price)
    })
</script>

<div>PRICE</div>
<div>{formattedPrice}</div>
