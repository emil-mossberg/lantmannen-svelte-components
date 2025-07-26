<script lang="ts">
    import { t } from 'svelte-i18n'

    import pssFetch from '../lib/stores/PssFetch.svelte'

    import IconCaution from '../lib/Icons/icon-caution.svg'
</script>

{#if pssFetch.cartInfo?.cart_has_pay_campaign}
    <div
        class="tw-border-2 tw-border-yellow-sea tw-rounded tw-p-4 tw-shadow-lg tw-flex tw-gap-2 tw-items-center"
    >
        <img src={IconCaution} alt="caution icon" />
        {$t('m4GlobalMessage', {
            values: { name: pssFetch.cartInfo?.pay_campaign_name },
        })}
    </div>
{/if}
