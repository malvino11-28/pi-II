const FormaPagamentoModel = require("../models/formaPagamentoModel");

class cartController {

    async rotaCarrinho(req, res) {
        let formaPagamento = new FormaPagamentoModel();

        let formas = await formaPagamento.listarFormasPagamento();
        res.render("cart/carrinhoFinal", {
            formasPagamento: formas
        });
    }

    

}

module.exports = cartController;
