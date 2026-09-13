class productController {

  rotaProdutos(req, res) {
    res.render("products/produtos");
  }

  rotaChurrasqueira(req, res) {
    res.render("products/churrasqueira");
  }
}

module.exports = productController;
