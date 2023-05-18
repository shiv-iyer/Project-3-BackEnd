const express = require("express");
const router = express.Router();

// crud for cart required

const cartDataLayer = require("../../DAL/cart_items");
const { checkIfAuthenticatedJWT } = require("../../middlewares");

// first route: get cart items by user id
router.get("/:user_id", async (req, res) => {
    console.log(req.params.user_id);
    try {
        const cart = await cartDataLayer.getCart(req.params.user_id);
        res.status(200).send(cart);
    } catch (e) {
        res.sendStatus(404);
    }
});

router.post("/add", async (req, res) => {
    console.log("request received");
    try {
        // destructure required data from req.body
        const {userID, cardID, quantity} = req.body;
        console.log("crashed at line 25")
        let cart;
        let cartItem = await cartDataLayer.getCartItemByUserAndCard(userID, cardID);
        console.log("crashed at line 28")
        // if item in cart, add quantity, else, create new
        if (cartItem) {
            console.log("crashed at line 31")
            cart = await cartDataLayer.updateQuantity(userID, cardID, (cartItem.get("quantity") + quantity));
        } else {
            console.log("crashed at line 34")
            console.log(userID, cardID, quantity);
            cart = await cartDataLayer.createCartItem(userID, cardID, quantity);
            console.log("crashed at line 36");
        }
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
        console.log("error here")
    }
});

router.post("/update", async (req, res) => {
    // todo
    try {
        // this is the importance of the data layer
        // takes in userid, cardid, newquantity, all in req.body
        // backend and frontend have to match
        const cart = await cartDataLayer.updateQuantity(req.body.userID, req.body.cardID, req.body.quantity);
        res.status(200).send(cart);
    } catch (e) {
        res.sendStatus(404);
    }
});

router.post("/delete", async (req, res) => {
    // todo
    try {
        const cart = await cartDataLayer.removeFromCart(req.body.userID, req.body.cardID);
        res.status(200).send(cart);
    } catch (e) {
        res.sendStatus(404);
    }
});

module.exports = router;