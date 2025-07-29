import singletonFactory from './SingletonFactory'
import MagentoSvelteBridge from './MagentoSvelteBridge.svelte'
import { type CartInformation } from '../../schemas/CartInformation'
import { type Campaign } from '../../schemas/Campaign'

// TO DO move to file or come up with better solution
type PSSRequest = {
    id: string
    quantity: number
    isBuyable: 1 | 0 // This is odd, not sure better way to write it, it should always be 1 if can call API
}

class PssFetch {
    public paymentCampaign = 'M4' // TO DO move this to where?
    public bridge = MagentoSvelteBridge

    public cartInfo = $state<null | CartInformation>(null)

    private cache = new Map<string, Campaign>()

    constructor() {
        // TO DO pull in setting for checking this not, exists in magento already
    }

    setCartInfo(info: CartInformation) {
        this.cartInfo = info
    }

    public async fetchPSSCampaigns(request?: PSSRequest) {
        const useCache = !!request

        if (request && this.cache.has(request.id)) {
            return this.cache.get(request.id)!
        }

        const items = request
            ? [
                  {
                      itemNumber: parseInt(request.id),
                      quantity: request.quantity,
                      isBuyable: request.isBuyable,
                  },
              ]
            : []

        const body = {
            priceFinderData: {
                items,
                customerNumber: this.bridge.customerNumber(),
                storeId: this.bridge.storeId,
            },
        }

        try {
            const response = await fetch(
                window.BASE_URL + 'rest/V1/lma-api/pre-season-campaign/',
                {
                    method: 'POST',
                    body: JSON.stringify(body),
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            )

            // TO DO fix validating with zod
            const data: Campaign = await response.json()

            if (useCache) {
                this.cache.set(request.id, data)
            }

            this.setCartInfo(data.cart_information)
            return data
        } catch (error) {
            throw error
        }
    }
}

export default singletonFactory(() => new PssFetch())()
