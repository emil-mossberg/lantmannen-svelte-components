import z from 'zod'

import BaseFetch from './BaseFetch.svelte'
import { REST_PRICE, REST_PRICE_GUEST } from '../constants'
import { PriceSchema } from '../../schemas/Price'
import singletonFactory from './SingletonFactory'


const PriceBatchSchema = z.object({
  items: z.array(PriceSchema),
})

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
