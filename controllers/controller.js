class IndexController {
  index(req, res) {
    res.render("home/index");
  }
}

module.exports = new IndexController();
