const ProdutoModel = require("../models/produtoModel");

class indexController {

    async rotaRaiz(req, res) {
        let produtos = new ProdutoModel();
        let listarProdutos = await produtos.listarProdutos();
        res.render("home/index", {lista: listarProdutos});
    }
}

module.exports = indexController;