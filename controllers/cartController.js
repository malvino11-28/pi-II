const FormaRecebimentoModel = require("../models/formaRecebimentoModel");
const PessoaFisicaModel = require("../models/pessoaFisicaModel");

class cartController {
    async rotaCarrinho(req, res) {
        let formaRecebimento = new FormaRecebimentoModel();
        let cod = req.cookies.UserLogado;

        let formas = await formaRecebimento.listarFormas();

        return res.render("cart/carrinhoFinal", {
            formasPagamento: formas,
            usuario: cod
        });
        
    }
}

module.exports = cartController;