import { REST_STOCK_GUEST } from '../constants'
import FetchBatcher from './FetchBatcher.svelte'
import { type StockType } from '../../schemas/Stock'


class StockFetch {   
    private static instance: StockFetch
    
    private fetchBatcher: FetchBatcher<StockType>

    constructor() {

       const stockUrl = `${window.BASE_URL}${REST_STOCK_GUEST}`

        this.fetchBatcher = new FetchBatcher<StockType>(
            stockUrl,
            'stockFinderData',
            'item_number'
        )
    }

    public static get(): StockFetch {
        if (!this.instance) {
            this.instance = new StockFetch()
        }
        return this.instance
    }

    public async getPromise(productId: string, quantity: number) {
        return this.fetchBatcher.getPromise(productId, quantity)
    }
} 

export default StockFetch.get()