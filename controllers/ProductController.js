const LoteModel = require("../models/loteModel");
const ProdutoModel = require("../models/produtoModel");

class productController {

  rotaProdutos(req, res) {
    res.render("products/produtos");
  }

  rotaChurrasqueira(req, res) {
    res.render("products/churrasqueira");
  }

  rotaUtensilios(req, res) {
    res.render("products/utensilios");
  }

  rotaOfertas(req, res) {
    res.render("products/ofertas");
  }

  async rotaDetalhesProduto(req, res) {
    const id = req.params.id;
    
    const produto = new ProdutoModel;
    const lote = new LoteModel;
    let p = await produto.obterProdutoId(id);
    let l = await lote.listarLoteProduto(id);

    res.render("products/detalhes-produto.ejs", {
      layout: "layout/produtoLayout.ejs",
      produto: p,
      lote: l,
    });
  }
}

module.exports = productController;
