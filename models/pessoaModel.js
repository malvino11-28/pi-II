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
}

module.exports = PessoaModel;