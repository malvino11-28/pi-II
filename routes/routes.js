const express = require("express");

const router = express.Router();

const indexRoute = require("./indexRoute");
const productRoute = require("./productRoute");
const pedidoRoute = require("./pedidoRoute");
const deliveryRoute = require("./deliveryRoute");
const contactRoute = require("./contactRoute");
const cartRoute = require("./cartRoute");
const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");
const clienteRoute = require("./clienteRoute");

router.use("/", indexRoute);
router.use("/", productRoute);
router.use("/", deliveryRoute);
router.use("/", contactRoute);
router.use("/", cartRoute);
router.use("/", pedidoRoute);
router.use("/", authRoute);
router.use("/", adminRoute);
router.use("/", clienteRoute);

module.exports = router;