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

  async listarMarca() {
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

  async excluirMarca() {
    let sql = "DELETE FROM MARCA WHERE COD_MAR = ?";
    let db = new Database();
    let value = [id];
    let result = db.ExecutaComandoNonQuery(sql, value);

    return result;
  }
}

module.exports = MarcaModel;

// CREATE TABLE MARCA (
//     COD_MAR INT PRIMARY KEY AUTO_INCREMENT,
//     NOME_MAR VARCHAR(50) NOT NULL UNIQUE
// );
