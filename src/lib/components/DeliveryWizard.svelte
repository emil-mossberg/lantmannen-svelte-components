<script lang="ts">
    import { t } from 'svelte-i18n'

    import svelteBridge from '../stores/MagentoSvelteBridge.svelte'

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
        prefSalesQty: number
        isBuyable: boolean
        isPSS: boolean
        priceBoxUnit: string | null
        showModal?: boolean
        isPdpCard: boolean
    }

    let {
        isBulk,
        useModal,
        id,
        prefSalesQty,
        isBuyable,
        isPSS,
        priceBoxUnit,
        isPdpCard,
        showModal = $bindable(false),
    }: Props = $props()

    let deliveryMethod = $state<DeliveryMethod | null>(null)
    let deliveryAddress = $state<DeliveryAddress | null>(null)

    const enableBuyButton = $derived(() => {
        if (!showModal) return false

        return !deliveryMethod || !deliveryAddress
    })

    let pssPage = $state(true)
    let deliveryDate = $state('2025-08-03')

    let campaignId: string | null = $state(null)

    // Not very pretty fix for being able to close modal after buy button is pressed
    // typ="submit" and click event on same button does not work well together
    $effect(() => {
        const items = svelteBridge.cart.value?.items
        if (items?.some((product) => product.product_id === id)) {
            showModal = false
        }
    })

    const text = $t('order', { values: { type: isBulk ? $t('bulk') : '' } })
</script>

{#snippet buyButton(text: string)}
    <Button
        fullWidth={true}
        type="submit"
        class="min-w-[260px]"
        disabled={enableBuyButton()}>{text}</Button
    >
{/snippet}

<!-- TO DO pass different butt on if not PDP card -->
{#snippet openModalButton(label: string)}
    {#if isPdpCard}
        <Button
            fullWidth={true}
            type="button"
            onclick={() => (showModal = true)}>{label}</Button
        >
    {:else}
        PLP USAGE
    {/if}
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
        class="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-clear-button"
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
        {#await pssFetch.fetchPSSCampaigns( { id, quantity: prefSalesQty > 1 ? prefSalesQty : 1, isBuyable: isBuyable ? 1 : 0 } )}
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
        <div class="tw-mb-6">
            <DatePicker
                bind:deliveryDate
                disabledFrom="2025-09-24"
                hoverDistance={3}
                disabledDates={['2025-08-08', '2025-08-15']}
            />
        </div>

        {@render buyButton(text)}
    {/if}
{/snippet}
{#if useModal}
    <Modal
        textButton={$t('buyProduct')}
        header={text}
        {body}
        bind:showModal
        openButton={openModalButton}
    />
{:else}
    {@render buyButton(text)}
{/if}
