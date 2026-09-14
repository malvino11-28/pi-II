const express = require("express");
const deliveryController = require("../controllers/deliveryController");

const router = express.Router();

let controller = new deliveryController();

router.get("/entrega", controller.rotaEntrega);

module.exports = router;