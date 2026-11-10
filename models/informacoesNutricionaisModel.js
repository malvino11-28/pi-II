const Database = require("../database/database.js");

class InformacoesNutricionaisModel {
    #COD_NUTRI;
    #COD_PROD;
    #NOME_NUTRI;
    #QTD_100G_NUTRI;
    #UNI_NUTRI;
    #PERC_VD_NUTRI;

    constructor(id, idProd, nomeNutri, qtd100gNutri, uniNutri, percVDNutri) {
        this.#COD_NUTRI = id;
        this.#COD_PROD = idProd;
        this.#NOME_NUTRI = nomeNutri;
        this.#QTD_100G_NUTRI = qtd100gNutri;
        this.#UNI_NUTRI = uniNutri;
        this.#PERC_VD_NUTRI = percVDNutri;
    }

    get COD_NUTRI() { return this.#COD_NUTRI; }
    set COD_NUTRI(v) { this.#COD_NUTRI = v; }

    get COD_PROD() { return this.#COD_PROD; }
    set COD_PROD(v) { this.#COD_PROD = v; }

    get NOME_NUTRI() { return this.#NOME_NUTRI; }
    set NOME_NUTRI(v) { this.#NOME_NUTRI = v; }

    get QTD_100G_NUTRI() { return this.#QTD_100G_NUTRI; }
    set QTD_100G_NUTRI(v) { this.#QTD_100G_NUTRI = v; }

    get UNI_NUTRI() { return this.#UNI_NUTRI; }
    set UNI_NUTRI(v) { this.#UNI_NUTRI = v; }

    get PERC_VD_NUTRI() { return this.#PERC_VD_NUTRI; }
    set PERC_VD_NUTRI(v) { this.#PERC_VD_NUTRI = v; }

    async listarInfoNutri(idProd) {
        let sql = "SELECT * FROM INF_NUTRICIONAIS WHERE COD_PROD = ?";
        let values = [idProd];
        let db = new Database();

        return await db.ExecutaComando(sql, values);
    }

    async cadastrarInfoNutri() {
        let sql = "INSERT INTO INF_NUTRICIONAIS (COD_PROD, NUTRIENTE, QTD_100G_NUTRI, UNI_NUTRI, PERC_VD_NUTRI) VALUES (?, ?, ?, ?, ?)";
        let values = [this.#COD_PROD, this.#NOME_NUTRI, this.#QTD_100G_NUTRI, this.#UNI_NUTRI, this.#PERC_VD_NUTRI];

        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async excluirInfoNutri() {
        
    }
}

module.exports = InformacoesNutricionaisModel;
// CREATE TABLE INF_NUTRICIONAIS (
//     COD_NUTRI INT PRIMARY KEY AUTO_INCREMENT,
//     COD_PROD INT NOT NULL,

//     NUTRIENTE VARCHAR(50) NOT NULL,
//     QTD_100G_NUTRI NUMERIC(8, 2) NOT NULL,
//     UNI_NUTRI VARCHAR(10) NOT NULL,
//     PERC_VD_NUTRI NUMERIC(5, 2),

//     CONSTRAINT fk_nutri_prod
//         FOREIGN KEY (COD_PROD)
//         REFERENCES PRODUTO (COD_PROD),

//     CONSTRAINT unq_prod_nutri
//         UNIQUE (COD_PROD, NUTRIENTE)
// );