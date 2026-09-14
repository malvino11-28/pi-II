const express = require("express");

const indexController = require("../controllers/indexController.js");

const router = express.Router();

let controller = new indexController;
router.get("/", controller.rotaRaiz);

module.exports = router;
