const planoModel = require('../models/planoModel');
const AssinaturaModel = require('../models/assinaturaModel');

class clienteController {

    rotaPedidosView(req, res) {
        res.render('cliente/pedidos', {
            layout: 'layout/clienteLayout',
            pagina: 'pedidos',
            titulo: 'Meus pedidos'
        });
    }

    rotaEnderecosView(req, res) {
        res.render('cliente/enderecos', {
            layout: 'layout/clienteLayout',
            pagina: 'enderecos',
            titulo: 'Endereços'
        });
    }

    rotaAjudaView(req, res) {
        res.render('cliente/ajuda', {
            layout: 'layout/clienteLayout',
            pagina: 'ajuda',
            titulo: 'Preciso de ajuda'
        });
    }

    rotaAreaClienteView(req, res) {
        res.render('cliente/area-cliente', {
            layout: 'layout/clienteLayout',
            pagina: 'inicio',
            titulo: 'Visão geral'
        });
    }

    rotaAlterarDadosView(req, res) {
        res.render('cliente/alterar-dados', {
            layout: 'layout/clienteLayout',
            pagina: 'dados',
            titulo: 'Meus dados'
        });
    }

    rotaAlterarDados(req, res) {
        // Lógica para alterar os dados do cliente
        res.redirect('/cliente');
    }

    rotaAlterarSenhaView(req, res) {
        res.render('cliente/alterar-senha', {
            layout: 'layout/clienteLayout',
            pagina: 'senha',
            titulo: 'Alterar senha'
        });
    }

    rotaAlterarSenha(req, res) {
        // Lógica para alterar a senha do cliente
        res.redirect('/cliente');
    }

    async rotaAssinaturaView(req, res) {

        let plano = new planoModel();
        let listaPlanos = await plano.listarPlanos();

        res.render('cliente/assinatura', {
            layout: 'layout/clienteLayout',
            pagina: 'assinatura',
            titulo: 'Minha assinatura',

            planos: listaPlanos
        });
    }

    async rotaAssinarPlano(req, res) {
    try {
        if (!req.cliente) {
            return res.status(401).json({
                ok: false,
                mensagem: 'Faça login para assinar um plano.'
            });
        }

        let codPlano = Number(req.body.codPlano);
        let codPessoa = req.cliente.COD_PESSOA;

        if (!Number.isInteger(codPlano) || codPlano <= 0) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Selecione um plano válido.'
            });
        }

        // Busca as informações reais do plano no banco.
        let plano = new planoModel();
        plano = await plano.obterPlanoId(codPlano);

        if (!plano) {
            return res.status(404).json({
                ok: false,
                mensagem: 'Plano não encontrado.'
            });
        }

        // Este método faz o cadastro inicial da assinatura.
        let assinatura = new AssinaturaModel();
        let existente = await assinatura.obterAssinaturaId(codPessoa);

        if (existente) {
            return res.status(409).json({
                ok: false,
                mensagem: 'Você já possui uma assinatura cadastrada.'
            });
        }

        let duracao = Number(plano.DURACAO_PLANO);

        if (!Number.isInteger(duracao) || duracao <= 0) {
            return res.status(400).json({
                ok: false,
                mensagem: 'O plano está com a duração inválida.'
            });
        }

        // Calcula o vencimento usando a duração em dias.
        let vencimento = new Date();
        vencimento.setDate(vencimento.getDate() + duracao);

        // Formato aceito pelo campo DATE do MySQL: AAAA-MM-DD.
        let ano = vencimento.getFullYear();
        let mes = String(vencimento.getMonth() + 1).padStart(2, '0');
        let dia = String(vencimento.getDate()).padStart(2, '0');

        let dataVencimento = `${ano}-${mes}-${dia}`;

        assinatura = new AssinaturaModel(
            codPessoa,
            plano.COD_PLANO,
            'Ativa',
            dataVencimento
        );

        let cadastrou = await assinatura.cadastrarAssinatura();

        if (!cadastrou) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Não foi possível cadastrar a assinatura.'
            });
        }

        return res.status(201).json({
            ok: true,
            mensagem: 'Assinatura cadastrada com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao cadastrar assinatura:', erro);

        return res.status(500).json({
            ok: false,
            mensagem: 'Erro interno ao cadastrar a assinatura.'
        });
    }
}
}

module.exports = clienteController;
