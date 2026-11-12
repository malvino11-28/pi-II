const PessoaFisicaModel = require("../models/pessoaFisicaModel");

class authController {

    async rotaLoginView(req, res) {
        res.render("auth/login");
    }

    async rotaLogin(req, res) {
        const user = req.body.identificacao;
        const senha = req.body.senha;
        const user_tipo = req.body.tipoLogin;

        let msg = "Matrícula ou senha inválidos!";

        let funcionario = new PessoaFisicaModel();
        funcionario = await funcionario.validar(user, senha, "funcionario");

        if (funcionario) {
            res.cookie("UserLogado", funcionario.COD_PESSOA);
            return res.redirect("admin");
        }

        return res.render("auth/login", { mensagem: msg, tipo_usuario: user_tipo });
    }

    async rotaCadastroView(req, res) {
        res.render("auth/cadastro");
    }

    async rotaCadastro(req, res) {

    }

}

module.exports = authController;