const ClienteModel = require("../models/clienteModel");

class adminController {

    rotaDashboardView(req, res) {

        res.render("admin/dashboard");
    }

    async rotaCadastrarClientesView(req, res) {

        let cliente = new ClienteModel();
        let listaClientes = await cliente.listarClientes();
        res.render("admin/cadastrarCliente", { clientes: listaClientes });
    }

    async rotaCadastrarClientes(req, res) {

        if(req.body.nome != "" && req.body.cpf != "" && req.body.rg != "" 
            && req.body.dt_nasc != "" && req.body.email != "" 
            && req.body.cel != "" && req.body.senha != "") {

            let cliente = new ClienteModel(0, req.body.nome, req.body.cpf, req.body.rg, req.body.dt_nasc, req.body.email, req.body.cel, req.body.senha);
            let retornoBan = await cliente.cadastrarCliente();

            res.send({ ok: retornoBan });

        } else {

            res.send({ ok: false });
        }
    }
}

module.exports = adminController;