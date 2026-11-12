const express = require("express");
const PedidoController = require("../controllers/pedidoController");

const router = express.Router();

let controller = new PedidoController();

router.post("/pedido/salvar", controller.rotaSalvarPedido);

module.exports = router;