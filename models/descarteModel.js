const Database = require("../database/database");

class DescarteModel {
    #COD_DESC;
    #COD_LOTE;
    #DATA_DESC;
    #QTD_DESC;
    #MOTIVO_DESC;

    constructor(id, cod_lote, data, quantidade, motivo) {
        this.#COD_DESC = id;
        this.#COD_LOTE = cod_lote;
        this.#DATA_DESC = data;
        this.#QTD_DESC = quantidade;
        this.#MOTIVO_DESC = motivo;
    }

    get COD_DESC() { return this.#COD_DESC; }
    set COD_DESC(v) { this.#COD_DESC = v; }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    get DATA_DESC() { return this.#DATA_DESC; }
    set DATA_DESC(v) { this.#DATA_DESC = v; }

    get QTD_DESC() { return this.#QTD_DESC; }
    set QTD_DESC(v) { this.#QTD_DESC = v; }

    get MOTIVO_DESC() { return this.#MOTIVO_DESC; }
    set MOTIVO_DESC(v) { this.#MOTIVO_DESC = v; }

    async cadastrarDescarte() {
        let sql = "INSERT INTO DESCARTE (COD_LOTE, DATA_DESC, QTD_DESC, MOTIVO_DESC) VALUES (?, ?, ?, ?)";
        let values = [this.#COD_LOTE, this.#DATA_DESC, this.#QTD_DESC, this.#MOTIVO_DESC];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarDescartes() {
        let sql = "SELECT * FROM DESCARTE";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let descarte = new DescarteModel(linha["COD_DESC"], linha["COD_LOTE"], linha["DATA_DESC"], linha["QTD_DESC"], linha["MOTIVO_DESC"]);
            
            lista.push(descarte);
        }

        return lista;
    }

    async atualizarDescarte() {
        let sql = "UPDATE DESCARTE SET COD_LOTE = ?, DATA_DESC = ?, QTD_DESC = ?, MOTIVO_DESC = ? WHERE COD_DESC = ?";
        let values = [this.#COD_LOTE, this.#DATA_DESC, this.#QTD_DESC, this.#MOTIVO_DESC, this.#COD_DESC];
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
            let descarte = new DescarteModel(linha["COD_DESC"], linha["COD_LOTE"], linha["DATA_DESC"], linha["QTD_DESC"], linha["MOTIVO_DESC"]);

            return descarte;
        }

        return null;
    }
}

module.exports = DescarteModel;
