-- ==========================================
-- CLIENTE
-- ==========================================

CREATE TABLE CLIENTE (
    COD_CLI INT PRIMARY KEY AUTO_INCREMENT,
    NOME_CLI VARCHAR(150) NOT NULL,
    CPF_CLI VARCHAR(11) NOT NULL UNIQUE,
    RG_CLI VARCHAR(14) UNIQUE,
    DATA_NASC_CLI DATE NOT NULL,
    EMAIL_CLI VARCHAR(200) NOT NULL UNIQUE,
    TELEFONE_CLI VARCHAR(15),
    SENHA_CLI VARCHAR(255) NOT NULL
);

-- ==========================================
-- ASSINATURA
-- ==========================================

CREATE TABLE ASSINATURA (
    COD_CLI INT NOT NULL PRIMARY KEY,
    STATUS_ASS ENUM('Ativa', 'Vencida', 'Inativa') NOT NULL,
    PLANO_ASS VARCHAR(20) NOT NULL,
    VENC_ASS DATE NOT NULL,

    CONSTRAINT fk_cli_cod
        FOREIGN KEY (COD_CLI)
        REFERENCES CLIENTE (COD_CLI)
);

-- ==========================================
-- FUNCIONARIO
-- ==========================================

CREATE TABLE FUNCIONARIO (
    COD_FUN INT PRIMARY KEY AUTO_INCREMENT,
    STATUS_FUNC ENUM('Ativo', 'Inativo', 'Afastado', 'Férias') NOT NULL,
    NOME_FUN VARCHAR(150) NOT NULL,
    MATRICULA_FUN VARCHAR(4) NOT NULL UNIQUE,
    CARGO_FUN VARCHAR(30) NOT NULL
);

-- ==========================================
-- FORNECEDOR
-- ==========================================

CREATE TABLE FORNECEDOR (
    COD_FOR INT PRIMARY KEY AUTO_INCREMENT,
    CNPJ_FOR VARCHAR(14) NOT NULL UNIQUE,
    RAZAO_FOR VARCHAR(60) NOT NULL UNIQUE,
    NOME_FAN_FOR VARCHAR(60),
    EMAIL_FOR VARCHAR(200) NOT NULL UNIQUE,
    TELEFONE_FOR VARCHAR(15) NOT NULL
);

-- ==========================================
-- ENDERECO
-- ==========================================

CREATE TABLE ENDERECO (
    COD_END INT PRIMARY KEY AUTO_INCREMENT,
    COD_CLI INT,
    COD_FOR INT,

    RUA_END VARCHAR(255) NOT NULL,
    NUM_END VARCHAR(25),
    BAIRRO_END VARCHAR(255) NOT NULL,
    CIDADE_END VARCHAR(255) NOT NULL,
    ESTADO_END VARCHAR(2) NOT NULL,
    CEP_END VARCHAR(8) NOT NULL,

    CONSTRAINT fk_end_cli
        FOREIGN KEY (COD_CLI)
        REFERENCES CLIENTE (COD_CLI),

    CONSTRAINT fk_end_for
        FOREIGN KEY (COD_FOR)
        REFERENCES FORNECEDOR (COD_FOR),

    CHECK (
        (COD_CLI IS NOT NULL AND COD_FOR IS NULL)
        OR
        (COD_FOR IS NOT NULL AND COD_CLI IS NULL)
    )
);