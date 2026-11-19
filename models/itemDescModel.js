const Database = require("../database/database.js");

const db = new Database;

class ItemDescModel {
    #COD_DESC;
    #COD_PROD;
    #COD_LOTE;
    #QTD_LOTE;
    #MOTIVO_DESC;

    constructor(idDesc, idProd, idLote, qtdLote, motivo) {
        this.#COD_DESC = idDesc;
        this.#COD_PROD = idProd;
        this.#COD_LOTE = idLote;
        this.#QTD_LOTE = qtdLote;
        this.#MOTIVO_DESC = motivo;
    }

    get COD_DESC() { return this.#COD_DESC; }
    set COD_DESC(v) { this.#COD_DESC = v; }
    
    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    get QTD_LOTE() { return this.#QTD_LOTE; }
    set QTD_LOTE(v) { this.#QTD_LOTE = v; }

    get MOTIVO_DESC() { return this.#MOTIVO_DESC; }
    set MOTIVO_DESC(v) { this.#MOTIVO_DESC = v; }

    async cadastrarItemDesc() {
        let sql = "INSERT INTO ITEM_DESC (COD_DESC, COD_PROD, COD_LOTE, QTD_LOTE, MOTIVO_DESC) VALUES (?, ?, ?, ?, ?)";
        let values = [this.#COD_DESC, this.#COD_PROD, this.#COD_LOTE, this.#QTD_LOTE, this.#MOTIVO_DESC];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarItemDesc() {
        let sql = "SELECT * FROM ITEM_DESC";

        let rows = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let itemDesc = new ItemDescModel(row["COD_DESC"], row["COD_PROD"], row["COD_LOTE"], row["QTD_LOTE"], row["MOTIVO_DESC"]);
            lista.push(itemDesc);
        }

        return lista;
    }

    async excluirItemDesc(id) {
        let sql = "DELETE FROM ITEM_DESC WHERE COD_DESC = ?";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        return result;
    }

    async listarDescLote(idLote) {
        let sql = `
            SELECT D.COD_DESC, D.DATA_DESC,
                I.QTD_LOTE, I.MOTIVO_DESC,
                PF.NOME_PF AS NOME_FUNCIONARIO
            FROM ITEM_DESC I
            INNER JOIN DESCARTE D ON D.COD_DESC = I.COD_DESC
            LEFT JOIN PESSOA_FISICA PF
                ON PF.COD_PESSOA = D.COD_PESSOA
            WHERE I.COD_LOTE = ?
            ORDER BY D.DATA_DESC DESC, D.COD_DESC DESC
        `;
        let value = [idLote];

        let result = await db.ExecutaComando(sql, value);
        return result;
    }
}

module.exports = ItemDescModel;