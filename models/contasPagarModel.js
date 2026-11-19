const Database = require("../database/database");

class ContasPagarModel {
    #COD_CONTA_PAGAR;
    #COD_COMPRA;
    #NUM_PARCELA;
    #VALOR_PARCELA;
    #DATA_VENCIMENTO;
    #DATA_PAGAMENTO;

    constructor(id, codCompra, numParcela, valorParcela, dataVencimento, dataPagamento = null) {
        this.#COD_CONTA_PAGAR = id;
        this.#COD_COMPRA = codCompra;
        this.#NUM_PARCELA = numParcela;
        this.#VALOR_PARCELA = valorParcela;
        this.#DATA_VENCIMENTO = dataVencimento;
        this.#DATA_PAGAMENTO = dataPagamento;
    }

    async cadastrarParcela() {
        const sql = `INSERT INTO CONTAS_PAGAR (COD_COMPRA, NUM_PARCELA, VALOR_PARCELA, DATA_VENCIMENTO) VALUES (?, ?, ?, ?)`;

        const valores = [this.#COD_COMPRA, this.#NUM_PARCELA, this.#VALOR_PARCELA, this.#DATA_VENCIMENTO];

        const banco = new Database();
        this.#COD_CONTA_PAGAR = await banco.ExecutaComandoLastInserted(sql, valores);

        return this.#COD_CONTA_PAGAR;
    }
}

module.exports = ContasPagarModel;