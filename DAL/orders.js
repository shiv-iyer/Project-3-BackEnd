// require models

const { Order, OrderItem } = require("../models");

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: ["user", "order_status"]
    });
    return orders;
};

const addOrder = async (orderInfo) => {
    const order = new Order(orderInfo);
    await order.save();
    return order;
}

const getOrderWithStripeID = async (stripeId) => {
    const orderId = await Order.where({
        "stripe_id": stripeId
    }).fetch({
        require: true
    })

    return orderId;
};

const addOrderItem = async (orderId, cardId, quantity) => {
    const item = new OrderItem({
        "order_id": orderId,
        "card_id": cardId,
        "quantity": quantity
    });
    // make sure to always save
    await item.save();
    return item;
};

const getOrderByUserID = async (userID) => {
    const orders = await Order.collection().where({
        "user_id": userID
    }).fetch({
        require: false,
        withRelated: ["order_status"]
    });

    return orders;
};


module.exports = { getAllOrders, addOrder, getOrderWithStripeID, addOrderItem, getOrderByUserID };