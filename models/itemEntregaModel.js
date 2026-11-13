const Database = require("../database/database");

const db = new Database();

class ItemEntregaModel {
    #COD_PROD;
    #COD_LOTE;
    #COD_ENT;

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get COD_LOTE() { return this.#COD_LOTE; }
    set COD_LOTE(v) { this.#COD_LOTE = v; }

    get COD_ENT() { return this.#COD_ENT; }
    set COD_ENT(v) { this.#COD_ENT = v; }
}

module.exports = ItemEntregaModel;