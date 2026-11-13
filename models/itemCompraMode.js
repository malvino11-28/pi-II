const Database = require("../database/database.js");

const db = new Database;

class ItemCompraModel {
    #COD_COMPRA;
    #COD_PROD;
    #COD_LOTE;
    #QUANT_PROD;
    #VALOR_UNI_PROD;

    constructor(codCompra, codProd, codLote, qtdProd, valorUni) {
        this.#COD_COMPRA = codCompra;
        this.#COD_PROD = codProd;
        this.#COD_LOTE = codLote;
        this.#QUANT_PROD = qtdProd;
        this.#VALOR_UNI_PROD = valorUni;
    }

    async cadastrarItemCompra() {
        let sql = "INSERT INTO ITEM_COMPRA (COD_COMPRA, COD_PROD, COD_LOTE, QUANT_PROD, VALOR_UNI_PROD) VALUES (?, ?, ?, ?, ?)";
        let values = [this.#COD_COMPRA, this.#COD_PROD, this.#COD_LOTE, this.#QUANT_PROD, this.#VALOR_UNI_PROD];

        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarItemCompra() {
        let sql = "SELECT * FROM ITEM_COMPRA WHERE COD_COMPRA = ?";
        let value = [this.#COD_COMPRA];

        let rows = await db.ExecutaComandoNonQuery(sql, values);
        let lista = [];

        for (let i =0; i<rows.length;i++) {
            let row = rows[i];
            let itemCompra = new ItemCompraModel(row["COD_COMPRA"], row["COD_PROD"], row["COD_LOTE"], row["QUANT_PROD"], row["VALOR_UNI_PROD"]);
            lista.push(itemCompra);
        }

        return lista;
    }

    async atualizarItemCompra() {
        let sql = "UPDATE ITEM_COMPRA SET COD_PROD = ?, COD_LOTE = ?, QUANT_PROD = ? WHERE COD_COMPRA = ?";
        let values = [this.#COD_PROD, this.#COD_LOTE, this.QUANT_PROD, this.#COD_COMPRA];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async excluirItemCompra(id) {
        let sql = "DELETE FROM ITEM_COMPRA WHERE COD_COMPRA = ?";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);

        return result;
    }
}