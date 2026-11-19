const Database = require("../database/database");

class DescarteModel { //
    #COD_DESC;
    #COD_PESSOA; // saber o funcionário responsável pelo descarte
    #DATA_DESC;

    constructor(id, idPessoa, data) {
        this.#COD_DESC = id;
        this.#COD_PESSOA = idPessoa;
        this.#DATA_DESC = data;
    }

    get COD_DESC() { return this.#COD_DESC; }
    set COD_DESC(v) { this.#COD_DESC = v; }

    get COD_PESSOA() { return this.#COD_PESSOA; }
    set COD_PESSOA(v) { this.#COD_PESSOA = v; }

    get DATA_DESC() { return this.#DATA_DESC; }
    set DATA_DESC(v) { this.#DATA_DESC = v; }

    async cadastrarDescarte() {
    let sql = "INSERT INTO DESCARTE (COD_PESSOA, DATA_DESC) VALUES (?, CURDATE())";

    let valores = [this.#COD_PESSOA];
    let db = new Database();

    let codigo = await db.ExecutaComandoLastInserted(sql, valores);

    if (codigo) {
        this.#COD_DESC = codigo;
        return true;
    }

    return false;
}

    async listarDescartes() {
        let sql = "SELECT * FROM DESCARTE";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let descarte = new DescarteModel(linha["COD_DESC"], linha["COD_PESSOA"], linha["DATA_DESC"]);
            
            lista.push(descarte);
        }

        return lista;
    }

    async atualizarDescarte() {
        let sql = "UPDATE DESCARTE SET COD_PESSOA = ?, DATA_DESC = ? WHERE COD_DESC = ?";
        let values = [this.#COD_PESSOA, this.#DATA_DESC, this.#COD_DESC];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirDescarte(id) {
        let sql = "DELETE FROM DESCARTE WHERE COD_DESC = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterDescarteId(id) {
        let sql = "SELECT * FROM DESCARTE WHERE COD_DESC = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let descarte = new DescarteModel(linha["COD_DESC"], linha["COD_PESSOA"], linha["COD_LOTE"], linha["DATA_DESC"], linha["QTD_DESC"], linha["MOTIVO_DESC"]);

            return descarte;
        }

        return null;
    }
}

module.exports = DescarteModel;
