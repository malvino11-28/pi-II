const RelatorioModel = require("../models/relatorioModel");

function lerFiltros(query) {
    let nomes = [
        "inicio", "fim", "marca", "categoria", "produto",
        "status", "cliente", "recebimento", "regiao",
        "percentual", "fornecedor", "validade",
        "estoqueMin", "estoqueMax", "ordem"
    ];

    let filtros = {};

    for (let i = 0; i < nomes.length; i++) {
        filtros[nomes[i]] = "";

        if (typeof query[nomes[i]] == "string") {
            filtros[nomes[i]] = query[nomes[i]].trim();
        }
    }

    return filtros;
}

class RelatorioController {
    async descartes(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarDescartes(filtros);
        let marcas = await model.listarMarcas();
        let categorias = await model.listarCategorias();
        let produtos = await model.listarNomesProdutos();

        res.render("admin/relatorios/descartes", {
            lista: lista,
            filtros: filtros,
            marcas: marcas,
            categorias: categorias,
            produtos: produtos
        });
    }

    async promocoes(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarPromocoes(filtros);
        let marcas = await model.listarMarcas();
        let categorias = await model.listarCategorias();

        res.render("admin/relatorios/promocoes", {
            lista: lista,
            filtros: filtros,
            marcas: marcas,
            categorias: categorias
        });
    }

    async cancelamentos(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarCancelamentos(filtros);
        let clientes = await model.listarClientes();

        res.render("admin/relatorios/cancelamentos", {
            lista: lista,
            filtros: filtros,
            clientes: clientes
        });
    }

    async entregas(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarEntregas(filtros);
        let clientes = await model.listarClientes();

        res.render("admin/relatorios/entregas", {
            lista: lista,
            filtros: filtros,
            clientes: clientes
        });
    }

    async pedidos(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarPedidos(filtros);
        let clientes = await model.listarClientes();
        let recebimentos = await model.listarFormasRecebimento();

        res.render("admin/relatorios/pedidos", {
            lista: lista,
            filtros: filtros,
            clientes: clientes,
            recebimentos: recebimentos
        });
    }

    async produtos(req, res) {
        let model = new RelatorioModel();
        let filtros = lerFiltros(req.query);

        let lista = await model.listarProdutos(filtros);
        let marcas = await model.listarMarcas();
        let categorias = await model.listarCategorias();
        let fornecedores = await model.listarFornecedores();

        res.render("admin/relatorios/produtos", {
            lista: lista,
            filtros: filtros,
            marcas: marcas,
            categorias: categorias,
            fornecedores: fornecedores
        });
    }
}

module.exports = RelatorioController;