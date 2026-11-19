const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const PessoaJuridicaModel = require("../models/pessoaJuridicaModel");
const CategoriaModel = require("../models/categoriaModel");
const ProdutoModel = require("../models/produtoModel");
const MarcaModel = require("../models/marcaModel");
const LoteModel = require("../models/loteModel");
const PedidoModel = require("../models/pedidoModel");
const EntregaModel = require("../models/entregaModel");
const ItemPedidoModel = require("../models/itemPedidoModel");
const ItemDescModel = require("../models/itemDescModel");
const CompraModel = require("../models/compraModel");
const ItemCompraModel = require("../models/itemCompraModel");
const ContasPagarModel = require("../models/contasPagarModel");
const ItemPromoModel = require("../models/itemPromoModel");

const {
    somenteNumeros,
    validarCPF,
    validarNomeCompleto,
    validarEmail,
    validarTelefone,
    validarSenha,
    validarDataNascimento
} = require("../utils/validacoes");

const InformacoesNutricionaisModel = require("../models/informacoesNutricionaisModel");
const EnderecoModel = require("../models/enderecoModel");
const DescarteModel = require("../models/descarteModel");
const PromocaoModel = require("../models/promocaoModel");

function dataValidaCompra(valor) {
    if (typeof valor !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }

    let data = new Date(valor + "T00:00:00Z");

    if (isNaN(data.getTime())) {
        return false;
    }

    return data.toISOString().slice(0, 10) === valor;
}

function paraCentesimos(valor) {
    if (typeof valor !== "number" && typeof valor !== "string") {
        return NaN;
    }

    let texto = String(valor).trim().replace(",", ".");

    if (!/^\d{1,8}([.]\d{1,2})?$/.test(texto)) {
        return NaN;
    }

    let [inteiro, decimal = ""] = texto.split(".");

    return Number(inteiro) * 100 + Number(decimal.padEnd(2, "0"));
}

class adminController {

    async rotaDashboardView(req, res) {
        let cliente = new PessoaFisicaModel();
        let pessoasFisicas = await cliente.listarPF();
        let listaClientes = pessoasFisicas.filter(pessoa => pessoa.EMAIL_PESSOA);

        let produtos = new ProdutoModel();
        let listarProdutos = await produtos.listarProdutos();

        let fornecedor = new PessoaJuridicaModel();
        let listarFornecedores = await fornecedor.listarPJ();

        let pedido = new PedidoModel();
        let listarPedido = pedido.listarPedido()

        res.render("admin/dashboard", {
            clientes: listaClientes,
            fornecedores: listarFornecedores,
            produtos: listarProdutos,
            pedido: listarPedido
        });
    }

    async rotaCadastrarClientesView(req, res) {
        let cliente = new PessoaFisicaModel();
        let pessoasFisicas = await cliente.listarPF();
        let listaClientes = pessoasFisicas.filter(pessoa => pessoa.EMAIL_PESSOA);

        res.render("admin/cadastrarPessoaF", {
            clientes: listaClientes
        });
    }

    async rotaCadastrarClientes(req, res) {
        try {
            let erros = [];

            if (!validarNomeCompleto(req.body.nome)) {
                erros.push("Nome completo inválido.");
            }

            if (!validarCPF(req.body.cpf)) {
                erros.push("CPF inválido.");
            }

            if (!req.body.rg || req.body.rg.trim() === "") {
                erros.push("RG é obrigatório.");
            }

            if (!validarDataNascimento(req.body.dt_nasc)) {
                erros.push("Data de nascimento inválida.");
            }

            if (!validarEmail(req.body.email)) {
                erros.push("E-mail inválido.");
            }

            if (!validarTelefone(req.body.cel)) {
                erros.push("Celular inválido.");
            }

            if (!req.body.id || req.body.senha) {
                if (!validarSenha(req.body.senha)) {
                    erros.push("A senha deve ter ao menos 8 caracteres.");
                }
            }

            if (erros.length > 0) {
                return res.status(400).send({
                    ok: false,
                    erros: erros
                });
            }

            let cliente = new PessoaFisicaModel(0, req.body.nome.trim(), somenteNumeros(req.body.cpf), req.body.rg.trim(), req.body.dt_nasc, req.body.email.trim().toLowerCase(), somenteNumeros(req.body.cel), req.body.senha);

            let retornoBan = false;

            if (req.body.id) {
                cliente.COD_PESSOA = req.body.id;
                retornoBan = await cliente.atualizarPF();
            } else {
                retornoBan = await cliente.cadastrarPF();
            }

            res.send({ ok: retornoBan });

        } catch (erro) {
            console.log(erro);

            return res.status(500).send({
                ok: false,
                erros: ["Erro interno ao cadastrar o cliente."]
            });
        }
    }

    async alterarClienteView(req, res) {
        let idCliente = req.params.id;
        let cliente = new PessoaFisicaModel();
        cliente = await cliente.obterPorId(idCliente);

        res.render("admin/alterarCliente", { cliAlter: cliente });
    }

    async rotaExcluirCliente(req, res) {
        let idExclusao = req.body.id;

        if (idExclusao && idExclusao > 0) {
            let cliente = new PessoaFisicaModel();
            let result = await cliente.excluirPF(idExclusao);

            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaCadastrarFornecedorView(req, res) {
        let fornecedor = new PessoaJuridicaModel();
        let listaFornecedores = await fornecedor.listarPJ();

        res.render("admin/cadastrarPessoaJ", {
            fornecedores: listaFornecedores
        });
    }

    async rotaCadastrarFornecedor(req, res) {
        if (
            req.body.razao != "" &&
            req.body.nomeFan != "" &&
            req.body.cnpj != "" &&
            req.body.email != "" &&
            req.body.telefone != ""
        ) {
            let fornecedor = new PessoaJuridicaModel(0, somenteNumeros(req.body.cnpj), req.body.razao.trim(), req.body.nomeFan.trim(), req.body.email.trim().toLowerCase(), somenteNumeros(req.body.telefone));

            let retornoBan = false;

            if (req.body.id) {
                fornecedor.COD_PESSOA = req.body.id;
                retornoBan = await fornecedor.atualizarPJ();
            } else {
                retornoBan = await fornecedor.cadastrarPJ();
            }

            res.send({ ok: retornoBan });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAlterarFornecedorView(req, res) {
        let idFornecedor = req.params.id;
        let fornecedor = new PessoaJuridicaModel();
        fornecedor = await fornecedor.obterPorId(idFornecedor);

        res.render("admin/alterarFornecedor", {
            forAlter: fornecedor
        });
    }

    async rotaExcluirFornecedor(req, res) {
        let idExclusao = req.body.id;

        if (idExclusao && idExclusao > 0) {
            let fornecedor = new PessoaJuridicaModel();
            let result = await fornecedor.excluirPJ(idExclusao);

            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }
      /////////////////

    async rotaGerenciarCategoria(req, res) {
        let categoria = new CategoriaModel();
        let listaCategoria = await categoria.listarCategoria();
        res.render("admin/gerenciamentoCategoria", { categorias: listaCategoria });
    }

    async rotaCadastrarCategoria(req, res) {
        let result;
        if (req.body.nome != "") {
            if (req.body.id > 0) {
                let categoria = new CategoriaModel(req.body.id, req.body.nome);
                result = await categoria.atualizarCategoria();
            } else {
                let categoria = new CategoriaModel(0, req.body.nome);
                result = await categoria.cadastrarCategoria();
            }
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaExcluirCategoria(req, res) {
        let id = req.body.id;
        if (id && id > 0) {
            let categoria = new CategoriaModel();
            let result = await categoria.excluirCategoria(id);
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAlterarCategoria(req, res) {
        let id = req.params.id;
        let categoria = new CategoriaModel();
        categoria = await categoria.obterCategoriaId(id);
        res.render("admin/alterarCategoria", { categoria });
    }

    async rotaGerenciarProdutoView(req, res) {
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        let categoria = new CategoriaModel();

        let listaProduto = await produto.listarProdutos();
        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategoria();

        res.render("admin/produto", {
            produtos: listaProduto,
            marcas: listaMarca,
            categorias: listaCategoria
        });
    }

    async rotaGerenciarProduto(req, res) {
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        let categoria = new CategoriaModel();

        let listaProduto = await produto.listarProdutos();
        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategoria();

        res.render("admin/gerenciamentoProduto", {
            produtos: listaProduto,
            marcas: listaMarca,
            categorias: listaCategoria
        });
    }

    async rotaCadastrarProduto(req, res) {
        let result;
        if (
            req.body.marca != "0" &&
            req.body.categoria != "0" &&
            req.body.nome != "" &&
            req.body.desc != "" &&
            req.body.desc_red != "" &&
            req.body.uni != "0" &&
            req.body.valor != "" &&
            (req.body.id > 0 || req.file != null)
        ) {
            if (req.body.id > 0) {
                let produto = new ProdutoModel(req.body.id, req.body.marca, req.body.categoria, req.body.nome, req.body.desc, req.body.desc_red, req.body.uni, req.body.valor, req.file ? req.file.buffer : null);
                result = await produto.atualizarProduto();
                res.send({ ok: result });
            } else {
                let produto = new ProdutoModel(0, req.body.marca, req.body.categoria, req.body.nome, req.body.desc, req.body.desc_red, req.body.uni, req.body.valor, req.file.buffer);
                result = await produto.cadastrarProduto();
                res.send({ ok: result, idProd: result });
            }
        } else {
            res.send({ ok: false });
        }
    }

    async rotaCadastrarInfoNutri(req, res) {
        let idProd = req.body.idProd;
        let listaNutri = req.body.listaNutri;

        if (idProd > 0 && listaNutri.length > 0) {
            let nomes = [];
            for (let i = 0; i < listaNutri.length; i++) {
                let item = listaNutri[i];
                let nome = item.nome.trim();
                let qtd = item.qtd;
                let uni = item.uni.trim();

                if (nome.length < 2 || nome.length > 50 || qtd < 0 || uni.length < 1 || uni.length > 10) {
                    return res.send({ ok: false });
                }

                if (nomes.includes(nome.toLowerCase())) {
                    return res.send({ ok: false });
                }

                nomes.push(nome.toLowerCase());
            }

            for (let i = 0; i < listaNutri.length; i++) {
                let item = listaNutri[i];
                let infoNutri = new InformacoesNutricionaisModel(0, idProd, item.nome.trim(), item.qtd, item.uni.trim(), item.percVD);
                let result = await infoNutri.cadastrarInfoNutri();

                if (!result) {
                    return res.send({ ok: false });
                }
            }

            res.send({ ok: true });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAtualizarInfoNutri(req, res) {
        let id = req.body.id;
        let nome = req.body.nome.trim();
        let qtd = req.body.qtd;
        let uni = req.body.uni.trim();
        let percVD = req.body.percVD;

        if (id > 0 && nome.length >= 2 && nome.length <= 50 && req.body.qtd !== "" && uni.length > 0 && uni.length <= 10) {
            let infoNutri = new InformacoesNutricionaisModel(id, null, nome, qtd, uni, percVD);
            let result = await infoNutri.atualizarNutri();
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaExcluirInfoNutri(req, res) {
        let id = Number(req.body.id);

        if (Number.isInteger(id) && id > 0) {
            let infoNutri = new InformacoesNutricionaisModel();
            let result = await infoNutri.excluirInfoNutri(id);
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaExcluirProduto(req, res) {
        let id = req.body.id;
        if (id && id > 0) {
            let produto = new ProdutoModel();
            let result = await produto.excluirProduto(id);
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAtualizarProduto(req, res) {
        let id = req.params.id;
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        let categoria = new CategoriaModel();

        let produtoId;
        if (req.params.id != undefined && req.params.id != "") {
            produtoId = await produto.obterProdutoId(id);
        }

        let listaMarcas = await marca.listarMarcas();
        let listaCategorias = await categoria.listarCategoria();

        res.render("admin/alterarProduto", {
            marcas: listaMarcas,
            categorias: listaCategorias,
            produto: produtoId
        });
    }

    async rotaGerenciarMarca(req, res) {
        let marca = new MarcaModel();
        let listaMarcas = await marca.listarMarcas();
        res.render("admin/gerenciamentoMarca", { marcas: listaMarcas });
    }

    async rotaCadastrarMarca(req, res) {
        let result;
        if (req.body.nome != "") {
            if (req.body.id > 0) {
                let marca = new MarcaModel(req.body.id, req.body.nome);
                result = await marca.atualizarMarca();
            } else {
                let marca = new MarcaModel(0, req.body.nome);
                result = await marca.cadastrarMarca();
            }
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaExcluirMarca(req, res) {
        let idExclusao = req.body.id;
        if (idExclusao && idExclusao > 0) {
            let marca = new MarcaModel();
            let result = await marca.excluirMarca(idExclusao);
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAlterarMarca(req, res) {
        let id = req.params.id;
        let marca = new MarcaModel();
        marca = await marca.obterMarcaId(id);
        res.render("admin/alterarMarca", { marca });
    }

    async rotaGerenciamentoLote(req, res) {
        let idProduto = req.params.id;
        let produtoModel = new ProdutoModel();
        let loteModel = new LoteModel();

        let produto = await produtoModel.obterProdutoId(idProduto);
        let lotes = await loteModel.listarLoteProduto(idProduto);

        res.render("admin/gerenciamentoLote", {
            produto: produto,
            lotes: lotes
        });
    }

    async rotaCadastrarLote(req, res) {
        let result;
        let id = req.body.id;
        let idProduto = req.body.produto;
        let numeroLote = req.body.numeroLote;
        let dataFabricacao = req.body.dataFabricacao || null;
        let dataVencimento = req.body.dataVencimento;
        let estoque = req.body.estoque;

        if (
            idProduto > 0 &&
            numeroLote.trim() != "" &&
            dataVencimento != "" &&
            estoque != "" &&
            estoque > 0 &&
            dataFabricacao != "" &&
            dataVencimento > dataFabricacao
        ) {
            if (id > 0) {
                let lote = new LoteModel(id, idProduto, null, numeroLote.trim(), dataFabricacao, dataVencimento, estoque);
                result = await lote.atualizarLote();
            } else {
                let lote = new LoteModel(0, idProduto, null, numeroLote.trim(), dataFabricacao, dataVencimento, estoque);
                result = await lote.cadastrarLote();
            }
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    async rotaAlterarLote(req, res) {
        let idLote = req.params.id;
        let loteModel = new LoteModel();
        let produtoModel = new ProdutoModel();

        let lote = await loteModel.obterLoteId(idLote);
        let produto = await produtoModel.obterProdutoId(lote.COD_PROD);

        res.render("admin/alterarLote", { lote: lote, produto: produto });
    }

    async rotaExcluirLote(req, res) {
        let idLote = req.body.id;
        if (idLote > 0) {
            let lote = new LoteModel();
            let result = await lote.excluirLote(idLote);
            res.send({ ok: result });
        } else {
            res.send({ ok: false });
        }
    }

    // pedido

    async rotaGerenciarPedido(req, res) {
        let pedidoModel = new PedidoModel();
        let pedidos = await pedidoModel.listarPedidosAdmin();

        let total = pedidos.length;
        let pendentes = 0;
        let preparados= 0;
        let emEntrega= 0;
        let retirados= 0;
        let cancelados= 0;

        for (let i = 0;i<pedidos.length;i++) {
            if (pedidos[i].STATUS_PED == "Pendente") {
                pendentes++;
            }
        }
        for (let i = 0;i<pedidos.length;i++) {
            if (pedidos[i].STATUS_PED == "Preparado") {
                preparados++;
            }
        }
        for (let i = 0;i<pedidos.length;i++) {
            if (pedidos[i].STATUS_PED == "Saiu para entrega") {
                emEntrega++;
            }
        }
        for (let i = 0;i<pedidos.length;i++) {
            if (pedidos[i].STATUS_PED == "Retirado") {
                retirados++;
            }
        }
        for (let i = 0;i<pedidos.length;i++) {
            if (pedidos[i].STATUS_PED == "Cancelado") {
                cancelados++;
            }
        }

        res.render("admin/gerenciamentoPedido", {
            pedidos,
            total,
            pendentes,
            preparados,
            emEntrega,
            retirados,
            cancelados
        });
    }

    async rotaDetalhesPedido(req, res) {
        let id = req.params.id;
        
        if(!id && id <=0 ) {
            res.send({ok: false});
        } 

        let pedido = new PedidoModel();
        let p = await pedido.obterPedidoAdmin(id);

        if (!p) {

        }
        let itemPedido = new ItemPedidoModel();
        let itens = await itemPedido.listarItensAdmin(id);

        return res.render("admin/detalhesPedido", { pedido: p, itens });
    } 

    async rotaControlePedido(req, res) {
        let id = Number(req.params.id);

        if (!id || id <= 0) {
            return res.send("Código de pedido inválido.");
        } else {
            let pedidoModel = new PedidoModel();
            let pedido = await pedidoModel.obterPedidoAdmin(id);

            if (!pedido) {
                return res.send("Pedido não encontrado.");
            }

            let itemPedidoModel = new ItemPedidoModel();
            let itens = await itemPedidoModel.listarItensAdmin(id);

            let entregaModel = new EntregaModel();
            let enderecoModel = new EnderecoModel();
            let entrega = await entregaModel.obterEntregaPedido(id);
            let enderecos = await enderecoModel.listarEnderecosCliente(pedido.COD_CLI);

            return res.render("admin/controlePedido", {
                pedido,
                itens,
                entrega,
                enderecos
            });
        }
    }

    async rotaAtualizarStatusPedido(req, res) {
        let id = req.params.id;
        let novoStatus = req.body.status;

        if (!id || id <= 0) {
            return res.send({
                ok: false,
                msg: "Código de pedido inválido."
            });
        }

        let pedidoModel = new PedidoModel();
        let pedido = await pedidoModel.obterPedidoAdmin(id);

        if (!pedido) {
            return res.send({
                ok: false,
                msg: "Pedido não encontrado."
            });
        }

        let permitido = false;

        if (pedido.STATUS_PED === "Pendente") {
            if (novoStatus === "Preparado" || novoStatus === "Cancelado") {
                permitido = true;
            }
        } else if (pedido.STATUS_PED === "Preparado") {
            if (
                novoStatus === "Retirado" ||
                novoStatus === "Saiu para entrega" ||
                novoStatus === "Cancelado"
            ) {
                permitido = true;
            }
        }

        if (!permitido) {
            return res.send({
                ok: false,
                msg: "Essa alteração não é permitida para o status atual."
            });
        }

        let result = false;

        if (novoStatus == "Preparado") {
            let itemPedidoModel = new ItemPedidoModel();
            let itens = await itemPedidoModel.listarItensAdmin(id);
            let conferidos = req.body.conferidos;

            if (conferidos.length <= 0 || itens.length == 0 || conferidos.length != itens.length) {
                return res.send({
                    ok: false,
                    msg: "Confira todos os produtos e lotes antes de concluir a preparação."
                });
            }

            for (let i =0; i<itens.length; i++) {
                let qtd = 0;

                for (let j = 0; j<conferidos.length; j++) {
                    if (conferidos[j] && conferidos[j].produto == itens[i].COD_PROD && conferidos[j].lote == itens[i].COD_LOTE) {
                        qtd++;
                    }
                }

                if (qtd !== 1) {
                    return res.send({
                        ok:false,
                        msg: "A conferência está incompleta."
                    });
                }
            }

            result = await pedidoModel.atualizarStatusPedido(id, novoStatus, pedido.STATUS_PED);

        } else if (novoStatus == "Cancelado") {
            result = await pedidoModel.cancelarPedido(id, pedido.STATUS_PED);
        } else {
            let entregaModel = new EntregaModel();
            let entrega = await entregaModel.obterEntregaPedido(id);

            if (novoStatus == "Retirado") {
                if (entrega) {
                    return res.send({
                        ok: false,
                        msg:"Este pedido está destinado à entrega."
                    });
                }

                result = await pedidoModel.retirarPedido(id);

                if (!result) {
                    return res.send({
                        ok: false,
                        msg: "Não foi possível confirmar a retirada."
                    });
                }
            } else if (novoStatus == "Saiu para entrega") {
                if (!entrega) {
                    return res.send({
                        ok: false,
                        msg:"Cadastre a entrega antes de preparar o pedido"
                    });
                }

                result = await pedidoModel.sairParaEntrega(id, entrega.COD_ENT);
            }
        }

        if (result) {
            return res.send({
                ok: true,
                msg: "Operação realizada com sucesso!"
            });
        }

        return res.send({
            ok: false,
            msg: "Não foi possível confirmar a operação."
        });  
    }

    async rotaDefinirEntregaPedido(req, res) {
        let id = req.params.id;
        let idEndereco = req.body.idEndereco;
        let data = req.body.data;

        if (!id || id <= 0 || !idEndereco || idEndereco <= 0 || !data) {
            return res.send({
                ok: false,
                msg: "Informe um endereço e uma data válidos."
            });
        }

        let entregaModel = new EntregaModel();

        let result = await entregaModel.definirEntregaPedido(id, idEndereco, data);

        if (result) {
            return res.send({
                ok: true,
                msg: "Entrega cadastrada!"
            });
        }

        return res.send({
            ok: false,
            msg: "Não foi possível cadastrar a entrega."
        });
    }

    // descarte

    async rotaDescarteLote(req, res) {
        let id = req.params.id;

        if(!id || id <= 0) {
            return res.send("Lote inválido.");
        }

        let loteModel = new LoteModel();
        let lote = await loteModel.obterLoteId(id);

        if (!lote) {
            return res.send("Lote não encontrado.");
        }

        let produtoModel = new ProdutoModel();
        let produto = await produtoModel.obterProdutoId(lote.COD_PROD);

        if (!produto) {
            return res.send("Produto não encontrado.");
        }

        let itemDescModel = new ItemDescModel();
        let descartes = await itemDescModel.listarDescLote(id);

        return res.render("admin/descarteLote", {
            lote,
            descartes,
            produto
        });
    }

    async rotaRegistrarDescarte(req, res) {
        let id = req.params.id;
        let qtd = req.body.qtd;
        let motivo = req.body.motivo;
        let idFuncionario = req.cookies.UserLogado;

        if (!id || id <= 0 || !idFuncionario || idFuncionario <= 0) {
            console.log(id);
            console.log(idFuncionario);
            return res.send({
                ok: false,
                msg:"Lote ou funcionário inválido."
            });
        }

        if (!qtd || qtd <= 0) {
            return res.send({
                ok: false,
                msg:"Informe uma quantidade maior do que zero."
            });
        }

        motivo = motivo.trim();

        let loteModel = new LoteModel();
        let lote = await loteModel.obterLoteId(id);

        if (!lote) {
            return res.send({
                ok: false,
                msg: "Lote não encontrado."
            });
        }

        if (qtd > lote.EST_LOTE) {
            return res.send({
                ok: false,
                msg: "A quantidade informada é maior que o estoque do lote."
            });
        }

        let produtoModel = new ProdutoModel();
        let produto = await produtoModel.obterProdutoId(lote.COD_PROD);

        if (!produto) {
            return res.send({
                ok: false,
                msg: "Produto não encontrado."
            });
        }

        if (produto.UNI_MEDIDA_PROD == "UN" && !isInteger(qtd)) {
            return res.send({
                ok: false,
                msg: "Informe uma quantidade inteira para produtos em unidade."
            });
        }

        let descarte = new DescarteModel(0, idFuncionario, null);
        let salvo = await descarte.cadastrarDescarte();

        if (!salvo) {
            return res.send({
                ok: false,
                msg: "Não foi possível registrar o descarte."
            });
        }

        let item = new ItemDescModel(
            descarte.COD_DESC,
            lote.COD_PROD,
            lote.COD_LOTE,
            qtd,
            motivo
        );

        let itemSalvo = await item.cadastrarItemDesc();

        if (!itemSalvo) {
            await descarte.excluirDescarte(descarte.COD_DESC);

            return res.send({
                ok: false,
                msg: "Não foi possível registrar o item do descarte."
            });
        }

        let estoqueAtualizado = await loteModel.baixarEstoque(id, qtd);

        if (!estoqueAtualizado) {
            await item.excluirItemDesc(descarte.COD_DESC);
            await descarte.excluirDescarte(descarte.COD_DESC);

            return res.send({
                ok: false,
                msg: "Erro ao atualizar estoque: O saldo do lote pode ter mudado."
            });
        }

        return res.send({
            ok: true,
            msg: "Descarte registrado e estoque atualizado!"
        });
    }

    async rotaEfetuarCompraView(req, res) {
        let fornecedorModel = new PessoaJuridicaModel();
        let produtoModel = new ProdutoModel();

        let fornecedores = await fornecedorModel.listarPJ();
        let produtos = await produtoModel.listarProdutos();

        res.render("admin/efetuarCompra", {
            fornecedores: fornecedores,
            produtos: produtos
        });
    }

    async rotaListarLotesCompra(req, res) {
        let idProduto = Number(req.params.idProduto);

        if (!Number.isInteger(idProduto) || idProduto <= 0) {
            return res.status(400).send({
                ok: false,
                msg: "Produto inválido."
            });
        }

        let loteModel = new LoteModel();
        let lotes = await loteModel.listarLoteProduto(idProduto);

        return res.send({ ok: true, lotes: lotes });
    }

    async rotaEfetuarCompra(req, res) {
        let codCompra = null;
        let etapa = "validar a compra";

        try {
            
            let { idFornecedor, dataCompra, itens, valorPago, parcelas = [] } = req.body || {};

            if (!/^\d+$/.test(String(idFornecedor)) || Number(idFornecedor) <= 0) {
                return res.status(400).send({ ok: false, msg: "Selecione um fornecedor." });
            }

            if (!dataValidaCompra(dataCompra)) {
                return res.status(400).send({ ok: false, msg: "Informe uma data de compra válida." });
            }

            if (!Array.isArray(itens) || itens.length === 0) {
                return res.status(400).send({ ok: false, msg: "Adicione pelo menos um item." });
            }

            let fornecedorModel = new PessoaJuridicaModel();
            let fornecedor = await fornecedorModel.obterPorId(Number(idFornecedor));

            if (!fornecedor) {
                return res.status(400).send({ ok: false, msg: "Fornecedor não encontrado." });
            }

            let loteModel = new LoteModel();
            let produtoModel = new ProdutoModel();
            let itensCompra = [];
            let totalCentavos = 0;

            for (let item of itens) {
                if (!item) {
                    return res.status(400).send({ ok: false, msg: "Item de compra inválido." });
                }

                let qtd100 = paraCentesimos(item.qtd);
                let custoCentavos = paraCentesimos(item.valorUnitario);

                if (!Number.isFinite(qtd100) || qtd100 <= 0 ||
                    !Number.isFinite(custoCentavos) || custoCentavos <= 0) {
                    return res.status(400).send({
                        ok: false,
                        msg: "Informe uma quantidade e um custo unitário maiores que zero."
                    });
                }

                let idProduto;
                let idLote = null;
                let novoLote = null;
                let chaveLote;

                if (item.idLote != null) {
                    if (!/^\d+$/.test(String(item.idLote)) ||
                        Number(item.idLote) <= 0 || item.novoLote) {
                        return res.status(400).send({ ok: false, msg: "Confira o lote selecionado." });
                    }

                    let lote = await loteModel.obterLoteId(Number(item.idLote));

                    if (!lote) {
                        return res.status(400).send({ ok: false, msg: "Lote não encontrado." });
                    }

                    idLote = lote.COD_LOTE;
                    idProduto = lote.COD_PROD;
                    chaveLote = `lote-${idLote}`;

                    if (item.idProduto != null && Number(item.idProduto) !== Number(idProduto)) {
                        return res.status(400).send({
                            ok: false,
                            msg: "O lote pertence a outro produto."
                        });
                    }

                } else {
                    novoLote = item.novoLote;
                    idProduto = Number(item.idProduto);

                    if (!Number.isInteger(idProduto) || idProduto <= 0 ||
                        typeof novoLote?.numeroLote !== "string" || !novoLote.numeroLote.trim()) {
                        return res.status(400).send({
                            ok: false,
                            msg: "Informe o produto e o número do novo lote."
                        });
                    }

                    let numero = novoLote.numeroLote.trim().toUpperCase();
                    let fabricacao = novoLote.dataFabricacao;
                    let validade = novoLote.dataVencimento;

                    if (!dataValidaCompra(validade) ||
                        (fabricacao && (!dataValidaCompra(fabricacao) || fabricacao >= validade))) {
                        return res.status(400).send({
                            ok: false,
                            msg: "Confira as datas de fabricação e validade do novo lote."
                        });
                    }

                    let cadastrados = await loteModel.listarLoteProduto(idProduto);
                    let jaExiste = cadastrados.some(lote =>
                        String(lote.NUM_LOTE).trim().toUpperCase() === numero
                    );

                    if (jaExiste) {
                        return res.status(400).send({
                            ok: false,
                            msg: "Esse lote já existe. Selecione o lote cadastrado."
                        });
                    }

                    chaveLote = `novo-${idProduto}-${numero}`;
                }

                let produto = await produtoModel.obterProdutoId(idProduto);

                if (!produto) {
                    return res.status(400).send({ ok: false, msg: "Produto não encontrado." });
                }

                let quantidade = qtd100 / 100;

                if (produto.UNI_MEDIDA_PROD === "UN" && !Number.isInteger(quantidade)) {
                    return res.status(400).send({
                        ok: false,
                        msg: "Informe uma quantidade inteira para produtos vendidos em unidade."
                    });
                }

                if (itensCompra.some(linha => linha.chaveLote === chaveLote)) {
                    return res.status(400).send({
                        ok: false,
                        msg: "O mesmo lote foi adicionado duas vezes."
                    });
                }

                let subtotalCentavos = Math.round(qtd100 * custoCentavos / 100);
                totalCentavos += subtotalCentavos;

                if (subtotalCentavos < 1 || totalCentavos > 9999999999) {
                    return res.status(400).send({ ok: false, msg: "Confira o valor dos itens da compra." });
                }

                itensCompra.push({
                    idProduto,
                    idLote,
                    novoLote,
                    chaveLote,
                    quantidade,
                    valorUnitario: custoCentavos / 100
                });
            }

            let pagoCentavos = paraCentesimos(valorPago);

            if (!Number.isFinite(pagoCentavos) || pagoCentavos < 0 || !Array.isArray(parcelas)) {
                return res.status(400).send({ ok: false, msg: "Confira os dados de pagamento." });
            }

            let somaCentavos = pagoCentavos;
            let contas = [];

            for (let parcela of parcelas) {
                let valorCentavos = paraCentesimos(parcela?.valor);

                if (!Number.isFinite(valorCentavos) || valorCentavos <= 0 ||
                    !dataValidaCompra(parcela?.dataVencimento)) {
                    return res.status(400).send({
                        ok: false,
                        msg: "Confira o valor e o vencimento de cada parcela."
                    });
                }

                somaCentavos += valorCentavos;

                contas.push({
                    valor: valorCentavos / 100,
                    vencimento: parcela.dataVencimento
                });
            }

            if (somaCentavos !== totalCentavos) {
                return res.status(400).send({
                    ok: false,
                    msg: "O valor pago mais as parcelas deve ser igual ao total da compra."
                });
            }

            etapa = "cadastrar a compra";

            let compra = new CompraModel(
                0, fornecedor.COD_PESSOA, dataCompra, totalCentavos / 100
            );

            let idGerado = await compra.cadastrarCompra();

            if (!Number.isInteger(idGerado) || idGerado <= 0) {
                throw new Error("Não foi possível obter o código da compra.");
            }

            codCompra = idGerado;

            for (let dados of itensCompra) {
                if (dados.novoLote) {
                    etapa = "cadastrar o lote " + dados.novoLote.numeroLote;

                    let novo = dados.novoLote;
                    let lote = new LoteModel(
                        0,
                        dados.idProduto,
                        null,
                        novo.numeroLote.trim(),
                        novo.dataFabricacao || null,
                        novo.dataVencimento,
                        0
                    );

                    let loteSalvo = await lote.cadastrarLote();

                    if (!loteSalvo || !lote.COD_LOTE) {
                        throw new Error("Não foi possível cadastrar o lote.");
                    }

                    dados.idLote = lote.COD_LOTE;
                }

                etapa = "gravar o item do lote " + dados.idLote;

                let itemCompra = new ItemCompraModel(
                    codCompra,
                    dados.idProduto,
                    dados.idLote,
                    dados.quantidade,
                    dados.valorUnitario
                );

                let itemSalvo = await itemCompra.cadastrarItemCompra();

                if (!itemSalvo) {
                    throw new Error("Não foi possível gravar o item da compra.");
                }
            }

            for (let i = 0; i < contas.length; i++) {
                etapa = `gravar a parcela ${i + 1}`;

                let conta = new ContasPagarModel(
                    codCompra,
                    contas[i].vencimento,
                    null,
                    contas[i].valor,
                    "PENDENTE",
                    i + 1
                );

                let salva = await conta.cadastrarParcela();

                if (!salva) {
                    throw new Error("Não foi possível cadastrar a parcela.");
                }
            }

            for (let dados of itensCompra) {
                etapa = "atualizar o estoque do lote " + dados.idLote;

                let estoqueAtualizado = await loteModel.adicionarEstoque(
                    dados.idLote,
                    dados.idProduto,
                    dados.quantidade
                );

                if (!estoqueAtualizado) {
                    throw new Error("Não foi possível atualizar o estoque.");
                }
            }

            etapa = "concluir a compra";

            let compraConcluida = await compra.concluirCompra(codCompra);

            if (!compraConcluida) {
                throw new Error("Não foi possível concluir a compra.");
            }

            return res.status(201).send({
                ok: true,
                codCompra,
                msg: "Compra nº " + codCompra + " registrada com sucesso!"
            });

        } catch (erro) {
            console.error(`Erro ao ${etapa}`, codCompra, erro.message);

            return res.status(500).send({
                ok: false,
                codCompra,
                etapa,
                msg: `Falha ao ${etapa}. Confira os registros antes de reenviar.`
            });
        }
    }
    // promocao

    async rotaPromocoes(req, res) {
        let promocaoModel = new PromocaoModel();
        let itemPromoModel = new ItemPromoModel();
        let categoriaModel = new CategoriaModel();
        let marcaModel = new MarcaModel();

        let promocoes = await promocaoModel.listarPromocoes();
        let itens = await itemPromoModel.listarItemPromo();
        let lotes = await itemPromoModel.listarLotesVencPromocao();
        let categorias = await categoriaModel.listarCategoria();
        let marcas = await marcaModel.listarMarcas();

        res.render("admin/gerenciarPromocoes", {
            promocoes,
            itens,
            lotes,
            categorias,
            marcas
        });
    }

    async rotaCadastrarPromocao(req, res) {
        let nome = req.body.nome;
        let percentual = req.body.percentual;
        let inicio = req.body.inicio;
        let fim = req.body.fim;
        let idLotes = req.body.lotes;
        let fun = req.cookies.UserLogado;

        if (!fun || fun <= 0) {
            return res.send({
                ok: false,
                msg: "Funcionário inválido."
            });
        }

        if (nome.trim() == "" || nome.trim().length > 100) {
            return res.send({
                ok: false,
                msg: "Informe um nome de até 100 caracteres."
            });
        }

        if (percentual <= 0 || percentual > 100) {
            return res.send({
                ok: false,
                msg: "Informe um desconto maior que zero e até 100%."
            });
        }

        if (!inicio || !fim || fim < inicio) { // a ser ajustado
            return res.send({
                ok: false,
                msg: "Informe datas válidas."
            });
        }

        if (idLotes.length <= 0) {
            return res.send({
                ok: false,
                msg: "Selecione pelo menos um lote."
            });
        }

        let itemPromoModel = new ItemPromoModel();
        let lotesDisponiveis = await itemPromoModel.listarLotesVencPromocao();
        let selec = [];

        for (let i = 0; i<idLotes.length;i++) {
            let id = idLotes[i];

            if (!id || id <= 0) {
                return res.send({
                    ok: false,
                    msg: "Lote inválido."
                });
            }

            for (let j = 0; j<selec.length; j++) {
                if (selec[j].COD_LOTE == id) {
                    return res.send({
                        ok: false,
                        msg: "O mesmo lote foi enviado mais de uma vez."
                    })
                }
            }
        
            let lote = null;

            for (let j = 0; j<lotesDisponiveis.length;j++) {
                if (lotesDisponiveis[j].COD_LOTE == id) {
                    lote = lotesDisponiveis[j];
                    j = 9999;
                }
            }

            if (!lote || lote.DATA_VENC_LOTE < inicio) {
                return res.send({
                    ok: false,
                    msg: "Um dos lotes está indisponível."
                });
            }

            let preco = lote.VALOR_UNI_PROD;

            if (!preco || preco <= 0) {
                return res.send({
                    ok: false,
                    msg: "Um dos produtos está com o preço inválido."
                });
            }

            selec.push(lote);
        }

        let promocao = new PromocaoModel(0, fun, nome.trim(), "Manual", null, percentual, inicio, fim);

        let salvou = await promocao.cadastrarPromocao();

        if (!salvou) {
            return res.send({
                ok: false,
                msg: "Não foi possível cadastrar a promoção."
            });
        }

        for (let i = 0; i < selec.length;i++) {
            let lote = selec[i];

            let precoCentavos = Math.round(lote.VALOR_UNI_PROD * 100);
            let percentCentesimos = Math.round(percentual * 100);
            let valor = Math.round(precoCentavos * (10000 - percentCentesimos) / 10000) / 100;

            let item = new ItemPromoModel(promocao.COD_PROMO, lote.COD_PROD, lote.COD_LOTE, valor);

            let salvouItem = await item.cadastrarItemPromo();

            if (!salvouItem) {
                await itemPromoModel.excluirPorPromocao(promocao.COD_PROMO);
                await promocao.excluirPromocao(promocao.COD_PROMO);

                return res.send({
                    ok: false,
                    msg: "Não foi possível registrar os itens da promoção."
                });
            }
        }

        return res.send({
            ok: true,
            msg: "Promoção cadastrada com sucesso!"
        });
    }

    async rotaExcluirPromocao(req, res) {
        let id = Number(req.body.id);

        if (!id || id <= 0) {
            return res.send({
                ok: false,
                msg: "Promoção inválida."
            });
        }

        let item = new ItemPromoModel();
        let promocao = new PromocaoModel();

        await item.excluirPorPromocao(id);
        let excluiu = await promocao.excluirPromocao(id);

        return res.send({
            ok: excluiu,
            msg: excluiu ? "Promoção excluída!" : "Não foi possível excluir a promoção."
        });
    }
}

module.exports = adminController;