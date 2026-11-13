const Database = require("../database/database");

const db = new Database();

class PedidoModel {
    #COD_PED;
    #COD_CLI;
    #COD_PROMO;
    #COD_PAG;
    #TOTAL_PED;

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get COD_CLI() { return this.#COD_CLI; }
    set COD_CLI(v) { this.#COD_CLI = v; }

    get COD_PROMO() { return this.#COD_PROMO; }
    set COD_PROMO(v) { this.#COD_PROMO = v; }

    get COD_PAG() { return this.#COD_PAG; }
    set COD_PAG(v) { this.#COD_PAG = v; }

    get TOTAL_PED() { return this.#TOTAL_PED; }
    set TOTAL_PED(v) { this.#TOTAL_PED = v; }

    constructor(idPed, idCli, idPromo, idPag, total) {
        this.#COD_PED = idPed;
        this.#COD_CLI = idCli;
        this.#COD_PROMO = idPromo;
        this.#COD_PAG = idPag;
        this.#TOTAL_PED = total;
    }

    async salvarPedido() {
        let sql = `INSERT INTO PEDIDO (COD_STATUS, COD_CLI, COD_PROMO, COD_PAG, DATA_PED, TOTAL_PED) 
            VALUES ((SELECT COD_STATUS FROM STATUS_PEDIDO WHERE NOME_STATUS = ?), ?, ?, ?, CURDATE(), ?) 
            `; // tabela status será removida, COD_STATUS vai virar STATUS_PED do tipo enum
        
        let values = ["Pendente", 
            this.#COD_CLI,
            this.#COD_PROMO,
            this.#COD_PAG,
            this.#TOTAL_PED
            ]

        let result = await db.ExecutaComandoLastInserted(sql, values);
        return result;
    }

    async listarPedido() {

    }

    async atualizarPedido() {

    }

    async excluirPedido() {

    }
}

module.exports = PedidoModel;