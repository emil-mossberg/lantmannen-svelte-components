import singletonFactory from './SingletonFactory'


const tempPSSDummy = [
  {
    "campaign_id": "ML12",
    "campaign_name": "Sträckfilm Betala 251210 Leverans Okt",
    "campaign_period_type": null,
    "campaign_type": "M4",
    "order_date": "2025-10-25",
  },
  {
    "campaign_id": "ML17",
    "campaign_name": "Sträckfilm Betala 251210 Leverans Aug",
    "campaign_period_type": null,
    "campaign_type": "M4",
    "order_date": "2025-08-25",
  },
  {
    "campaign_id": "ML18",
    "campaign_name": "Sträckfilm Betala 251210 Leverans Sep",
    "campaign_period_type": null,
    "campaign_type": "M4",
    "order_date": "2025-09-25",
  },
  {
    "campaign_id": "MM01",
    "campaign_name": "Gödsel 15öre/kg Leverans augusti",
    "campaign_period_type": null,
    "campaign_type": "M5",
    "order_date": "2025-08-25",

  }
]


// TO DO remove for cartInfoing
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

type CartInformation = {
    cart_has_pay_campaign: boolean
    cart_is_empty: boolean
    pay_campaign_id: string
    pay_campaign_name: string
}

class PssFetch {

    public paymentCampaign = 'M4' // TO DO move this to where?

    public cartInfo = $state<null | CartInformation>(null)

    constructor() {
        console.log('fetch constructor')

        // TO DO pull in setting for checking this not, exists in magento already
        console.log('WINDOW', window)
        window.addEventListener('DOMContentLoaded', () => console.log('apa'))
    }

    testFunction () {
        console.log('call!!d')
    }

    setCartInfo(info: CartInformation) {
        this.cartInfo = info
    }

    public async pssProto(id: string) {
        // await sleep(2000)

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
                tempPSSDummy
            }
        } catch (error) {
            throw error
        }
    }
}

export default singletonFactory(() => new PssFetch())()
