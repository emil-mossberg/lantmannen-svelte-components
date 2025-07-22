<script lang="ts">
    import Button from '../lib/components/Button.svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'
    import DatePicker from '../lib/components/DatePicker.svelte'
    import Modal from '../lib/components/Modal.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'

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

    let pssSeleced = $state(false)
</script>

{#snippet buyButton()}
    <Button type="submit" class="min-w-[260px]" disabled={enableBuyButton()}
        >{`Beställ ${isBulk ? ' bulk' : ''}`}</Button
    >
{/snippet}

{#snippet header()}
    {`Beställ ${isBulk ? ' bulk' : ''}`}
{/snippet}

{#snippet body()}
    {#if isPSS && !pssSeleced}
        {#await pssFetch.pssProto(id)}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            <div>HERE should the PSS table for selecting</div>
            {#each campaign.products as item}
                <div>
                    {item.title}
                </div>
            {/each}
        {/await}
        ITS a PSS please <Button
            onclick={() => {
                pssSeleced = true
            }}>Select PSS</Button
        >
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
