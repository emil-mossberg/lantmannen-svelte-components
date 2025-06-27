### Code snippets

This is a less clean way of accessing the customer-cart

```javascript
require(['Magento_Customer/js/customer-data'], function(customerData) {
    const cart = customerData.get('cart');

    console.log(cart);

    const subscription = cart.subscribe(function(newCartData) {
        console.log('Cart updated:', newCartData);
    });
});









