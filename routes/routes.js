const express = require("express");

const indexController = require("../controllers/controller.js");

const router = express.Router();

let controller = indexController;

router.get("/", controller.index);

module.exports = router;
