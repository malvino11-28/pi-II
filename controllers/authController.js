const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const EnderecoModel = require("../models/enderecoModel");

const {
    somenteNumeros,
    validarCPF,
    validarNomeCompleto,
    validarEmail,
    validarTelefone,
    validarSenha,
    validarDataNascimento
} = require("../utils/validacoes");

const estadosValidos = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF",
    "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
    "RO", "RR", "SC", "SP", "SE", "TO"
];

class authController {

    async rotaLoginView(req, res) {
        res.render("auth/login", {
            mensagem: "",
            tipo_usuario: "cliente"
        });
    }

    async rotaLogin(req, res) {
        const user = req.body.identificacao;
        const senha = req.body.senha;
        const user_tipo = req.body.tipoLogin;

        if (user_tipo === "funcionario") {
            let msg = "Matrícula ou senha inválidos!";
            let funcionario = new PessoaFisicaModel();
            funcionario = await funcionario.validar(user, senha, user_tipo);

            if (funcionario) {
                res.cookie("UserLogado", funcionario.COD_PESSOA);
                return res.redirect("admin");
            }

            return res.render("auth/login", {
                mensagem: msg,
                tipo_usuario: user_tipo
            });
        } else if (user_tipo === "cliente") {
            let msg = "E-mail ou senha inválidos!";
            let cliente = new PessoaFisicaModel();
            cliente = await cliente.validar(user.trim().toLowerCase(), senha, user_tipo);

            if (cliente) {
                res.cookie("UserLogado", cliente.COD_PESSOA);
                return res.redirect("/carrinho");
            }

            return res.render("auth/login", {
                mensagem: msg,
                tipo_usuario: user_tipo
            });
        } else {
            return res.render("auth/login", {
                mensagem: "Tipo de usuário inválido!"
            });
        }
    }

    async rotaCadastroView(req, res) {
        res.render("auth/cadastro");
    }

    async rotaCadastro(req, res) {
        try {
            const erros = [];

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

            if (!validarSenha(req.body.senha)) {
                erros.push("A senha deve ter ao menos 8 caracteres.");
            }

            if (req.body.senha !== req.body.confirmacao) {
                erros.push("Os campos de senha e confirmação devem ser iguais.");
            }

            if (!req.body.cep || !/^\d{5}-?\d{3}$/.test(req.body.cep.trim())) {
                erros.push("CEP inválido. Informe 8 dígitos.");
            }

            if (!req.body.rua || req.body.rua.trim() === "") {
                erros.push("Rua é obrigatória.");
            }

            if (!req.body.bairro || req.body.bairro.trim() === "") {
                erros.push("Bairro é obrigatório.");
            }

            if (!req.body.cidade || req.body.cidade.trim() === "") {
                erros.push("Cidade é obrigatória.");
            }

            if (!req.body.uf || !estadosValidos.includes(req.body.uf.trim().toUpperCase())) {
                erros.push("Selecione uma UF válida.");
            }

            if (erros.length > 0) {
                return res.status(400).send({ ok: false, erros });
            }

            const cliente = new PessoaFisicaModel(
                0,
                req.body.nome.trim(),
                somenteNumeros(req.body.cpf),
                req.body.rg.trim(),
                req.body.dt_nasc,
                req.body.email.trim().toLowerCase(),
                somenteNumeros(req.body.cel),
                req.body.senha
            );

            const clienteCadastro = await cliente.cadastrarPF();

            if (!clienteCadastro) {
                return res.status(500).send({
                    ok: false,
                    erros: ["Não foi possível cadastrar o cliente."]
                });
            }

            const endereco = new EnderecoModel(
                0,
                cliente.COD_PESSOA,
                req.body.rua.trim(),
                (req.body.num || "").trim(),
                req.body.bairro.trim(),
                (req.body.comp || "").trim(),
                req.body.cidade.trim(),
                req.body.uf.trim().toUpperCase(),
                somenteNumeros(req.body.cep)
            );

            const enderecoCadastro = await endereco.cadastrarEndereco();

            if (!enderecoCadastro) {
                return res.status(500).send({
                    ok: false,
                    erros: ["O cliente foi cadastrado, mas não foi possível salvar o endereço."]
                });
            }

            return res.send({ ok: true });

        } catch (erro) {
            console.error("Erro ao finalizar o cadastro");

            return res.status(500).send({
                ok: false,
                erros: ["Erro interno ao finalizar o cadastro."]
            });
        }
    }
}

module.exports = authController;