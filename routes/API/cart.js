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

module.exports = router;