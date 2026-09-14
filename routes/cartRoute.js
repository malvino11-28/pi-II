const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

let controller = new cartController();

router.get("/carrinho", controller.rotaCarrinho);

module.exports = router;