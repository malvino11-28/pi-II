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
}

module.exports = productController;
