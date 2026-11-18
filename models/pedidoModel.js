
const Database = require("../database/database");

const db = new Database();

class PedidoModel {
    #COD_PED;
    #COD_CLI;
    #COD_PROMO;
    #STATUS_PED;
    #DATA_PED;
    #COD_RECEB;
    #TOTAL_PED;

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get COD_CLI() { return this.#COD_CLI; }
    set COD_CLI(v) { this.#COD_CLI = v; }

    get COD_PROMO() { return this.#COD_PROMO; }
    set COD_PROMO(v) { this.#COD_PROMO = v; }

    get STATUS_PED() { return this.#STATUS_PED; }
    set STATUS_PED(v) { this.#STATUS_PED = v; }

    get DATA_PED() { return this.#DATA_PED; }
    set DATA_PED(v) { this.#DATA_PED = v; }

    get COD_RECEB() { return this.#COD_RECEB; }
    set COD_RECEB(v) { this.#COD_RECEB = v; }

    get TOTAL_PED() { return this.#TOTAL_PED; }
    set TOTAL_PED(v) { this.#TOTAL_PED = v; }

    constructor(idPed, idCli, idPromo, status, data, idPag, total) {
        this.#COD_PED = idPed;
        this.#COD_CLI = idCli;
        this.#COD_PROMO = idPromo;
        this.#STATUS_PED = status;
        this.#DATA_PED = data;
        this.#COD_RECEB = idPag;
        this.#TOTAL_PED = total;
    }

    async salvarPedido() {
        let sql = "INSERT INTO PEDIDO (COD_CLI, COD_PROMO, STATUS_PED, COD_RECEB, DATA_PED, TOTAL_PED) VALUES (?, ?, ?, ?, CURDATE(), ?)";

        let values = [
            this.#COD_CLI,
            this.#COD_PROMO,
            "Pendente",
            this.#COD_RECEB,
            this.#TOTAL_PED
        ];

        let result = await db.ExecutaComandoLastInserted(sql, values);

        if (result) {
            this.#COD_PED = result;
            return true;
        }
        return false;
    }

    async listarPedido() {
        let sql = "SELECT * FROM PEDIDO";

        let rows = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            let pedido = new PedidoModel(
                row["COD_PED"],
                row["COD_CLI"],
                row["COD_PROMO"],
                row["STATUS_PED"],
                row["DATA_PED"],
                row["COD_RECEB"],
                row["TOTAL_PED"]
            );

            lista.push(pedido);
        }

        return lista;
    }

    async obterPorId(id) {
        let sql = "SELECT * FROM PEDIDO WHERE COD_PED = ?";
        let values = [id];

        let rows = await db.ExecutaComando(sql, values);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            let pedido = new PedidoModel(
                row["COD_PED"],
                row["COD_CLI"],
                row["COD_PROMO"],
                row["STATUS_PED"],
                row["DATA_PED"],
                row["COD_RECEB"],
                row["TOTAL_PED"]
            );
            lista.push(pedido);
        }

        return lista;
    }

    async atualizarPedido() {
        let sql = `UPDATE PEDIDO SET
            COD_CLI = ?,
            COD_PROMO = ?,
            STATUS_PED = ?,
            COD_RECEB = ?,
            DATA_PED = ?,
            TOTAL_PED = ?
            WHERE COD_PED = ?`;

        let values = [
            this.#COD_CLI,
            this.#COD_PROMO,
            this.#STATUS_PED,
            this.#COD_RECEB,
            this.#DATA_PED,
            this.#TOTAL_PED,
            this.#COD_PED
        ];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async excluirPedido(id) {
        let sql = "DELETE FROM PEDIDO WHERE COD_PED = ?";
        let values = [id];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarPedidosAdmin() {
        let sql = `
            SELECT P.COD_PED, P.COD_CLI, P.DATA_PED, P.STATUS_PED, P.TOTAL_PED,
                PF.NOME_PF AS NOME_CLIENTE,
                F.NOME_RECEB AS FORMA_PAGAMENTO
            FROM PEDIDO P
            INNER JOIN PESSOA_FISICA PF ON PF.COD_PESSOA = P.COD_CLI
            INNER JOIN FORMA_PAGAMENTO F ON F.COD_RECEB = P.COD_RECEB
            ORDER BY P.DATA_PED DESC, P.COD_PED DESC

        `;

        let result = await db.ExecutaComando(sql);
        return result
    }

    async obterPedidoAdmin(id) {
        let sql = `
            SELECT P.COD_PED, P.COD_CLI, P.DATA_PED, P.STATUS_PED, P.TOTAL_PED,
                PF.NOME_PF AS NOME_CLIENTE,
                PF.EMAIL_PESSOA, PF.TELEFONE_PESSOA,
                F.NOME_RECEB AS FORMA_PAGAMENTO
            FROM PEDIDO P
            INNER JOIN PESSOA_FISICA PF ON PF.COD_PESSOA = P.COD_CLI
            INNER JOIN FORMA_PAGAMENTO F ON F.COD_RECEB = P.COD_RECEB
            WHERE P.COD_PED = ?
        `;
        let value = [id];

        let rows = await db.ExecutaComando(sql, value);
        return rows[0];
    }

    
}

module.exports = PedidoModel;
