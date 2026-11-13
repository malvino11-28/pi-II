const Database = require("../database/database");

const db = new Database();

class ItemPedidoModel {
    #COD_PED;
    #COD_PROD;
    #QTD_PROD;
    #COD_PAG;
    #VALOR_UNI_PROD;
    // #SUBTOTAL_PED 

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get QTD_PROD() { return this.#QTD_PROD; }
    set QTD_PROD(v) { this.#QTD_PROD = v; }

    get VALOR_UNI_PROD() { return this.#VALOR_UNI_PROD; }
    set VALOR_UNI_PROD(v) { this.#VALOR_UNI_PROD = v; }

    constructor(idPed, idProd, qtdProd, idPag, valorUni) {
        this.#COD_PED = idPed;
        this.#COD_PROD = idProd;
        this.#QTD_PROD = qtdProd;
        this.#COD_PAG = idPag; // remover
        this.#VALOR_UNI_PROD = valorUni;
    }

    async salvarItemPedido() {
        let sql = "INSERT INTO ITEM_PEDIDO (COD_PED, COD_PROD, QTD_PROD, VALOR_UNI_PROD) VALUES (?, ?, ?, ?)";

        let values = [
            this.#COD_PED,
            this.#COD_PROD,
            this.#QTD_PROD,
            this.#VALOR_UNI_PROD
        ];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarItemPedido() {
        let sql = "SELECT * FROM ITEM_PEDIDO WHERE = ?";
        let value = [this.#COD_PED];

        let rows = await db.ExecutaComando(sql, value);
        let lista = [];

        for (let i = 0; i<rows.length;i++) {
            let row = rows[i];
            let itemPedido = new ItemPedidoModel(row[""], row[""], row[""], row[""]);
            lista.push(itemPedido);
        }
        
        return lista;
    }

    async atualizarItemPedido() {
        let sql = "UPDATE ITEM_PEDIDO SET COD_PROD = ?, QTD_PROD = ? WHERE COD_PED = ?";
        let values = [this.#COD_PROD, this.#QTD_PROD, this.#COD_PED];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async excluirItemPedido(id) {
        let sql = "DELETE FROM ITEM_PEDIDO WHERE COD_PED = ?";
        let value = [id];

        let result = await db.ExecutaComando(sql, value);
        return result;
    }
}

module.exports = ItemPedidoModel;