const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router()

let controller = new adminController;

router.get("/admin", controller.rotaDashboardView);

router.get("/admin/cadastrar-clientes", controller.rotaCadastrarClientesView);
router.post("/admin/cadastrar-clientes", controller.rotaCadastrarClientes);
router.get("/admin/alterar-cliente/:id", controller.alterarClienteView)
router.post("/admin/excluir-cliente", controller.rotaExcluirCliente);

router.get("/admin/cadastrar-fornecedores", controller.rotaCadastrarFornecedorView);
router.post("/admin/cadastrar-fornecedores", controller.rotaCadastrarFornecedor);
router.get("/admin/alterar-fornecedores/:id", controller.rotaAlterarFornecedorView);
router.post("/admin/excluir-fornecedor", controller.rotaExcluirFornecedor);

router.get("/admin/produto", controller.rotaGerenciarProdutoView);

router.get("/admin/produto/gerenciamento-produto", controller.rotaGerenciarProduto);
router.post("/admin/produto/cadastrar-produto", controller.rotaCadastrarProduto);
router.post("/admin/produto/excluir-produto", controller.rotaExcluirProduto);
router.get("/admin/produto/gerenciamento-produto/alterar-produto/:id", controller.rotaAtualizarProduto);

router.get("/admin/produto/gerenciamento-marca", controller.rotaGerenciarMarca);
router.post("/admin/produto/cadastrar-marca", controller.rotaCadastrarMarca);
router.post("/admin/produto/excluir-marca", controller.rotaExcluirMarca);
router.get("/admin/produto/gerenciamento-marca/alterar-marca/:id", controller.rotaAlterarMarca);

router.get("/admin/produto/gerenciamento-categoria", controller.rotaGerenciarCategoria);
router.post("/admin/produto/cadastrar-categoria", controller.rotaCadastrarCategoria);
router.post("/admin/produto/excluir-categoria", controller.rotaExcluirCategoria);
router.get("/admin/produto/gerenciamento-categoria/alterar-categoria/:id", controller.rotaAlterarCategoria);

router.get("/admin/produto/gerenciamento-lote/:id", controller.rotaGerenciamentoLote);
router.post("/admin/produto/cadastrar-lote", controller.rotaCadastrarLote);
router.get("/admin/produto/gerenciamento-lote/alterar-lote/:id", controller.rotaAlterarLote);
router.post("/admin/produto/excluir-lote", controller.rotaExcluirLote);

module.exports = router;