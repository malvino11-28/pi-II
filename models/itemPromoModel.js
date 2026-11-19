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
        let sql = "SELECT * FROM ITEM_PROMO";

        let rows = await db.ExecutaComando(sql);
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

    async listarLotesVencPromocao() {
        let sql = `SELECT L.COD_LOTE, L.COD_PROD, L.NUM_LOTE, L.EST_LOTE, DATE_FORMAT(L.DATA_VENC_LOTE, '%Y-%m-%d') AS DATA_VENC_LOTE
            P.NOME_PROD, P.VALOR_UNI_PROD, P.COD_CAT, P.COD_MAR, C.NOME_CAT, M.NOME_MAR
            FROM LOTE L
            INNER JOIN PRODUTO P ON P.COD_PROD = L.COD_PROD
            INNER JOIN CATEGORIA C ON C.COD_CAT = P.COD_CAT
            INNER JOIN MARCA M ON M.COD_MAR = P.COD_MAR
               WHERE L.EST_LOTE > 0 AND L.DATA_VENC_LOTE >= CURDATE()
               ORDER BY P.NOME_PROD, L.DATA_VENC_LOTE, L.COD_LOTE
        `;
        let result = await db.ExecutaComando(sql);
        return result;
    }

    async excluirPorPromocao(id) {
        let sql = "DELETE FROM ITEM_PROMO WHERE COD_PROMO = ?";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        return result;
    }
}

module.exports = ItemPromoModel;