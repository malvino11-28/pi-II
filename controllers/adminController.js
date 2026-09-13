class adminController {

    rotaDashboard(req, res) {

        res.render("admin/dashboard");
    }

    rotaClients(req, res) {

        res.render("admin/clients");
    }
}

module.exports = adminController;