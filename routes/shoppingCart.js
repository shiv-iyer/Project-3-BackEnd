// new route for shopping cart
const express = require("express");
const router = express.Router();

// require cart service layer
const CartServices = require("../services/cart_services");

// middleware
const { checkIfAuthenticated } = require("../middlewares");

// display the contents of the shopping cart
router.get("/", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.render("carts/index", {
        'shoppingCart': (await cart.getCart()).toJSON()
    });
});

// add to shopping cart
router.get("/:card_id/add", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.card_id, 1);
    req.flash("success_messages", "Yay! Item was successfully added to your cart!");
    res.redirect("/cards");
});

// remove from shopping cart
router.get("/:card_id/remove", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.removeFromCart(req.params.card_id);
    req.flash("success_messages", "Yay! Item was successfully removed from your cart!");
    res.redirect("/cart");
});

// update existing cart item's quantity
router.post("/:card_id/quantity/update", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.setQuantity(req.params.card_id, req.body.newQuantity);
    req.flash("success_messages", "Yay! Cart item's quantity was successfully updated!");
    res.redirect("/cart");
});

module.exports = router;