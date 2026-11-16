const Database = require('../database/database');

class PessoaModel {
    #COD_PESSOA;
    #EMAIL_PESSOA;
    #TELEFONE_PESSOA;

    constructor(cod, email, telefone) {
        this.#COD_PESSOA = cod;
        this.#EMAIL_PESSOA = email;
        this.#TELEFONE_PESSOA = telefone;
    }

    get COD_PESSOA() {
        return this.#COD_PESSOA;
    }

    set COD_PESSOA(value) {
        this.#COD_PESSOA = value;
    }

    get EMAIL_PESSOA() {
        return this.#EMAIL_PESSOA;
    }

    set EMAIL_PESSOA(value) {
        this.#EMAIL_PESSOA = value;
    }

    get TELEFONE_PESSOA() {
        return this.#TELEFONE_PESSOA;
    }

    set TELEFONE_PESSOA(value) {
        this.#TELEFONE_PESSOA = value;
    }

    async cadastrarP() {

        let banco = new Database();

        let sql = "INSERT INTO PESSOA (EMAIL_PESSOA, TELEFONE_PESSOA) VALUES (?, ?)";
        let value = [this.EMAIL_PESSOA, this.TELEFONE_PESSOA];

        let result = banco.ExecutaComandoNonQuery(sql, value);

        return result;
    }

    async listarP() {

        let banco = new Database();

        let sql = "SELECT COD_PESSOA FROM PESSOA WHERE EMAIL_PESSOA = ? AND TELEFONE_PESSOA = ?";
        let value = [this.EMAIL_PESSOA, this.TELEFONE_PESSOA];

        let linha = banco.ExecutaComando(sql, value);

        if(linha.length > 0) {

            return linha;
        }
        
    }
}

module.exports = PessoaModel;