import { MagentoSvelteBridgeSingleton } from './MagentoSvelteBridgeSingleton.svelte'

type Resolver<T> = {
    resolve: (price: T) => void
    reject: (err: Error) => void
}

type FetchResponse<T> = {
    items: T[]
}

export default class FetchBatcher<T extends Record<string, any>> {
    private queue = new Map<
        string,
        {
            quantity: number
            resolvers: Resolver<T>[]
        }
    >()

    private timer: ReturnType<typeof setTimeout> | null = null

    public statusMap = $state<{
        value: Map<string, 'pending' | 'fulfilled' | 'rejected'>
    }>({ value: new Map() })

    private bridgeInfo: MagentoSvelteBridgeSingleton =
        MagentoSvelteBridgeSingleton.get()

    constructor(
        private url: string,
        private fetchKey: string,
        private itemKey: string,
    ) {}

    private async flushQueue(): Promise<void> {
        const currentQueue = new Map(this.queue)

        const customerNumber = this.bridgeInfo.customerNumber()

        if (this.bridgeInfo.isLoggedIn && !customerNumber) {
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
                        storeId: this.bridgeInfo.storeId,
                    },
                }),
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })

            const result: FetchResponse<T> = await response.json()

            // TO DO is it best to convert to string or can I have it as number always if fix else where

            const itemsMap = new Map(
                result.items.map((p: T) => [String(p[this.itemKey]), p])
            )

            for (const [productId, { resolvers }] of currentQueue.entries()) {
                const data = itemsMap.get(productId)

                if (data) {
                    resolvers.forEach(({ resolve }) => resolve(data))
                } else {
                    const error = new Error(
                        `No data returned for productId: ${productId}`
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
                resolve: (data) => {
                    this.statusMap.value.set(productId, 'fulfilled')
                    resolve(data)
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
