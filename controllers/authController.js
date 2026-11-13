const PessoaFisicaModel = require("../models/pessoaFisicaModel");

class authController {

    async rotaLoginView(req, res) {
        res.render("auth/login");
    }

    async rotaLogin(req, res) {
        const user = req.body.identificacao;
        const senha = req.body.senha;
        const user_tipo = req.body.tipoLogin;
        
        if(user_tipo === "funcionario") {

            let msg = "Matrícula ou senha inválidos!";
            let funcionario = new PessoaFisicaModel();
            funcionario = await funcionario.validar(user, senha, user_tipo);

            if (funcionario) {
                res.cookie("UserLogado", funcionario.COD_PESSOA);
                return res.redirect("admin");
            }

            return res.render("auth/login", { mensagem: msg, tipo_usuario: user_tipo });
        
        } else if(user_tipo === "cliente") {

            let msg = "E-mail ou senha inválidos!";
            let cliente = new PessoaFisicaModel();
            cliente = await cliente.validar(user, senha, user_tipo);

            if (cliente) {
                res.cookie("UserLogado", cliente.COD_PESSOA);
                return res.redirect("home");
            }

            return res.render("auth/login", { mensagem: msg, tipo_usuario: user_tipo });
        
        } else {

            return res.render("auth/login", { mensagem: "Tipo de usuário inválido!" });
        }
    }

    async rotaCadastroView(req, res) {
        res.render("auth/cadastro");
    }

    async rotaCadastro(req, res) {
        try {
            let erros = [];

            if (!validarNomeCompleto(req.body.nome)) {
                erros.push("Nome completo inválido.");
            }

            if (!validarCPF(req.body.cpf)) {
                erros.push("CPF inválido.");
            }

            if (!req.body.rg || req.body.rg.trim() === "") {
                erros.push("RG é obrigatório.");
            }

            if (!validarDataNascimento(req.body.dt_nasc)) {
                erros.push("Data de nascimento inválida.");
            }

            if (!validarEmail(req.body.email)) {
                erros.push("E-mail inválido.");
            }

            if (!validarTelefone(req.body.cel)) {
                erros.push("Celular inválido.");
            }

            if (!req.body.id || req.body.senha) {
                if (!validarSenha(req.body.senha)) {
                    erros.push("A senha deve ter ao menos 8 caracteres.");
                }
                if (req.body.senha !== req.body.confirmacao) {
                    erros.push("O campo de senha e confirmação de senha estão diferentes.");
                }
            }

            if (erros.length > 0) {
                return res.status(400).send({
                    ok: false,
                    erros: erros
                });
            }

            let cliente = new PessoaFisicaModel(0, req.body.nome.trim(), somenteNumeros(req.body.cpf), req.body.rg.trim(), req.body.dt_nasc, req.body.email.trim().toLowerCase(), somenteNumeros(req.body.cel), req.body.senha);
            
            let retornoBan = await cliente.cadastrarPF();
            
            res.send({ ok: retornoBan });

        } catch (erro) {
            console.log(erro);

            return res.status(500).send({
                ok: false,
                erros: ["Erro interno ao finalizar o cadastro."]
            });
        }
    }

}

module.exports = authController;