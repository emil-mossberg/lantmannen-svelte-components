<script lang="ts">
    import Button from '../lib/components/Button.svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'
    import Modal from '../lib/components/Modal.svelte'

    import {
        bulkDeliveryMethods,
        packageDeliveryMethods,
        bulkAddress,
        packageAddresses,
    } from '../dummyData'

    type Props = {
        isBulk: boolean
        useModal: boolean
    }

    const { isBulk, useModal }: Props = $props()

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

        if(!showModal)
          return false

        return !deliveryMethod || !deliveryAddress
    })
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
    {@render buyButton()}
{/snippet}

{#if useModal}
    <Modal textButton="Köp produkten" {header} {body} bind:showModal />
{:else}
  {@render buyButton()}
{/if}

