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

        let sql = "INSERT INTO PESSOA (EMAIL_PESSOA, TELEFONE_PESSOA) VALUES (?, ?)";
        let values = [this.#EMAIL_PESSOA, this.#TELEFONE_PESSOA];

        let banco = new Database();
        let result = await banco.ExecutaComandoLastInserted(sql, values);

        if(result) {

            this.#COD_PESSOA = result;
            return true;
        }

        return false;
    }
}

module.exports = PessoaModel;