import singletonFactory from '@lib/stores/SingletonFactory'
import magentoSvelteBridge from '@lib/stores/MagentoSvelteBridge.svelte'
import { type CartInformation } from '../../schemas/CartInformation'
import { type Campaign } from '../../schemas/Campaign'
import { fetchPOST } from '@lib/utils/helpers'

// TO DO move to file or come up with better solution
type PSSRequest = {
  id: string
  quantity: number
  isBuyable: 1 | 0 // This is odd, not sure better way to write it, it should always be 1 if can call API
}

class PssFetch {
  public bridge = magentoSvelteBridge

  public cartInfo = $state<null | CartInformation>(null)

  private cache = new Map<string, Campaign>()

  constructor() {
    // Set this up to check m4 messages if setting is enabled
    if (this.bridge.paymentCampaignEnabled) {
      window.addEventListener('magento:cartUpdated', () => {
        this.fetchPSSCampaigns()
      })
      
      window.addEventListener('priceFinderData-fetched', () => {
        this.fetchPSSCampaigns()
      })
    }
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

    const body = JSON.stringify({
      priceFinderData: {
        items,
        customerNumber: this.bridge.customerNumber(),
        storeId: this.bridge.storeId,
      },
    })

    try {
      const response = await fetchPOST(
        window.BASE_URL + 'rest/V1/lma-api/pre-season-campaign/',
        body,
      )

      // TO DO fix validating with zod also if its called with empty data then it wont return any data
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
