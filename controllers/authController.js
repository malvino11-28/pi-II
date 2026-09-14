class authController {

    rotaLogin(req, res) {

        res.render("auth/login");
    }

    rotaCadastro(req, res) {

        res.render("auth/cadastro");
    }
}

module.exports = authController;