
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
                F.NOME_RECEB AS FORMA_RECEBIMENTO
            FROM PEDIDO P
            INNER JOIN PESSOA_FISICA PF ON PF.COD_PESSOA = P.COD_CLI
            INNER JOIN FORMA_RECEBIMENTO F ON F.COD_RECEB = P.COD_RECEB
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
                F.NOME_RECEB AS FORMA_RECEBIMENTO
            FROM PEDIDO P
            INNER JOIN PESSOA_FISICA PF ON PF.COD_PESSOA = P.COD_CLI
            INNER JOIN FORMA_RECEBIMENTO F ON F.COD_RECEB = P.COD_RECEB
            WHERE P.COD_PED = ?
        `;
        let value = [id];

        let rows = await db.ExecutaComando(sql, value);
        return rows[0];
    }

    async atualizarStatusPedido(id, novoStatus, statusAtual) {
        let sql = "UPDATE PEDIDO SET STATUS_PED = ? WHERE COD_PED = ? AND STATUS_PED = ?";

        let values = [novoStatus, id, statusAtual];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async cancelarPedido(id, statusAtual) {
        if (statusAtual !== "Pendente" && statusAtual != "Preparado") {
            return false;
        }

        let sql = "SELECT COD_PROD, COD_LOTE, QTD_PROD FROM ITEM_PEDIDO WHERE COD_PED = ? ORDER BY COD_LOTE, COD_PROD";
        let value = [id];

        let itens = await db.ExecutaComando(sql, value);

        let sqlStatus = "UPDATE PEDIDO SET STATUS_PED = ? WHERE COD_PED = ? AND STATUS_PED = ?";
        let valuesStatus = ["Cancelado", id, statusAtual];

        let sqlLote = "UPDATE LOTE SET EST_LOTE = EST_LOTE + ? WHERE COD_LOTE = ? AND COD_PROD = ?";

        let sqlEntrega = "UPDATE ENTREGA SET STATUS_ENT = 'Cancelado' WHERE COD_PED = ?";

        let ok = 0;
        let resultL;

        for (let i = 0; i < itens.length; i++) {
            let qtd = itens[i].QTD_PROD;

            if (!qtd || qtd <= 0) {
                return false;
            }
        }

        let resultP = await db.ExecutaComandoNonQuery(sqlStatus, valuesStatus);
        if (resultP) {
            for (let i = 0;i < itens.length;i++) {
                let qtd = itens[i].QTD_PROD;

                let valuesLote = [qtd, item.COD_LOTE, item.COD_PROD];

                resultL = await db.ExecutaComandoNonQuery(sqlLote, valuesLote);

                if (resultL) {
                    ok++;
                } else {
                    return false; 
                }
            }
            if (ok < itens.length) {
                return false;
            } else {
                await db.ExecutaComandoNonQuery(sqlEntrega, value);

                return true;
            }
        } else {
            return false;
        }
    }

    async retirarPedido(id) {
        let sql = "UPDATE PEDIDO SET_STATUS = 'Retirado' WHERE COD_PED = ? AND STATUS_PED = 'Preparado'";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        
        return result;
    }

    async sairParaEntrega(id, idEntrega) {
        let sql = "UPDATE PEDIDO SET STATUS_PED = 'Saiu para entrega' WHERE COD_PED = ? AND STATUS_PED = 'Preparado'";
        let value = [id];

        let sqlEntrega = "UPDATE ENTREGA SET STATUS_ENT = 'Saiu para entrega' WHERE COD_ENT = ? AND COD_PED = ? AND STATUS_ENT = 'Pendente'";
        let valuesE = [idEntrega, id];

        let sqlItemEnt = "INSERT INTO ITEM_ENTREGA (COD_PROD, COD_LOTE, COD_ENT) SELECT COD_PROD, COD_LOTE, ? FROM ITEM_PEDIDO WHERE COD_PED = ?";
        let valuesIE = [idEntrega, id];

        let resultP = await db.ExecutaComandoNonQuery(sql, value);
        let resultE = await db.ExecutaComandoNonQuery(sqlEntrega, valuesE);
        let resultIE = await db.ExecutaComandoNonQuery(sqlItemEnt, valuesIE);

        return resultP && resultIE && resultE;
    }
}

module.exports = PedidoModel;
