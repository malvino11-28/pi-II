const express = require("express");

const router = express.Router();

const indexRoute = require("./indexRoute");
const productRoute = require("./productRoute");
const deliveryRoute = require("./deliveryRoute");
const contactRoute = require("./contactRoute");
const cartRoute = require("./cartRoute");
const authRoute = require("./authRoute");
const adminRoute = require("./adminRoute");

router.use("/", indexRoute);
router.use("/", productRoute);
router.use("/", deliveryRoute);
router.use("/", contactRoute);
router.use("/", cartRoute);
router.use("/", authRoute);
router.use("/", adminRoute);

module.exports = router;