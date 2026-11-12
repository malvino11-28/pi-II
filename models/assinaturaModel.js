const Database = require("../database/database");

class AssinaturaModel {
    #COD_PESSOA;
    #COD_PLANO;
    #STATUS_ASS;
    #VENC_ASS;

    constructor(cod_pessoa, cod_plano, status, vencimento) {
        this.#COD_PESSOA = cod_pessoa;
        this.#COD_PLANO = cod_plano;
        this.#STATUS_ASS = status;
        this.#VENC_ASS = vencimento;
    }

    get COD_PESSOA() { return this.#COD_PESSOA; }
    set COD_PESSOA(v) { this.#COD_PESSOA = v; }

    get COD_PLANO() { return this.#COD_PLANO; }
    set COD_PLANO(v) { this.#COD_PLANO = v; }

    get STATUS_ASS() { return this.#STATUS_ASS; }
    set STATUS_ASS(v) { this.#STATUS_ASS = v; }

    get VENC_ASS() { return this.#VENC_ASS; }
    set VENC_ASS(v) { this.#VENC_ASS = v; }

    async cadastrarAssinatura() {
        let sql = "INSERT INTO ASSINATURA (COD_PESSOA, COD_PLANO, STATUS_ASS, VENC_ASS) VALUES (?, ?, ?, ?)";
        let values = [this.#COD_PESSOA, this.#COD_PLANO, this.#STATUS_ASS, this.#VENC_ASS];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarAssinaturas() {
        let sql = "SELECT * FROM ASSINATURA";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let assinatura = new AssinaturaModel(linha["COD_PESSOA"], linha["COD_PLANO"], linha["STATUS_ASS"], linha["VENC_ASS"]);
            
            lista.push(assinatura);
        }

        return lista;
    }

    async atualizarAssinatura() {
        let sql = "UPDATE ASSINATURA SET COD_PLANO = ?, STATUS_ASS = ?, VENC_ASS = ? WHERE COD_PESSOA = ?";
        let values = [this.#COD_PLANO, this.#STATUS_ASS, this.#VENC_ASS, this.#COD_PESSOA];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirAssinatura(id) {
        let sql = "DELETE FROM ASSINATURA WHERE COD_PESSOA = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterAssinaturaId(id) {
        let sql = "SELECT * FROM ASSINATURA WHERE COD_PESSOA = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let assinatura = new AssinaturaModel(linha["COD_PESSOA"], linha["COD_PLANO"], linha["STATUS_ASS"], linha["VENC_ASS"]);

            return assinatura;
        }

        return null;
    }
}

module.exports = AssinaturaModel;
