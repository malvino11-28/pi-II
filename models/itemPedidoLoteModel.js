const Database = require("../database/database");

const db = new Database();

class ItemPedidoLoteModel {
    #COD_PED;
    #COD_PROD;
    #COD_LOTE;
    #QTD_LOTE;

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get QTD_LOTE() { return this.#QTD_LOTE; }
    set QTD_LOTE(v) { this.#QTD_LOTE = v; }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    constructor(idPed, idProd, qtdLote, idLote) {
        this.#COD_PED = idPed;
        this.#COD_PROD = idProd;
        this.#COD_LOTE = idLote;
        this.#QTD_LOTE = qtdProd;
    }

    async salvarItemPedidoLote() {
        let sql = "INSERT INTO ITEM_PEDIDO (COD_PED, COD_PROD, QTD_LOTE, COD_LOTE) VALUES (?, ?, ?, ?)";

        let values = [
            this.#COD_PED,
            this.#COD_PROD,
            this.#QTD_LOTE,
            this.#COD_LOTE
        ];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarItemPedidoLote() {

    }

    async atualizarItemPedidoLote() {

    }

    async excluirItemPedidoLote() {

    }
}

module.exports = ItemPedidoLoteModel;