<script lang="ts">
    import { t } from 'svelte-i18n'

    import Button from '../lib/components/Button.svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'
    import DatePicker from '../lib/components/DatePicker.svelte'
    import Modal from '../lib/components/Modal.svelte'
    import InfoBox from '../lib/components/InfoBox.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'

    import { type Campaign } from '../schemas/Campaign'

    import {
        bulkDeliveryMethods,
        packageDeliveryMethods,
        bulkAddress,
        packageAddresses,
    } from '../dummyData'

    type Props = {
        isBulk: boolean
        useModal: boolean
        id: string
        prefSalesQuantity: number
        isPSS: boolean
    }

    const { isBulk, useModal, id, prefSalesQuantity, isPSS }: Props = $props()

    // TO DO move types?
    type DeliveryMethod = {
        delivery_method: string
        delivery_method_name: string
    }

    type DeliveryAddress = {
        address: string
        adressId: string
    }

    let deliveryMethod = $state<DeliveryMethod | null>(null)
    let deliveryAddress = $state<DeliveryAddress | null>(null)

    // TO DO : Add validation of select fields
    // TO DO : Figure out how to run this and submit form at the same time
    let showModal = $state(false)

    const validateAndClose = () => {
        console.log('WIP - DO VALIDATION')
        showModal = false
    }

    const enableBuyButton = $derived(() => {
        if (!showModal) return false

        return !deliveryMethod || !deliveryAddress
    })

    let pssPage = $state(true)

    let campaignId: string | null = $state(null)

    const disableCampaign = (campaign: Campaign) => {
        return (
            (pssFetch.cartInfo?.cart_has_pay_campaign &&
                campaign.campaign_type !== pssFetch.paymentCampaign) ||
            (!pssFetch.cartInfo?.cart_has_pay_campaign &&
                !pssFetch.cartInfo?.cart_is_empty &&
                campaign.campaign_type === pssFetch.paymentCampaign)
        )
    }

    const getDisabledReasonMessage = (campaigns: Campaign[]) => {
        if (
            pssFetch.cartInfo?.cart_has_pay_campaign &&
            campaigns.filter(
                (campaign) => campaign.campaign_type != pssFetch.paymentCampaign
            )
        ) {
            return $t('M4DisabledCartM4', {
                values: { name: pssFetch.cartInfo.pay_campaign_name },
            })
        } else if (
            !pssFetch.cartInfo?.cart_has_pay_campaign &&
            !pssFetch.cartInfo?.cart_is_empty &&
            campaigns.filter(
                (campaign) => campaign.campaign_type != pssFetch.paymentCampaign
            )
        ) {
            return $t('M4DisabledCartNoM4')
        }

        return null
    }
</script>

{#snippet buyButton()}
    <Button
        fullWidth={true}
        type="submit"
        class="min-w-[260px]"
        disabled={enableBuyButton()}
        >{`Beställ ${isBulk ? ' bulk' : ''}`}</Button
    >
{/snippet}

{#snippet header()}
    {`Beställ ${isBulk ? ' bulk' : ''}`}
{/snippet}

{#snippet stepButton(
    count: number,
    text: string,
    done: boolean,
    current: boolean,
    onclick: () => void
)}
    <button
        class="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-border-none hover:tw-bg-white hover:tw-border-none  focus:tw-bg-white focus:tw-border-none"
        type="button"
        {onclick}
    >
        <div
            class="{`tw-flex tw-items-center tw-justify-center tw-w-[32px] tw-h-[32px] tw-rounded-full tw-border tw-border-charcoal tw-font-bold ${current && 'tw-bg-tannenbaum tw-text-white'} ${done && 'tw-bg-charcoal tw-text-white'}`}"
        >
            {count}
        </div>
        {text}
    </button>
{/snippet}

{#snippet body()}
    {#if isPSS}
        <div class="tw-flex tw-gap-4 tw-justify-center tw-items-center tw-mb-6">
            {@render stepButton(
                1,
                $t('selectCampaign'),
                !!campaignId,
                pssPage,
                () => (pssPage = true)
            )}
            <div class="tw-w-[40px] tw-h-px tw-bg-alto"></div>
            {@render stepButton(
                2,
                $t('selectDeliveryInfo'),
                false,
                !pssPage,
                () => (pssPage = false)
            )}
        </div>
    {/if}
    {#if isPSS && pssPage}
        <!-- {#await pssFetch.pssProto(id)} -->
        {#await pssFetch.pssProto('1')}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            {@const text = getDisabledReasonMessage(campaign.tempPSSDummy)}

            {#if text}
                <InfoBox {text} />
            {/if}

            <ul class="tw-mt-4">
                {#each campaign.tempPSSDummy as item}
                    {@const disabled = disableCampaign(item)}
                    <li
                        class={`tw-p-4 tw-mb-4  tw-flex tw-justify-between tw-items-center tw-relative tw-m-0 tw-border tw-border-alto ${disabled && 'tw-opacity-50'}`}
                    >
                        <h6>{item.campaign_name}</h6>
                        <input
                            type="radio"
                            bind:group={campaignId}
                            value={item.campaign_id}
                            {disabled}
                        />
                    </li>
                {/each}
            </ul>
            <Button
                fullWidth={true}
                disabled={!campaignId}
                onclick={() => (pssPage = false)}
                >{$t('selectDeliveryInfo')}</Button
            >
        {/await}
    {:else}
        <SelectWrapper
            text="Leveransmethod:"
            bind:value={deliveryMethod}
            items={isBulk ? bulkDeliveryMethods : packageDeliveryMethods}
            label="delivery_method_name"
            itemId="delivery_method"
            placeholder="Välj leveransmetod"
        />
        <SelectWrapper
            text="Leveransadress:"
            bind:value={deliveryAddress}
            items={isBulk
                ? bulkAddress.map((item) => ({
                      ...item,
                      address: `${item.address}, Silo: ${item.siloId}`,
                      addressId: `${item.addressId}-${item.siloId}`,
                  }))
                : packageAddresses}
            label="address"
            itemId="addressId"
            placeholder="Valj leveransaddress"
        />
        <label for="">Leveransdatum:</label>
        <DatePicker
            date="2025-06-12"
            disabledFrom="2025-06-24"
            hoverDistance={3}
            disabledDates={['2025-06-08', '2025-06-15']}
        />
        {@render buyButton()}
    {/if}
{/snippet}

{#if useModal}
    <Modal textButton="Köp produkten" {header} {body} bind:showModal />
{:else}
    {@render buyButton()}
{/if}
