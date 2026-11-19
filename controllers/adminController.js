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

class adminController {

    async rotaDashboardView(req, res) {
        let cliente = new PessoaFisicaModel();
        let pessoasFisicas = await cliente.listarPF();
        let listaClientes = pessoasFisicas.filter(pessoa => pessoa.EMAIL_PESSOA);

        let produtos = new ProdutoModel();
        let listarProdutos = await produtos.listarProdutos();

        let fornecedor = new PessoaJuridicaModel();
        let listarFornecedores = await fornecedor.listarPJ();

        res.render("admin/dashboard", {
            clientes: listaClientes,
            fornecedores: listarFornecedores,
            produtos: listarProdutos
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
        let descartes = itemDescModel.listarDescLote(id);

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
}

module.exports = adminController;