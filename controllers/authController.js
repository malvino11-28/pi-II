const FuncionarioModel = require("../models/funcionarioModel");
class authController {

    async rotaLoginView(req, res) {


        res.render("auth/login");
    }

    async rotaLogin(req, res) {

        const user = req.body.matricula;
        const senha = req.body.senha;

        let msg = "Usuário ou senha inválidos!"
        let cor = "red";

        let funcionario = new FuncionarioModel();
        funcionario = await funcionario.validar(user, senha);
        if(funcionario) {
            res.cookie("UserLogado", funcionario.COD_FUN);
            return res.redirect("admin");
        }

        return res.render('login', {'mensagem': msg, 'color': cor});
    }

    async rotaCadastroView(req, res) {

        res.render("auth/cadastro");
    }

    async rotaCadastro(req, res) {

    }
}

module.exports = authController;