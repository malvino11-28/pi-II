const FormaRecebimentoModel = require("../models/formaRecebimentoModel");

class cartController {
    async rotaCarrinho(req, res) {
        let formaRecebimento = new FormaRecebimentoModel();
        let formas = await formaRecebimento.listarFormas();
        let codCliente = req.cookies.UserLogado;

        return res.render("cart/carrinhoFinal", {
            formasPagamento: formas,
            usuario: codCliente
        });
    }
}

module.exports = cartController;