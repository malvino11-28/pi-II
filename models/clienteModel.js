class ClienteModel {
    
    #COD_CLI;
    #NOME_CLI;
    #CPF_CLI
    #RG_CLI
    #DATA_NASC_CLI;
    #EMAIL_CLI;
    #TELEFONE_CLI;
    #SENHA_CLI;

    get COD_CLI() {
        return this.#COD_CLI;
    }

    set COD_CLI(value) {
        this.#COD_CLI = value;
    }

    get NOME_CLI() {
        return this.#NOME_CLI;
    }

    set NOME_CLI(value) {
        this.#CPF_CLI = value;
    }

    get CPF_CLI() {
        return this.#CPF_CLI;
    }

    set CPF_CLI(value) {
        this.#CPF_CLI = value;
    }

    get RG_CLI() {
        return this.#RG_CLI;
    }

    set RG_CLI(value) {
        this.#RG_CLI = value;
    }

    get DATA_NASC_CLI() {
        return this.#DATA_NASC_CLI;
    }

    set DATA_NASC_CLI(value) {
        this.#DATA_NASC_CLI = value;
    }

    get EMAIL_CLI() {
        return this.#EMAIL_CLI;
    }

    set EMAIL_CLI(value) {
        this.#EMAIL_CLI = value;
    }

    get TELEFONE_CLI() {
        return this.#TELEFONE_CLI;
    }

    set TELEFONE_CLI(value) {
        this.#TELEFONE_CLI = value;
    }

    get SENHA_CLI() {
        return this.#SENHA_CLI;
    }

    set SENHA_CLI(value) {
        this.#SENHA_CLI = value;
    }

    constructor(cod, nome, cpf, rg, dt_nasc, email, senha) {

        this.#COD_CLI = cod;
        this.#NOME_CLI = nome;
        this.#CPF_CLI = cpf;
        this.#RG_CLI = rg;
        this.#DATA_NASC_CLI = dt_nasc;
        this.#EMAIL_CLI = email;
        this.#SENHA_CLI = senha;
    }

    async efetuarPedido() {

    }

    async assinarClube() {

    }

    async efetuarCancelamento() {

    }

}

module.exports = ClienteModel;