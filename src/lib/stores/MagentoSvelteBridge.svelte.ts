import { type Cart } from '@lib/../schemas/Cart'
import { type CustomerInfo } from '@lib/../schemas/Customer'
import singletonFactory from '@lib/stores/SingletonFactory'
import { MagentoSvelteBridgeSchema } from '@lib/../schemas/MagentoSvelteBridge'
import { type LocaleCode } from '@lib/../schemas/Locale'

// Note for this class to work there must be a element in Magento with id svelte-information,
// that contains all the data attribute needed by the class

class MagentoSvelteBridge {
  private readonly parsedData = MagentoSvelteBridgeSchema.parse(
    document.getElementById('svelte-information'),
  )

  public readonly storeId: number = this.parsedData.storeId
  public readonly locale: LocaleCode = this.parsedData.locale
  public readonly isLoggedIn: boolean = this.parsedData.loggedIn
  public readonly showListPrice: boolean =
    this.parsedData.configShowVatPercentage
  public readonly showVatPercentage: boolean =
    this.parsedData.configShowVatPercentage
  public readonly showInclVatPdp: boolean = this.parsedData.configShowInclVatPdp
  public readonly showExclVatPdp: boolean = this.parsedData.configShowExclVatPdp
  public readonly showInclVatPlp: boolean = this.parsedData.configShowInclVatPlp
  public readonly showExclVatPlp: boolean = this.parsedData.configShowExclVatPlp
  public readonly vatEnabled: boolean = this.parsedData.vatEnabled
  public readonly showDeliveryBox: boolean = this.parsedData.showDeliveryBox
  public readonly paymentCampaignEnabled: boolean =
    this.parsedData.configPaymentCampaignEnabled
  public readonly paymentCampaign: string =
    this.parsedData.configPaymentCampaign
  public readonly showDeliveryPlanner: boolean =
    this.parsedData.showDeliveryPlanner
  public readonly tonnagePackageType: string[] =
    this.parsedData.tonnagePackageType

  public cart = $state<{ value: Cart | null }>({ value: null })

  public customer = $state<{ value: CustomerInfo | null }>({
    value: null,
  })

  constructor() {
    // TO Do use parser here for type safety?
    // cart.value = window.MagentoBridgeState.cart;
    // customer.value = window.MagentoBridgeState.customer;
    // TO DO can I DRY this, not use 3 x

    window.addEventListener('fotorama:load', function () {
      console.log('loaded')
    })

    window.addEventListener(
      'magento:cartUpdated',
      this.onCartUpdated.bind(this),
    )
    window.addEventListener(
      'magento:customerUpdated',
      this.onCustomerUpdated.bind(this),
    )
    window.addEventListener(
      'magento:initialState',
      this.handleIntialState.bind(this),
    )
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
