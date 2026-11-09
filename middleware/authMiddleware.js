const FuncionarioModel = require("../models/funcionarioModel");

class AuthMiddleware {
    
    async autenticarFuncionario(req, res, next) {
        if(req.cookies.UserLogado) {

            let idUser = req.cookies.UserLogado;
            let funcionario = new FuncionarioModel();
            funcionario = await funcionario.obterPorId(idUser);
            if(funcionario && funcionario.STATUS_FUN == 'Ativo') {
                next();
            
            } else {

                res.redirect("/login");
            }

        } else {

            res.redirect("/login");
        }
    }
}

module.exports = AuthMiddleware;