const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router()

let controller = new adminController;

router.get("/admin", controller.rotaDashboard);
router.get("/admin/clients", controller.rotaClients);

module.exports = router;