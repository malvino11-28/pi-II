const Database = require("../database/database");

class LoteModel {
    #COD_LOTE;
    #COD_PROD;
    #COD_PROMO;
    #NUM_LOTE;
    #DATA_FAB_LOTE;
    #DATA_VENC_LOTE;
    #EST_LOTE;

    constructor( id, idProd, idPromo, numLote, dataFab, dataVenc, estoque) { 
        this.#COD_LOTE = id;
        this.#COD_PROD = idProd;
        this.#COD_PROMO = idPromo;
        this.#NUM_LOTE = numLote;
        this.#DATA_FAB_LOTE = dataFab;
        this.#DATA_VENC_LOTE = dataVenc;
        this.#EST_LOTE = estoque;
    }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get COD_PROMO() { return this.#COD_PROMO; }
    set COD_PROMO(v) { this.#COD_PROMO = v; }

    get NUM_LOTE() { return this.#NUM_LOTE; }
    set NUM_LOTE(v) { this.#NUM_LOTE = v; }

    get DATA_FAB_LOTE() { return this.#DATA_FAB_LOTE; }
    set DATA_FAB_LOTE(v) { this.#DATA_FAB_LOTE = v; }

    get DATA_VENC_LOTE() { return this.#DATA_VENC_LOTE; }
    set DATA_VENC_LOTE(v) { this.#DATA_VENC_LOTE = v; }

    get EST_LOTE() { return this.#EST_LOTE; }
    set EST_LOTE(v) { this.#EST_LOTE = v; }

    async listarLoteProduto(idProduto) {
        let sql = "SELECT * FROM LOTE WHERE COD_PROD = ? ";
        let values = [idProduto];
        let db = new Database();
        let result = await db.ExecutaComando(sql, values);

        return result;
    }

    async obterLoteId(id) {
        let sql = "SELECT * FROM LOTE WHERE COD_LOTE = ? ";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let lote = new LoteModel(
                linha["COD_LOTE"],
                linha["COD_PROD"],
                linha["COD_PROMO"],
                linha["NUM_LOTE"],
                linha["DATA_FAB_LOTE"],
                linha["DATA_VENC_LOTE"],
                linha["EST_LOTE"]
            );

            return lote;
        }
        return null;
    }

    async cadastrarLote() {
        let sql = "INSERT INTO LOTE (COD_PROD, COD_PROMO, NUM_LOTE, DATA_FAB_LOTE, DATA_VENC_LOTE, EST_LOTE) VALUES (?, ?, ?, ?, ?, ?)";
        let values = [
            this.#COD_PROD,
            this.#COD_PROMO,
            this.#NUM_LOTE,
            this.#DATA_FAB_LOTE,
            this.#DATA_VENC_LOTE,
            this.#EST_LOTE
        ];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }
    async atualizarLote() {
        let sql = "UPDATE LOTE SET NUM_LOTE = ?, DATA_FAB_LOTE = ?, DATA_VENC_LOTE = ?, EST_LOTE = ? WHERE COD_LOTE = ? AND COD_PROD = ?";
        let values = [
            this.#NUM_LOTE,
            this.#DATA_FAB_LOTE,
            this.#DATA_VENC_LOTE,
            this.#EST_LOTE,
            this.#COD_LOTE,
            this.#COD_PROD
        ];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirLote(id) {
        let sql = "DELETE FROM LOTE WHERE COD_LOTE = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }
}

module.exports = LoteModel;