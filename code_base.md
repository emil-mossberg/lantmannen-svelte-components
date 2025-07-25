# .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

# .vscode/extensions.json

```json
{
  "recommendations": ["svelte.svelte-vscode"]
}

```

# .vscode/settings.json

```json
{
    "prettier.semi": false,
    "prettier.tabWidth": 4,
    "prettier.singleQuote": true
}

```

# index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="product-page-info"></div>
    <div id="svelte-checkout-acess"></div>
    <div id="purchase-demo"></div>
    <div id="purchase-info-2"></div>
    <div id="svelte-tester"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

# livereload.js

```js
import livereload from 'livereload'

console.log('Starting live reload')

const PROJECT_PATH_JS = '/Users/emil.mossberg/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/js'
const PROJECT_PATH_CS = '/Users/emil.mossberg/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/css'

const server = livereload.createServer()
server.watch(
    [PROJECT_PATH_JS, PROJECT_PATH_CS]
)

```

# package.json

```json
{
  "name": "svelte-agri-components",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:move": "vite build && cp -r dist/js/* ~/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/js/ && cp dist/svelte-bundle.css ~/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/css",
    "watch:build:move": "chokidar 'src/**/*' -c 'npm run build:move'",
    "livereload": "node livereload.js",
    "dev-delux": "concurrently \"npm run livereload\" \"npm run watch:build:move\"",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^5.0.3",
    "@tsconfig/svelte": "^5.0.4",
    "ai-digest": "^1.4.1",
    "autoprefixer": "^10.4.21",
    "chokidar-cli": "^3.0.0",
    "concurrently": "^9.2.0",
    "livereload": "^0.9.3",
    "postcss": "^8.5.4",
    "svelte": "^5.19.6",
    "svelte-check": "^4.1.4",
    "svelte-i18n": "^4.0.1",
    "svelte-select": "^5.8.3",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.1.0",
    "zod": "^3.25.67"
  }
}

```

# postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

# PROMPT.md

```md
# PROMPT TEMPLATE 

I’m working on a Svelte 5 application that is integrated into an existing Adobe Commerce / Magento 2 storefront. The Svelte app is not using SvelteKit, but is instead built as a standalone frontend that is embedded into Magento pages to take over specific UI functionality.

Key features implemented in the Svelte app include:

Fetching price and stock levels dynamically via AJAX

Handling the purchase flow, including selection of configurable options (size, color, etc.), validation, and triggering the "Add to Cart" action

I will provide:

The complete codebase in a single file

A local copy of the Svelte 5 documentation, since this version was released after many LLM cutoff dates

Please answer the following question with that context in mind:
[INSERT YOUR SPECIFIC QUESTION HERE]
```

# README.md

```md
### Code snippets

This is a less clean way of accessing the customer-cart

\`\`\`javascript
require(['Magento_Customer/js/customer-data'], function(customerData) {
    const cart = customerData.get('cart');

    console.log(cart);

    const subscription = cart.subscribe(function(newCartData) {
        console.log('Cart updated:', newCartData);
    });
});










```

# src/app.css

```css
/* @import "tailwindcss"; */

@tailwind base;
@tailwind components;
@tailwind utilities;


.tw-s-overlay {
  opacity: .4;
}


/* TO DO use variables */
/* .svelte-component h1 {
  font-family: 'LantmannenSerif', serif;
  font-weight: 700;
  font-size: 3.125rem;
  color: #1e6e37;
} */


/* RESET LIST (All classes should be named magento-svelte for easy removing one day */

.svelte-component input[type="number"] {
  border-radius: unset;
  height: auto;
  width: auto;
}

.svelte-component button {
  pointer-events: unset;
  opacity: unset;
}

.magento-svelte-select input[type="text"] {
  height: auto;
  border: unset;
  position: absolute;
}

button.magento-svelte-button-transparent {
  background-color: transparent;
  border-color: transparent;
}

button.magento-svelte-button:focus {
  background-color: #005720;
  border-color: #005720;
  color: white;
}

svg.magento-svelte-svg {
  background-color: white;
}

.svelte-component button {
  min-width: unset;
}




```

# src/dummyData.ts

```ts
  export const bulkDeliveryMethods = [
    { delivery_method: "020", delivery_method_name: "Bulk 3 dagar" },
    { delivery_method: "021", delivery_method_name: "Bulk Fast Dag" },

    { delivery_method: "023", delivery_method_name: "Bulk 2 dagar" },
  ];

  export const packageDeliveryMethods = [
    {
      delivery_method: "010",
      delivery_method_name: "Flak Normal, Lantmännen lossar",
    },
    {
      delivery_method: "011",
      delivery_method_name: "Flak Normal, Kund lossar",
    },
    {
      delivery_method: "012",
      delivery_method_name: "Flak Express, Kund lossar, Område A",
    },
    {
      delivery_method: "013",
      delivery_method_name: "Flak Express Lantmännen lossar Omr A",
    },
    { delivery_method: "040", delivery_method_name: "Egen transport" },
  ];

 export const bulkAddress = [
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 1, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 2, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 3, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 4, addressId: '101' },
  {
    address: "Birger Jarlsgatan 26, 216 12 Limhamn",
    siloId: 4,
    addressId: '202',
  },
  {
    address: "Birger Jarlsgatan 26, 216 12 Limhamn",
    siloId: 5,
    addressId: '202',
  },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 7, addressId: '303' },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 8, addressId: '303' },
  { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 10, addressId: '404' },
  { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 9, addressId: '404' },
];

export const packageAddresses = [
  { address: "Dybäcksgatan 5, 216 20 Malmö", addressId: '101' },
  { address: "Birger Jarlsgatan 26, 216 12 Limhamn", addressId: '202' },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", addressId: '303' },
  { address: "Paddelgränd 8, 216 11 Limhamn", addressId: '404' },
];
```

# src/entries/CheckoutAcess.svelte

```svelte
<script lang="ts">
    import DeliveryPlanner from './DeliveryPlanner.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

</script>

{#if bridgeSingleton.showDeliveryPlanner}
    <DeliveryPlanner />
{:else}
    <div>Old cart flow, implement</div>
{/if}

```

# src/entries/DeliveryPlanner.svelte

```svelte
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

```

# src/entries/DeliveryWizard.svelte

```svelte
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

```

# src/entries/ProductBuyBox.svelte

```svelte
<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import pssFetch from '../lib/stores/PssFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

    import DeliveryWizard from './DeliveryWizard.svelte'
    import QtyIncrement from '../lib/components/QtyIncrement.svelte'

    type Props = {
        id: string
        sku: string
        prefSalesQuantity: number
        isBulk: boolean
        qtyIncrement: number
        isBulkInFi?: boolean
        isPdpCard?: boolean
    }

    const {
        id,
        prefSalesQuantity,
        sku,
        isBulk,
        qtyIncrement,
        isBulkInFi = false,
        isPdpCard = false,
    }: Props = $props()

    // Not using this also means not sending any additional form values to backend, this is why it is disabled if setting is not turn on
    const useModal = $derived(() => {
        if (!bridgeSingleton.showDeliveryPlanner) return false
        if (isBulk) return true

        if (bridgeSingleton.cart.value?.items) {
            return !bridgeSingleton.cart.value?.items.some(
                (item) => item.product_sku === sku
            )
        }

        return true
    })

    let stockPromise = $state(stockFetch.getPromise(sku, prefSalesQuantity))

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))
</script>

{#await Promise.all([pricePromise, stockPromise])}
    No price or stock yet - add Skeleton
{:then [price, stock]}
    <!-- TO DO : Switch Check PSS boolean -->
    {#if price.price_cached && isPdpCard}
        {#await pssFetch.pssProto(price.product_id)}
            <p>Loading PSS Campaign...</p>
        {:then campaign}
            <div><strong>HERE should the PSS table for viewing be</strong></div>
            {#each campaign.products.slice(0, 4) as item}
                <div>
                    {item.title}
                </div>
            {/each}
        {/await}
    {/if}
    <div class="tw-flex tw-gap-4">
        <!-- TO DO : Dynamic PSS boolean here -->
        <QtyIncrement {qtyIncrement} {id} />
        <DeliveryWizard
            {isBulk}
            isPSS={false}
            useModal={useModal()}
            {id}
            {prefSalesQuantity}
        />
    </div>
    {#if qtyIncrement > 1}
        <div class="tw-text-sm">
            {$t('qtyIncInfo', { values: { qty: qtyIncrement } })}
        </div>
    {/if}
{/await}

```

# src/entries/ProductPriceBox.svelte

```svelte
<script lang="ts">
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'
    import priceFetch from '../lib/stores/PriceFetch.svelte'
    import Price from '../lib/components/Price.svelte';

    type Props = {
        id: string
        prefSalesQuantity: number
        newProduct: boolean
        isBuyable: boolean
        spun: string | null
        packagingType: string | null
        unitMeasure: string | null
        basicUnit: string | null
        qtyIncrement: number
        palletDiscountInformation: string | null
        showPalletAttribute: boolean
        priceBoxUnit: string
        prefSalesQtyUnit: string
    }

    const {
        id,
        prefSalesQuantity,
        spun,
        unitMeasure,
        packagingType,
        basicUnit,
        newProduct = false,
        isBuyable,
        qtyIncrement,
        palletDiscountInformation,
        showPalletAttribute,
        priceBoxUnit,
        prefSalesQtyUnit,
    }: Props = $props()

    let pricePromise = $state(priceFetch.getPromise(id, prefSalesQuantity))
</script>

{#await pricePromise}
    LOADING
{:then price}
    {@const priceInfo = price.price_info.extension_attributes}
    {@const isPss = !!priceInfo?.lma_campaign_is_pre_season}

    <div class="tw-min-h-[40px] tw-relative">
        {#if bridgeSingleton.showListPrice && priceInfo.lma_list_price}
            <div>Implement List price header here</div>
            <!-- TO DO : Add list price header Headers, check template -->
        {/if}
        {#if !isPss}
            <div>
                <!-- TO DO : Add  discount, check template -->
                <!-- TO DO : Format below -->
                 <Price price={priceInfo.lma_customer_price}/>
                 <Price price={120000.400}/>
                {priceInfo.lma_customer_price}
                {priceBoxUnit}
            </div>
        {/if}
        {#if !isPss || bridgeSingleton.showListPrice}
            <div>
                EXCL VAT
            </div>
        <!-- TO DO : Add  list price column -->
         {/if}
    </div>
{:catch error}
    Error loading price: {error.message}
{/await}

```

# src/entries/ProductStockBox.svelte

```svelte
<script lang="ts">
    import { t } from 'svelte-i18n'

    import stockFetch from '../lib/stores/StockFetch.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridgeSingleton.svelte'

    import IconStock from '../lib/Icons/in-stock.svg'

    type Props = {
        isBulk: boolean
        sku: string
        prefSalesQuantity: number
    }

    const { prefSalesQuantity, sku, isBulk }: Props = $props()

    let stockPromise = $state(stockFetch.getPromise(sku, prefSalesQuantity))
</script>

{#await stockPromise}
    Loading Stock Spinner
{:then stock}
    <div>
        <span>{$t('availability')}</span>
        <div
            class="tw-p-4 tw-mt-3 tw-rounded tw-border tw-border-alto tw-flex tw-items-center tw-gap-3"
        >
            <img src={IconStock} alt="stock icon" />
            {#if !stock.in_stock && !stock.allow_backorder}
                <!-- TO DO add logic for isLocalWarehouse -->
                <span>{$t('outOfStock')}</span>
            {:else if (isBulk && (stock.in_stock || stock.allow_backorder)) || (!isBulk && stock.in_stock)}
                <span>{$t('inStock')}</span>
            {:else if !isBulk && !stock.in_stock && stock.allow_backorder}
                <span>{bridgeSingleton.formatDate(stock.in_stock_date)}</span>
            {/if}
        </div>
    </div>
{/await}

```

# src/entries/SvelteTester.svelte

```svelte
<script lang="ts">
    import type { Component, ComponentProps } from 'svelte'

    import { bulkDeliveryMethods, packageDeliveryMethods } from '../dummyData'

    let parentHover = $state(false)
    let isActive = $state(false)

    import Dynamic from '../lib/components/test/Dynamic.svelte'

    function withProps<TComponent extends Component<any>>(
        component: TComponent,
        props: ComponentProps<TComponent>
    ) {
        // TO DO what can I do here now?
    }

    withProps(Dynamic, { label: 'bar' })

    let count = $state(0)

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    $effect(() => {
        console.log(count)

        return () => {
            console.log('clean up')
        }
    })
</script>

<div>TEST TEST</div>

<div>{count}</div>
<button onclick={() => count++}>COUNT</button>

```

# src/lib/components/Button.svelte

```svelte
<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements'

    type LmButtonProps = HTMLButtonAttributes & {
        class?: string
    }

    let { children, class: className = '', ...rest }: LmButtonProps = $props()

    // TO DO implement secondary button also and potentially buy button with svg icon
    // TO DO add support for svg icon?
</script>

<button
    type="button"
    {...rest}
    class={`magento-svelte-button tw-px-4 tw-py-2 tw-border tw-border-green-pea tw-bg-green-pea p-2 tw-text-white active:tw-bg-tannenbaum active:tw-border-tannenbaum active:tw-text-white hover:tw-bg-tannenbaum hover:tw-border-tannenbaum hover:tw-text-white disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${className}`}
>
    {@render children?.()}
</button>

```

# src/lib/components/DatePicker.svelte

```svelte
<script lang="ts">
    type Props = {
        date: string
        hoverDistance: number
        disabledDates?: string[]
        disabledFrom: string // TO DO : should also be numerical?
    }

    let {
        date = $bindable(),
        disabledFrom,
        disabledDates = [],
        hoverDistance = 1,
    }: Props = $props()

    let offset = $state(0)
    let currentHover = $state('')

    const objdisabledFrom = new Date(disabledFrom)
    const objdisabledFromEpoc = objdisabledFrom.getTime()

    // TO DO : localize month and weekdays
    let days = 'Mo|Tu|We|Th|Fr|Sa|Su'.split('|')
    let months = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|')

    function iso(date: Date) {
        const pad = (n: number) => (n < 10 ? '0' + n : n)
        return (
            date.getFullYear() +
            '-' +
            pad(date.getMonth() + 1) +
            '-' +
            pad(date.getDate())
        )
    }

    function selectDate(newValue: string) {
        date = newValue
        offset = 0
    }

    function go(direction: number) {
        offset = offset + direction
    }

    let viewDate = $derived.by(() => {
        let viewDate = new Date(date)

        viewDate.setMonth(viewDate.getMonth() + offset)
        return viewDate
    })

    type Day = {
        date: number
        selected: boolean
        enabled: boolean
        highlight: boolean
        value: string
    }

    const isDateEnabled = (value: string, time: number) => {
        return time < objdisabledFromEpoc && !disabledDates.includes(value)
    }

    let weeksFrom = $derived.by(() => {
        const START = 1 // Start week on monday

        const startOfCalendar = new Date(viewDate.getTime())

        // TO DO understand how this aligns back to first visible in month even if before the month

        // Set to first day of month
        startOfCalendar.setDate(1)

        const dayOffset =
            startOfCalendar.getDate() +
            ((START - startOfCalendar.getDay() - 7) % 7)

        // Adjust to first day of week that above day is in in
        startOfCalendar.setDate(dayOffset)

        let endOfCalendar = new Date(viewDate.getTime())

        endOfCalendar.setDate(
            new Date(
                viewDate.getFullYear(),
                viewDate.getMonth() + 1,
                0
            ).getDate()
        )

        const endOffset =
            endOfCalendar.getDate() + ((START - endOfCalendar.getDay() + 6) % 7)

        endOfCalendar.setDate(endOffset)

        var d = new Date(startOfCalendar.getTime()),
            M = viewDate.getMonth(),
            Y = viewDate.getFullYear(),
            week: Day[] = [],
            weeks = [week]

        const currentHoverDate = new Date(currentHover)
        const currentHoverIso = iso(currentHoverDate)

        let highlightRemaining = 0

        while (d.getTime() <= endOfCalendar.getTime()) {
            var dd = d.getDate(),
                value = iso(d)

            const enabled = isDateEnabled(value, d.getTime())

            const isHovered = value === currentHoverIso && enabled

            if (isHovered) {
                highlightRemaining = hoverDistance
            }

            const highlight = highlightRemaining > 0 && enabled

            if (highlight) {
                highlightRemaining--
            }

            const day = {
                date: dd,
                selected: date === value,
                enabled,
                highlight,
                value,
            }

            week.push(day)

            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

            if (d.getDay() === START) {
                week = []
                weeks.push(week)
            }
        }

        return weeks
    })

    let month = $derived.by(() => {
        return months[viewDate.getMonth()]
    })

    const year = $derived.by(() => viewDate.getFullYear())

    let inputDate = $state(date)

    function parseValidateAndFormatDate() {
        
        const inutDateObj = new Date(inputDate)

        if (isNaN(inutDateObj.getTime())) {
            inputDate = date
            return
        }

        // TO DO clean up
        // const formattedDate = inutDateObj.toISOString().slice(0, 10) // 'YYYY-MM-DD'
        const formattedDate = inutDateObj.toLocaleString().slice(0, 10) // 'YYYY-MM-DD'
        
        console.log('Formatted date', formattedDate)

        const timestamp = inutDateObj.getTime()

        if (!isDateEnabled(formattedDate, timestamp)) {
            inputDate = date
        } else {
            // TO DO fix
            date = formattedDate
            // inputDate = formattedDate
        }
    }
</script>

<div>
    <div class="tw-pb-3">
        <input
            type="text"
            bind:value={inputDate}
            onblur={parseValidateAndFormatDate}
        />
    </div>

    <table
        class="tw-table-fixed tw-border-separate tw-border tw-border-gray-300 tw-text-center tw-p-4"
    >
        <thead>
            <tr>
                <th class="btn" onclick={() => go(-1)}>&#9664;</th>
                <th colspan="5">{month} {year}</th>

                <th><button type="button" onclick={() => go(+1)}>&#9654;</button></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each days as day}
                    <th>{day}</th>
                {/each}
            </tr>
            {#each weeksFrom as week}
                <tr>
                    {#each week as day}
                        <td
                            class={`tw-w-[60px] tw-h-[60px]  ${day.selected && 'tw-text-green-pea tw-border tw-border-green-pea tw-font-bold'} ${!day.enabled && 'tw-opacity-20'} ${day.highlight && 'tw-bg-green-pea tw-text-white tw-font-bold'}`}
                            onclick={() => selectDate(day.value)}
                            onmouseenter={() => (currentHover = day.value)}
                            onmouseleave={() => (currentHover = '')}
                            >{day.date}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

```

# src/lib/components/Modal.svelte

```svelte
<script lang="ts">
  import { t } from "svelte-i18n";
  
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";
  import IconCross from "../IconsDynamic/IconCross.svelte";
  import Overlay from "./Overlay.svelte";

  type Props = {
    textButton: string;
    header: Snippet;
    body: Snippet;
    showModal?: boolean;
  };

  let { textButton, header, body, showModal = $bindable(false) }: Props = $props();

  $effect(() => {
    if (showModal) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  });
</script>

<Overlay show={showModal} />
{#if showModal}
  <div
    class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-[120] tw-bg-white tw-p-6 tw-border tw-w-[500px]"
  >
    <div class="tw-flex tw-justify-between mb-4">
      <h5>{@render header?.()}</h5>
      <button class="magento-svelte-button-transparent" onclick={() => (showModal = false)}><IconCross /> </button>
    </div>
    <div>{@render body?.()}</div>
  </div>
{/if}
<Button onclick={() => (showModal = true)} type="button">{textButton}</Button>

```

# src/lib/components/Overlay.svelte

```svelte
<script lang="ts">
    type Props = {
        show: boolean
        onclick?: () => void // This can be used to connect close on click overlay
    }

    const { show, onclick }: Props = $props()
    
</script>

{#if show}
    <button
        class="tw-fixed tw-inset-0 tw-bg-black tw-z-[110] tw-s-overlay hover:tw-bg-black"
        aria-label="overlay"
        onclick={() => onclick?.()}
    ></button>
{/if}

```

# src/lib/components/Price.svelte

```svelte
<script lang="ts">
    type Props = {
        price: number
        basicUnit?: string
    }

    const { price, basicUnit }: Props = $props()

    // TO DO take a locale also dynamically
    const tempFormat = 'fi'

    const formatMap = {
        fi: {
            code: 'fi-FI',
            currency: 'EUR',
        },
        se: {
            code: 'SV-SE',
            currency: 'SEK',
        },
    }

    const formattedPrice = $derived.by(() => {
        const format = formatMap[tempFormat]

        return new Intl.NumberFormat(format.code, {
            style: 'currency',
            currency: format.currency,
        }).format(price)
    })
</script>

<div>PRICE</div>
<div>{formattedPrice}</div>

```

# src/lib/components/PSSTable.svelte

```svelte
<!-- TO DO implement PSS table logic need to know if -->
```

# src/lib/components/QtyIncrement.svelte

```svelte
<script lang="ts">
    import { onMount } from 'svelte'

    import {
        combine,
        isInteger,
        min,
        required,
        qtyIncrements,
    } from '../validators/validators'

    import InfoIcon from '../../lib/Icons/icon-info.svg'

    // TO DO Is there a better way to start this?
    let qty = $state(1)

    type Props = {
        qtyIncrement?: number
        id: string
    }

    let { qtyIncrement = 1, id }: Props = $props()

    // TO DO can this also be in validation logic
    let error: string | null = $state('')

    // TO DO hardcoded min qty
    const validators = combine(
        required(),
        min(1),
        isInteger(),
        qtyIncrements(qtyIncrement)
    )

    function validate() {
        error = validators(qty)
    }

    const decrement = () => {
        if (qty <= qtyIncrement) return
        qty -= qtyIncrement
    }

    const increment = () => {
        qty += qtyIncrement
    }

    onMount(() => {
        qty = qtyIncrement
    })
</script>

{#snippet qtyButton(
    customClass: string,
    sign: string,
    action: () => void,
    disabled = false
)}
    <button
        type="button"
        class={`svelte-qty-button-fix tw-h-[44px] text-[1.25rem] flex tw-justify-center tw-items-center tw-w-[44px] tw-border-alto tw-bg-alto tw-bg-opacity-30 tw-text-green-pea ${customClass} disabled:text-charcoal disabled:tw-cursor-not-allowed disabled:hover:tw-bg-opacity-30 disabled:hover:tw-bg-alto  ${disabled ? 'text-charcoal tw-cursor-not-allowed hover:tw-bg-opacity-30 hover:tw-bg-alto' : 'hover:tw-bg-green-pea hover:tw-text-white'}`}
        onclick={action}
        {disabled}>{sign}</button
    >
{/snippet}
<!-- Note on usage of fix for stacking context with z-10 and z-20, this is to manipulate order that elements are on top of each other to fix the box shadow of focus ring -->
<div class="svelte-component">
    <div class="tw-relative tw-flex tw-rounded">
        {@render qtyButton(
            'tw-border-t tw-border-b tw-border-l tw-rounded-bl tw-rounded-tl tw-focus:z-20',
            '-',
            decrement,
            qty <= qtyIncrement
        )}

        <input
            class="tw-h-[44px] tw-w-[64px] tw-border tw-border-alto tw-text-center tw-text-[0.75rem] tw-focus:z-10"
            id={`qty-${id}`}
            name="qty"
            type="number"
            bind:value={qty}
            oninput={validate}
            onblur={validate}
        />

        {@render qtyButton(
            'tw-border-t tw-border-b tw-border-r tw-rounded-br tw-rounded-tr',
            '+',
            increment
        )}
        {#if error}
            <div
                class="tw-absolute tw-rounded tw-border-cerulean tw-border-2 tw-py-2 tw-px-4 tw-top-[-64px] tw-bg-white tw-flex tw-items-center tw-gap-2"
            >
                <img src={InfoIcon} alt="" /><span class="tw-whitespace-nowrap"
                    >{error}</span
                >
            </div>
        {/if}
    </div>
</div>

```

# src/lib/components/SelectDate.svelte

```svelte
<script lang="ts">
  type Props = {
    deliveryFrom: string;
    deliveryTo: string;
  };

  let { deliveryFrom = $bindable(), deliveryTo }: Props = $props();
</script>

<div class="tw-mb-3">
  <label class="tw-block" for="">Önskat leveransintervall:</label>
  <div class="tw-flex tw-gap-3">
    <input type="text" bind:value={deliveryFrom} />
    <span>{` - ${deliveryTo}`}</span>
  </div>
</div>

```

# src/lib/components/SelectWrapper.svelte

```svelte
<script lang="ts" generics="T">
    // Note: once new select element is in major browser we can stop using svelte-select
    import Select from 'svelte-select'

    type Props = {
        items: T[]
        text: string
        itemId: string
        label: string
        value: {} | null
        disabled?: boolean
        placeholder?: string
    }

    const id = $props.id()

    let {
        label,
        itemId,
        items,
        value = $bindable(),
        disabled = false,
        text,
        placeholder,
    }: Props = $props()

    const isStringArray = typeof items[0] === 'string'
    const resolvedLabel = label ?? (isStringArray ? undefined : 'label')
    const resolvedItemId = itemId ?? (isStringArray ? undefined : 'id')
</script>

<div class="tw-mb-3 magento-svelte-select">
    <label class="tw-block" for={id}>{text}</label>
    <Select
        {id}
        bind:value
        {items}
        {placeholder}
        label={resolvedLabel}
        itemId={resolvedItemId}
        {disabled}
        --border-radius="0px"
        --list-border-radius="0px"
        --item-is-active-bg="#F4EEE6"
        --item-is-active-color="#201E1A"
        --item-hover-bg="#F4EEE6"
        --item-hover-color="#201E1A"
        --border-focused="2px solid #0192D0"
        --padding="0px"
        clearable={false}
    />
</div>

```

# src/lib/components/Sheet.svelte

```svelte
<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import type { Snippet } from "svelte";
  import Overlay from "./Overlay.svelte";
  import IconCross from "../IconsDynamic/IconCross.svelte";

  type Props = {
    header: Snippet;
    body: Snippet;
    showSheet: boolean;
  };

  let { header, body, showSheet = $bindable(false) }: Props = $props();

  
  // Toggle scrolling when opening modal
  $effect(() => {
    if (showSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });
</script>

<Overlay show={showSheet} onclick={() => showSheet = false} />
{#if showSheet}
  <div
    class="tw-w-[600px] tw-h-full tw-fixed tw-top-0 tw-border tw-bg-white tw-right-0 tw-z-[110] tw-flex tw-flex-col"
    transition:slide={{ axis: "x", duration: 400, easing: cubicIn }}
  >
    <div class="tw-flex tw-justify-between tw-p-6">
      <h5>{@render header?.()}</h5>
      <button class="magento-svelte-button-transparent" onclick={() => (showSheet = false)}><IconCross /></button>
    </div>
    {@render body?.()}
  </div>
{/if}

```

# src/lib/components/Test.svelte

```svelte
<script lang="ts">
	let { object } = $props();
</script>

<button onclick={() => {
	// has no effect
	object.count += 1
}}>
	clicks: {object.count}
</button>
```

# src/lib/components/test/Dynamic.svelte

```svelte
<script lang="ts">
  type Props = {
    label: string
  };

  let { label }: Props = $props();
</script>

<div>HELLO Im dynamic</div>
<div>{label}</div>

```

# src/lib/components/test/Wrapper.svelte

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		// only components that have at most the "prop"
		// property required can be passed
		DynamicComponent: Component<{ label: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent label="foo" />
```

# src/lib/constants.ts

```ts
export const REST_PRICE = "rest/V1/lma-api/product-prices/";
export const REST_PRICE_GUEST = "rest/V1/lma-api/product-prices-guest/";
export const REST_STOCK_GUEST = "rest/V1/lma-api/product-stock-guest/";

```

# src/lib/Icons/icon-info.svg

This is a file of the type: SVG Image

# src/lib/Icons/in-stock.svg

This is a file of the type: SVG Image

# src/lib/IconsDynamic/cross.svg

This is a file of the type: SVG Image

# src/lib/IconsDynamic/IconCart.svelte

```svelte
<div
	class=" tw-bg-white tw-group tw-grid tw-h-[44px] tw-w-[44px] tw-place-items-center tw-rounded-full tw-border tw-border-charcoal tw-text-charcoal  hover:tw-text-white hover:tw-bg-tannenbaum hover:tw-border-tannenbaum"
>
	<svg
		class="magento-svelte-svg tw-h-[24px] tw-w-[24px] group-hover:tw-bg-tannenbaum"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
	>
		<path
		fill="currentColor"
			d="M20.292 15.34H7.924c-.165 0-.33-.11-.357-.275L5.565 5.713H2.357A.363.363 0 0 1 2 5.357C2 5.165 2.165 5 2.357 5h3.51c.164 0 .329.11.356.274l2.002 9.352h11.793l1.207-6.17H7.815a.363.363 0 0 1-.357-.357c0-.192.164-.357.356-.357h13.822c.11 0 .22.055.274.138.055.082.11.192.083.301l-1.344 6.884c-.027.165-.192.274-.357.274ZM9.597 19.288c-.933 0-1.7-.768-1.7-1.7 0-.932.767-1.7 1.7-1.7.932 0 1.7.768 1.7 1.7 0 .932-.768 1.7-1.7 1.7Zm0-2.687a.983.983 0 0 0-.988.987c0 .549.44.987.988.987a.983.983 0 0 0 .987-.987.983.983 0 0 0-.987-.987ZM18.427 19.288c-.932 0-1.7-.768-1.7-1.7 0-.932.768-1.7 1.7-1.7.933 0 1.7.768 1.7 1.7 0 .932-.767 1.7-1.7 1.7Zm0-2.687a.983.983 0 0 0-.987.987c0 .549.439.987.987.987a.983.983 0 0 0 .988-.987.983.983 0 0 0-.988-.987Z"
		/>
		<path
		fill="currentColor"
			d="M19.826 10.841H8.308a.363.363 0 0 1-.357-.356c0-.192.165-.356.357-.356h11.518c.192 0 .357.164.357.356a.363.363 0 0 1-.357.357ZM19.387 13.008H8.774a.363.363 0 0 1-.357-.356c0-.192.165-.357.357-.357h10.613c.192 0 .357.165.357.357a.363.363 0 0 1-.357.356Z"
		/>
	</svg>
</div>

```

# src/lib/IconsDynamic/IconChevron.svelte

```svelte
<script lang="ts">
		type Props = {
		isActive: boolean
		parentHover: boolean
	}

    let { isActive, parentHover }: Props = $props()
</script>

<div
	class="{`tw-text-charcoal hover:tw-text-white tw-group tw-grid tw-h-[30px] tw-w-[30px] tw-place-items-center tw-rounded-full tw-border tw-border-transparent hover:-tw-border-tannenbaum hover:tw-bg-tannenbaum tw-transform tw-transition tw-duration-300 ${isActive ? 'tw-rotate-180' : ''} ${parentHover ? 'tw-border-tannenbaum tw-bg-tannenbaum' : ''}`}"
>
	<svg
		width="16"
		height="10"
		xmlns="http://www.w3.org/2000/svg"
		class="{`${parentHover ? 'tw-text-white' : ''}`}"
		><path
			d="M15.747.77A.867.867 0 0 0 14.52.766L7.994 7.268 1.48.754A.867.867 0 1 0 .254 1.98L7.38 9.105a.864.864 0 0 0 1.225.002l7.14-7.112a.866.866 0 0 0 .002-1.226z"
			fill="currentColor"
			fill-rule="evenodd"
		/></svg
	>
</div>
```

# src/lib/IconsDynamic/IconCross.svelte

```svelte
<script lang="ts">
  type Props = {
    parentHover?: boolean;
  };

  let { parentHover = false }: Props = $props();
</script>

<div
  class={`tw-text-charcoal hover:tw-text-white tw-group tw-grid tw-h-[30px] tw-w-[30px] tw-place-items-center tw-rounded-full tw-border tw-border-transparent hover:-tw-border-tannenbaum hover:tw-bg-tannenbaum tw-transform tw-transition tw-duration-300 ${parentHover ? "tw-border-tannenbaum tw-bg-tannenbaum" : ""}`}
>
  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" class="{`${parentHover ? 'tw-text-white' : ''}`}"
    
    ><path d="M11.95.636l1.414 1.414L2.05 13.364.636 11.95z" fill="currentColor" /><path fill="currentColor"
      d="M2.05.636L13.364 11.95l-1.414 1.414L.636 2.05z"
    /></svg
  >
</div>

```

# src/lib/locales/fi.json

```json
{   
    "availability": "Saatavuus",
    "inStock": "Varastossa",
    "outOfStock":"Loppu varastosta",
    "welcome": "Tervetuloa",
    "sku": "Tuotenumero",
    "qtyIncInfo" : "Myyntierä: {qty}",
    "qtyIncrement": "Vähimmäisostomäärä on {qty}"
}
```

# src/lib/locales/sv.json

```json
{
    "incVAT": "Inkl. moms",
    "inStock": "Disponibelt",
    "outOfStock": "Ej i lager",
    "exVAT": "Ex. moms",
    "welcome": "Välkommen",
    "sku": "Art.no"
}
```

# src/lib/localization.js

```js
import { init, addMessages } from "svelte-i18n";

import sv from "./locales/sv.json";
import fi from "./locales/fi.json";

addMessages("fi", fi);
addMessages("sv", sv);

export function setupI18n() {
  init({
    fallbackLocale: "fi",
    initialLocale: "fi",
  });
}

// import { addMessages, init } from 'svelte-i18n';

// const locale = import.meta.env.VITE_LOCALE || 'fi';

// export async function setupI18n() {
//   let messages;

//   if (locale === 'sv') {
//     messages = await import('./locales/sv.json');
//   } else if (locale === 'fi') {
//     messages = await import('./locales/fi.json');
//   } else {
//     throw new Error('Unsupported locale: ' + locale);
//   }

//   addMessages(locale, messages.default);
//   init({
//     fallbackLocale: locale,
//     initialLocale: locale,
//   });
// }
```

# src/lib/stores/BaseFetch.svelte.ts

```ts
import { MagentoSvelteBridgeSingleton } from './MagentoSvelteBridgeSingleton.svelte'

type Resolver<T> = {
    resolve: (price: T) => void
    reject: (err: Error) => void
}

type FetchResponse<T> = {
    items: T[]
}

// TO DO why does need to extend Record<string, any>?
export default abstract class BaseFetch<T extends Record<string, any>> {
    public bridge = MagentoSvelteBridgeSingleton.get()

    private queue = new Map<string, { quantity: number; resolvers: Resolver<T>[] }>()
    private timer: ReturnType<typeof setTimeout> | null = null

    public statusMap = $state<{ value: Map<string, 'pending' | 'fulfilled' | 'rejected'> }>({ value: new Map() })

    protected abstract getUrl(): string
    protected abstract getFetchKey(): string
    protected abstract getItemKey(): string

    private async flushQueue(): Promise<void> { 
        const currentQueue = new Map(this.queue)

        const customerNumber = this.bridge.customerNumber()

        if (this.bridge.isLoggedIn && !customerNumber) {
            setTimeout(() => this.flushQueue(), 10)
            return
        }

        this.queue.clear()
        this.timer = null

        const items = Array.from(currentQueue.entries()).map(
            ([itemNumber, { quantity }]) => ({ itemNumber, quantity })
        )

        try {
            const response = await fetch(this.getUrl(), {
                method: 'POST',
                body: JSON.stringify({
                    [this.getFetchKey()]: {
                        items,
                        customerNumber,
                        storeId: this.bridge.storeId,
                    },
                }),
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })

            const result: FetchResponse<T> = await response.json()

            const itemsMap = new Map(result.items.map((p) => [String(p[this.getItemKey()]), p]))

            for (const [productId, { resolvers }] of currentQueue.entries()) {
                const data = itemsMap.get(productId)

                if (data) {
                    resolvers.forEach(({ resolve }) => resolve(data))
                } else {
                    const error = new Error(`No data returned for productId: ${productId}`)
                    resolvers.forEach(({ reject }) => reject(error))
                }
            }
        } catch (error) {
            for (const { resolvers } of currentQueue.values()) {
                resolvers.forEach(({ reject }) => reject(error as Error))
            }
        }
    }

    public getPromise(productId: string, quantity: number): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.queue.has(productId)) {
                this.queue.set(productId, { quantity, resolvers: [] })
                this.statusMap.value.set(productId, 'pending')
            }

            const entry = this.queue.get(productId)!
            entry.resolvers.push({
                resolve: (data) => {
                    this.statusMap.value.set(productId, 'fulfilled')
                    resolve(data)
                },
                reject: (err) => {
                    this.statusMap.value.set(productId, 'rejected')
                    reject(err)
                },
            })

            if (!this.timer) {
                this.timer = setTimeout(() => this.flushQueue(), 10)
            }
        })
    }
}
```

# src/lib/stores/MagentoSvelteBridgeSingleton.svelte.ts

```ts
import { type CartType } from '../../schemas/Cart'
import { type CustomerInfoType } from '../../schemas/Customer'

export class MagentoSvelteBridgeSingleton {
    private static instance: MagentoSvelteBridgeSingleton

    private svelteBridgeData =
        document.getElementById('svelte-information')?.dataset

    public readonly storeId: number = Number(this.svelteBridgeData?.storeId)

    public readonly isLoggedIn: boolean = this.convertToBoolean(
        this.svelteBridgeData?.loggedIn
    )

    // TO DO make this less verbose
    public readonly showListPrice: boolean = this.convertToBoolean(this.svelteBridgeData?.showListPrice)
    public readonly showVatPercentage: boolean = this.convertToBoolean(this.svelteBridgeData?.configShowVatPercentage)
    public readonly showInclVatPdp: boolean = this.convertToBoolean(this.svelteBridgeData?.configShowInclVatPdp)
    public readonly showExclVatPdp: boolean = this.convertToBoolean(this.svelteBridgeData?.configShowExclVatPdp)
    public readonly showInclVatPlp: boolean = this.convertToBoolean(this.svelteBridgeData?.configShowInclVatPlp)
    public readonly showExclVatPlp: boolean = this.convertToBoolean(this.svelteBridgeData?.configShowExclVatPlp)

    public cart = $state<{ value: CartType | null }>({ value: null })

    public customer = $state<{ value: CustomerInfoType | null }>({
        value: null,
    })

    public readonly showDeliveryPlanner: boolean = this.convertToBoolean(
        this.svelteBridgeData?.showDeliveryPlanner
    )

    constructor() {
        // TO Do use parser here for type safety?
        // cart.value = window.MagentoBridgeState.cart;
        // customer.value = window.MagentoBridgeState.customer;
        // TO DO can I DRY this, not use 3 x
        window.addEventListener(
            'magento:cartUpdated',
            this.onCartUpdated.bind(this)
        )
        window.addEventListener(
            'magento:customerUpdated',
            this.onCustomerUpdated.bind(this)
        )
        window.addEventListener(
            'magento:initialState',
            this.handleIntialState.bind(this)
        )
    }

    public static get(): MagentoSvelteBridgeSingleton {
        if (!this.instance) {
            this.instance = new MagentoSvelteBridgeSingleton()
        }
        return this.instance
    }

    private convertToBoolean(value: string | undefined) {
        return value === '1'
    }

    private onCartUpdated(e: Event) {
        const customEvent = e as CustomEvent
        this.cart.value = customEvent.detail.cart
    }

    private onCustomerUpdated(e: Event) {
        const customEvent = e as CustomEvent
        this.customer.value = customEvent.detail.customer
    }

    private handleIntialState(e: Event) {
        const customEvent = e as CustomEvent
        this.cart.value = customEvent.detail.cart
        this.customer.value = customEvent.detail.customer
    }

    public customerNumber() {
        return this.customer.value?.current_company_number ?? null
    }

    public formatDate(date: string) {
        const locale = 'fi' // TO DO move this into scraping from dom

        if (locale === 'fi') {
            const [year, month, day] = date.split('-')
            return `${day}.${month}.${year}`
        }

        // Default: return as-is (YYYY-MM-DD) for Swedish
        return date
    }
}


export default MagentoSvelteBridgeSingleton.get()

```

# src/lib/stores/PriceFetch.svelte.ts

```ts
import BaseFetch from './BaseFetch.svelte'
import { REST_PRICE, REST_PRICE_GUEST } from '../constants'
import { type PriceType } from '../../schemas/Price'
import singletonFactory from './SingletonFactory'

class PriceFetch extends BaseFetch<PriceType> {
    protected getUrl(): string {
        return `${window.BASE_URL}${
            this.bridge.isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
        }`
    }

    protected getFetchKey(): string {
        return 'priceFinderData'
    }

    protected getItemKey(): string {
        return 'product_id'
    }
}

export default singletonFactory(() => new PriceFetch())()

```

# src/lib/stores/PssFetch.svelte.ts

```ts
// TO DO implement PSS fetch logic
// TO DO refactor out Fetch logic from Price and Stock and reuse,
// TO DO implement singleton here aswell but no queue

import singletonFactory from './SingletonFactory'

class PssFetch {
    public async pssProto(id: string) {
        console.log('ProductsId', id)

        return fetch(`https://dummyjson.com/products`).then((r) => r.json())
    }
}

export default singletonFactory(() => new PssFetch())()

```

# src/lib/stores/SingletonFactory.ts

```ts
export default function singletonFactory<T>(creator: () => T): () => T {
    let instance: T
    return () => {
        if (!instance) {
            instance = creator()
        }
        return instance
    }
}

```

# src/lib/stores/StockFetch.svelte.ts

```ts
import { REST_STOCK_GUEST } from '../constants'
import BaseFetch from './BaseFetch.svelte'
import { type StockType } from '../../schemas/Stock'

import singletonFactory from './SingletonFactory'

class StockFetch extends BaseFetch<StockType> {

    protected getUrl(): string {
        return `${window.BASE_URL}${REST_STOCK_GUEST}`
    }

    protected getFetchKey(): string {
        return 'stockFinderData'
    }

    protected getItemKey(): string {
        return 'item_number'
    }
}

export default singletonFactory(() => new StockFetch())()
```

# src/lib/stores/usePriceStockSingleton.svelte.ts

```ts
// TO DO move this to correct file
declare global {
    interface Window {
        BASE_URL: string
    }
}

import { REST_PRICE_GUEST } from '../constants'

const _usePriceStock = () => {
    async function testPriceCall() {
        const priceFinderData = {
            items: [{ itemNumber: 441863, quantity: 1 }],
            storeId: 1,
            customerNumber: null,
        }

        try {
            const response = await fetch(
                `${window.BASE_URL}${REST_PRICE_GUEST}`,
                {
                    method: 'POST',

                    body: JSON.stringify({ priceFinderData }),
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            )

            const result = await response.json()

            const resultAsObj = result.items.reduce((acc, item) => {
                acc[item.product_id] = item
                return acc
            }, {})

            productPrice.value = { ...productPrice.value, ...resultAsObj }
        } catch (error) {
            console.log('fetchPrice Failed')
        }
    }

    async function testPSSCall() {
        const priceFinderData = {
            items: [{ itemNumber: 284903, quantity: 1, isBuyable: 1 }],
            storeId: 11,
            customerNumber: '10000003',
        }

        try {
            const response = await fetch(
                `${window.BASE_URL}${'rest/V1/lma-api/pre-season-campaign/'}`,
                {
                    method: 'POST',

                    body: JSON.stringify({ priceFinderData }),
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            )

            const result = await response.json()

            const resultAsObj = result.items.reduce((acc, item) => {
                acc[item.product_id] = item
                return acc
            }, {})

            productPrice.value = { ...productPrice.value, ...resultAsObj }
        } catch (error) {
            console.log('fetchPrice Failed')
        }
    }

    return {
        testPriceCall,
        testPSSCall,
    }
}

export const usePriceStockSingleton = _usePriceStock()

```

# src/lib/utility.ts

```ts

```

# src/lib/validators/validators.ts

```ts
export type Validator = (value: any) => string | null;

// Validator rules

export const required = (message = 'This field is required'): Validator => (value) =>
	value == null || value === '' ? message : null;

export const qtyIncrements = (step: number, message?: string): Validator => (value) =>
	value % step !== 0 ? message ?? `Must be a multiple of ${step}` : null;

export const isInteger = (message = 'Must be an integer'): Validator => (value) =>
	Number.isInteger(Number(value)) ? null : message;

export const min = (minVal: number, message?: string): Validator => (value) =>
	value < minVal ? message ?? `Must be at least ${minVal}` : null;

export const combine = (...validators: Validator[]): Validator => (value) => {
	for (const v of validators) {
		const result = v(value);
		if (result) return result;
	}
	return null;
};
```

# src/main.ts

```ts
import { mount } from 'svelte'
import './app.css'

import { setupI18n } from './lib/localization'

import SvelteTester from './entries/SvelteTester.svelte'
import ProductBuyBox from './entries/ProductBuyBox.svelte'
import ProductPriceBox from './entries/ProductPriceBox.svelte'
import ProductStockBox from './entries/ProductStockBox.svelte'
import CheckoutAcess from './entries/CheckoutAcess.svelte'

setupI18n()

const packageTypeList = document
    .getElementById('svelte-information')
    ?.getAttribute('data-tonnage-package-type')
    ?.split(',')

// Logic Checkout acess component, includes logic for delivery planner or old flow

const checkoutAcessMountPoint = document.getElementById('svelte-checkout-acess')

const checkoutAcess = mount(CheckoutAcess, {
    target: checkoutAcessMountPoint!,
})

// Logic Product Buy Box component(s)

document.querySelectorAll('[id^="svelte-product-buy-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-buy-box-', '')

    const sku = el.getAttribute('data-sku') as string // TO DO is there a better solution?

    const packagingType = el.getAttribute('data-packaging-type')
        ? el.getAttribute('data-packaging-type')
        : el.getAttribute('data-packaging-type-se')

    const usedPackagingTypeAttr = el.hasAttribute('data-packaging-type')
        ? 'data-packaging-type'
        : 'data-packaging-type-se'

    const isBulk = packageTypeList?.includes(packagingType ?? '') ?? false

    const isBulkInFinland =
        isBulk && usedPackagingTypeAttr === 'data-packaging-type'

    const prefSalesQuantityAttr = el.getAttribute('data-pref-sales-quantity')
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1

    const qtyIncrement = Number(el.getAttribute('data-qty-increment') ?? 1) || 1

    const isNew = el.getAttribute('data-product-is-new') === '1'

    const isPdpCard = el.getAttribute('data-is-pdp-card') === '1'

    mount(ProductBuyBox, {
        target: el,
        props: { id, prefSalesQuantity, sku, isBulk, qtyIncrement, isPdpCard },
    })
})

// Logic Product Price box component

document.querySelectorAll('[id^="svelte-product-price-box-"]').forEach((el) => {
    const elementId = el.id
    const id = elementId.replace('svelte-product-price-box-', '')
    const prefSalesQuantityAttr = el.getAttribute(
        'data-product-pref-sales-quantity'
    )
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1
    const newProduct = el.getAttribute('data-product-is-new') === '1'
    const isBuyable = el.getAttribute('data-product-is-buyable') === '1'
    const spun = el.getAttribute('data-product-spun')
    const unitMeasure = el.getAttribute('data-product-unit-measure')
    const packagingType = el.getAttribute('data-product-packaging-type')
    const basicUnit = el.getAttribute('data-product-basic-unit')
    const qtyIncrement =
        Number(el.getAttribute('product-data-qty-increment') ?? 1) || 1
    const palletDiscountInformation = el.getAttribute(
        'data-product-pallet-discount-information'
    )
    const showPalletAttribute =
        el.getAttribute('data-product-show-pallet-attribute') === '1'
    const priceBoxUnit = el.getAttribute('data-config-price-box-unit')
    const prefSalesQtyUnit = el.getAttribute('data-config-pref-sales-qty-unit')

    mount(ProductPriceBox, {
        target: el,
        props: {
            id,
            prefSalesQuantity,
            newProduct,
            spun,
            unitMeasure,
            packagingType,
            basicUnit,
            isBuyable,
            qtyIncrement,
            palletDiscountInformation,
            showPalletAttribute,
            priceBoxUnit,
            prefSalesQtyUnit,
        },
    })
})

// Logic Product Stock box component

document.querySelectorAll('[id^="svelte-product-stock-box-"]').forEach((el) => {
    const prefSalesQuantityAttr = el.getAttribute(
        'data-product-pref-sales-quantity'
    )
    const prefSalesQuantity = prefSalesQuantityAttr
        ? Number(prefSalesQuantityAttr)
        : 1

    const packagingType = el.getAttribute('data-packaging-type')
        ? el.getAttribute('data-packaging-type')
        : el.getAttribute('data-packaging-type-se')

    const isBulk = packageTypeList?.includes(packagingType ?? '') ?? false

    const sku = el.getAttribute('data-sku') as string // TO DO is there a better solution?

    mount(ProductStockBox, {
        target: el,
        props: {
            prefSalesQuantity,
            isBulk,
            sku,
        },
    })
})

// Logic Svelte Tester component

const svelteTester = mount(SvelteTester, {
    target: document.getElementById('svelte-tester')!,
})

```

# src/schemas/Cart.ts

```ts
import { z } from "zod";

const ProductImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
});

const ProductPriceValueSchema = z.object({
  incl_tax: z.string(), // e.g., "26.5000"
  excl_tax: z.string(), // e.g., "23.2500"
});

const CartItemSchema = z.object({
  canApplyMsrp: z.boolean(),
  configure_url: z.string().url(),
  is_visible_in_site_visibility: z.boolean(),
  item_id: z.string(),
  message: z.string(),
  options: z.array(z.any()), // You can make this more specific if needed
  product_brand: z.string(),
  product_category: z.string(),
  product_has_url: z.boolean(),
  product_id: z.string(),
  product_image: ProductImageSchema,
  product_name: z.string(),
  product_price: z.string(), // raw HTML string
  product_price_value: ProductPriceValueSchema,
  product_sku: z.string(),
  product_type: z.string(),
  product_url: z.string().url(),
  qty: z.number(),
});

export const CartSchema = z.object({
  cart_empty_message: z.string(),
  data_id: z.number(),
  extra_actions: z.string(),
  grand_total_excl_tax: z.string(), // HTML string
  grand_total_incl_tax: z.string(), // HTML string
  isGuestCheckoutAllowed: z.boolean(),
  items: z.array(CartItemSchema),
  possible_onepage_checkout: z.boolean(),
  storeId: z.string(),
  subtotal: z.string(), // HTML string
  subtotalAmount: z.number(),
  subtotal_excl_tax: z.string(),
  subtotal_incl_tax: z.string(),
  summary_count: z.number(),
  website_id: z.string(),
});

export type CartItemType = z.infer<typeof CartItemSchema>;
export type CartType = z.infer<typeof CartSchema>;
```

# src/schemas/Customer.ts

```ts
import { z } from "zod";

export const CustomerInfoSchema = z.object({
  assortment: z.string(), // e.g. "000040,LBL1"
  credit_status: z.string(), // e.g. "0"
  current_company_number: z.string(), // e.g. "10000003"
  customer_group: z.string(), // e.g. "140"
  data_id: z.number(), // e.g. 1750685614
  e2_customer_list_json: z.string(), // still a string, not parsed
  fake_campaigns: z.string(), // can be empty
  firstname: z.string(),
  fullname: z.string(),
  payment_method: z.string(),
  silo_exist: z.boolean(),
  user_email: z.string().email(),
  user_first_name: z.string(),
  user_last_name: z.string(),
  valid_campaigns: z.string(), // e.g. comma-separated string of IDs
  websiteId: z.string(),
});

export type CustomerInfoType = z.infer<typeof CustomerInfoSchema>;
```

# src/schemas/Price.ts

```ts
import { z } from "zod";

// Zod schema
export const ProductSchema = z.object({
  product_id: z.number(),
  tax_class_id: z.number(),
  customer_number: z.string(),
  product_sku: z.string(),
  price_format: z.string(),

  price_info: z.object({
    final_price: z.number(),
    max_price: z.number(),
    max_regular_price: z.number(),
    minimal_regular_price: z.number(),
    special_price: z.number().nullable(),
    minimal_price: z.number(),
    regular_price: z.number(),

    formatted_prices: z.object({
      final_price: z.string(),
      max_price: z.string(),
      minimal_price: z.string(),
      max_regular_price: z.string(),
      minimal_regular_price: z.string().nullable(),
      special_price: z.string().nullable(),
      regular_price: z.string(),
    }),

    extension_attributes: z.object({
      msrp: z.object({
        msrp_price: z.string(),
        is_applicable: z.string(),
        is_shown_price_on_gesture: z.string(),
        msrp_message: z.string(),
        explanation_message: z.string(),
      }),

      tax_adjustments: z.object({
        final_price: z.number(),
        max_price: z.number(),
        max_regular_price: z.number(),
        minimal_regular_price: z.number(),
        special_price: z.number(),
        minimal_price: z.number(),
        regular_price: z.number(),
        formatted_prices: z.object({
          final_price: z.string(),
          max_price: z.string(),
          minimal_price: z.string(),
          max_regular_price: z.string(),
          minimal_regular_price: z.string().nullable(),
          special_price: z.string(),
          regular_price: z.string(),
        }),
      }),

      weee_attributes: z.array(z.any()),

      weee_adjustment: z.string(),

      lma_customer_price: z.number(),
      lma_customer_price_formatted: z.string(),
      lma_customer_price_is_campaign: z.boolean(),
      lma_vat_percentage: z.number(),
      lma_unit_measure: z.string(),
      lma_valid_price_inc_vat: z.number(),
      lma_valid_price_inc_vat_formatted: z.string(),
      lma_line_amount: z.number(),
      lma_line_amount_inc_vat: z.number(),
      lma_quantity: z.number(),
      lma_price_lookup_done: z.boolean(),
      lma_custom_price_set: z.boolean(),
      lma_campaign_price: z.number(),
      lma_campaign_price_inc_vat: z.number(),
      lma_profix_price: z.number(),
      lma_profix_price_inc_vat: z.number(),
      lma_campaign_payment_terms: z.string(),
      lma_campaign_fixed_due_date: z.string(),
      lma_list_price: z.number(),
      lma_list_price_formatted: z.string(),
      lma_list_price_inc_vat: z.number(),
      lma_list_price_inc_vat_formatted: z.string(),
      lma_is_pallet_discount: z.boolean(),
      lma_campaign_is_pre_season: z.boolean().optional(),
    }),
  }),

  price_cached: z.boolean(),
  order_date: z.string(),
  campaign_cat_id: z.number(),
  campaign_type: z.string(),
  promotion_id: z.string(),
  product_group: z.string(),
  immediate_delivery_while_pss: z.boolean(),
  promotion_id_period: z.null(),
  transaction_reason: z.string(),
});

// Inferred TypeScript type
export type PriceType = z.infer<typeof ProductSchema>;
```

# src/schemas/Stock.ts

```ts
import { z } from "zod";

const StockSchema = z.object({
  allow_backorder: z.boolean(),
  current_available_stock: z.string(), 
  data_from_cache: z.boolean(),
  express_delivery: z.boolean(),
  in_stock: z.boolean(),
  in_stock_date: z.string(), 
  item_number: z.string(), 
  order_date: z.string(), 
  package_delivery: z.boolean(),
  pickup_delivery: z.boolean(),
  product_id: z.string().nullable(),
  quantity: z.number(),
  stock_levels_hidden: z.boolean(),
  unit_measure: z.string(), 
});

export type StockType = z.infer<typeof StockSchema>;
```

# src/vite-env.d.ts

```ts
/// <reference types="svelte" />
/// <reference types="vite/client" />


declare global {
    interface Window {
        BASE_URL: string
    }
}
```

# svelte.config.js

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}

```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "green-pea": "#1E6E37",
        sand: "#ECE2D6",
        "sand-light": "#F4EEE6",
        "sand-dark": "#E2D4C2",
        "forest-green": "#23A73F",
        "yellow-green": "#D7E187",
        alto: "#D6D6D6",
        swirl: "#D4CEC4",
        oxley: "#7C9E87",
        charcoal: "#201E1A",
        black: "#000",
        tannenbaum: "#005720",
        mercury: "#E6E6E6",
        cerulean: "#0192D0",
        "yellow-sea": "#FAAF00",
        "alizarin-crimson": "#EF2834",
        desert: "#B95D25",
        monza: "#CE0B17",
        nobel: "#B3B3B3",
        "steel-blue": "#4B7DB9",
      },
    },
  },
  plugins: [],
};

```

# tsconfig.app.json

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    /**
     * Typecheck JS in `.svelte` and `.js` files by default.
     * Disable checkJs if you'd like to use dynamic types in JS.
     * Note that setting allowJs false does not prevent the use
     * of JS in `.svelte` files.
     */
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true,
    "moduleDetection": "force"
  },
  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
}

```

# tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

# tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}

```

# vite.config.ts

```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'


export default defineConfig({
  plugins: [svelte()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "js/svelte-index.min.js",
        chunkFileNames: "js/svelte-chunk.js",
        assetFileNames: "svelte-bundle.css",
      }
    }
  }
})

```

