<script lang="ts">
    import { t } from 'svelte-i18n'

    import pssFetch from '../lib/stores/PssFetch.svelte'

    import IconInfo from '../lib/Icons/icon-info.svg'
</script>

{#if pssFetch.cartInfo?.cart_has_pay_campaign}
    <div
        class="tw-border-2 tw-border-cerulean tw-rounded tw-p-4 tw-shadow-lg tw-flex tw-gap-2 tw-items-center"
    >
        <img src={IconInfo} alt="info icon" />
        {$t('m4GlobalMessage', {
            values: { name: pssFetch.cartInfo?.pay_campaign_name },
        })}
    </div>
{/if}
