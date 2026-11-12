const Database = require("../database/database");
const PessoaModel = require("./pessoaModel");

class PessoaJuridicaModel extends PessoaModel {

    #CNPJ_PJ;
    #RAZAO_PJ;
    #NOME_FAN_PJ;

    constructor(cod, cnpj, razao, nomeFantasia, email, telefone) {
        super(cod, email, telefone);

        this.#CNPJ_PJ = cnpj;
        this.#RAZAO_PJ = razao;
        this.#NOME_FAN_PJ = nomeFantasia;
    }

    get CNPJ_PJ() {
        return this.#CNPJ_PJ;
    }

    set CNPJ_PJ(value) {
        this.#CNPJ_PJ = value;
    }

    get RAZAO_PJ() {
        return this.#RAZAO_PJ;
    }

    set RAZAO_PJ(value) {
        this.#RAZAO_PJ = value;
    }

    get NOME_FAN_PJ() {
        return this.#NOME_FAN_PJ;
    }

    set NOME_FAN_PJ(value) {
        this.#NOME_FAN_PJ = value;
    }

    async cadastrarPJ() {

        let sql = "INSERT INTO PESSOA_JURIDICA (CNPJ_PJ, RAZAO_PJ, NOME_FAN_PJ, EMAIL_PESSOA, TELEFONE_PESSOA) VALUES (?,?,?,?,?)";
        let values = [this.#CNPJ_PJ, this.#RAZAO_PJ, this.#NOME_FAN_PJ, this.EMAIL_PESSOA, this.TELEFONE_PESSOA];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async atualizarPJ() {

        let sql = "UPDATE PESSOA_JURIDICA SET CNPJ_PJ = ?, RAZAO_PJ = ?, NOME_FAN_PJ = ?, EMAIL_PESSOA = ?, TELEFONE_PESSOA = ? WHERE COD_PESSOA = ?";
        let values = [this.#CNPJ_PJ, this.#RAZAO_PJ, this.#NOME_FAN_PJ, this.EMAIL_PESSOA, this.TELEFONE_PESSOA, this.COD_PESSOA];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarPJ() {

        let sql = "SELECT * FROM PESSOA_JURIDICA";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {

            let linha = linhas[i];
            let pessoaJuridica = new PessoaJuridicaModel(linha["COD_PESSOA"], linha["CNPJ_PJ"], linha["RAZAO_PJ"], linha["NOME_FAN_PJ"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"]);

            lista.push(pessoaJuridica);
        }

        return lista;
    }

    async excluirPJ(id) {

        let sql = "DELETE FROM PESSOA_JURIDICA WHERE COD_PESSOA = ?";
        let value = [id];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, value);

        return result;
    }

    async obterPorId(id) {

        let sql = "SELECT * FROM PESSOA_JURIDICA WHERE COD_PESSOA = ?";
        let value = [id];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, value);

        if (linhas.length > 0) {

            let linha = linhas[0];
            let pessoaJuridica = new PessoaJuridicaModel(linha["COD_PESSOA"], linha["CNPJ_PJ"], linha["RAZAO_PJ"], linha["NOME_FAN_PJ"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"]);

            return pessoaJuridica;

        } else {

            return null;
        }
    }
}

module.exports = PessoaJuridicaModel;