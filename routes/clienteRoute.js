const express = require('express');
const clienteController = require('../controllers/clienteController');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
let controller = new clienteController();
let auth = new AuthMiddleware();

router.get('/cliente', auth.autenticarCliente, controller.rotaAreaClienteView);

router.get('/cliente/alterar-dados', auth.autenticarCliente, controller.rotaAlterarDadosView);
router.post('/cliente/alterar-dados', auth.autenticarCliente, controller.rotaAlterarDados);

router.get('/cliente/alterar-senha', auth.autenticarCliente, controller.rotaAlterarSenhaView);
router.post('/cliente/alterar-senha', auth.autenticarCliente, controller.rotaAlterarSenha);

router.get('/cliente/assinatura', auth.autenticarCliente, controller.rotaAssinaturaView);
router.post('/cliente/assinatura', auth.autenticarCliente, controller.rotaAssinarPlano);

module.exports = router;