const CategoriaModel = require("../models/categoriaModel");
const ClienteModel = require("../models/clienteModel");
const FornecedorModel = require("../models/fornecedorModel");
const ProdutoModel = require("../models/produtoModel");
const MarcaModel = require("../models/marcaModel");

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
    if (req.body.nome != "") {
      let categoria = new CategoriaModel(0, req.body.nome);
      let result = await categoria.cadastrarCategoria();
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
    let id = req.body.id;
    let categoria = new CategoriaModel();

    categoria = await categoria.obterPorId(id);
    res.render("admin/gerenciamentoCateogira", { catAlteracao: categoria }); //
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

  // ==================== MARCA
  async rotaGerenciarMarca(req, res) {
    let marca = new MarcaModel();
    let listaMarcas = await marca.listarMarcas();
    res.render("admin/gerenciamentoMarca", {
      marcas: listaMarcas,
    });
  }

  async rotaCadastrarMarca(req, res) {
    if (req.body.nome != "") {
      let marca = new MarcaModel(0, req.body.nome);
      let result = await marca.cadastrarMarca();
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
    res.render("admin/alterarMarca");
  }

  // =================== MARCA -
}

module.exports = adminController;
