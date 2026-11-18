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

    rotaAssinaturaView(req, res) {
        res.render('cliente/assinatura', {
            layout: 'layout/clienteLayout',
            pagina: 'assinatura',
            titulo: 'Minha assinatura'
        });
    }

    rotaAssinarPlano(req, res) {
        // Lógica para assinar um plano
        res.redirect('/cliente');
    }
}

module.exports = clienteController;
