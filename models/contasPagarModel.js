const Database = require("../database/database");

class ContasPagarModel {
    #COD_COMPRA;
    #DATA_VENC_CP;
    #DATA_PGTO_CP;
    #VALOR_CP;
    #STATUS_CP;
    #NUM_PARC_CP;

    constructor(codCompra, dataVencimento, dataPagamento, valor, status, numParcela) {
        this.#COD_COMPRA = codCompra;
        this.#DATA_VENC_CP = dataVencimento;
        this.#DATA_PGTO_CP = dataPagamento;
        this.#VALOR_CP = valor;
        this.#STATUS_CP = status;
        this.#NUM_PARC_CP = numParcela;
    }

    async cadastrarParcela() {
        let sql = `
            INSERT INTO CONTAS_PAGAR
                (COD_COMPRA, DATA_VENC_CP, DATA_PGTO_CP, VALOR_CP, STATUS_CP, NUM_PARC_CP)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        let valores = [
            this.#COD_COMPRA,
            this.#DATA_VENC_CP,
            this.#DATA_PGTO_CP,
            this.#VALOR_CP,
            this.#STATUS_CP,
            this.#NUM_PARC_CP
        ];

        let banco = new Database();
        let salva = await banco.ExecutaComandoNonQuery(sql, valores);

        return salva;
    }
}

module.exports = ContasPagarModel;