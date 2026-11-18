const Database = require("../database/database");

const db = new Database();

class EntregaModel {
    #COD_ENT;
    #COD_PED; 
    #COD_END;
    #DATA_ENT;
    #STATUS_ENT;

    get COD_ENT() { return this.#COD_ENT; }
    set COD_ENT(v) { this.#COD_ENT = v; }

    get COD_PED() { return this.#COD_PED; }
    set COD_PED(v) { this.#COD_PED = v; }

    get COD_END() { return this.#COD_END; }
    set COD_END(v) { this.#COD_END = v; }

    get DATA_ENT() { return this.#DATA_ENT; }
    set DATA_ENT(v) { this.#DATA_ENT = v; }

    get STATUS_ENT() { return this.#STATUS_ENT; }
    set STATUS_ENT(v) { this.#STATUS_ENT = v; }

    constructor(codEnt, codPed, codEnd, data, status) {
        this.#COD_ENT = codEnt;
        this.#COD_PED = codPed;
        this.#COD_END = codEnd;
        this.#DATA_ENT = data;
        this.#STATUS_ENT = status;
    }

    async cadastrarEntrega() {
        let sql = "INSERT INTO ENTREGA (COD_PED, COD_END, DATA_ENT, STATUS_ENT) VALUES (?, ?, ?, ?)";
        let values = [this.#COD_PED, this.#COD_END, this.#DATA_ENT, this.#STATUS_ENT];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async atualizarEntrega() {
        let sql = "UPDATE ENTREGA SET DATA_ENT = ?, STATUS_ENT = ? WHERE COD_ENT = ?"
        let values = [this.#DATA_ENT, this.#STATUS_ENT, this.#COD_ENT];

        let result = await db.ExecutaComandoNonQuery(sql, values);
        return result;
    }

    async listarEntregas() {
        let sql = "SELECT * FROM ENTREGA";

        let rows = await db.ExecutaComando(sql);
        let lista = [];
        for (let i = 0; i<rows.length;i++) {
            let row = rows[i];
            let entrega = new EntregaModel(row["COD_ENT"], row["COD_PED"], row["COD_END"], row["DATA_ENT"], row["STATUS_ENT"])
            lista.push(entrega);
        }

        return lista;
    }

    async excluirEntrega(id) {
        let sql = "DELETE FROM ENTREGA WHERE COD_ENT = ?";
        let value = [id];

        let result = await db.ExecutaComandoNonQuery(sql, value);
        return result;
    }

    async obterEntregaPedido(id) {
        let sql = `SELECT E.*, 
            EN.RUA_END, EN.NUM_END, EN.BAIRRO_END, EN.CIDADE_END, EN.ESTADO_END
            FROM ENTREGA E LEFT JOIN ENDERECO EN ON EN.COD_END = E.COD_END
            WHERE E.COD_PED = ?    
        `;
        let value = [id];

        let rows = await db.ExecutaComando(sql, value);
        return rows[0];
    }

    async definirEntregaPedido(idPedido, idEndereco, data) {
        let sql = `
            INSERT INTO ENTREGA (COD_PED, COD_END, DATA_ENT, STATUS_ENT)
            SELECT P.COD_PED, EN.COD_END, ?, 'Pendente'
            FROM PEDIDO P
            INNER JOIN ENDERECO EN ON EN.COD_PESSOA = P.COD_CLI
            WHERE P.COD_PED = ?
                AND P.STATUS_PED = 'Pendente'
                AND EN.COD_END = ?
                AND NOT EXISTS (
                    SELECT 1
                    FROM ENTREGA E
                    WHERE E.COD_PED = P.COD_PED
                )
        `;

        let valores = [data, idPedido, idEndereco];

        return await db.ExecutaComandoNonQuery(sql, valores);
    }
}

module.exports = EntregaModel;