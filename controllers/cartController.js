const FormaPagamentoModel = require("../models/formaPagamentoModel");

class cartController {

    async rotaCarrinho(req, res) {
        let formaPagamento = new FormaPagamentoModel();
        let codCliente = req.cookies.UserLogado;

        let formas = await formaPagamento.listarFormasPagamento();
        res.render("cart/carrinhoFinal", {
            formasPagamento: formas,
            usuario: codCliente
        });
    }

    

}

module.exports = cartController;
