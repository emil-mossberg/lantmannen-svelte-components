import { type Cart } from '../../schemas/Cart'
import { type CustomerInfo } from '../../schemas/Customer'
import singletonFactory from './SingletonFactory'
import { MagentoSvelteBridgeSchema } from '../../schemas/MagentoSvelteBridge'

// Note for this class to work there must be a element in Magento with id svelte-information,
// that contains all the data attribute needed by the class

class MagentoSvelteBridge {
    private svelteBridgeData =
        document.getElementById('svelte-information')?.dataset ?? {}

    private readonly parsedData = MagentoSvelteBridgeSchema.parse(
        this.svelteBridgeData
    )
    public readonly storeId = this.parsedData.storeId
    public readonly locale = this.parsedData.locale
    public readonly tonnagePackageType = this.parsedData.tonnagePackageType
    public readonly isLoggedIn = this.parsedData.loggedIn ?? false
    public readonly showListPrice = this.parsedData.configShowListPrice ?? false
    public readonly vatEnabled = this.parsedData.vatEnabled ?? false
    public readonly showVatPercentage =
        this.parsedData.configShowVatPercentage ?? false
    public readonly showInclVatPdp =
        this.parsedData.configShowInclVatPdp ?? false
    public readonly showExclVatPdp =
        this.parsedData.configShowExclVatPdp ?? false
    public readonly showInclVatPlp =
        this.parsedData.configShowInclVatPlp ?? false
    public readonly showExclVatPlp =
        this.parsedData.configShowExclVatPlp ?? false
    public readonly paymentCampaignEnabled =
        this.parsedData.configPaymentCampaignEnabled ?? false
    public readonly paymentCampaign = this.parsedData.configPaymentCampaign
    public readonly showDeliveryPlanner =
        this.parsedData.showDeliveryPlanner ?? false

    public cart = $state<{ value: Cart | null }>({ value: null })

    public customer = $state<{ value: CustomerInfo | null }>({
        value: null,
    })

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
        console.log(customEvent.detail.cart)
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
