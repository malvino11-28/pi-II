const PessoaFisicaModel = require("../models/pessoaFisicaModel");

class AuthMiddleware {

    async autenticarFuncionario(req, res, next) {
        if (req.cookies.UserLogado) {
            let idUser = req.cookies.UserLogado;
            let funcionario = new PessoaFisicaModel();
            funcionario = await funcionario.obterPorId(idUser);

            if (funcionario && funcionario.MATRICULA_FUN && funcionario.STATUS_FUN === "Ativo") {
                return next();
            }
        }

        return res.redirect("/login");
    }
}

module.exports = AuthMiddleware;