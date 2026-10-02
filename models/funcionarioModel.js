const ClienteModel = require("../models/clienteModel");
const Database = require("../database/database");

class FuncionarioModel {

    #COD_FUN;
    #STATUS_FUN;
    #NOME_FUN;
    #MATRICULA_FUN;
    #CARGO_FUN;

    get COD_FUN() {
        return this.#COD_FUN;
    }

    set COD_FUN(value) {
        this.#COD_FUN = value;
    }

    get STATUS_FUN() {
        return this.#STATUS_FUN;
    }

    set STATUS_FUN(value) {
        this.#STATUS_FUN = value;
    }

    get NOME_FUN() {
        return this.#NOME_FUN;
    }

    set NOME_FUN(value) {
        this.#NOME_FUN = value;
    }

    get MATRICULA_FUN() {
        return this.#MATRICULA_FUN;
    }

    set MATRICULA_FUN(value) {
        this.#MATRICULA_FUN = value;
    }

    get CARGO_FUN() {
        return this.#CARGO_FUN;
    }

    set CARGO_FUN(value) {
        this.#CARGO_FUN = value;
    }

    constructor(cod, status, nome, matricula, cargo) {

        this.#COD_FUN = cod;
        this.#STATUS_FUN = status;
        this.#NOME_FUN = nome;
        this.#MATRICULA_FUN = matricula;
        this.#CARGO_FUN = cargo;
    }

    async cadastrarCliente() {

        let sql = "INSERT INTO CLIENTE (NOME_CLI, CPF_CLI, RG_CLI, DATA_NASC_CLI, EMAIL_CLI, TELEFONE_CLI, SENHA_CLI) VALUES (?,?,?,?,?,?,?)";
        let cli = new ClienteModel();
        let values = [cli.NOME_CLI, cli.CPF_CLI, cli.RG_CLI, cli.DATA_NASC_CLI, cli.EMAIL_CLI, cli.TELEFONE_CLI, cli.SENHA_CLI];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async buscarCliente() {

    }

    async listarClientes() {

        let sql = "SELECT * FROM CLIENTE ";
    }

    async excluirCliente(id) {

    }
}