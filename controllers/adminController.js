const CategoriaModel = require("../models/categoriaModel");
const ClienteModel = require("../models/clienteModel");
const FornecedorModel = require("../models/fornecedorModel");
const ProdutoModel = require("../models/produtoModel");
const MarcaModel = require("../models/marcaModel");
const LoteModel = require("../models/loteModel");

const {
  somenteNumeros,
  validarCPF,
  validarNomeCompleto,
  validarEmail,
  validarTelefone,
  validarSenha,
  validarDataNascimento,
} = require("../utils/validacoes");

class adminController {
  async rotaDashboardView(req, res) {
    let cliente = new ClienteModel();
    let produto = new ProdutoModel();
    let listaClientes = await cliente.listarClientes();
    let listaProdutos = await produto.listarProdutos();

    res.render("admin/dashboard", {
      clientes: listaClientes,
      produtos: listaProdutos,
    });
  }

  async rotaCadastrarClientesView(req, res) {
    let cliente = new ClienteModel();
    let listaClientes = await cliente.listarClientes();

    res.render("admin/cadastrarCliente", {
      clientes: listaClientes,
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

      if (!validarSenha(req.body.senha)) {
        erros.push("A senha deve ter ao menos 8 caracteres.");
      }

      if (erros.length > 0) {
        return res.status(400).send({
          ok: false,
          erros: erros,

    async rotaDashboardView(req, res) {

        let cliente = new ClienteModel();
        let listaClientes = await cliente.listarClientes();

        let fornecedor = new FornecedorModel();
        let listarFornecedores = await fornecedor.listarFornecedores()

        res.render("admin/dashboard", {
            clientes: listaClientes,
            fornecedores: listarFornecedores
        });
    }

    async rotaCadastrarClientesView(req, res) {
        let cliente = new ClienteModel();
        let listaClientes = await cliente.listarClientes();

        res.render("admin/cadastrarCliente", {
            clientes: listaClientes
        });
      }

      let cliente = new ClienteModel(
        0,
        req.body.nome.trim(),

        // Remove . e - antes de salvar.
        somenteNumeros(req.body.cpf),

        req.body.rg.trim(),

        // Continua em AAAA-MM-DD, como o input type="date" envia.
        req.body.dt_nasc,

        req.body.email.trim().toLowerCase(),

        // Remove (, ), espaço e - antes de salvar.
        somenteNumeros(req.body.cel),

        req.body.senha,
      );
            // Exige senha no cadastro ou quando uma nova senha é enviada na edição.
            if (!req.body.id || req.body.senha) {
                if (!validarSenha(req.body.senha)) {
                    erros.push("A senha deve ter ao menos 8 caracteres.");
                }
            }

      let retornoBan = await cliente.cadastrarCliente();

      return res.send({
        ok: retornoBan,
      });
    } catch (erro) {
      console.log(erro);

      return res.status(500).send({
        ok: false,
        erros: ["Erro interno ao cadastrar o cliente."],
      });
    }
  }

  async rotaExcluirCliente(req, res) {
    let idExclusao = req.body.id;
    if (idExclusao && idExclusao > 0) {
      let cliente = new ClienteModel();
      let result = cliente.excluirCliente(idExclusao);

      res.send({ ok: result });
    } else {
      res.send({ ok: false });
    }
  }

  async rotaCadastrarFornecedorView(req, res) {
    let fornecedor = new FornecedorModel();
    let listaFornecedores = await fornecedor.listarFornecedores();

    res.render("admin/fornecedor", {
      fornecedores: listaFornecedores,
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
      let fornecedor = new FornecedorModel(
        0,
        req.body.cnpj,
        req.body.razao,
        req.body.nomeFan,
        req.body.email,
        req.body.telefone,
      );
      let result = await fornecedor.cadastrarFornecedor();
      res.send({ ok: result });
    } else {
      res.send({ ok: false });
    }
  }

  // =========== GERENCIAR PRODUTO

  // =========== GERENCIAR CATEGORIA

  async rotaGerenciarCategoria(req, res) {
    let categoria = new CategoriaModel();
    let listaCategoria = await categoria.listarCategoria();
    console.log(listaCategoria);
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
    console.log(categoria)
    res.render("admin/alterarCategoria", { categoria }); //
  }

  // =========== GERENCIAR PRODUTO

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
      categorias: listaCategoria,
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
      categorias: listaCategoria,
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
      req.body.valor != ""
    ) {
      if (req.body.id > 0) {
        let produto = new ProdutoModel(
        req.body.id,
        req.body.marca,
        req.body.categoria,
        req.body.nome,
        req.body.desc,
        req.body.desc_red,
        req.body.uni,
        req.body.valor,
      );
        result = await produto.atualizarProduto();
      } else {
        let produto = new ProdutoModel(
        0,
        req.body.marca,
        req.body.categoria,
        req.body.nome,
        req.body.desc,
        req.body.desc_red,
        req.body.uni,
        req.body.valor,
      );
        result = await produto.cadastrarProduto();
      }
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

    let produtoId = await produto.obterProdutoId(id);
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
    res.render("admin/gerenciamentoMarca", {
      marcas: listaMarcas,
    });
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
            let cliente = new ClienteModel(
                0,
                req.body.nome.trim(),
                somenteNumeros(req.body.cpf),
                req.body.rg.trim(),
                req.body.dt_nasc,
                req.body.email.trim().toLowerCase(),
                somenteNumeros(req.body.cel),
                req.body.senha
            );

            let retornoBan = false;

            if(req.body.id) {
                cliente.COD_CLI = req.body.id;
                retornoBan = await cliente.atualizarCliente();

            } else {

                retornoBan = await cliente.cadastrarCliente();
            }

            res.send({ ok: retornoBan });
            
        } catch (erro) {
            console.log(erro);

      res.send({ ok: result });
    } else {
      res.send({ ok: false });
    }
  }

  async rotaAlterarMarca(req, res) {
    let id = req.params.id;
    let marca = new MarcaModel();
    async alterarClienteView(req, res) {

        let idCliente = req.params.id;
        let cliente = new ClienteModel();
        cliente = await cliente.obterPorId(idCliente);

        res.render("admin/alterarCliente", { cliAlter: cliente });
    }

    async rotaExcluirCliente(req, res) {

    marca = await marca.obterMarcaId(id);
    res.render("admin/alterarMarca", { marca });
  }

  async rotaGerenciamentoLote(req, res) {
    let idProduto = req.params.id;
            let cliente = new ClienteModel();
            let result = await cliente.excluirCliente(idExclusao);

    let produtoModel = new ProdutoModel();
    let loteModel = new LoteModel();

    let produto = await produtoModel.obterProdutoId(idProduto);
    let lotes = await loteModel.listarLoteProduto(idProduto);
        } else {

            res.send({ ok: false });
        }
    }

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

    if (idProduto > 0 && numeroLote.trim() != "" && dataVencimento != "" && estoque != "" && estoque > 0 && dataFabricacao != "" && dataVencimento > dataFabricacao) {
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
        if (
            req.body.razao != "" &&
            req.body.nomeFan != "" &&
            req.body.cnpj != "" &&
            req.body.email != "" &&
            req.body.telefone != ""
        ) {

            let fornecedor = new FornecedorModel(
                0,
                somenteNumeros(req.body.cnpj),
                req.body.razao.trim(),
                req.body.nomeFan.trim(),
                req.body.email.trim().toLowerCase(),
                somenteNumeros(req.body.telefone)
            );

            let retornoBan = false;

            if(req.body.id) {
                fornecedor.COD_FOR = req.body.id;
                retornoBan = await fornecedor.atualizarFornecedor();

            } else {

                retornoBan = await fornecedor.cadastrarFornecedor();
            }

            res.send({ ok: retornoBan });

        } else {
            
            res.send({ ok: false });
        }
    }

    async rotaAlterarFornecedorView(req, res) {
        
        let idFornecedor = req.params.id;
        let fornecedor = new FornecedorModel();
        fornecedor = await fornecedor.obterPorId(idFornecedor);

        res.render("admin/alterarFornecedor", {
            forAlter: fornecedor
        });
    }

    async rotaExcluirFornecedor(req, res) {

        let idExclusao = req.body.id;
        if(idExclusao && idExclusao > 0) {

            let fornecedor = new FornecedorModel();
            let result = await fornecedor.excluirFornecedor(idExclusao);

            res.send({ ok: result });
        
        } else {

            res.send({ ok: false });
        }
    }
  }

}

module.exports = adminController;
