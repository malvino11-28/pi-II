const Database = require("../database/database");

class ProdutoModel {
  #COD_PROD;
  #COD_MAR; // marca fk
  #COD_CAT; // categoria fk
  #NOME_PROD;
  #DESC_RED_PROD; // descricao reduzida
  #DESC_PROD;
  #UNI_MEDIDA_PROD;
  #VALOR_UNI_PROD;

  get COD_PROD() {
    return this.#COD_PROD;
  }
  set COD_PROD(v) {
    this.#COD_PROD = v;
  }

  get COD_MAR() {
    return this.#COD_MAR;
  }
  set COD_MAR(v) {
    this.#COD_MAR = v;
  }

  get COD_CAT() {
    return this.#COD_CAT;
  }
  set COD_CAT(v) {
    this.#COD_CAT = v;
  }

  get NOME_PROD() {
    return this.#NOME_PROD;
  }
  set NOME_PROD(v) {
    this.#NOME_PROD = v;
  }

  get DESC_RED_PROD() {
    return this.#DESC_RED_PROD;
  }
  set DESC_RED_PROD(v) {
    this.#DESC_RED_PROD = v;
  }

  get DESC_PROD() {
    return this.#DESC_PROD;
  }
  set DESC_PROD(v) {
    this.#DESC_PROD = v;
  }

  get UNI_MEDIDA_PROD() {
    return this.#UNI_MEDIDA_PROD;
  }
  set UNI_MEDIDA_PROD(v) {
    this.#UNI_MEDIDA_PROD = v;
  }

  get VALOR_UNI_PROD() {
    return this.#VALOR_UNI_PROD;
  }
  set VALOR_UNI_PROD(v) {
    this.#VALOR_UNI_PROD = v;
  }

  constructor(cod_prod, cod_mar, cod_cat, nome, desc, desc_red, uni, valor) {
    this.#COD_PROD = cod_prod;
    this.#COD_MAR = cod_mar;
    this.#COD_CAT = cod_cat;
    this.#NOME_PROD = nome;
    this.#DESC_PROD = desc;
    this.#DESC_RED_PROD = desc_red;
    this.#UNI_MEDIDA_PROD = uni;
    this.#VALOR_UNI_PROD = valor;
  }

  async listarProdutos() {
    let sql = "SELECT * FROM PRODUTO"
    let db = new Database();
    let linhas = await db.ExecutaComando(sql);
    let lista = [];

    for (let i = 0;i<linhas.length;i++) {
      let linha = linhas[i];
      let produto = new ProdutoModel(linha['COD_PROD'], linha['COD_MAR'], linha['COD_CAT'], linha['NOME_PROD'], linha['DESC_PROD'], linha['DESC_RED_PROD'], linha['UNI_MEDIDA_PROD'], linha['VALOR_UNI_PROD']);
      
      lista.push(produto);
    }
  }

  async cadastrarProduto() {
    let sql = "INSERT INTO PRODUTO (COD_MAR, COD_CAT, NOME_PROD, DESC_PROD, DESC_RED_PROD, UNI_MEDIDA_PROD, VALOR_UNI_PROD) VALUES (?, ?, ?, ?, ?, ?, ?)"
    let values = [this.#COD_MAR, this.#COD_CAT, this.#NOME_PROD, this.#DESC_PROD, this.#DESC_RED_PROD, this.#UNI_MEDIDA_PROD, this.#VALOR_UNI_PROD];
    let db = new Database();

    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }

  async obterPorId(id) {
    let sql = "SELECT * FROM PRODUTO WHERE COD_PROD = ?";
    let value = [id];
    let db = new Database();

    let linhas = await db.ExecutaComando(sql, values);

    if (linhas.length > 0) {
      let linha = linhas[0];
      
      let produto = new ProdutoModel(linha['COD_PROD'], linha['COD_MAR'], linha['COD_CAT'], linha['NOME_PROD'], linha['DESC_PROD'], linha['DESC_RED_PROD'], linha['UNI_MEDIDA_PROD'], linha['VALOR_UNI_PROD']);
      return produto;
    }
    return null;
  }

  async excluirProduto(id) {
    let sql = "DELETE FROM PRODUTO WHERE COD_PROD = ?";
    let value = [id];
    let db = new Database();

    let result = await db.ExecutaComandoNonQuery(sql, value);

    return result;
  }

  async atualizarProduto() {
    let sql = "UPDATE PRODUTO SET COD_MAR = ?, COD_CAT = ?, NOME_PROD = ?, DESC_PROD = ?, DESC_RED_PROD = ?, UNI_MEDIDA_PROD = ?, VALOR_UNI_PROD = ?";
    let values = [this.#COD_MAR, this.#COD_CAT, this.#NOME_PROD, this.#DESC_PROD, this.#DESC_RED_PROD, this.#UNI_MEDIDA_PROD, this.#VALOR_UNI_PROD];
    let db = new Database();

    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }
}

module.exports = ProdutoModel;

// COD_PROD INT PRIMARY KEY AUTO_INCREMENT,
// COD_MAR INT NOT NULL,
// COD_CAT INT NOT NULL,

// NOME_PROD VARCHAR(100) NOT NULL,
// DESC_RED_PROD VARCHAR(255) NOT NULL,
// DESC_PROD TEXT NOT NULL,

// UNI_MEDIDA_PROD ENUM('KG', 'G', 'UN', 'L', 'ML') NOT NULL,
// VALOR_UNI_PROD NUMERIC(6, 2) NOT NULL,

// CONSTRAINT fk_prod_mar
//     FOREIGN KEY (COD_MAR)
//     REFERENCES MARCA (COD_MAR),

// CONSTRAINT fk_prod_cat
//     FOREIGN KEY (COD_CAT)
//     REFERENCES CATEGORIA (COD_CAT),
