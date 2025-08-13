import z from 'zod'
import { REST_STOCK_GUEST } from '../constants'
import BaseFetch from './BaseFetch.svelte'
import { StockSchema } from '../../schemas/Stock'

import singletonFactory from './SingletonFactory'


const StockBatchSchema = z.object({
  items: z.array(StockSchema),
})

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