// route for checking out

const express = require("express");
const router = express.Router();

// require in cart services
const CartServices = require("../services/cart_services");

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
        }
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
        console.log(stripeSession);
        // process stripeSession
    }
    res.send({ received: true });
})

module.exports = router;