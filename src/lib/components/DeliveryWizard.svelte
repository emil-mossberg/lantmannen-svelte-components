<script lang="ts">
    import { t } from 'svelte-i18n'

    import Button from './Button.svelte'
    import SelectWrapper from './SelectWrapper.svelte'
    import DatePicker from './DatePicker.svelte'
    import Modal from './Modal.svelte'
    import PssList from './PSSList.svelte'
    import pssFetch from '../stores/PssFetch.svelte'

    import { type DeliveryMethod } from '../../schemas/DeliveryMethod'
    import { type DeliveryAddress } from '../../schemas/DeliveryAddress'

    import {
        bulkDeliveryMethods,
        packageDeliveryMethods,
        bulkAddress,
        packageAddresses,
    } from '../../dummyData'

    type Props = {
        isBulk: boolean
        useModal: boolean
        id: string
        prefSalesQuantity: number
        isBuyable: boolean
        isPSS: boolean
        priceBoxUnit: string
    }

    const {
        isBulk,
        useModal,
        id,
        prefSalesQuantity,
        isBuyable,
        isPSS,
        priceBoxUnit,
    }: Props = $props()

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
</script>

{#snippet buyButton()}
    <Button
        fullWidth={true}
        type="submit"
        class="min-w-[260px]"
        disabled={enableBuyButton()}
        >{$t('order', { values: { type: isBulk ? $t('bulk') : '' } })}</Button
    >
{/snippet}

{#snippet header()}
    {$t('order', { values: { type: isBulk ? $t('bulk') : '' } })}
{/snippet}

{#snippet stepButton(
    count: number,
    text: string,
    done: boolean,
    current: boolean,
    disabled: boolean,
    onclick: () => void
)}
    <button
        class="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-border-none hover:tw-bg-white hover:tw-border-none focus:tw-bg-white focus:tw-border-none"
        type="button"
        {disabled}
        {onclick}
    >
        <div
            class={`tw-flex tw-items-center tw-justify-center tw-w-[32px] tw-h-[32px] tw-rounded-full tw-border tw-border-charcoal tw-font-bold ${current && 'tw-bg-tannenbaum tw-text-white'} ${done && 'tw-bg-charcoal tw-text-white'}`}
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
                false,
                () => (pssPage = true)
            )}
            <div class="tw-w-[40px] tw-h-px tw-bg-alto"></div>
            {@render stepButton(
                2,
                $t('selectDeliveryInfo'),
                false,
                !pssPage,
                !campaignId,
                () => (pssPage = false)
            )}
        </div>
    {/if}
    {#if isPSS && pssPage}
        {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQuantity > 1 ? prefSalesQuantity : 1, isBuyable: isBuyable ? 1 : 0 } )}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            <PssList
                campaigns={campaign}
                {priceBoxUnit}
                bind:campaignId
                enableRadio={true}
            />
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
            date="2025-08-03"
            disabledFrom="2025-09-24"
            hoverDistance={3}
            disabledDates={['2025-08-08', '2025-08-15']}
        />
        {@render buyButton()}
    {/if}
{/snippet}

{#if useModal}
    <Modal textButton="Köp produkten" {header} {body} bind:showModal />
{:else}
    {@render buyButton()}
{/if}
