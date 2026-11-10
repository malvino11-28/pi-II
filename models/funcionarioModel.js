const Database = require("../database/database");
class FuncionarioModel {

    #COD_FUN;
    #STATUS_FUN;
    #NOME_FUN;
    #MATRICULA_FUN;
    #CARGO_FUN;
    #SENHA_FUN;

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

    get SENHA_FUN() {
        return this.#SENHA_FUN;
    }

    set SENHA_FUN(value) {
        this.#SENHA_FUN = value;
    }

    constructor(cod, status, nome, matricula, cargo, senha) {

        this.#COD_FUN = cod;
        this.#STATUS_FUN = status;
        this.#NOME_FUN = nome;
        this.#MATRICULA_FUN = matricula;
        this.#CARGO_FUN = cargo;
        this.#SENHA_FUN = senha;
    }

    async validar(matricula, senha) {

        let sql = "SELECT * FROM FUNCIONARIO WHERE MATRICULA_FUN = ? AND SENHA_FUN = ? AND STATUS_FUN = 'Ativo'";
        let values = [matricula, senha];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, values);

        if(linhas.length > 0) {
            
            let linha = linhas[0];
            return new FuncionarioModel(linha["COD_FUN"], linha["STATUS_FUN"], linha["NOME_FUN"], linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["SENHA_FUN"]);
        }

        return null;
    }

    async obterPorId(id) {

        let sql = "SELECT * FROM FUNCIONARIO WHERE COD_FUN = ?";
        let value = [id];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, value);

        if(linhas.length > 0) {

            let linha = linhas[0];
            let funcionario = new FuncionarioModel(linha["COD_FUN"], linha["STATUS_FUN"], linha["NOME_FUN"], linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["SENHA_FUN"]);

            return funcionario;

        } else {

            return null;
        }
    }
}

module.exports = FuncionarioModel;