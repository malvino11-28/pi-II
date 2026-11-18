const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const AssinaturaModel = require('../models/assinaturaModel');
const PlanoModel = require('../models/planoModel');
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

    async autenticarCliente(req, res, next) {
        if (req.cookies.UserLogado) {
            let idUser = req.cookies.UserLogado;
            let cliente = new PessoaFisicaModel();
            cliente = await cliente.obterPorId(idUser);

            if (cliente && !cliente.MATRICULA_FUN) {
                req.cliente = cliente;
                res.locals.cliente = {
                    COD_PESSOA: cliente.COD_PESSOA,
                    NOME_PF: cliente.NOME_PF,
                    EMAIL_PESSOA: cliente.EMAIL_PESSOA,
                    TELEFONE_PESSOA: cliente.TELEFONE_PESSOA
                };
                
                let assinaturaModel = new AssinaturaModel();

                let assinatura = await assinaturaModel.obterAssinaturaId(
                    cliente.COD_PESSOA
                );

                res.locals.assinatura = assinatura;
                res.locals.planoAssinado = null;

                if (assinatura) {
                    let planoModel = new PlanoModel();

                    res.locals.planoAssinado = await planoModel.obterPlanoId(
                        assinatura.COD_PLANO
                    );
                }

                return next();
            }
        }

        if (req.is('application/json')) {
            return res.status(401).json({
                ok: false,
                mensagem: 'Faça login novamente para continuar.'
        });
        }
        return res.redirect('/login');
    }
    
}

module.exports = AuthMiddleware;