const mysql = require("mysql2");

class Database {
  #conexao;

  get conexao() {
    return this.#conexao;
  }
  set conexao(conexao) {
    this.#conexao = conexao;
  }

  constructor() {
    this.#conexao = mysql.createPool({
      host: "132.226.245.178", // a definir
      database: "PFS1_10442614130", // a definir
      user: "10442614130", // a definir
      password: "10442614130",
      idleTimeout: 30000,
      connectionLimit: 50,
    });
  }

  ExecutaComando(sql, valores) {
    var cnn = this.#conexao;
    return new Promise(function (res, rej) {
      cnn.query(sql, valores, function (error, results, fields) {
        if (error) rej(error);
        else res(results);
      });
    });
  }

  ExecutaComandoNonQuery(sql, valores) {
    var cnn = this.#conexao;
    return new Promise(function (res, rej) {
      cnn.query(sql, valores, function (error, results, fields) {
        if (error) rej(error);
        else res(results.affectedRows > 0);
      });
    });
  }

  ExecutaComandoLastInserted(sql, valores) {
    var cnn = this.#conexao;
    return new Promise(function (res, rej) {
      cnn.query(sql, valores, function (error, results, fields) {
        if (error) rej(error);
        else res(results.insertId);
      });
    });
  }
}

module.exports = Database;
