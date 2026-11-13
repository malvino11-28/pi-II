const express = require("express");
const cartController = require("../controllers/cartController");
const AuthMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

let controller = new cartController();
let auth = new AuthMiddleware();

router.get("/carrinho", auth.autenticarCliente, controller.rotaCarrinho);

module.exports = router;