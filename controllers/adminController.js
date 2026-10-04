const ClienteModel = require("../models/clienteModel");

const {
    somenteNumeros,
    validarCPF,
    validarNomeCompleto,
    validarEmail,
    validarTelefone,
    validarSenha,
    validarDataNascimento
} = require("../utils/validacoes");

class adminController {

    rotaDashboardView(req, res) {
        res.render("admin/dashboard");
    }

    async rotaCadastrarClientesView(req, res) {
        let cliente = new ClienteModel();
        let listaClientes = await cliente.listarClientes();

        res.render("admin/cadastrarCliente", {
            clientes: listaClientes
        });
    }

    async rotaCadastrarClientes(req, res) {
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

            if (!validarSenha(req.body.senha)) {
                erros.push("A senha deve ter ao menos 8 caracteres.");
            }

            if (erros.length > 0) {
                return res.status(400).send({
                    ok: false,
                    erros: erros
                });
            }

            let cliente = new ClienteModel(
                0,
                req.body.nome.trim(),

                // Remove . e - antes de salvar.
                somenteNumeros(req.body.cpf),

                req.body.rg.trim(),

                // Continua em AAAA-MM-DD, como o input type="date" envia.
                req.body.dt_nasc,

                req.body.email.trim().toLowerCase(),

                // Remove (, ), espaço e - antes de salvar.
                somenteNumeros(req.body.cel),

                req.body.senha
            );

            let retornoBan = await cliente.cadastrarCliente();

            return res.send({
                ok: retornoBan
            });

        } catch (erro) {
            console.log(erro);

            return res.status(500).send({
                ok: false,
                erros: ["Erro interno ao cadastrar o cliente."]
            });
        }
    }
}

module.exports = adminController;