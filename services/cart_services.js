// import cart DAL
const cartDataLayer = require('../DAL/cart_items');

// class
class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    // function to add an item to the cart (be it existing or new)
    async addToCart(cardID, quantity) {
        // check if the user has added the card to the shopping cart before
        let cartItem = await cartDataLayer
                              .getCartItemByUserAndCard(this.user_id, cardID);
        if (cartItem) {
            return await cartDataLayer
                          .updateQuantity(this.user_id, cardID, (cartItem.get('quantity') + 1));
        } else {
            let newCartItem = cartDataLayer
                               .createCartItem(this.user_id, cardID, quantity);
            return newCartItem;
        }
    };

    // function to remove an item from the cart
    async removeFromCart(cardID) {
        return await cartDataLayer
                      .removeFromCart(this.user_id, cardID);
    }

    // function to update a cart item's quantity
    async setQuantity(cardID, quantity) {
        return await cartDataLayer
                      .updateQuantity(this.user_id, cardID, quantity)
    };

    // function to retrieve all cart items for a particular user
    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    };
}

module.exports = CartServices;