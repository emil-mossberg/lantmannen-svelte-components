<script lang="ts">
    import Sheet from '../lib/components/Sheet.svelte'
    import Button from '../lib/components/Button.svelte'
    import SelectDate from '../lib/components/SelectDate.svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'
    import IconCart from '../lib/IconsDynamic/IconCart.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

    import {
        bulkDeliveryMethods,
        packageDeliveryMethods,
        bulkAddress,
        packageAddresses,
    } from '../dummyData'


    const deliveries = $state([
        {
            type: 'bulk',
            adress: '101',
            deliveryDateFrom: '2025-06-12',
            deliveryDateTo: '2025-06-20',
            deliveryMethod: '023',
            items: [
                {
                    name: 'Galant Ordinär p bk',
                    sku: '400205',
                    quantity: 1000,
                    pris: '19 008,00 kr',
                },
            ],
        },
        {
            type: 'bulk',
            adress: '101',
            deliveryDateFrom: '2025-06-12',
            deliveryDateTo: '2025-06-20',
            deliveryMethod: '023',
            items: [
                {
                    name: 'Lamm 500 p bk',
                    sku: '400288',
                    quantity: 15000,
                    pris: '5 820,00 kr',
                },
            ],
        },
        {
            type: 'package',
            adress: '101',
            deliveryDateFrom: '2025-06-12',
            deliveryDateTo: '2025-06-20',
            deliveryMethod: '011',
            items: [
                {
                    name: 'Galant Ordinär p ss',
                    sku: '924630',
                    quantity: 1000,
                    pris: '4 744,00 kr',
                },
                {
                    name: 'Contact 5L',
                    sku: '301918',
                    quantity: 5,
                    pris: '324,00 kr',
                },
            ],
        },
    ])

    // TO DO : Could this be a problem with PSS that has same sku twice in cart
    // TO DO : Use this in ajax call to get deliveries info instead of multiple times inline in template when that ajax call is used
    const findProductInCart = (sku: string) => {

        return bridgeSingleton.cart.value?.items.find((item) => item.product_sku === sku)
    }

    let showSheet = $state(false)
</script>

{#snippet header()}
    Leveransplaneraren 
{/snippet}

{#snippet body()}
    <div
        class="tw-flex tw-justify-between tw-align-middle tw-px-6 tw-py-4 tw-border-b"
    >
        {#if bridgeSingleton.cart.value?.items}
            <span>
                {`${bridgeSingleton.cart.value.items.length} Varor`}
            </span>
            <span>{`Total( Excl VAT): ${bridgeSingleton.cart.value.subtotalAmount}`}</span>
        {/if}
    </div>
    <ul class="tw-h-full tw-overflow-auto">
        {#each deliveries as delivery, index}
            <li
                class="tw-py-3 tw-px-6 tw-mb-2 [&:not(:last-child)]:tw-border-b"
            >
                <h5>
                    {`Leverans ${index + 1} ${delivery.type === 'bulk' ? '(Bulkleverans - silo krävs)' : ''}`}
                </h5>
                {delivery.deliveryMethod.delivery_method}

                <SelectWrapper
                    text="Leveransmethod:"
                    bind:value={delivery.deliveryMethod}
                    items={delivery.type === 'bulk'
                        ? bulkDeliveryMethods
                        : packageDeliveryMethods}
                    label="delivery_method_name"
                    itemId="delivery_method"
                />
                <SelectWrapper
                    text="Leveransadress:"
                    bind:value={delivery.adress}
                    items={delivery.type === 'bulk'
                        ? bulkAddress.map((item) => ({
                              ...item,
                              address: `${item.address}, Silo: ${item.siloId}`,
                              addressId: `${item.addressId}-${item.siloId}`,
                          }))
                        : packageAddresses}
                    label="address"
                    itemId="addressId"
                />
                <SelectDate
                    bind:deliveryFrom={delivery.deliveryDateFrom}
                    deliveryTo={delivery.deliveryDateTo}
                />
                <ul>
                    {#each delivery.items as item}
                        <li class="tw-flex">
                            <img
                                class="tw-h-[100x] tw-w-[100px]"
                                src={findProductInCart(item.sku)?.product_image
                                    .src}
                                alt={findProductInCart(item.sku)?.product_image
                                    .alt}
                            />
                            <div>
                                <div>
                                    <span class="tw-font-bold tw-text-sm"
                                        >{findProductInCart(item.sku)
                                            ?.product_name}</span
                                    >
                                </div>
                                <div>
                                    <span class="tw-text-sm tw-text-right"
                                        >{`Antal: ${findProductInCart(item.sku)?.qty}`}</span
                                    >
                                </div>
                                <div>
                                    <span class="tw-text-sm tw-text-right"
                                        >{`Pris: ${findProductInCart(item.sku)?.product_price_value.incl_tax}`}</span
                                    >
                                </div>
                                <div>
                                    <span class="tw-text-sm"
                                        >{`Artikelnummer: ${findProductInCart(item.sku)?.product_sku}`}</span
                                    >
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>
    <div class="tw-flex tw-justify-center tw-items-center tw-py-3 tw-border-t">
        <Button
            onclick={() =>
                (window.location.href = window.BASE_URL + 'checkout/cart/')}
            >Gå till varukorgen</Button
        >
    </div>
{/snippet}

{#if bridgeSingleton.cart.value && bridgeSingleton.cart.value?.items.length}
    <button
        onclick={() => (showSheet = true)}
        class="tw-fixed tw-right-0 tw-top-0 tw-z-[110] tw-flex tw-gap-4 tw-px-3 tw-py-2 tw-items-center tw-bg-white"
        ><IconCart /> Leveransplaneraren</button
    >
    <Sheet {header} {body} bind:showSheet />
{/if}
