import MagentoSvelteBridge from './MagentoSvelteBridge.svelte'
import { fetchPOST } from '../helpers'

import { ZodType, z } from 'zod'

type Resolver<T> = {
  resolve: (price: T) => void
  reject: (err: Error) => void
}

type FetchResponse<T> = {
  items: T[]
}

// TO DO why does need to extend Record<string, any>?
export default abstract class BaseFetch<S extends ZodType<{ items: any[] }>> {
  public bridge = MagentoSvelteBridge

    private queue = new Map<
    string,
    { quantity: number; unitMeasure?: string; resolvers: Resolver<z.infer<S>['items'][number]>[] }
  >()
  private timer: ReturnType<typeof setTimeout> | null = null

  protected abstract getPath(): string
  protected abstract getFetchKey(): string
  protected abstract getItemKey(): string

  protected abstract schema: S

  protected getUrl(): string {
    return `${window.BASE_URL}${this.getPath()}`
  }

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
      ([itemNumber, { quantity, unitMeasure }]) => {
        const base = { itemNumber, quantity }
        return unitMeasure ? { ...base, unitMeasure } : base
      },
    )

    try {
      const body = JSON.stringify({
        [this.getFetchKey()]: {
          items,
          customerNumber,
          storeId: this.bridge.storeId,
        },
      })

      const response = await fetchPOST(this.getUrl(), body)

      const json = await response.json()
      const result = this.schema.parse(json)
      
      window.dispatchEvent(new CustomEvent(`${this.getFetchKey()}-fetched`))

      const itemsMap = new Map(
        result.items.map((p) => [String(p[this.getItemKey()]), p]),
      )

      for (const [productId, { resolvers }] of currentQueue.entries()) {
        const data = itemsMap.get(productId)

        if (data) {
          resolvers.forEach(({ resolve }) => resolve(data))
        } else {
          const error = new Error(
            `No data returned for productId: ${productId}`,
          )
          resolvers.forEach(({ reject }) => reject(error))
        }
      }
    } catch (error) {
      for (const { resolvers } of currentQueue.values()) {
        resolvers.forEach(({ reject }) => reject(error as Error))
      }
    }
  }

  public getPromise(
    productId: string,
    quantity: number,
    unitMeasure?: string,
  ): Promise<z.infer<S>['items'][number]>  {
    return new Promise((resolve, reject) => {
      if (!this.queue.has(productId)) {
        this.queue.set(productId, {
          quantity,
          unitMeasure,
          resolvers: [],
        })
      }

      const entry = this.queue.get(productId)!

      entry.resolvers.push({
        resolve: (data) => {
          resolve(data)
        },
        reject: (err) => {
          reject(err)
        },
      })

      if (!this.timer) {
        this.timer = setTimeout(() => this.flushQueue(), 0) // Used to batch Promise (micro tasks) to run before we call batched fetch (macro task)
      }
    })
  }
}
