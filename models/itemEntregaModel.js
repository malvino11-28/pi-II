const Database = require("../database/database");

const db = new Database();

class ItemEntregaModel {
    #COD_PROD;
    #COD_LOTE;
    #COD_ENT;

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    get COD_ENT() { return this.#COD_ENT; }
    set COD_ENT(v) { this.#COD_ENT = v; }

    constructor(codProd, codLote, codEnt) {
        this.#COD_PROD = codProd;
        this.#COD_LOTE = codLote;
        this.#COD_ENT = codEnt;
    }

    async cadastrarItemEntrega() {
        let sql = "INSERT INTO ITEM_ENTREGA (COD_PROD, COD_LOTE, COD_ENT) VALUES (?, ?, ?)";
        let values = [this.#COD_PROD, this.#COD_LOTE, this.#COD_ENT];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarItemEntrega() {
        let sql = "SELECT * FROM ITEM_ENTREGA WHERE COD_ENT = ?";
        let value = [this.#COD_ENT];

        let rows = await db.ExecutaComando(sql, value);
        let lista = [];
        for (let i = 0; i<rows.length;i++) {
            let row = rows[i];
            let itemEntrega = new ItemEntregaModel(row["COD_PROD"], row["COD_LOTE"], row["COD_ENT"]);
            lista.push(itemEntrega);
        }
        
        return lista;
    }

    async atualizarItemEntrega() {
        let sql = "UPDATE ITEM_ENTREGA SET COD_PROD = ?, COD_LOTE = ? WHERE COD_ENT = ?";
        let value = [this.#COD_ENT];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        return result;
    }

    async excluirItemEntrega(id) {
        let sql = "DELETE FROM ITEM_ENTREGA WHERE COD_ENT = ?";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        return result;
    }
}

module.exports = ItemEntregaModel;