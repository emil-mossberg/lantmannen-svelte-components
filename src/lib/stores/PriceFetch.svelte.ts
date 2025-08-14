import z from 'zod'

import BaseFetch from '@lib/stores/BaseFetch.svelte'
import { REST_PRICE, REST_PRICE_GUEST } from '@lib/constants'
import { PriceBatchSchema } from '@lib/schemas/Price'
import singletonFactory from '@lib/stores/SingletonFactory'

class PriceFetch extends BaseFetch<typeof PriceBatchSchema> {
  protected getPath(): string {
    return this.bridge.isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
  }

  protected getFetchKey(): string {
    return 'priceFinderData'
  }

  protected getItemKey(): string {
    return 'product_id'
  }

  protected schema = PriceBatchSchema
}

export default singletonFactory(() => new PriceFetch())()
