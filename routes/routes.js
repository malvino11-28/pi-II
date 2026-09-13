const express = require("express");

const router = express.Router();

const indexRoute = require("./indexRoute");
const productRoute = require("./productRoute");

router.use("/", indexRoute);
router.use("/", productRoute);

module.exports = router;