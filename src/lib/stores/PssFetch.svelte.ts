import singletonFactory from './SingletonFactory'

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
        await sleep(2000)

        try {
            const response = await fetch(`https://dummyjson.com/products/${id}`)
            const json = await response.json()
            console.log(json)
            this.setCartInfo({
                cart_has_pay_campaign: true,
                cart_is_empty: false,
                pay_campaign_id: json.sku,
                pay_campaign_name: `Payment name ${json.title}`,
            })

            return json
        } catch (error) {
            throw error
        }
    }
}

export default singletonFactory(() => new PssFetch())()
