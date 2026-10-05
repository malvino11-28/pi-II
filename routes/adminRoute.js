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
router.post("/admin/cadastrar-fornecedor", controller.rotaExcluirCliente);

router.get("/admin/produto", controller.rotaGerenciarProdutoView);
router.get("/admin/produto/gerenciamento-produto", controller.rotaGerenciarProduto);

router.get("/admin/marca", controller.rotaMarcas);
router.post("/admin/arca", controller.rotaCadastrarMarca);
router.post("/admin/marca", controller.rotaExcluirMarca);

module.exports = router;