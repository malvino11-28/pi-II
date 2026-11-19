const express = require("express");
const RelatorioController = require("../controllers/relatorioController");
const AuthMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

let controller = new RelatorioController();
let auth = new AuthMiddleware();

router.get("/admin/relatorios/descartes", auth.autenticarFuncionario, controller.descartes);
router.get("/admin/relatorios/promocoes", auth.autenticarFuncionario, controller.promocoes);
router.get("/admin/relatorios/cancelamentos", auth.autenticarFuncionario, controller.cancelamentos);
router.get("/admin/relatorios/entregas", auth.autenticarFuncionario, controller.entregas);
router.get("/admin/relatorios/pedidos", auth.autenticarFuncionario, controller.pedidos);
router.get("/admin/relatorios/produtos", auth.autenticarFuncionario, controller.produtos);

module.exports = router;