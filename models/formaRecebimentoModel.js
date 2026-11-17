const Database = require("../database/database");

const db = new Database;

class FormaRecebimentoModel {
    #COD_RECEB;
    #NOME_RECEB;

    get COD_RECEB() { return this.#COD_RECEB; }
    set COD_RECEB(v) { this.#COD_RECEB = v; }

    get NOME_RECEB() { return this.#NOME_RECEB; }
    set NOME_RECEB(v) { this.#NOME_RECEB = v; }

    constructor(idPag, nomePag) {
        this.#COD_RECEB = idPag;
        this.#NOME_RECEB = nomePag;
    }

    async listarFormas() {
        let sql = "SELECT * FROM FORMA_RECEBIMENTO ORDER BY COD_RECEB";

        let linhas = await db.ExecutaComando(sql);
        return linhas;
    }

    async obterPorId(id) {
        let sql = "SELECT * FROM FORMA_RECEBIMENTO WHERE COD_RECEB = ?";
        let values = [id];

        let linhas = await db.ExecutaComando(sql, values);
        if (linhas.length > 0) {
            return linhas[0];
        }
        return null;
    }
}

module.exports = FormaRecebimentoModel;
