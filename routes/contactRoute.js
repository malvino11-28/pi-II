const express = require("express");
const contactController = require("../controllers/contactController");

const router = express.Router();

let controller = new contactController();

router.get("/contato", controller.rotaContato);

module.exports = router;