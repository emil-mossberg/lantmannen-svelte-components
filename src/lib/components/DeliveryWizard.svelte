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
    }

    let {
        isBulk,
        useModal,
        id,
        prefSalesQty,
        isBuyable,
        isPSS,
        priceBoxUnit,
        showModal = $bindable(false),
    }: Props = $props()

    let deliveryMethod = $state<DeliveryMethod | null>(null)
    let deliveryAddress = $state<DeliveryAddress | null>(null)

    // TO DO : Add validation of select fields
    // TO DO : Figure out how to run this and submit form at the same time

    const validateAndClose = () => {
        showModal = false
    }

    const enableBuyButton = $derived(() => {
        if (!showModal) return false

        return !deliveryMethod || !deliveryAddress
    })

    let pssPage = $state(true)
    let deliveryDate = $state('2025-08-03')

    let campaignId: string | null = $state(null)

    // TO DO arrow?
    function handleClick(event: MouseEvent) {
        showModal = false
        console.log('handleClick and Add to Cart #2')

        // Need to handle the click event programmatically since it does not work to use type="submit" and click event on same button
        const button = event.currentTarget as HTMLElement

        // TO DO make dynamic
        const form = button.closest(
            `form[data-product-sku="923884"]`
        ) as HTMLFormElement | null

        console.log('here!')
        showModal = false

        if (form) {
            console.log('before Submit?')

            form.submit()
        } else {
            console.warn('No matching form found')
        }
    }

    // Not very pretty fix for being able to close modal after buy button is pressed
    // typ="submit" and click event on same button does not work well together
    $effect(() => {
        const items = svelteBridge.cart.value?.items
        if (items?.some((product) => product.product_id === id)) {
            showModal = false
        }
    })
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

        {@render buyButton()}
    {/if}
{/snippet}
{#if useModal}
    <Modal textButton="Köp produkten" {header} {body} bind:showModal />
{:else}
    {@render buyButton()}
{/if}
