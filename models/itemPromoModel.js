const Database = require("../database/database");

const db = new Database;

class ItemPromoModel {
    #COD_PROMO;
    #COD_PROD;
    #COD_LOTE;
    #VALOR_PROMO;

    constructor(codPromo, codProd, codLote, valor) {
        this.#COD_PROMO = codPromo;
        this.#COD_PROD = codProd;
        this.#COD_LOTE = codLote;
        this.#VALOR_PROMO = valor;
    }

    async cadastrarItemPromo() {
        let sql = "INSERT INTO ITEM_PROMO (COD_PROMO, COD_PROD, COD_LOTE, VALOR_PROMO) VALUES (?, ?, ?, ?)";
        let values = [this.#COD_PROMO, this.#COD_PROD, this.#COD_LOTE, this.#VALOR_PROMO];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarItemPromo() {
        let sql = "SELECT * FROM ITEM_PROMO WHERE COD_LOTE = ?";
        let value = [this.#COD_LOTE];

        let rows = await db.ExecutaComando(sql, value);
        let lista = [];

        for (let i = 0;i<rows.length;i++) {
            let row = rows[i];
            let itemPromo = new ItemPromoModel(row["COD_PROMO"], row["COD_PROD"], row["COD_LOTE"], row["VALOR_PROMO"]);
            lista.push(itemPromo);
        }

        return lista;
    }

    async excluirItemPromo(id) {
        let sql = "DELETE FROM ITEM_PROMO WHERE COD_LOTE = ?";
        let value = [id];

        let result = db.ExecutaComandoNonQuery(sql, value);
        return result;
    }
}

module.exports = ItemPromoModel;