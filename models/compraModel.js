const Database = require("../database/database");

class CompraModel {
    #COD_COMPRA;
    #COD_PESSOA;
    #DATA_COMPRA;
    #TOTAL_COMPRA;

    constructor(id, cod_pessoa, data, total) {
        this.#COD_COMPRA = id;
        this.#COD_PESSOA = cod_pessoa;
        this.#DATA_COMPRA = data;
        this.#TOTAL_COMPRA = total;
    }

    get COD_COMPRA() { return this.#COD_COMPRA; }
    set COD_COMPRA(v) { this.#COD_COMPRA = v; }

    get COD_PESSOA() { return this.#COD_PESSOA; }
    set COD_PESSOA(v) { this.#COD_PESSOA = v; }

    get DATA_COMPRA() { return this.#DATA_COMPRA; }
    set DATA_COMPRA(v) { this.#DATA_COMPRA = v; }

    get TOTAL_COMPRA() { return this.#TOTAL_COMPRA; }
    set TOTAL_COMPRA(v) { this.#TOTAL_COMPRA = v; }

    async cadastrarCompra() {
        let sql = "INSERT INTO COMPRA (COD_PESSOA, DATA_COMPRA, TOTAL_COMPRA) VALUES (?, ?, ?)";
        let values = [this.#COD_PESSOA, this.#DATA_COMPRA, this.#TOTAL_COMPRA];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarCompras() {
        let sql = "SELECT * FROM COMPRA";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let compra = new CompraModel(linha["COD_COMPRA"], linha["COD_PESSOA"], linha["DATA_COMPRA"], linha["TOTAL_COMPRA"]);

            lista.push(compra);
        }

        return lista;
    }

    async atualizarCompra() {
        let sql = "UPDATE COMPRA SET COD_PESSOA = ?, DATA_COMPRA = ?, TOTAL_COMPRA = ? WHERE COD_COMPRA = ?";
        let values = [this.#COD_PESSOA, this.#DATA_COMPRA, this.#TOTAL_COMPRA, this.#COD_COMPRA];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirCompra(id) {
        let sql = "DELETE FROM COMPRA WHERE COD_COMPRA = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterCompraId(id) {
        let sql = "SELECT * FROM COMPRA WHERE COD_COMPRA = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let compra = new CompraModel(linha["COD_COMPRA"], linha["COD_PESSOA"], linha["DATA_COMPRA"], linha["TOTAL_COMPRA"]);

            return compra;
        }

        return null;
    }
}

module.exports = CompraModel;
