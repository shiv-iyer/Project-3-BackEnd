// route for checking out

const express = require("express");
const router = express.Router();

// moment for date formatting
const moment = require("moment");
moment().format();

// require in cart services
const CartServices = require("../services/cart_services");

// import order data layer
const orderDataLayer = require("../DAL/orders");

// strip
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
    // create cart service object
    const cart = new CartServices(req.session.user.id);

    // get all items from the cart
    let items = await cart.getCart();

    // step 1 — get line items
    let lineItems = [];
    let meta = [];
    // line items follow the Stripe documentation: https://stripe.com/docs/api/checkout/sessions/create
    for (let i of items) {
        const lineItem = {
            'quantity': i.get('quantity'),
            'price_data': {
                'currency': 'SGD',
                // convert from cents to dollars
                'unit_amount': (i.related('card').get('cost')) * 100,
                'product_data': {
                    'name': i.related('card').get('name')
                }
            }
        }
        if (i.related('card').get('image_url')) {
            lineItem.price_data.product_data.images = [i.related('card').get('image_url')];
        }
        // push item to array
        lineItems.push(lineItem);

        // save the quantity data along with the card id
        meta.push({
            // save user id in metadata
            'user_id': req.session.user.id,
            'card_id': i.get('card_id'),
            'quantity': i.get('quantity')
        });
    }

    // step 2 — create Stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        mode:'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        },
        shipping_address_collection: { allowed_countries: ["SG"] },
        billing_address_collection: "required"
    }

    // step 3: register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        // step 4; get the ID of a session
        'sessionId': stripeSession.id, 
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
});

// processing payment
router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    } catch (e) {
        res.send({
            'error': e.message
        })
        console.log(e.message)
    }
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        // console.log(stripeSession);
        
        // process stripeSession
        const paymentIntent = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent);
        const date = moment.unix(stripeSession.created).format("YYYY-MM-DD HH:mm:ss");

        const orderData = {
            // retrieve user ID from meta data
            "user_id": (JSON.parse(stripeSession.metadata.orders))[0].user_id,
            "order_status_id": 2,
            // divide by 100 to convert back 
            "total_cost": (stripeSession.amount_total) / 100,
            // moment date
            "order_date": date,
            "shipping_country": stripeSession.shipping_details.address.country,
            "shipping_postal_code": stripeSession.shipping_details.address.postal_code,
            "shipping_address_line_1": stripeSession.shipping_details.address.line1,
           "shipping_address_line_2": stripeSession.shipping_details.address.line2,
            "billing_country": stripeSession.customer_details.address.country,
            "billing_postal_code": stripeSession.customer_details.address.postal_code,
            "billing_address_line_1": stripeSession.customer_details.address.line1,
            "billing_address_line_2": stripeSession.customer_details.address.line2,
            // delivery instructions...
            "delivery_instructions": "Please contact me before delivering!",
            // retrieve payment type
            "payment_type": paymentIntent.payment_method_types[0],
            "stripe_id": stripeSession.id
        };

        const newOrder = await orderDataLayer.addOrder(orderData);
        // this is to change the metadata into json format
        const orderItems = JSON.parse(stripeSession.metadata.orders);
        console.log("orderItems:", orderItems);

        // this is to get order id using the stripeSession's id
        const orderDetails = await orderDataLayer.getOrderWithStripeID(stripeSession.id);

        // since orderItems is an array, we use a for loop to loop through to array and individually add each order item
        orderItems.forEach(order => {
            console.log(order)
            const newItem = orderDataLayer.addOrderItem(orderDetails.id, order.card_id, order.quantity);
        })

        

    }
    res.send({ received: true });
})

module.exports = router;