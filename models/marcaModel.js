class MarcaModel {
  #COD_MAR;
  #NOME_MAR;

  get COD_MAR() {
    return this.#COD_MAR;
  }
  set COD_MAR(v) {
    this.#COD_MAR = v;
  }

  get NOME_MAR() {
    return this.#NOME_MAR;
  }
  set NOME_MAR(v) {
    this.#NOME_MAR = v;
  }

  constructor(cod, nome) {
    this.#COD_MAR = cod;
    this.#NOME_MAR = nome;
  }
}

// CREATE TABLE MARCA (
//     COD_MAR INT PRIMARY KEY AUTO_INCREMENT,
//     NOME_MAR VARCHAR(50) NOT NULL UNIQUE
// );
