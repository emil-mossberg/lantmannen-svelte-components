import { REST_PRICE, REST_PRICE_GUEST } from '../constants'
import FetchBatcher from './FetchBatcher.svelte'

import { type PriceType } from '../../schemas/Price'
import { MagentoSvelteBridgeSingleton } from './MagentoSvelteBridgeSingleton.svelte'

class PriceFetch {   
    private static instance: PriceFetch
    
    private bridgeInfo: MagentoSvelteBridgeSingleton =
        MagentoSvelteBridgeSingleton.get()

    private fetchBatcher: FetchBatcher<PriceType>

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


