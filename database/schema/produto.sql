-- ==========================================
-- CATEGORIA
-- ==========================================

CREATE TABLE CATEGORIA (
    COD_CAT INT PRIMARY KEY AUTO_INCREMENT,
    NOME_CAT VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- MARCA
-- ==========================================

CREATE TABLE MARCA (
    COD_MAR INT PRIMARY KEY AUTO_INCREMENT,
    NOME_MAR VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- PRODUTO
-- ==========================================

CREATE TABLE PRODUTO (
    COD_PROD INT PRIMARY KEY AUTO_INCREMENT,
    COD_MAR INT NOT NULL,
    COD_CAT INT NOT NULL,

    NOME_PROD VARCHAR(100) NOT NULL,
    DESC_RED_PROD VARCHAR(255) NOT NULL,
    DESC_PROD TEXT NOT NULL,

    UNI_MEDIDA_PROD ENUM('KG', 'G', 'UN', 'L', 'ML') NOT NULL,
    VALOR_UNI_PROD NUMERIC(6, 2) NOT NULL,

    CONSTRAINT fk_prod_mar
        FOREIGN KEY (COD_MAR)
        REFERENCES MARCA (COD_MAR),

    CONSTRAINT fk_prod_cat
        FOREIGN KEY (COD_CAT)
        REFERENCES CATEGORIA (COD_CAT),

    CHECK (VALOR_UNI_PROD >= 0)
);

-- ==========================================
-- PROMOCAO
-- ==========================================

CREATE TABLE PROMOCAO (
    COD_PROMO INT PRIMARY KEY AUTO_INCREMENT,
    NOME_PROMO VARCHAR(100) NOT NULL,

    TIPO_PROMO ENUM('Manual', 'Vencimento')
        DEFAULT 'Manual' NOT NULL,

    DESCONT_MON_PROMO NUMERIC(8, 2),
    DESCONT_PER_PROMO NUMERIC(5, 2),

    DATA_INIC_PROMO DATE NOT NULL,
    DATA_FIM_PROMO DATE NOT NULL,

    CHECK (DATA_FIM_PROMO >= DATA_INIC_PROMO),

    CHECK (
        DESCONT_MON_PROMO IS NULL
        OR DESCONT_MON_PROMO > 0
    ),

    CHECK (
        DESCONT_PER_PROMO IS NULL
        OR (
            DESCONT_PER_PROMO > 0
            AND DESCONT_PER_PROMO <= 100
        )
    ),

    CHECK (
        (DESCONT_MON_PROMO IS NOT NULL AND DESCONT_PER_PROMO IS NULL)
        OR
        (DESCONT_PER_PROMO IS NOT NULL AND DESCONT_MON_PROMO IS NULL)
    )
);

-- ==========================================
-- LOTE
-- ==========================================

CREATE TABLE LOTE (
    COD_LOTE INT PRIMARY KEY AUTO_INCREMENT,
    COD_PROD INT NOT NULL,
    COD_PROMO INT,

    NUM_LOTE VARCHAR(50) NOT NULL,
    DATA_FAB_LOTE DATE,
    DATA_VENC_LOTE DATE NOT NULL,
    EST_LOTE NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_lote_prod
        FOREIGN KEY (COD_PROD)
        REFERENCES PRODUTO (COD_PROD),

    CONSTRAINT fk_lote_promo
        FOREIGN KEY (COD_PROMO)
        REFERENCES PROMOCAO (COD_PROMO),

    CONSTRAINT unq_lote_prod
        UNIQUE (COD_PROD, NUM_LOTE),

    CONSTRAINT unq_lote_cod_prod
        UNIQUE (COD_LOTE, COD_PROD),

    CHECK (EST_LOTE >= 0),

    CHECK (
        DATA_FAB_LOTE IS NULL
        OR DATA_VENC_LOTE > DATA_FAB_LOTE
    )
);

-- ==========================================
-- INFORMACOES NUTRICIONAIS
-- ==========================================

CREATE TABLE INF_NUTRICIONAIS (
    COD_NUTRI INT PRIMARY KEY AUTO_INCREMENT,
    COD_PROD INT NOT NULL,

    NUTRIENTE VARCHAR(50) NOT NULL,
    QTD_100G_NUTRI NUMERIC(8, 2) NOT NULL,
    UNI_NUTRI VARCHAR(10) NOT NULL,
    PERC_VD_NUTRI NUMERIC(5, 2),

    CONSTRAINT fk_nutri_prod
        FOREIGN KEY (COD_PROD)
        REFERENCES PRODUTO (COD_PROD),

    CONSTRAINT unq_prod_nutri
        UNIQUE (COD_PROD, NUTRIENTE)
);