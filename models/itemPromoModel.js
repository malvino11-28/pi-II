const Database = require("../database/database");

const db = new Database;

class ItemPromoModel {
    #COD_PROMO;
    #COD_PROD;
    #VALOR_PROMO;

    constructor(codPromo, codProd, valor) {
        this.#COD_PROMO = codPromo;
        this.#COD_PROD = codProd;
        this.#VALOR_PROMO = valor;
    }


}

module.exports = ItemPromoModel;