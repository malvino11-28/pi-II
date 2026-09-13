const express = require("express");
const productController = require("../controllers/productController.js");

const router = express.Router();

let controller = new productController();

router.get("/produtos", controller.rotaProdutos);
router.get("/produtos/churrasqueira", controller.rotaChurrasqueira);

module.exports = router;