const LoteModel = require("../models/loteModel");
const ProdutoModel = require("../models/produtoModel");
const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const InformacoesNutricionaisModel = require("../models/informacoesNutricionaisModel");

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
    const categoria = new CategoriaModel;
    const marca = new MarcaModel;
    const infoNutri = new InformacoesNutricionaisModel();
    let p = await produto.obterProdutoId(id);
    let l = await lote.listarLoteProduto(id);
    let c = await categoria.obterCategoriaId(p.COD_CAT);
    let m = await marca.obterMarcaId(p.COD_MAR);
    let iN = await infoNutri.listarInfoNutri(id);

    let estoque = 0;
    for (let i = 0; i < l.length; i++) {
      estoque = estoque + Number(l[i].EST_LOTE);
    }

    const categoriaNome = c.NOME_CAT;
    const marcaNome = m.NOME_MAR;
    res.render("products/detalhes-produto.ejs", {
      layout: "layout/produtoLayout.ejs",
      produto: p,
      lote: l,
      estoque,
      categoriaNome,
      marcaNome,
      iN
    });
  }
}

module.exports = productController;
