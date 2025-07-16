// TO DO move this to correct file
declare global {
    interface Window {
        BASE_URL: string
    }
}

import { REST_PRICE, REST_PRICE_GUEST } from '../constants'

// TO DO both type should have same format
import { type StockType } from "../../schemas/Stock";

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

    private url: string


    constructor(url: string) {
      url = url
    }

    private async flushQueue(): Promise<void> {
        const currentQueue = new Map(this.queue)
        this.queue.clear()
        this.timer = null
        
        

        // TO DO fix this
        const isLoggedIn = false

        const items = Array.from(currentQueue.entries()).map(
            ([itemNumber, { quantity }]) => ({
                itemNumber,
                quantity,
            })
        )

        try {
            const response = await fetch(
                `${window.BASE_URL}${
                    isLoggedIn ? REST_PRICE : REST_PRICE_GUEST
                }`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        priceFinderData: {
                            items,
                            customerNumber: null,
                            storeId: 1,
                        },
                    }),
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            )

            const result = await response.json()

            // TO DO type this
            // TO DO is it best to convert to string or can I have it as number always if fix else where
            const priceMap = new Map(
                result.items.map((p) => [String(p.product_id), p])
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
            console.log('error')
            for (const { resolvers } of currentQueue.values()) {
                resolvers.forEach(({ reject }) => reject(error))
            }
        }
    }

    getPromise(productId: string, quantity: number): Promise<T> {
        return new Promise((resolve, reject) => {
            console.log('apa')
            console.log(this.queue)

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

// TO DO fix this
const _usePrice = () => {
    const priceFetchBatcher = new FetchBatcher<Price>()

    return {
        priceFetchBatcher,
    }
}

export const usePriceSingleton = _usePrice()
