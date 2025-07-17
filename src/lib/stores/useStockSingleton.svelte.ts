// TO DO move this to correct file
declare global {
    interface Window {
        BASE_URL: string
    }
}

import { REST_STOCK_GUEST } from '../constants'
import FetchBatcher from './FetchBatcher.svelte'

// TO DO both type should have same format
import { type StockType } from '../../schemas/Stock'

const _useStock = () => {


    const stockUrl = `${window.BASE_URL}${REST_STOCK_GUEST}`

    const stockFetchBatcher = new FetchBatcher<StockType>(
        stockUrl,
        'stockFinderData',
        'item_number',
    )

    return {
        stockFetchBatcher,
    }
}

export const useStockSingleton = _useStock()


class PriceFetch {   
    private static instance: PriceFetch
    

    private bridgeInfo: MagentoSvelteBridgeSingleton =
        MagentoSvelteBridgeSingleton.get()

    public fetchBatcher: FetchBatcher<PriceType>

    constructor() {
        const isLoggedIn = this.bridgeInfo.isLoggedIn

        const priceUrl = `${window.BASE_URL}${
            isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
        }`

        this.fetchBatcher = new FetchBatcher<PriceType>(
            priceUrl,
            'priceFinderData',
            'product_id'
        )
    }

    public static get(): PriceFetch {
        if (!this.instance) {
            this.instance = new PriceFetch()
        }
        return this.instance
    }

    public async getPromise(productId: string, quantity: number) {
        return this.fetchBatcher.getPromise(productId, quantity)
    }
} 

export default PriceFetch.get()