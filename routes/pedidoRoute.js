const express = require("express");
const PedidoController = require("../controllers/pedidoController");
const AuthMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

let controller = new PedidoController();
let auth = new AuthMiddleware();

router.post("/pedido/salvar/:id", auth.autenticarCliente, controller.rotaSalvarPedido);

module.exports = router;