const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

let controller = new authController();

router.get("/login", controller.rotaLoginView);
router.post("/login", controller.rotaLogin);

router.get("/cadastrar", controller.rotaCadastroView);
router.post("/cadastrar", controller.rotaCadastro);

module.exports = router;