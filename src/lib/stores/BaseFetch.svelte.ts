import { MagentoSvelteBridgeSingleton } from './MagentoSvelteBridgeSingleton.svelte'

type Resolver<T> = {
    resolve: (price: T) => void
    reject: (err: Error) => void
}

type FetchResponse<T> = {
    items: T[]
}

// TO DO why does need to extend Record<string, any>?
export default abstract class BaseFetch<T extends Record<string, any>> {
    public bridge = MagentoSvelteBridgeSingleton.get()

    private queue = new Map<string, { quantity: number; resolvers: Resolver<T>[] }>()
    private timer: ReturnType<typeof setTimeout> | null = null

    public statusMap = $state<{ value: Map<string, 'pending' | 'fulfilled' | 'rejected'> }>({ value: new Map() })

    protected abstract getUrl(): string
    protected abstract getFetchKey(): string
    protected abstract getItemKey(): string

    private async flushQueue(): Promise<void> { 
        const currentQueue = new Map(this.queue)

        const customerNumber = this.bridge.customerNumber()

        if (this.bridge.isLoggedIn && !customerNumber) {
            setTimeout(() => this.flushQueue(), 10)
            return
        }

        this.queue.clear()
        this.timer = null

        const items = Array.from(currentQueue.entries()).map(
            ([itemNumber, { quantity }]) => ({ itemNumber, quantity })
        )

        try {
            const response = await fetch(this.getUrl(), {
                method: 'POST',
                body: JSON.stringify({
                    [this.getFetchKey()]: {
                        items,
                        customerNumber,
                        storeId: this.bridge.storeId,
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

            const itemsMap = new Map(result.items.map((p) => [String(p[this.getItemKey()]), p]))

            for (const [productId, { resolvers }] of currentQueue.entries()) {
                const data = itemsMap.get(productId)

                if (data) {
                    resolvers.forEach(({ resolve }) => resolve(data))
                } else {
                    const error = new Error(`No data returned for productId: ${productId}`)
                    resolvers.forEach(({ reject }) => reject(error))
                }
            }
        } catch (error) {
            for (const { resolvers } of currentQueue.values()) {
                resolvers.forEach(({ reject }) => reject(error as Error))
            }
        }
    }

    public getPromise(productId: string, quantity: number): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.queue.has(productId)) {
                this.queue.set(productId, { quantity, resolvers: [] })
                this.statusMap.value.set(productId, 'pending')
            }

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
                this.timer = setTimeout(() => this.flushQueue(), 10)
            }
        })
    }
}