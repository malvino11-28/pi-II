const Database = require("../database/database");

class PlanoModel {
    #COD_PLANO;
    #NOME_PLANO;
    #VALOR_PLANO;
    #DURACAO_PLANO;

    constructor(id, nome, valor, duracao) {
        this.#COD_PLANO = id;
        this.#NOME_PLANO = nome;
        this.#VALOR_PLANO = valor;
        this.#DURACAO_PLANO = duracao;
    }

    get COD_PLANO() {
        return this.#COD_PLANO;
    }

    set COD_PLANO(value) { 
        this.#COD_PLANO = value; 
    }

    get NOME_PLANO() { 
        return this.#NOME_PLANO; 
    }

    set NOME_PLANO(value) {
        this.#NOME_PLANO = value;
    }

    get VALOR_PLANO() {
        return this.#VALOR_PLANO;
    }

    set VALOR_PLANO(value) {
        this.#VALOR_PLANO = value;
    }

    get DURACAO_PLANO() {
        return this.#DURACAO_PLANO;
    }

    set DURACAO_PLANO(value) {
        this.#DURACAO_PLANO = value;
    }

    async cadastrarPlano() {
        let sql = "INSERT INTO PLANO (NOME_PLANO, VALOR_PLANO, DURACAO_PLANO) VALUES (?, ?, ?)";
        let values = [this.#NOME_PLANO, this.#VALOR_PLANO, this.#DURACAO_PLANO];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarPlanos() {
        let sql = "SELECT * FROM PLANO";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let plano = new PlanoModel(linha["COD_PLANO"], linha["NOME_PLANO"], linha["VALOR_PLANO"], linha["DURACAO_PLANO"]);
            
            lista.push(plano);
        }

        return lista;
    }

    async atualizarPlano() {
        let sql = "UPDATE PLANO SET NOME_PLANO = ?, VALOR_PLANO = ?, DURACAO_PLANO = ? WHERE COD_PLANO = ?";
        let values = [this.#NOME_PLANO, this.#VALOR_PLANO, this.#DURACAO_PLANO, this.#COD_PLANO];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirPlano(id) {
        let sql = "DELETE FROM PLANO WHERE COD_PLANO = ?";
        let values = [id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterPlanoId(id) {
        let sql = "SELECT * FROM PLANO WHERE COD_PLANO = ?";
        let values = [id];
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let plano = new PlanoModel(linha["COD_PLANO"], linha["NOME_PLANO"], linha["VALOR_PLANO"], linha["DURACAO_PLANO"]);

            return plano;
        }

        return null;
    }
}

module.exports = PlanoModel;
