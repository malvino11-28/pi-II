const express = require("express");
const adminController = require("../controllers/adminController");
const AuthMiddleware = require("../middleware/authMiddleware");

const router = express.Router()

let controller = new adminController;
let auth = new AuthMiddleware();

router.get("/admin", auth.autenticarFuncionario, controller.rotaDashboardView);

router.get("/admin/cadastrar-clientes", auth.autenticarFuncionario, controller.rotaCadastrarClientesView);
router.post("/admin/cadastrar-clientes", auth.autenticarFuncionario, controller.rotaCadastrarClientes);
router.get("/admin/alterar-cliente/:id", auth.autenticarFuncionario, controller.alterarClienteView)
router.post("/admin/excluir-cliente", auth.autenticarFuncionario, controller.rotaExcluirCliente);

router.get("/admin/cadastrar-fornecedores", auth.autenticarFuncionario, controller.rotaCadastrarFornecedorView);
router.post("/admin/cadastrar-fornecedores", auth.autenticarFuncionario, controller.rotaCadastrarFornecedor);
router.get("/admin/alterar-fornecedores/:id", auth.autenticarFuncionario, controller.rotaAlterarFornecedorView);
router.post("/admin/excluir-fornecedor", auth.autenticarFuncionario, controller.rotaExcluirFornecedor);

router.get("/admin/produto", auth.autenticarFuncionario, controller.rotaGerenciarProdutoView);

router.get("/admin/produto/gerenciamento-produto", auth.autenticarFuncionario, controller.rotaGerenciarProduto);
router.post("/admin/produto/cadastrar-produto", auth.autenticarFuncionario, controller.rotaCadastrarProduto);
router.post("/admin/produto/excluir-produto", auth.autenticarFuncionario, controller.rotaExcluirProduto);
router.get("/admin/produto/gerenciamento-produto/alterar-produto/:id", auth.autenticarFuncionario, controller.rotaAtualizarProduto);

router.get("/admin/produto/gerenciamento-marca", auth.autenticarFuncionario, controller.rotaGerenciarMarca);
router.post("/admin/produto/cadastrar-marca", auth.autenticarFuncionario, controller.rotaCadastrarMarca);
router.post("/admin/produto/excluir-marca", auth.autenticarFuncionario, controller.rotaExcluirMarca);
router.get("/admin/produto/gerenciamento-marca/alterar-marca/:id", auth.autenticarFuncionario, controller.rotaAlterarMarca);

router.get("/admin/produto/gerenciamento-categoria", auth.autenticarFuncionario, controller.rotaGerenciarCategoria);
router.post("/admin/produto/cadastrar-categoria", auth.autenticarFuncionario, controller.rotaCadastrarCategoria);
router.post("/admin/produto/excluir-categoria", auth.autenticarFuncionario, controller.rotaExcluirCategoria);
router.get("/admin/produto/gerenciamento-categoria/alterar-categoria/:id", auth.autenticarFuncionario, controller.rotaAlterarCategoria);

router.get("/admin/produto/gerenciamento-lote/:id", auth.autenticarFuncionario, controller.rotaGerenciamentoLote);
router.post("/admin/produto/cadastrar-lote", auth.autenticarFuncionario, controller.rotaCadastrarLote);
router.get("/admin/produto/gerenciamento-lote/alterar-lote/:id", auth.autenticarFuncionario, controller.rotaAlterarLote);
router.post("/admin/produto/excluir-lote", auth.autenticarFuncionario, controller.rotaExcluirLote);

module.exports = router;