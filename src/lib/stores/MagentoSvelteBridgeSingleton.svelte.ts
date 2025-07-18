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
