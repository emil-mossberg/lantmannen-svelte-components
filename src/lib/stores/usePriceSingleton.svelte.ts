// TO DO move this to correct file
declare global {
    interface Window {
        BASE_URL: string
    }
}

import { REST_PRICE, REST_PRICE_GUEST } from '../constants'
import { useBridgeSingleton } from './useBridgeSingleton.svelte'
import FetchBatcher from './fetchBatcher.svelte'

// TO DO this is wrong

type Price = {
    itemNumber: string
    price: number
}

const _usePrice = () => {
    const { customer, isLoggedIn, storeId } = useBridgeSingleton

    const priceUrl = `${window.BASE_URL}${
        isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
    }`

    const customerNumber = () => customer.value?.current_company_number ?? null

    const priceFetchBatcher = new FetchBatcher<Price>(
        priceUrl,
        'priceFinderData',
        'product_id',
        isLoggedIn,
        customerNumber
    )

    return {
        priceFetchBatcher,
    }
}

export const usePriceSingleton = _usePrice()
