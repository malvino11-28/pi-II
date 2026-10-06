const Database = require("../database/database");

class CategoriaModel {
  #COD_CAT;
  #NOME_CAT;

  get cod_cat() {
    return this.#COD_CAT;
  }
  set cod_cat(v) {
    this.#COD_CAT = v;
  }

  get nome_cat() {
    return this.#NOME_CAT;
  }
  set nome_cat(v) {
    this.#NOME_CAT = v;
  }

  constructor(cod, nome) {
    this.#COD_CAT = cod;
    this.#NOME_CAT = nome;
  }

  async listarCategoria() {
    let sql = "SELECT * FROM CATEGORIA";
    let db = new Database();
    let rows = await db.ExecutaComando(sql);
    let lista = [];

    console.log(rows);

    for (let i = 0; i < rows.length; i++) {
      lista.push(rows[i]);
    }

    return lista;
  }

  async cadastrarCategoria() {
    let sql = "INSERT INTO CATEGORIA (COD_CAT, NOME_CAT) VALUES (?, ?)";
    let values = [this.#COD_CAT, this.#NOME_CAT];
    let db = new Database();
    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }

  async excluirCategoria(id) {
    let sql = "DELETE FROM CATEGORIA WHERE COD_CAT = ?";
    let value = [id];
    let db = new Database();
    let result = await db.ExecutaComandoNonQuery(sql, value);

    return result;
  }

  async atualizarCategoria() {
    let sql = "UPDATE CATEGORIA SET NOME_CAT = ? WHERE COD_CAT = ?";
    let db = new Database();
    let values = [this.#NOME_CAT, this, this.#COD_CAT];
    let result = await db.ExecutaComandoNonQuery(sql, values);

    return result;
  }

  async obterPorId(id) {
    let sql = "SELECT * FROM CATEGORIA WHERE COD_CAT = ?"
    let value = [id];
    
    let db = new Database();
    let rows = await db.ExecutaComando(sql, value);

    if (rows.length > 0) {
        let row = rows[0];

        let categoria = new CategoriaModel(row["COD_CAT"], row["NOME_CAT"]);

        return categoria;
    }

    return null;
  }
}

module.exports = CategoriaModel;
