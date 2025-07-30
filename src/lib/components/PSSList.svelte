<script lang="ts">
    import { t } from 'svelte-i18n'
    import svelteBridge from '../stores/MagentoSvelteBridge.svelte'

    import PriceShow from './PriceShow.svelte'

    import { type Campaign, type CampaignItem } from '../../schemas/Campaign'

    type Props = {
        campaigns: Campaign
        campaignId?: string | null
        enableRadio?: boolean
        priceBoxUnit: string
    }

    let {
        campaigns,
        campaignId = $bindable(),
        priceBoxUnit,
        enableRadio = false,
    }: Props = $props()

    const disableCampaign = (item: CampaignItem, campaign: Campaign) => {
        return (
            (campaign.cart_information.cart_has_pay_campaign &&
                (item.campaign_type !== svelteBridge.paymentCampaign ||
                    campaign.cart_information.pay_campaign_id !==
                        item.campaign_id)) ||
            (!campaign.cart_information.cart_has_pay_campaign &&
                !campaign.cart_information.cart_is_empty &&
                item.campaign_type === svelteBridge.paymentCampaign)
        )
    }

        const getDisabledReasonMessage = (campaigns: CampaignItem[]) => {
        if (
            pssFetch.cartInfo?.cart_has_pay_campaign &&
            campaigns.filter(
                (campaign) =>
                    campaign.campaign_type != svelteBridge.paymentCampaign
            )
        ) {
            return $t('M4DisabledCartM4', {
                values: { name: pssFetch.cartInfo.pay_campaign_name },
            })
        } else if (
            !pssFetch.cartInfo?.cart_has_pay_campaign &&
            !pssFetch.cartInfo?.cart_is_empty &&
            campaigns.filter(
                (campaign) =>
                    campaign.campaign_type != svelteBridge.paymentCampaign
            )
        ) {
            return $t('M4DisabledCartNoM4')
        }

        return null
    }
</script>
<div>LIST HERE</div>
<ul class="tw-mt-4">
    {#each campaigns.items as item}
        {@const disabled = disableCampaign(item, campaigns)}
        <li
            class={`tw-p-4 tw-mb-4  tw-flex tw-justify-between tw-items-center tw-relative tw-m-0 tw-border tw-border-alto ${disabled && 'tw-opacity-50'}`}
        >
            <h6>{item.campaign_name}</h6>
            <PriceShow
                price={item.prices[0].price_info.extension_attributes
                    .lma_campaign_price}
                isCampaignPrice={true}
                {priceBoxUnit}
            />
            <span class="tw-text-xs tw-leading-6">{$t('exVAT')}</span>
            {#if enableRadio}
                <input
                    type="radio"
                    bind:group={campaignId}
                    value={item.campaign_id}
                    {disabled}
                />
            {/if}
        </li>
    {/each}
</ul>
