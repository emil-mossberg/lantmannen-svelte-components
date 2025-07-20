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
