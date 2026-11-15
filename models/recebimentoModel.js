const Database = require("../database/database");

class RecebimentoModel {
    #COD_REC;
    #COD_PED;
    #DATA_REC;
    #VALOR_REC;

    constructor(id, cod_ped, data, valor) {
        this.#COD_REC = id;
        this.#COD_PED = cod_ped;
        this.#DATA_REC = data;
        this.#VALOR_REC = valor;
    }

    get COD_REC() { return this.#COD_REC; }
    set COD_REC(v) { this.#COD_REC = v; }

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get DATA_REC() { return this.#DATA_REC; }
    set DATA_REC(v) { this.#DATA_REC = v; }

    get VALOR_REC() { return this.#VALOR_REC; }
    set VALOR_REC(v) { this.#VALOR_REC = v; }

    async cadastrarRecebimento() {
        let sql = "INSERT INTO RECEBIMENTO (COD_PED, DATA_REC, VALOR_REC) VALUES (?, ?, ?, ?)";
        let values = [this.#COD_PED, this.#DATA_REC, this.#VALOR_REC];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarRecebimentos() {
        let sql = "SELECT * FROM RECEBIMENTO";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let recebimento = new RecebimentoModel(
                linha["COD_REC"],
                linha["COD_PED"],
                linha["DATA_REC"],
                linha["VALOR_REC"]
            );
            lista.push(recebimento);
        }

        return lista;
    }

    async atualizarRecebimento() {
        let sql = "UPDATE RECEBIMENTO SET COD_PED = ?, DATA_REC = ?, VALOR_REC = ? WHERE COD_REC = ?";
        let values = [this.#COD_PED, this.#DATA_REC, this.#VALOR_REC, this.#COD_REC];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirRecebimento(id) {
        let sql = "DELETE FROM RECEBIMENTO WHERE COD_REC = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterRecebimentoId(id) {
        let sql = "SELECT * FROM RECEBIMENTO WHERE COD_REC = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let recebimento = new RecebimentoModel(linha["COD_REC"], linha["COD_PED"], linha["DATA_REC"], linha["VALOR_REC"]);

            return recebimento;
        }

        return null;
    }
}

module.exports = RecebimentoModel;
