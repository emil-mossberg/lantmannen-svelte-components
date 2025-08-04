import BaseFetch from './BaseFetch.svelte'
import { REST_PRICE, REST_PRICE_GUEST } from '../constants'
import { type Price } from '../../schemas/Price'
import singletonFactory from './SingletonFactory'

class PriceFetch extends BaseFetch<Price> {
  protected getPath(): string {
    return this.bridge.isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
  }

  protected getFetchKey(): string {
    return 'priceFinderData'
  }

  protected getItemKey(): string {
    return 'product_id'
  }
}

export default singletonFactory(() => new PriceFetch())()
