const FormaRecebimentoModel = require("../models/FormaRecebimentoModel");

class cartController {

    async rotaCarrinho(req, res) {
        let FormaRecebimento = new FormaRecebimentoModel();

        let formas = await FormaRecebimento.listarFormasPagamento();
        res.render("cart/carrinhoFinal", {
            formasPagamento: formas
        });
    }

    

}

module.exports = cartController;
