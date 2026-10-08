const Database = require("../database/database");

class FornecedorModel{

    #COD_FOR;
    #CNPJ_FOR;
    #RAZAO_FOR;
    #NOME_FAN_FOR;
    #EMAIL_FOR;
    #TELEFONE_FOR;

    get COD_FOR() {
        return this.#COD_FOR;
    }

    set COD_FOR(value) {
        this.#COD_FOR = value;
    }

    get CNPJ_FOR() {
        return this.#CNPJ_FOR;
    }

    set CNPJ_FOR(value) {
        this.#CNPJ_FOR = value;
    }

    get RAZAO_FOR() {
        return this.#RAZAO_FOR;
    }

    set RAZAO_FOR(value) {
        this.#RAZAO_FOR = value;
    }

    get NOME_FAN_FOR() {
        return this.#NOME_FAN_FOR;
    }

    set NOME_FAN_FOR(value) {
        this.#NOME_FAN_FOR = value;
    }

    get EMAIL_FOR() {
        return this.#EMAIL_FOR;
    }

    set EMAIL_FOR(value) {
        this.#EMAIL_FOR = value;
    }

    get TELEFONE_FOR() {
        return this.#TELEFONE_FOR;
    }

    set TELEFONE_FOR(value) {
        this.#TELEFONE_FOR = value;
    }

    constructor(cod, cnpj, razao, nome_fantasia, email, telefone) {

        this.#COD_FOR = cod;
        this.#CNPJ_FOR = cnpj;
        this.#RAZAO_FOR = razao;
        this.#NOME_FAN_FOR = nome_fantasia;
        this.#EMAIL_FOR = email;
        this.#TELEFONE_FOR = telefone;
    }

    async cadastrarFornecedor() {

        let sql = "INSERT INTO FORNECEDOR (COD_FOR, CNPJ_FOR, RAZAO_FOR, NOME_FAN_FOR, EMAIL_FOR, TELEFONE_FOR) VALUES (?,?,?,?,?,?)";
        let values = [this.#COD_FOR, this.#CNPJ_FOR, this.#RAZAO_FOR, this.#NOME_FAN_FOR, this.#EMAIL_FOR, this.#TELEFONE_FOR];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;

    }

    async atualizarFornecedor() {
        
        let sql = "UPDATE FORNECEDOR SET CNPJ_FOR = ?, RAZAO_FOR = ?, NOME_FAN_FOR = ?, EMAIL_FOR = ?, TELEFONE_FOR = ? WHERE COD_FOR = ?";
        let values = [this.#CNPJ_FOR, this.#RAZAO_FOR, this.#NOME_FAN_FOR, this.#EMAIL_FOR, this.#TELEFONE_FOR, this.#COD_FOR];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarFornecedores() {

        let sql = "SELECT * FROM FORNECEDOR";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = []

        for(let i = 0; i < linhas.length; i++) {

            let linha = linhas[i];
            let fornecedor = new FornecedorModel(linha["COD_FOR"], linha["CNPJ_FOR"], linha["RAZAO_FOR"], linha["NOME_FAN_FOR"], linha["EMAIL_FOR"], linha["TELEFONE_FOR"]);

            lista.push(fornecedor);
        }

        return lista;
    }

    async excluirFornecedor(id) {

        let sql = "DELETE FROM FORNECEDOR WHERE COD_FOR = ?";
        let value = [id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, value);

        return result;
    }

    async obterPorId(id) {

        let sql = "SELECT * FROM FORNECEDOR WHERE COD_FOR = ?";
        let value = [id];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, value);

        if(linhas.length > 0) {

            let linha = linhas[0];
            let fornecedor = new FornecedorModel(linha["COD_FOR"], linha["CNPJ_FOR"], linha["RAZAO_FOR"], linha["NOME_FAN_FOR"], linha["EMAIL_FOR"], linha["TELEFONE_FOR"]);

            return fornecedor;

        } else {

            return null;
        }
    }
}

module.exports = FornecedorModel;