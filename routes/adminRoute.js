const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router()

let controller = new adminController;

router.get("/admin", controller.rotaDashboardView);

router.get("/admin/cadastrar-clientes", controller.rotaCadastrarClientesView);
router.post("/admin/cadastrar-clientes", controller.rotaCadastrarClientes);
router.post("/admin/excluir-cliente", controller.rotaExcluirCliente);

router.get("/admin/cadastrar-fornecedor", controller.rotaCadastrarFornecedorView);
router.post("/admin/cadastrar-fornecedor", controller.rotaCadastrarFornecedor);
router.post("/admin/excluir-fornecedor", controller.rotaExcluirFornecedor);

module.exports = router;