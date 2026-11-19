const Database = require("../database/database");

class compraModel {
    #COD_COMPRA;
    #COD_PESSOA;
    #DATA_COMPRA;
    #VALOR_TOTAL_COMPRA;
    #STATUS_COMPRA;

    constructor(codCompra, codPessoa, dataCompra, valorTotalCompra, statusCompra = "Pendente") {
        this.#COD_COMPRA = codCompra;
        this.#COD_PESSOA = codPessoa;
        this.#DATA_COMPRA = dataCompra;
        this.#VALOR_TOTAL_COMPRA = valorTotalCompra;
        this.#STATUS_COMPRA = statusCompra;
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

    get VALOR_TOTAL_COMPRA() {
        return this.#VALOR_TOTAL_COMPRA;
    }

    set VALOR_TOTAL_COMPRA(value) {
        this.#VALOR_TOTAL_COMPRA = value;
    }

    get STATUS_COMPRA() {
        return this.#STATUS_COMPRA;
    }

    async cadastrarCompra() {
        let sql = `
            INSERT INTO COMPRA (COD_PESSOA, DATA_COMPRA, VALOR_TOTAL_COMPRA)
            VALUES (?, ?, ?)
        `;

        let values = [
            this.#COD_PESSOA,
            this.#DATA_COMPRA,
            this.#VALOR_TOTAL_COMPRA
        ];

        let banco = new Database();
        let codCompra = await banco.ExecutaComandoLastInserted(sql, values);

        return codCompra;
    }

    async concluirCompra(codCompra) {
        let sql = `
            UPDATE COMPRA
            SET STATUS_COMPRA = 'Concluída'
            WHERE COD_COMPRA = ? AND STATUS_COMPRA = 'Pendente'
        `;

        let banco = new Database();
        let resultado = await banco.ExecutaComandoNonQuery(sql, [codCompra]);

        return resultado;
    }

    async listarCompras() {
        let sql = "SELECT * FROM COMPRA";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let linha of linhas) {
            let compra = new compraModel(
                linha.COD_COMPRA,
                linha.COD_PESSOA,
                linha.DATA_COMPRA,
                linha.VALOR_TOTAL_COMPRA,
                linha.STATUS_COMPRA
            );

            lista.push(compra);
        }

        return lista;
    }

    async atualizarCompra() {
        let sql = `
            UPDATE COMPRA
            SET COD_PESSOA = ?, DATA_COMPRA = ?, VALOR_TOTAL_COMPRA = ?
            WHERE COD_COMPRA = ?
        `;

        let values = [
            this.#COD_PESSOA,
            this.#DATA_COMPRA,
            this.#VALOR_TOTAL_COMPRA,
            this.#COD_COMPRA
        ];

        let banco = new Database();
        let resultado = await banco.ExecutaComandoNonQuery(sql, values);

        return resultado;
    }

    async excluirCompra(codCompra) {
        let sql = "DELETE FROM COMPRA WHERE COD_COMPRA = ?";
        let banco = new Database();
        let resultado = await banco.ExecutaComandoNonQuery(sql, [codCompra]);

        return resultado;
    }

    async obterCompraId(codCompra) {
        let sql = "SELECT * FROM COMPRA WHERE COD_COMPRA = ?";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, [codCompra]);

        if (linhas.length === 0) {
            return null;
        }

        let linha = linhas[0];

        return new compraModel(
            linha.COD_COMPRA,
            linha.COD_PESSOA,
            linha.DATA_COMPRA,
            linha.VALOR_TOTAL_COMPRA,
            linha.STATUS_COMPRA
        );
    }
}

module.exports = compraModel;