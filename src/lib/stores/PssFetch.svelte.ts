import singletonFactory from './SingletonFactory'
import MagentoSvelteBridge from './MagentoSvelteBridge.svelte'
import { type CartInformation } from '../../schemas/CartInformation'

const tempPSSDummy = [
    {
        campaign_id: 'ML12',
        campaign_name: 'Sträckfilm Betala 251210 Leverans Okt',
        campaign_period_type: null,
        campaign_type: 'M4',
        order_date: '2025-10-25',
    },
    {
        campaign_id: 'ML17',
        campaign_name: 'Sträckfilm Betala 251210 Leverans Aug',
        campaign_period_type: null,
        campaign_type: 'M4',
        order_date: '2025-08-25',
    },
    {
        campaign_id: 'ML18',
        campaign_name: 'Sträckfilm Betala 251210 Leverans Sep',
        campaign_period_type: null,
        campaign_type: 'M4',
        order_date: '2025-09-25',
    },
    {
        campaign_id: 'MM01',
        campaign_name: 'Gödsel 15öre/kg Leverans augusti',
        campaign_period_type: null,
        campaign_type: 'M5',
        order_date: '2025-08-25',
    },
]

// TO DO remove for cartInfoing
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

class PssFetch {
    public paymentCampaign = 'M4' // TO DO move this to where?
    public bridge = MagentoSvelteBridge

    public cartInfo = $state<null | CartInformation>(null)

    constructor() {
        // TO DO pull in setting for checking this not, exists in magento already
    }

    setCartInfo(info: CartInformation) {
        this.cartInfo = info
    }

    public async fetchPSSCampaigns(id: string) {
        const body = {
            priceFinderData: {
                items: [
                    {
                        itemNumber: parseInt(id),
                        quantity: 1,
                        isBuyable: 1,
                    },
                ],
                customerNumber: '10000003',
                storeId: this.bridge.storeId,
            },
        }

        console.log('BODY', body);

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

            const json = await response.json()

            console.log(json)
        } catch (error) {
            throw error
        }
    }

    public async pssProto(id: string) {
        try {
            const response = await fetch(`https://dummyjson.com/products/${id}`)
            const json = await response.json()

            this.setCartInfo({
                cart_has_pay_campaign: true,
                cart_is_empty: false,
                pay_campaign_id: json.sku,
                pay_campaign_name: `Payment name ${json.title}`,
            })

            return {
                json,
                tempPSSDummy,
            }
        } catch (error) {
            throw error
        }
    }
}

export default singletonFactory(() => new PssFetch())()
