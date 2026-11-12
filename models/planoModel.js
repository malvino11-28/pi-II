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

    get COD_PLANO() { return this.#COD_PLANO; }
    set COD_PLANO(v) { this.#COD_PLANO = v; }

    get NOME_PLANO() { return this.#NOME_PLANO; }
    set NOME_PLANO(v) { this.#NOME_PLANO = v; }

    get VALOR_PLANO() { return this.#VALOR_PLANO; }
    set VALOR_PLANO(v) { this.#VALOR_PLANO = v; }

    get DURACAO_PLANO() { return this.#DURACAO_PLANO; }
    set DURACAO_PLANO(v) { this.#DURACAO_PLANO = v; }

    async cadastrarPlano() {
        let sql = "INSERT INTO PLANO (NOME_PLANO, VALOR_PLANO, DURACAO_PLANO) VALUES (?, ?, ?)";
        let values = [this.#NOME_PLANO, this.#VALOR_PLANO, this.#DURACAO_PLANO];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarPlanos() {
        let sql = "SELECT * FROM PLANO";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let plano = new PlanoModel(
                linha["COD_PLANO"],
                linha["NOME_PLANO"],
                linha["VALOR_PLANO"],
                linha["DURACAO_PLANO"]
            );
            lista.push(plano);
        }

        return lista;
    }

    async atualizarPlano() {
        let sql = "UPDATE PLANO SET NOME_PLANO = ?, VALOR_PLANO = ?, DURACAO_PLANO = ? WHERE COD_PLANO = ?";
        let values = [this.#NOME_PLANO, this.#VALOR_PLANO, this.#DURACAO_PLANO, this.#COD_PLANO];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirPlano(id) {
        let sql = "DELETE FROM PLANO WHERE COD_PLANO = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterPlanoId(id) {
        let sql = "SELECT * FROM PLANO WHERE COD_PLANO = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let plano = new PlanoModel(
                linha["COD_PLANO"],
                linha["NOME_PLANO"],
                linha["VALOR_PLANO"],
                linha["DURACAO_PLANO"]
            );

            return plano;
        }

        return null;
    }
}

module.exports = PlanoModel;
