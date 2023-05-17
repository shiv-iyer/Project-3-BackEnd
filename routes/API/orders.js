const express = require("express");
const router = express.Router();

const orderDataLayer = require("../../DAL/orders");

router.get("/:user_id", async (req, res) => {
    try {
        const orders = await orderDataLayer.getOrderByUserID(req.params.user_id);
        res.status(200).send(orders);
    } catch (e) {
        res.status(404);
    }
});

module.exports = router;