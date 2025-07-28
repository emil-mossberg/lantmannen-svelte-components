<script lang="ts">
    import { t } from 'svelte-i18n'

    import Button from '../lib/components/Button.svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'
    import DatePicker from '../lib/components/DatePicker.svelte'
    import Modal from '../lib/components/Modal.svelte'
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

    const selectPSS = (campaignId: string) => {
        console.log('campaignId', campaignId)
        // TO DO Set up selecting PSS
        pssSeleced = true
    }

    let pssSeleced = $state(false)
    let pssCampaignHoverId = $state<null | string>(null)

    function getTooltipMessage(item: Campaign) {
        if (
            pssFetch.cartInfo?.cart_has_pay_campaign &&
            item.campaign_type !== pssFetch.paymentCampaign
        ) {
            return $t('M4DisabledCartM4', {
                values: { name: item.campaign_name },
            })
        }

        if (
            !pssFetch.cartInfo?.cart_has_pay_campaign &&
            !pssFetch.cartInfo?.cart_is_empty &&
            item.campaign_type === pssFetch.paymentCampaign
        ) {
            return $t('M4DisabledCartNoM4')
        }

        return null
    }
</script>

{#snippet buyButton()}
    <Button type="submit" class="min-w-[260px]" disabled={enableBuyButton()}
        >{`Beställ ${isBulk ? ' bulk' : ''}`}</Button
    >
{/snippet}

{#snippet header()}
    {`Beställ ${isBulk ? ' bulk' : ''}`}
{/snippet}

{#snippet tooltipWarning(text: string)}
    <span
        class="tw-absolute tw-z-10 tw-bg-white tw-max-w-[300px] tw-left-1/2 tw--translate-x-1/2 tw-top-6 tw-p-4 tw-border-2 tw-border-cerulean rounded"
    >
        {text}</span
    >
{/snippet}

{#snippet body()}
    {#if isPSS && !pssSeleced}
        <!-- {#await pssFetch.pssProto(id)} -->
        {#await pssFetch.pssProto('1')}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            <div>HERE should the PSS table for selecting</div>
            {campaign.json.title}

            <ul>
                {#each campaign.tempPSSDummy as item}
                    <li
                        class="tw-p-4 tw-flex tw-justify-between tw-items-center tw-relative tw-m-0"
                        onmouseenter={() =>
                            (pssCampaignHoverId = item.campaign_id)}
                        onmouseleave={() => (pssCampaignHoverId = null)}
                    >
                        {item.campaign_name}
                        <Button
                            onclick={() => {
                                selectPSS(item.campaign_id)
                            }}>{$t('select')}</Button
                        >
                        {#if item.campaign_id === pssCampaignHoverId}
                            {@const tooltip = getTooltipMessage(item)}
                            {#if tooltip}
                                {@render tooltipWarning(tooltip)}
                            {/if}
                        {/if}
                    </li>
                {/each}
            </ul>
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
