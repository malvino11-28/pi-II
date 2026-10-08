const Database = require("../database/database");

class MarcaModel {
  #COD_MAR;
  #NOME_MAR;

  get COD_MAR() {
    return this.#COD_MAR;
  }
  set COD_MAR(v) {
    this.#COD_MAR = v;
  }

  get NOME_MAR() {
    return this.#NOME_MAR;
  }
  set NOME_MAR(v) {
    this.#NOME_MAR = v;
  }

  constructor(cod, nome) {
    this.#COD_MAR = cod;
    this.#NOME_MAR = nome;
  }

  async cadastrarMarca() {
    let sql = "INSERT INTO MARCA (COD_MAR, NOME_MAR) VALUES (?, ?)";
    let values = [this.#COD_MAR, this.#NOME_MAR];
    let db = new Database();
    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }

  async listarMarcas() {
    let sql = "SELECT * FROM MARCA;";
    let db = new Database();
    let linhas = await db.ExecutaComando(sql);
    let lista = [];
    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i];
      lista.push(linha);
    }

    return lista;
  }

  async excluirMarca(id) {
    let sql = "DELETE FROM MARCA WHERE COD_MAR = ?";
    let db = new Database();
    let value = [id];
    let result = await db.ExecutaComandoNonQuery(sql, value);

    return result;
  }

  async atualizarMarca() {
    let sql = "UPDATE MARCA SET NOME_MAR = ? WHERE COD_MAR = ?";
    let db = new Database();
    let values = [this.#NOME_MAR, this.#COD_MAR];
    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }

  async obterMarcaId(id) {
    let sql = "SELECT * FROM MARCA WHERE COD_MAR = ?";
    let value = [id];

    let db = new Database();
    let rows = await db.ExecutaComando(sql, value)
  
    if (rows.length > 0) {
      let row = rows[0];

      let marca = new MarcaModel(row["COD_MAR"], row["NOME_MAR"]);

      return marca;
    }

    return null;
  }
}

module.exports = MarcaModel;