const Database = require("../database/database");

const db = new Database;

class FormaPagamentoModel {
    #COD_PAG;
    #NOME_PAG;

    constructor(idPag, nomePag) {
        this.#COD_PAG = idPag;
        this.#NOME_PAG = nomePag;
    }

    async listarFormasPagamento() {
        let sql = "SELECT * FROM FORMA_PAGAMENTO ORDER BY COD_PAG";

        let linhas = await db.ExecutaComando(sql);
        return linhas;
    }

    async obterPorId(id) {
        let sql = "SELECT * FROM FORMA_PAGAMENTO WHERE COD_PAG = ?";
        let values = [id];

        let linhas = await db.ExecutaComando(sql, values);
        if (linhas.length > 0) {
            return linhas[0];
        }
        return null;
    }
}

module.exports = FormaPagamentoModel;
