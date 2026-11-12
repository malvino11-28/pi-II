const Database = require("../database/database");
const PessoaModel = require("./pessoaModel");

class PessoaFisicaModel extends PessoaModel {

    #NOME_PF;
    #CPF_PF;
    #RG_PF;
    #DATA_NASC_PF;
    #SENHA_PF;
    #STATUS_PLANO;
    #MATRICULA_FUN;
    #CARGO_FUN;
    #STATUS_FUN;

    get NOME_PF() {
        return this.#NOME_PF;
    }

    set NOME_PF(value) {
        this.#NOME_PF = value;
    }

    get CPF_PF() {
        return this.#CPF_PF;
    }

    set CPF_PF(value) {
        this.#CPF_PF = value;
    }

    get RG_PF() {
        return this.#RG_PF;
    }

    set RG_PF(value) {
        this.#RG_PF = value;
    }

    get DATA_NASC_PF() {
        return this.#DATA_NASC_PF;
    }

    set DATA_NASC_PF(value) {
        this.#DATA_NASC_PF = value;
    }

    get SENHA_PF() {
        return this.#SENHA_PF;
    }

    set SENHA_PF(value) {
        this.#SENHA_PF = value;
    }

    get STATUS_PLANO() {
        return this.#STATUS_PLANO;
    }

    set STATUS_PLANO(value) {
        this.#STATUS_PLANO = value;
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

    get STATUS_FUN() {
        return this.#STATUS_FUN;
    }

    set STATUS_FUN(value) {
        this.#STATUS_FUN = value;
    }

    constructor(cod, nome, cpf, rg, dt_nasc, email, telefone, senha, statusPlano = null, matricula = null, cargo = null, statusFuncionario = null) {

        super(cod, email, telefone);

        this.#NOME_PF = nome;
        this.#CPF_PF = cpf;
        this.#RG_PF = rg;
        this.#DATA_NASC_PF = dt_nasc;
        this.#SENHA_PF = senha;
        this.#STATUS_PLANO = statusPlano;
        this.#MATRICULA_FUN = matricula;
        this.#CARGO_FUN = cargo;
        this.#STATUS_FUN = statusFuncionario;
    }

    async cadastrarPF() {

        let sql = "INSERT INTO PESSOA_FISICA (NOME_PF, CPF_PF, RG_PF, DATA_NASC_PF, EMAIL_PESSOA, TELEFONE_PESSOA, SENHA_PF, MATRICULA_FUN, CARGO_FUN, STATUS_FUN) VALUES (?,?,?,?,?,?,?,?,?,?)";
        let values = [this.#NOME_PF, this.#CPF_PF, this.#RG_PF, this.#DATA_NASC_PF, this.EMAIL_PESSOA, this.TELEFONE_PESSOA, this.#SENHA_PF, this.#MATRICULA_FUN, this.#CARGO_FUN, this.#STATUS_FUN];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async atualizarPF() {

        let sql = "UPDATE PESSOA_FISICA SET NOME_PF = ?, CPF_PF = ?, RG_PF = ?, DATA_NASC_PF = ?, EMAIL_PESSOA = ?, TELEFONE_PESSOA = ?";
        let values = [this.#NOME_PF, this.#CPF_PF, this.#RG_PF, this.#DATA_NASC_PF, this.EMAIL_PESSOA, this.TELEFONE_PESSOA];

        if (this.#SENHA_PF) {
            sql += ", SENHA_PF = ?";
            values.push(this.#SENHA_PF);
        }

        sql += " WHERE COD_PESSOA = ?";
        values.push(this.COD_PESSOA);

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async atualizarDadosFun() {

        let sql = "UPDATE PESSOA_FISICA SET MATRICULA_FUN = ?, CARGO_FUN = ?, STATUS_FUN = ? WHERE COD_PESSOA = ?";
        let values = [this.#MATRICULA_FUN, this.#CARGO_FUN, this.#STATUS_FUN, this.COD_PESSOA];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarPF() {

        let sql = "SELECT PF.*, CASE WHEN A.COD_PESSOA IS NULL THEN 'Pendente de plano' WHEN A.STATUS_ASS = 'Ativa' THEN 'Ativo' WHEN A.STATUS_ASS = 'Vencida' THEN 'Vencido' WHEN A.STATUS_ASS = 'Inativa' THEN 'Inativo' END AS STATUS_PLANO FROM PESSOA_FISICA PF LEFT JOIN ASSINATURA A ON PF.COD_PESSOA = A.COD_PESSOA";

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {

            let linha = linhas[i];
            let pessoaFisica = new PessoaFisicaModel(linha["COD_PESSOA"], linha["NOME_PF"], linha["CPF_PF"], linha["RG_PF"], linha["DATA_NASC_PF"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"], linha["SENHA_PF"], linha["STATUS_PLANO"], linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["STATUS_FUN"]);

            lista.push(pessoaFisica);
        }

        return lista;
    }

    async listarFun() {

        let sql = "SELECT PF.*, CASE WHEN A.COD_PESSOA IS NULL THEN 'Pendente de plano' WHEN A.STATUS_ASS = 'Ativa' THEN 'Ativo' WHEN A.STATUS_ASS = 'Vencida' THEN 'Vencido' WHEN A.STATUS_ASS = 'Inativa' THEN 'Inativo' END AS STATUS_PLANO FROM PESSOA_FISICA PF LEFT JOIN ASSINATURA A ON PF.COD_PESSOA = A.COD_PESSOA WHERE PF.MATRICULA_FUN IS NOT NULL";

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {

            let linha = linhas[i];
            let pessoaFisica = new PessoaFisicaModel(linha["COD_PESSOA"], linha["NOME_PF"], linha["CPF_PF"], linha["RG_PF"], linha["DATA_NASC_PF"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"], linha["SENHA_PF"], linha["STATUS_PLANO"], linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["STATUS_FUN"]);

            lista.push(pessoaFisica);
        }

        return lista;
    }

    async excluirPF(id) {

        let sql = "DELETE FROM PESSOA_FISICA WHERE COD_PESSOA = ?";
        let value = [id];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, value);

        return result;
    }

    async obterPorId(id) {

        let sql = "SELECT * FROM PESSOA_FISICA WHERE COD_PESSOA = ?";
        let value = [id];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, value);

        if (linhas.length > 0) {

            let linha = linhas[0];
            let pessoaFisica = new PessoaFisicaModel(linha["COD_PESSOA"], linha["NOME_PF"], linha["CPF_PF"], linha["RG_PF"], linha["DATA_NASC_PF"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"], linha["SENHA_PF"], null, linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["STATUS_FUN"]);

            return pessoaFisica;

        } else {

            return null;
        }
    }

    async validar(id, senha, tipoLogin) {

        let sql;

        if (tipoLogin === "funcionario") {

            sql = "SELECT * FROM PESSOA_FISICA WHERE MATRICULA_FUN = ? AND SENHA_PF = ? AND STATUS_FUN = 'Ativo'";

        } else if (tipoLogin === "cliente") {

            sql = "SELECT * FROM PESSOA_FISICA WHERE EMAIL_PESSOA = ? AND SENHA_PF = ?";

        } else {

            return null;
        }

        let values = [id, senha];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, values);

        if (linhas.length > 0) {

            let linha = linhas[0];
            return new PessoaFisicaModel(linha["COD_PESSOA"], linha["NOME_PF"], linha["CPF_PF"], linha["RG_PF"], linha["DATA_NASC_PF"], linha["EMAIL_PESSOA"], linha["TELEFONE_PESSOA"], linha["SENHA_PF"], null, linha["MATRICULA_FUN"], linha["CARGO_FUN"], linha["STATUS_FUN"]);
        }

        return null;
    }
}

module.exports = PessoaFisicaModel;