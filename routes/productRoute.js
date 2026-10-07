const express = require("express");
const productController = require("../controllers/ProductController.js");

const router = express.Router();

let controller = new productController();

router.get("/produtos", controller.rotaProdutos);
router.get("/produtos/churrasqueira", controller.rotaChurrasqueira);
router.get("/produtos/utensilios", controller.rotaUtensilios);
router.get("/produtos/ofertas", controller.rotaOfertas);

module.exports = router;