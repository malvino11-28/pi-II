const Database = require("../database/database");

class ClienteModel {
    
    #COD_CLI;
    #NOME_CLI;
    #CPF_CLI
    #RG_CLI
    #DATA_NASC_CLI;
    #EMAIL_CLI;
    #CELULAR_CLI;
    #SENHA_CLI;
    #STATUS_PLANO;

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

    get CELULAR_CLI() {
        return this.#CELULAR_CLI;
    }

    set CELULAR_CLI(value) {
        this.#CELULAR_CLI = value;
    }

    get SENHA_CLI() {
        return this.#SENHA_CLI;
    }

    set SENHA_CLI(value) {
        this.#SENHA_CLI = value;
    }

    get STATUS_PLANO() {
        return this.#STATUS_PLANO;
    }

    set STATUS_PLANO(value) {
        this.#STATUS_PLANO = value;
    }

    constructor(cod, nome, cpf, rg, dt_nasc, email, celular, senha, status) {

        this.#COD_CLI = cod;
        this.#NOME_CLI = nome;
        this.#CPF_CLI = cpf;
        this.#RG_CLI = rg;
        this.#DATA_NASC_CLI = dt_nasc;
        this.#EMAIL_CLI = email;
        this.#CELULAR_CLI = celular;
        this.#SENHA_CLI = senha;
        this.#STATUS_PLANO = status;
    }

    async cadastrarCliente() {

        let sql = "INSERT INTO CLIENTE (NOME_CLI, CPF_CLI, RG_CLI, DATA_NASC_CLI, EMAIL_CLI, TELEFONE_CLI, SENHA_CLI) VALUES (?,?,?,?,?,?,?)";
        let values = [this.#NOME_CLI, this.#CPF_CLI, this.#RG_CLI, this.#DATA_NASC_CLI, this.#EMAIL_CLI, this.#CELULAR_CLI, this.#SENHA_CLI];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async atualizarCliente() {

        let sql = "UPDATE CLIENTE SET NOME_CLI = ?, CPF_CLI = ?, RG_CLI = ?, DATA_NASC_CLI = ?, EMAIL_CLI = ?, TELEFONE_CLI = ?, SENHA_CLI = ?";
        let values = [this.#NOME_CLI, this.#CPF_CLI, this.#RG_CLI, this.#DATA_NASC_CLI, this.#EMAIL_CLI, this.#CELULAR_CLI, this.#SENHA_CLI];

        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarClientes() {

        let sql = "SELECT C.*, CASE WHEN A.COD_CLI IS NULL THEN 'Pendente de plano' WHEN A.STATUS_ASS = 'Ativa' THEN 'Ativo' WHEN A.STATUS_ASS = 'Vencida' THEN 'Vencido' WHEN A.STATUS_ASS = 'Inativa' THEN 'Inativo' END AS STATUS_PLANO FROM CLIENTE C LEFT JOIN ASSINATURA A ON C.COD_CLI = A.COD_CLI";
        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql);
        let lista = [];

        for(let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let cliente = new ClienteModel(linha["COD_CLI"], linha["NOME_CLI"], linha["CPF_CLI"], linha["RG_CLI"], linha["DATA_NASC_CLI"], linha["EMAIL_CLI"], linha["TELEFONE_CLI"], linha["SENHA_CLI"], linha["STATUS_PLANO"]);

            lista.push(cliente);
        }

        return lista;
    }

    async excluirCliente(id) {

        let sql = "DELETE FROM CLIENTE WHERE COD_CLI = ?";
        let value = [id];
        let banco = new Database();
        let result = await banco.ExecutaComandoNonQuery(sql, value);

        return result;
    }

    async obterPorId(id) {

        let sql = "SELECT * FROM CLIENTE WHERE COD_CLI = ?";
        let value = [id];

        let banco = new Database();
        let linhas = await banco.ExecutaComando(sql, value);

        if(linhas.length > 0) {

            let linha = linhas[i];
            let cliente = new ClienteModel(linha["COD_CLI"], linha["NOME_CLI"], linha["CPF_CLI"], linha["RG_CLI"], linha["DATA_NASC_CLI"], linha["EMAIL_CLI"], linha["TELEFONE_CLI"], linha["SENHA_CLI"], linha["STATUS_PLANO"]);

            return cliente;

        } else {

            return null;
        }
    }

}

module.exports = ClienteModel;