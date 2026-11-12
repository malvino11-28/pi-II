const Database = require("../database/database");

class EnderecoModel {
    #COD_END;
    #COD_PESSOA;
    #RUA_END;
    #NUM_END;
    #BAIRRO_END;
    #CIDADE_END;
    #ESTADO_END;
    #CEP_END;

    constructor(id, cod_pessoa, rua, numero, bairro, cidade, estado, cep) {
        this.#COD_END = id;
        this.#COD_PESSOA = cod_pessoa;
        this.#RUA_END = rua;
        this.#NUM_END = numero;
        this.#BAIRRO_END = bairro;
        this.#CIDADE_END = cidade;
        this.#ESTADO_END = estado;
        this.#CEP_END = cep;
    }

    get COD_END() { return this.#COD_END; }
    set COD_END(v) { this.#COD_END = v; }

    get COD_PESSOA() { return this.#COD_PESSOA; }
    set COD_PESSOA(v) { this.#COD_PESSOA = v; }

    get RUA_END() { return this.#RUA_END; }
    set RUA_END(v) { this.#RUA_END = v; }

    get NUM_END() { return this.#NUM_END; }
    set NUM_END(v) { this.#NUM_END = v; }

    get BAIRRO_END() { return this.#BAIRRO_END; }
    set BAIRRO_END(v) { this.#BAIRRO_END = v; }

    get CIDADE_END() { return this.#CIDADE_END; }
    set CIDADE_END(v) { this.#CIDADE_END = v; }

    get ESTADO_END() { return this.#ESTADO_END; }
    set ESTADO_END(v) { this.#ESTADO_END = v; }

    get CEP_END() { return this.#CEP_END; }
    set CEP_END(v) { this.#CEP_END = v; }

    async cadastrarEndereco() {
        let sql = "INSERT INTO ENDERECO (COD_PESSOA, RUA_END, NUM_END, BAIRRO_END, CIDADE_END, ESTADO_END, CEP_END) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let values = [this.#COD_PESSOA, this.#RUA_END, this.#NUM_END, this.#BAIRRO_END, this.#CIDADE_END, this.#ESTADO_END, this.#CEP_END];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async listarEnderecos() {
        let sql = "SELECT * FROM ENDERECO";
        let db = new Database();
        let linhas = await db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i];
            let endereco = new EnderecoModel(linha["COD_END"], linha["COD_PESSOA"], linha["RUA_END"], linha["NUM_END"], linha["BAIRRO_END"], linha["CIDADE_END"], linha["ESTADO_END"], linha["CEP_END"]);
            lista.push(endereco);
        }

        return lista;
    }

    async atualizarEndereco() {
        let sql = "UPDATE ENDERECO SET COD_PESSOA = ?, RUA_END = ?, NUM_END = ?, BAIRRO_END = ?, CIDADE_END = ?, ESTADO_END = ?, CEP_END = ? WHERE COD_END = ?";
        let values = [this.#COD_PESSOA, this.#RUA_END, this.#NUM_END, this.#BAIRRO_END, this.#CIDADE_END, this.#ESTADO_END, this.#CEP_END, this.#COD_END];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async excluirEndereco(id) {
        let sql = "DELETE FROM ENDERECO WHERE COD_END = ?";
        let values = [id];
        let db = new Database();
        let result = await db.ExecutaComandoNonQuery(sql, values);

        return result;
    }

    async obterPorId(id) {
        let sql = "SELECT * FROM ENDERECO WHERE COD_END = ?";
        let values = [id];
        let db = new Database();
        let linhas = await db.ExecutaComando(sql, values);

        if (linhas.length > 0) {
            let linha = linhas[0];
            let endereco = new EnderecoModel(
                linha["COD_END"],
                linha["COD_PESSOA"],
                linha["RUA_END"],
                linha["NUM_END"],
                linha["BAIRRO_END"],
                linha["CIDADE_END"],
                linha["ESTADO_END"],
                linha["CEP_END"]
            );

            return endereco;
        }

        return null;
    }
}

module.exports = EnderecoModel;
