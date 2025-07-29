<script lang="ts">
    import { t } from 'svelte-i18n'

    import InfoBox from '../lib/components/InfoBox.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'
</script>

{#if pssFetch.cartInfo?.cart_has_pay_campaign}
    <InfoBox
        text={$t('m4GlobalMessage', {
            values: { name: pssFetch.cartInfo?.pay_campaign_name },
        })}
    />
{/if}
