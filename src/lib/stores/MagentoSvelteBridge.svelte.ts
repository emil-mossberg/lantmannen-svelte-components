import { type Cart } from '../../schemas/Cart'
import { type CustomerInfo } from '../../schemas/Customer'
import { type LocaleCode } from '../../schemas/Locale'
import { validateWithSchema } from '../helpers'
import { localeCodeSchema } from '../../schemas/Locale'
import singletonFactory from './SingletonFactory'


// Note for this class to work there must be a element in Magento with id svelte-information, 
// that contains all the data attribute needed by the class

class MagentoSvelteBridge {
    private svelteBridgeData =
        document.getElementById('svelte-information')?.dataset

    public readonly storeId: number = Number(this.svelteBridgeData?.storeId)

    public readonly locale: LocaleCode = validateWithSchema(localeCodeSchema, this.svelteBridgeData?.locale)

    public readonly isLoggedIn: boolean = this.convertToBoolean(
        this.svelteBridgeData?.loggedIn
    )

    // TO DO make this less verbose
    public readonly showListPrice: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowListPrice
    )
    public readonly showVatPercentage: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowVatPercentage
    )
    public readonly showInclVatPdp: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowInclVatPdp
    )
    public readonly showExclVatPdp: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowExclVatPdp
    )
    public readonly showInclVatPlp: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowInclVatPlp
    )
    public readonly showExclVatPlp: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configShowExclVatPlp
    )

    public readonly paymentCampaignEnabled: boolean = this.convertToBoolean(
        this.svelteBridgeData?.configPaymentCampaignEnabled
    )

    public readonly paymentCampaign: string = this.svelteBridgeData?.configPaymentCampaign as string // TO DO better solution

    public cart = $state<{ value: Cart | null }>({ value: null })

    public customer = $state<{ value: CustomerInfo | null }>({
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
        if (this.locale === 'fi_FI') {
            const [year, month, day] = date.split('-')
            return `${day}.${month}.${year}`
        }

        // Default: return as-is (YYYY-MM-DD) for Swedish
        return date
    }
}

export default singletonFactory(() => new MagentoSvelteBridge())()
