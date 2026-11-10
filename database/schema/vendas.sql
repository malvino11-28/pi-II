-- ==========================================
-- FORMA DE PAGAMENTO
-- ==========================================

CREATE TABLE FORMA_PAGAMENTO (
    COD_PAG INT PRIMARY KEY AUTO_INCREMENT,
    NOME_PAG VARCHAR(15) NOT NULL UNIQUE
);

-- ==========================================
-- STATUS DO PEDIDO
-- ==========================================

CREATE TABLE STATUS_PEDIDO (
    COD_STATUS INT PRIMARY KEY AUTO_INCREMENT,
    NOME_STATUS VARCHAR(100) NOT NULL UNIQUE
);

-- ==========================================
-- PEDIDO
-- ==========================================

CREATE TABLE PEDIDO (
    COD_PED INT PRIMARY KEY AUTO_INCREMENT,
    COD_STATUS INT NOT NULL,
    COD_CLI INT NOT NULL,
    COD_PROMO INT,
    COD_PAG INT NOT NULL,

    DATA_PED DATE NOT NULL,
    TOTAL_PED NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_pedido_status
        FOREIGN KEY (COD_STATUS)
        REFERENCES STATUS_PEDIDO (COD_STATUS),

    CONSTRAINT fk_pedido_cli
        FOREIGN KEY (COD_CLI)
        REFERENCES CLIENTE (COD_CLI),

	CONSTRAINT fk_ped_pro 
        FOREIGN KEY (COD_PROMO) 
        REFERENCES PROMOCAO (COD_PROMO),

    CONSTRAINT fk_ped_pag 
        FOREIGN KEY (COD_PAG) 
        REFERENCES FORMA_PAGAMENTO (COD_PAG)
);

-- ==========================================
-- ITEM DO PEDIDO
-- ==========================================

CREATE TABLE ITEM_PEDIDO (
    COD_PED INT NOT NULL,
    COD_PROD INT NOT NULL,

    QTD_PROD NUMERIC(5, 2) NOT NULL,
    VALOR_UNI NUMERIC(8, 2) NOT NULL,

    CONSTRAINT pk_item_prod_ped
        PRIMARY KEY (COD_PED, COD_PROD),

    CONSTRAINT fk_item_ped
        FOREIGN KEY (COD_PED)
        REFERENCES PEDIDO (COD_PED),

    CONSTRAINT fk_item_prod
        FOREIGN KEY (COD_PROD)
        REFERENCES PRODUTO (COD_PROD)
);

-- ==========================================
-- LOTES UTILIZADOS NO ITEM
-- ==========================================

CREATE TABLE ITEM_PEDIDO_LOTE (
    COD_PED INT NOT NULL,
    COD_PROD INT NOT NULL,
    COD_LOTE INT NOT NULL,

    QTD_LOTE NUMERIC(10, 2) NOT NULL,

    CONSTRAINT pk_item_pedido_lote
        PRIMARY KEY (COD_PED, COD_PROD, COD_LOTE),

    CONSTRAINT fk_ipl_item
        FOREIGN KEY (COD_PED, COD_PROD)
        REFERENCES ITEM_PEDIDO (COD_PED, COD_PROD),

    CONSTRAINT fk_ipl_lote
        FOREIGN KEY (COD_LOTE, COD_PROD)
        REFERENCES LOTE (COD_LOTE, COD_PROD),

    CHECK (QTD_LOTE > 0)
);

-- ==========================================
-- ITENS COM PROMOÇÃO DE UM RESPECTIVO LOTE
-- ==========================================

CREATE TABLE ITEM_PROMOCAO_LOTE (
    COD_PROMO INT NOT NULL,
    COD_LOTE INT NOT NULL,

    PRIMARY KEY (COD_PROMO, COD_LOTE),

    CONSTRAINT fk_ipl_promocao
        FOREIGN KEY (COD_PROMO)
        REFERENCES PROMOCAO (COD_PROMO),

    CONSTRAINT fk_ipl_lote
        FOREIGN KEY (COD_LOTE)
        REFERENCES LOTE (COD_LOTE)
);