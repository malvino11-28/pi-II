const Database = require("../database/database");

class CompraModel {
    #COD_COMPRA;
    #COD_PESSOA;
    #DATA_COMPRA;
    #TOTAL_COMPRA;
    #STATUS_COMPRA;

    constructor(id, cod_pessoa, data, total, status = "Pendente") {
        this.#COD_COMPRA = id;
        this.#COD_PESSOA = cod_pessoa;
        this.#DATA_COMPRA = data;
        this.#TOTAL_COMPRA = total;
        this.#STATUS_COMPRA = status;
    }

    get COD_COMPRA() {
        return this.#COD_COMPRA;
    }

    set COD_COMPRA(value) {
        this.#COD_COMPRA = value;
    }

    get COD_PESSOA() {
        return this.#COD_PESSOA;
    }

    set COD_PESSOA(value) {
        this.#COD_PESSOA = value;
    }

    get DATA_COMPRA() {
        return this.#DATA_COMPRA;
    }

    set DATA_COMPRA(value) {
        this.#DATA_COMPRA = value;
    }

    get TOTAL_COMPRA() {
        return this.#TOTAL_COMPRA;
    }

    set TOTAL_COMPRA(value) {
        this.#TOTAL_COMPRA = value;
    }

    get STATUS_COMPRA() {
        return this.#STATUS_COMPRA;
    }

    async cadastrarCompra() {
        let sql = "INSERT INTO COMPRA (COD_PESSOA, DATA_COMPRA, TOTAL_COMPRA) VALUES (?, ?, ?)";
        let values = [this.#COD_PESSOA, this.#DATA_COMPRA, this.#TOTAL_COMPRA];
        let banco = new Database();
        let cod_compra = await banco.ExecutaComandoLastInserted(sql, values);

        return cod_compra;
    }

    async concluirCompra(codCompra) {
        let sql = "UPDATE COMPRA SET STATUS_COMPRA = 'Concluída' WHERE COD_COMPRA = ? AND STATUS_COMPRA = 'Pendente'";

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, [codCompra]);

        return result;
    }

    async listarCompras() {
        let sql = "SELECT * FROM COMPRA";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let compra = new CompraModel(linha["COD_COMPRA"], linha["COD_PESSOA"], linha["DATA_COMPRA"], linha["TOTAL_COMPRA"], linha["STATUS_COMPRA"]);

            lista.push(compra);
        }

        return lista;
    }

    async atualizarCompra() {
        let sql = "UPDATE COMPRA SET COD_PESSOA = ?, DATA_COMPRA = ?, TOTAL_COMPRA = ? WHERE COD_COMPRA = ?";
        let values = [this.#COD_PESSOA, this.#DATA_COMPRA, this.#TOTAL_COMPRA, this.#COD_COMPRA];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirCompra(id) {
        let sql = "DELETE FROM COMPRA WHERE COD_COMPRA = ?";
        let values = [id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterCompraId(id) {
        let sql = "SELECT * FROM COMPRA WHERE COD_COMPRA = ?";
        let values = [id];
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let compra = new CompraModel(linha["COD_COMPRA"], linha["COD_PESSOA"], linha["DATA_COMPRA"], linha["TOTAL_COMPRA"], linha["STATUS_COMPRA"]);

            return compra;
        }

        return null;
    }
}

module.exports = CompraModel;
