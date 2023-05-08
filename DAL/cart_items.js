const { CartItem } = require('../models');

const getCart = async (userID) => {
    return await CartItem.collection()
                  .where({
                    'user_id': userID
                  }).fetch({
                    require: false,
                    withRelated: ['card', 'card.expansion']
                  });
};

const getCartItemByUserAndCard = async (userID, cardID) => {
    return await CartItem.where({
        'user_id': userID,
        'card_id': cardID
    }).fetch({
        require: false
    });
};

async function createCartItem(userID, cardID, quantity) {
    let cartItem = new CartItem({
        'user_id': userID,
        'card_id': cardID,
        'quantity': quantity
    });
    await cartItem.save();
    return cartItem;
};

async function removeFromCart(userID, cardID) {
    let cartItem = await getCartItemByUserAndCard(userID, cardID);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
};

async function updateQuantity(userID, cardID, newQuantity) {
    let cartItem = await getCartItemByUserAndCard(userID, cardID);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
};

module.exports = { getCart, getCartItemByUserAndCard, createCartItem, removeFromCart, updateQuantity };