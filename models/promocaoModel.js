const Database = require("../database/database");

let db = new Database();

class PromocaoModel {
    #COD_PROMO;
    #COD_PESSOA; // pessoa fisica, saber o funcionario responsável pelo cadastro da promossão
    #NOME_PROMO;
    #TIPO_PROMO;
    #DESCONT_MON_PROMO;
    #DESCONT_PER_PROMO;
    #DATA_INIC_PROMO;
    #DATA_FIM_PROMO;

    constructor(id, idFun, nome, tipo, descontoMonetario, descontoPercentual, dataInicio, dataFim) {
        this.#COD_PROMO = id;
        this.#COD_PESSOA = idFun;
        this.#NOME_PROMO = nome;
        this.#TIPO_PROMO = tipo;
        this.#DESCONT_MON_PROMO = descontoMonetario;
        this.#DESCONT_PER_PROMO = descontoPercentual;
        this.#DATA_INIC_PROMO = dataInicio;
        this.#DATA_FIM_PROMO = dataFim;
    }

    get COD_PROMO() { return this.#COD_PROMO; }
    set COD_PROMO(v) { this.#COD_PROMO = v; }

    get COD_PESSOA() { return this.#COD_PESSOA; }
    set COD_PESSOA(v) { this.#COD_PESSOA = v; }

    get NOME_PROMO() { return this.#NOME_PROMO; }
    set NOME_PROMO(v) { this.#NOME_PROMO = v; }

    get TIPO_PROMO() { return this.#TIPO_PROMO; }
    set TIPO_PROMO(v) { this.#TIPO_PROMO = v; }

    get DESCONT_MON_PROMO() { return this.#DESCONT_MON_PROMO; }
    set DESCONT_MON_PROMO(v) { this.#DESCONT_MON_PROMO = v; }

    get DESCONT_PER_PROMO() { return this.#DESCONT_PER_PROMO; }
    set DESCONT_PER_PROMO(v) { this.#DESCONT_PER_PROMO = v; }

    get DATA_INIC_PROMO() { return this.#DATA_INIC_PROMO; }
    set DATA_INIC_PROMO(v) { this.#DATA_INIC_PROMO = v; }

    get DATA_FIM_PROMO() { return this.#DATA_FIM_PROMO; }
    set DATA_FIM_PROMO(v) { this.#DATA_FIM_PROMO = v; }

    async cadastrarPromocao() {
        let sql = "INSERT INTO PROMOCAO (COD_PESSOA, NOME_PROMO, TIPO_PROMO, DESCONT_MON_PROMO, DESCONT_PER_PROMO, DATA_INIC_PROMO, DATA_FIM_PROMO) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let values = [this.#COD_PESSOA, this.#NOME_PROMO, this.#TIPO_PROMO, this.#DESCONT_MON_PROMO, this.#DESCONT_PER_PROMO, this.#DATA_INIC_PROMO, this.#DATA_FIM_PROMO];
        let db = new Database();
        let id = await db.ExecutaComandoLastInserted(sql, values);

        if (id > 0) {
            this.#COD_PROMO = id;
            return true;
        }
        return false;
    }

    async listarPromocoes() {
        let sql = "SELECT * FROM PROMOCAO";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let promocao = new PromocaoModel(linha["COD_PROMO"], linha["COD_PESSOA"], linha["NOME_PROMO"], linha["TIPO_PROMO"], linha["DESCONT_MON_PROMO"], linha["DESCONT_PER_PROMO"], linha["DATA_INIC_PROMO"], linha["DATA_FIM_PROMO"]);
            lista.push(promocao);
        }

        return lista;
    }

    async atualizarPromocao() {
        let sql = "UPDATE PROMOCAO SET COD_PESSOA = ?, NOME_PROMO = ?, TIPO_PROMO = ?, DESCONT_MON_PROMO = ?, DESCONT_PER_PROMO = ?, DATA_INIC_PROMO = ?, DATA_FIM_PROMO = ? WHERE COD_PROMO = ?";
        let values = [this.#COD_PESSOA, this.#NOME_PROMO, this.#TIPO_PROMO, this.#DESCONT_MON_PROMO, this.#DESCONT_PER_PROMO, this.#DATA_INIC_PROMO, this.#DATA_FIM_PROMO, this.#COD_PROMO];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirPromocao(id) {
        let sql = "DELETE FROM PROMOCAO WHERE COD_PROMO = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterPromocaoId(id) {
        let sql = "SELECT * FROM PROMOCAO WHERE COD_PROMO = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let promocao = new PromocaoModel(linha["COD_PROMO"], linha["COD_PESSOA"], linha["NOME_PROMO"], linha["TIPO_PROMO"], linha["DESCONT_MON_PROMO"], linha["DESCONT_PER_PROMO"], linha["DATA_INIC_PROMO"], linha["DATA_FIM_PROMO"]);

            return promocao;
        }

        return null;
    }

    async obterValorVigente(idProd, idLote) { // retorna valor promocional quando tem
        let sql = `SELECT MIN(I.VALOR_PROMO) AS VALOR_PROMO
            FROM ITEM_PROMO I
            INNER JOIN PROMOCAO P ON P.COD_PROMO = I.COD_PROMO
            INNER JOIN LOTE L ON L.COD_LOTE = I.COD_LOTE
                AND L.COD_PROD = I.COD_PROD
            WHERE I.COD_PROD = ?
                AND I.COD_LOTE = ?
                AND CURDATE() BETWEEN P.DATA_INIC_PROMO AND P.DATA_FIM_PROMO
                AND L.DATA_VENC_LOTE >= CURDATE()
                AND L.EST_LOTE > 0
        `;
        let values = [idProd, idLote];

        let rows = await db.ExecutaComando(sql, values);
        
        return rows[0].VALOR_PROMO;
    }
}

module.exports = PromocaoModel;
