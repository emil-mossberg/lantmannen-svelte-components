import { REST_STOCK_GUEST } from '@lib/constants'
import BaseFetch from '@lib/stores/BaseFetch.svelte'
import { StockBatchSchema } from '@lib/schemas/Stock'

import singletonFactory from '@lib/stores/SingletonFactory'

class StockFetch extends BaseFetch<typeof StockBatchSchema> {
  protected getPath(): string {
    return REST_STOCK_GUEST
  }

  protected getFetchKey(): string {
    return 'stockFinderData'
  }

  protected getItemKey(): string {
    return 'item_number'
  }

  protected schema = StockBatchSchema
}

export default singletonFactory(() => new StockFetch())()
