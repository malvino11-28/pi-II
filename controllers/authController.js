const FuncionarioModel = require("../models/funcionarioModel");
class authController {

    async rotaLoginView(req, res) {


        res.render("auth/login");
    }

    async rotaLogin(req, res) {

        const user = req.body.identificacao;
        const senha = req.body.senha;
        const user_tipo = req.body.tipoLogin;

        let msg = "Matrícula ou senha inválidos!"

        let funcionario = new FuncionarioModel();
        funcionario = await funcionario.validar(user, senha);
        if(funcionario) {
            res.cookie("UserLogado", funcionario.COD_FUN);
            return res.redirect("admin");
        }

        return res.render('auth/login', { 'mensagem': msg, 'tipo_usuario' : user_tipo });
    }

    async rotaCadastroView(req, res) {

        res.render("auth/cadastro");
    }

    async rotaCadastro(req, res) {

    }

}

module.exports = authController;