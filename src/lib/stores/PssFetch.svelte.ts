// TO DO implement PSS fetch logic
// TO DO refactor out Fetch logic from Price and Stock and reuse,
// TO DO implement singleton here aswell but no queue

import singletonFactory from './SingletonFactory'

class PssFetch {
    public async pssProto(id: number) {
        console.log('ProductsId', id)

        return fetch(`https://dummyjson.com/products`).then((r) => r.json())
    }
}

export default singletonFactory(() => new PssFetch())()
