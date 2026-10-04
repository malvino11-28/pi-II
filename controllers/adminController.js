const ClienteModel = require("../models/clienteModel");
const FornecedorModel = require("../models/fornecedorModel");

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

    async rotaDashboardView(req, res) {

        let cliente = new ClienteModel();
        let listaClientes = await cliente.listarClientes();

        let fornecedor = new FornecedorModel();
        let listarFornecedores = await fornecedor.listarFornecedores()

        res.render("admin/dashboard", {
            clientes: listaClientes,
            fornecedores: listarFornecedores
        });
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

    async rotaExcluirCliente(req, res) {

        let idExclusao = req.body.id;
        if(idExclusao && idExclusao > 0) {

            let cliente = new ClienteModel();
            let result = await cliente.excluirCliente(idExclusao);

            res.send({ ok: result });

        } else {
            res.send({ ok: false });
        }
    }

    async rotaCadastrarFornecedorView(req, res) {

        let fornecedor = new FornecedorModel();
        let listaFornecedores = await fornecedor.listarFornecedores();

        res.render("admin/fornecedor", {
            fornecedores: listaFornecedores
        });
    }

    async rotaCadastrarFornecedor(req, res) {

        if (
            req.body.razao != "" &&
            req.body.nomeFan != "" &&
            req.body.cnpj != "" &&
            req.body.email != "" &&
            req.body.telefone != ""
        ) {

            let fornecedor = new FornecedorModel(
                0,
                somenteNumeros(req.body.cnpj),
                req.body.razao.trim(),
                req.body.nomeFan.trim(),
                req.body.email.trim().toLowerCase(),
                somenteNumeros(req.body.telefone)
            );

            let result = await fornecedor.cadastrarFornecedor();

            res.send({ ok: result });

        } else {
            res.send({ ok: false });
        }
}

    async rotaExcluirFornecedor(req, res) {

        let idExclusao = req.body.id;
        if(idExclusao && idExclusao > 0) {

            let fornecedor = new FornecedorModel();
            let result = await fornecedor.excluirFornecedor(idExclusao);

            res.send({ ok: result });
        
        } else {

            res.send({ ok: false });
        }
    }

}

module.exports = adminController;