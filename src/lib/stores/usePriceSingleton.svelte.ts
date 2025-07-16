// TO DO move this to correct file
declare global {
    interface Window {
        BASE_URL: string
    }
}

import { REST_PRICE, REST_PRICE_GUEST, REST_STOCK_GUEST } from '../constants'
import { useBridgeSingleton } from './useBridgeSingleton.svelte'

// TO DO both type should have same format
import { type StockType } from '../../schemas/Stock'

// TO DO this is wrong

type Price = {
    itemNumber: string
    price: number
}

type Resolver = {
    resolve: (price: Price) => void
    reject: (err: Error) => void
}

class FetchBatcher<T> {
    private queue = new Map<
        string,
        {
            quantity: number
            resolvers: Resolver[]
        }
    >()

    private timer: ReturnType<typeof setTimeout> | null = null

    public statusMap = $state<{
        value: Map<string, 'pending' | 'fulfilled' | 'rejected'>
    }>({ value: new Map() })

    constructor(
        private url: string,
        private fetchKey: string,
        private itemKey: string,
        private isLoggedIn: boolean,
        private getCustomerNumber: () => string | null
    ) {}

    private async flushQueue(): Promise<void> {
        const currentQueue = new Map(this.queue)

        const customerNumber = this.getCustomerNumber()

        if (this.isLoggedIn && !customerNumber) {
            setTimeout(this.flushQueue.bind(this), 10)
            return
        }

        this.queue.clear()
        this.timer = null

        const items = Array.from(currentQueue.entries()).map(
            ([itemNumber, { quantity }]) => ({
                itemNumber,
                quantity,
            })
        )

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                body: JSON.stringify({
                    [this.fetchKey]: {
                        items,
                        customerNumber,
                        storeId: 1,
                    },
                }),
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })

            const result = await response.json()

            // TO DO type this
            // TO DO is it best to convert to string or can I have it as number always if fix else where

            const priceMap = new Map(
                result.items.map((p) => [String(p[this.itemKey]), p])
            )

            for (const [productId, { resolvers }] of currentQueue.entries()) {
                const price = priceMap.get(productId)

                if (price) {
                    resolvers.forEach(({ resolve }) => resolve(price))
                } else {
                    const error = new Error(
                        `No price returned for productId: ${productId}`
                    )
                    resolvers.forEach(({ reject }) => reject(error))
                }
            }
        } catch (e) {
            for (const { resolvers } of currentQueue.values()) {
                resolvers.forEach(({ reject }) => reject(error))
            }
        }
    }

    getPromise(productId: string, quantity: number): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.queue.has(productId)) {
                this.queue.set(productId, { quantity, resolvers: [] })
                this.statusMap.value.set(productId, 'pending')
            }

            // TO DO get rid of !
            const entry = this.queue.get(productId)!

            entry.resolvers.push({
                resolve: (price) => {
                    this.statusMap.value.set(productId, 'fulfilled')
                    resolve(price)
                },
                reject: (err) => {
                    this.statusMap.value.set(productId, 'rejected')
                    reject(err)
                },
            })

            if (!this.timer) {
                this.timer = setTimeout(this.flushQueue.bind(this), 10) // batch all calls in 10ms window
            }
        })
    }
}

// TO DO fix this rename and below in singletin
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

    const stockUrl = `${window.BASE_URL}${REST_STOCK_GUEST}`

    const stockFetchBatcher = new FetchBatcher<StockType>(
        stockUrl,
        'stockFinderData',
        'item_number',
        isLoggedIn,
        customerNumber
    )

    return {
        priceFetchBatcher,
        stockFetchBatcher,
    }
}

export const usePriceSingleton = _usePrice()
