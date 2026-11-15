const FormaRecebimentoModel = require("../models/FormaRecebimentoModel");

class cartController {

    async rotaCarrinho(req, res) {
        let formaPagamento = new FormaPagamentoModel();
        let codCliente = req.cookies.UserLogado;

        let formas = await FormaRecebimento.listarFormasPagamento();
        res.render("cart/carrinhoFinal", {
            formasPagamento: formas,
            usuario: codCliente
        });
    }

    

}

module.exports = cartController;
