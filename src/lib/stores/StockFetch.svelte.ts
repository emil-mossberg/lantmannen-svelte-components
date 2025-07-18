import { REST_STOCK_GUEST } from '../constants'
import BaseFetch from './BaseFetch.svelte'
import { type StockType } from '../../schemas/Stock'

import singletonFactory from './SingletonFactory'

class StockFetch extends BaseFetch<StockType> {

    protected getUrl(): string {
        return `${window.BASE_URL}${REST_STOCK_GUEST}`
    }

    protected getFetchKey(): string {
        return 'stockFinderData'
    }

    protected getItemKey(): string {
        return 'item_number'
    }
}

export default singletonFactory(() => new StockFetch())()