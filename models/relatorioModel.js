const Database = require("../database/database");
const db = new Database();

class RelatorioModel {
    async listarDescartes(f) {
        let sql = `
            SELECT D.COD_DESC,
                DATE_FORMAT(D.DATA_DESC, '%d/%m/%Y') AS DATA,
                P.NOME_PROD, P.UNI_MEDIDA_PROD,
                M.NOME_MAR, C.NOME_CAT, L.NUM_LOTE,
                I.QTD_DESC, I.MOTIVO_DESC,
                F.NOME_PF AS FUNCIONARIO
            FROM DESCARTE D
            INNER JOIN ITEM_DESC I ON I.COD_DESC = D.COD_DESC
            INNER JOIN PRODUTO P ON P.COD_PROD = I.COD_PROD
            INNER JOIN LOTE L ON L.COD_LOTE = I.COD_LOTE
            LEFT JOIN MARCA M ON M.COD_MAR = P.COD_MAR
            LEFT JOIN CATEGORIA C ON C.COD_CAT = P.COD_CAT
            LEFT JOIN PESSOA_FISICA F ON F.COD_PESSOA = D.COD_PESSOA
            WHERE 1 = 1
        `;

        let valores = [];

        if (f.inicio) {
            sql += " AND D.DATA_DESC >= ?";
            valores.push(f.inicio);
        }

        if (f.fim) {
            sql += " AND D.DATA_DESC <= ?";
            valores.push(f.fim);
        }

        if (f.marca) {
            sql += " AND P.COD_MAR = ?";
            valores.push(f.marca);
        }

        if (f.categoria) {
            sql += " AND P.COD_CAT = ?";
            valores.push(f.categoria);
        }

        if (f.produto) {
            sql += " AND P.COD_PROD = ?";
            valores.push(f.produto);
        }

        sql += `
            ORDER BY D.DATA_DESC DESC, D.COD_DESC DESC,
                P.NOME_PROD, L.COD_LOTE
        `;

        return await db.ExecutaComando(sql, valores);
    }

    async listarPromocoes(f) {
        let sql = `
            SELECT PR.COD_PROMO, PR.NOME_PROMO, PR.DESCONT_PER_PROMO,
                DATE_FORMAT(PR.DATA_INIC_PROMO, '%d/%m/%Y') AS INICIO,
                DATE_FORMAT(PR.DATA_FIM_PROMO, '%d/%m/%Y') AS FIM,
                CASE
                    WHEN CURDATE() < PR.DATA_INIC_PROMO THEN 'Programada'
                    WHEN CURDATE() > PR.DATA_FIM_PROMO THEN 'Encerrada'
                    ELSE 'Ativa'
                END AS SITUACAO,
                P.NOME_PROD, P.UNI_MEDIDA_PROD,
                M.NOME_MAR, C.NOME_CAT, L.NUM_LOTE, I.VALOR_PROMO
            FROM PROMOCAO PR
            INNER JOIN ITEM_PROMO I ON I.COD_PROMO = PR.COD_PROMO
            INNER JOIN PRODUTO P ON P.COD_PROD = I.COD_PROD
            INNER JOIN LOTE L ON L.COD_LOTE = I.COD_LOTE
            LEFT JOIN MARCA M ON M.COD_MAR = P.COD_MAR
            LEFT JOIN CATEGORIA C ON C.COD_CAT = P.COD_CAT
            WHERE 1 = 1
        `;

        let valores = [];

        // busca promoções que tenham algum dia dentro do período informado.
        if (f.inicio) {
            sql += " AND PR.DATA_FIM_PROMO >= ?";
            valores.push(f.inicio);
        }

        if (f.fim) {
            sql += " AND PR.DATA_INIC_PROMO <= ?";
            valores.push(f.fim);
        }

        if (f.marca) {
            sql += " AND P.COD_MAR = ?";
            valores.push(f.marca);
        }

        if (f.categoria) {
            sql += " AND P.COD_CAT = ?";
            valores.push(f.categoria);
        }

        if (f.percentual) {
            sql += " AND PR.DESCONT_PER_PROMO = ?";
            valores.push(f.percentual);
        }

        if (f.status == "Programada") {
            sql += " AND CURDATE() < PR.DATA_INIC_PROMO";
        }

        if (f.status == "Ativa") {
            sql += `
                AND CURDATE()
                    BETWEEN PR.DATA_INIC_PROMO AND PR.DATA_FIM_PROMO
            `;
        }

        if (f.status == "Encerrada") {
            sql += " AND CURDATE() > PR.DATA_FIM_PROMO";
        }

        sql += `
            ORDER BY PR.DATA_INIC_PROMO DESC, PR.COD_PROMO DESC,
                P.NOME_PROD, L.COD_LOTE
        `;

        return await db.ExecutaComando(sql, valores);
    }

    async listarCancelamentos(f) {
        let sql = `
            SELECT P.COD_PED,
                DATE_FORMAT(P.DATA_PED, '%d/%m/%Y') AS DATA,
                F.NOME_PF AS CLIENTE, P.STATUS_PED, P.TOTAL_PED
            FROM PEDIDO P
            LEFT JOIN PESSOA_FISICA F ON F.COD_PESSOA = P.COD_CLI
            WHERE P.STATUS_PED = 'Cancelado'
        `;

        let valores = [];

        if (f.inicio) {
            sql += " AND P.DATA_PED >= ?";
            valores.push(f.inicio);
        }

        if (f.fim) {
            sql += " AND P.DATA_PED <= ?";
            valores.push(f.fim);
        }

        if (f.cliente) {
            sql += " AND P.COD_CLI = ?";
            valores.push(f.cliente);
        }

        sql += " ORDER BY P.DATA_PED DESC, P.COD_PED DESC";

        return await db.ExecutaComando(sql, valores);
    }

    async listarEntregas(f) {
        let sql = `
            SELECT E.COD_ENT, E.COD_PED, E.STATUS_ENT,
                DATE_FORMAT(E.DATA_ENT, '%d/%m/%Y') AS DATA,
                F.NOME_PF AS CLIENTE,
                EN.RUA_END, EN.NUM_END, EN.BAIRRO_END,
                EN.CIDADE_END, EN.ESTADO_END
            FROM ENTREGA E
            INNER JOIN PEDIDO P ON P.COD_PED = E.COD_PED
            LEFT JOIN PESSOA_FISICA F ON F.COD_PESSOA = P.COD_CLI
            LEFT JOIN ENDERECO EN ON EN.COD_END = E.COD_END
            WHERE 1 = 1
        `;

        let valores = [];

        if (f.inicio) {
            sql += " AND E.DATA_ENT >= ?";
            valores.push(f.inicio);
        }

        if (f.fim) {
            sql += " AND E.DATA_ENT <= ?";
            valores.push(f.fim);
        }

        if (f.status) {
            sql += " AND E.STATUS_ENT = ?";
            valores.push(f.status);
        }

        if (f.cliente) {
            sql += " AND P.COD_CLI = ?";
            valores.push(f.cliente);
        }

        if (f.regiao) {
            sql += `
                AND (
                    EN.BAIRRO_END LIKE ?
                    OR EN.CIDADE_END LIKE ?
                    OR EN.ESTADO_END LIKE ?
                )
            `;

            let busca = "%" + f.regiao + "%";
            valores.push(busca, busca, busca);
        }

        sql += " ORDER BY E.DATA_ENT DESC, E.COD_ENT DESC";

        return await db.ExecutaComando(sql, valores);
    }

    async listarPedidos(f) {
        let sql = `
            SELECT P.COD_PED, P.STATUS_PED, P.TOTAL_PED,
                DATE_FORMAT(P.DATA_PED, '%d/%m/%Y') AS DATA,
                F.NOME_PF AS CLIENTE,
                R.NOME_RECEB AS RECEBIMENTO
            FROM PEDIDO P
            LEFT JOIN PESSOA_FISICA F ON F.COD_PESSOA = P.COD_CLI
            LEFT JOIN FORMA_RECEBIMENTO R
                ON R.COD_RECEB = P.COD_RECEB
            WHERE 1 = 1
        `;

        let valores = [];

        if (f.inicio) {
            sql += " AND P.DATA_PED >= ?";
            valores.push(f.inicio);
        }

        if (f.fim) {
            sql += " AND P.DATA_PED <= ?";
            valores.push(f.fim);
        }

        if (f.status) {
            sql += " AND P.STATUS_PED = ?";
            valores.push(f.status);
        }

        if (f.cliente) {
            sql += " AND P.COD_CLI = ?";
            valores.push(f.cliente);
        }

        if (f.recebimento) {
            sql += " AND P.COD_RECEB = ?";
            valores.push(f.recebimento);
        }

        sql += " ORDER BY P.DATA_PED DESC, P.COD_PED DESC";

        return await db.ExecutaComando(sql, valores);
    }

    async listarProdutos(f) {
        let sql = `
            SELECT P.COD_PROD, P.NOME_PROD, P.UNI_MEDIDA_PROD,
                P.VALOR_UNI_PROD, M.NOME_MAR, C.NOME_CAT,
                COALESCE(E.ESTOQUE_TOTAL, 0) AS ESTOQUE_TOTAL,
                COALESCE(E.ESTOQUE_DISPONIVEL, 0)
                    AS ESTOQUE_DISPONIVEL,
                DATE_FORMAT(E.MENOR_VALIDADE, '%d/%m/%Y')
                    AS VALIDADE,
                COALESCE(Q.QTD_PEDIDA, 0) AS QTD_PEDIDA
            FROM PRODUTO P
            LEFT JOIN MARCA M ON M.COD_MAR = P.COD_MAR
            LEFT JOIN CATEGORIA C ON C.COD_CAT = P.COD_CAT

            LEFT JOIN (
                SELECT COD_PROD,
                    SUM(EST_LOTE) AS ESTOQUE_TOTAL,
                    SUM(
                        CASE
                            WHEN DATA_VENC_LOTE >= CURDATE()
                            THEN EST_LOTE
                            ELSE 0
                        END
                    ) AS ESTOQUE_DISPONIVEL,
                    MIN(
                        CASE
                            WHEN EST_LOTE > 0
                            THEN DATA_VENC_LOTE
                        END
                    ) AS MENOR_VALIDADE
                FROM LOTE
                GROUP BY COD_PROD
            ) E ON E.COD_PROD = P.COD_PROD

            LEFT JOIN (
                SELECT I.COD_PROD, SUM(I.QTD_PROD) AS QTD_PEDIDA
                FROM ITEM_PEDIDO I
                INNER JOIN PEDIDO PE ON PE.COD_PED = I.COD_PED
                WHERE PE.STATUS_PED <> 'Cancelado'
                GROUP BY I.COD_PROD
            ) Q ON Q.COD_PROD = P.COD_PROD

            WHERE 1 = 1
        `;

        let valores = [];

        if (f.marca) {
            sql += " AND P.COD_MAR = ?";
            valores.push(f.marca);
        }

        if (f.categoria) {
            sql += " AND P.COD_CAT = ?";
            valores.push(f.categoria);
        }

        if (f.estoqueMin) {
            sql += " AND COALESCE(E.ESTOQUE_DISPONIVEL, 0) >= ?";
            valores.push(f.estoqueMin);
        }

        if (f.estoqueMax) {
            sql += " AND COALESCE(E.ESTOQUE_DISPONIVEL, 0) <= ?";
            valores.push(f.estoqueMax);
        }

        if (f.validade) {
            sql += `
                AND EXISTS (
                    SELECT 1
                    FROM LOTE LV
                    WHERE LV.COD_PROD = P.COD_PROD
                        AND LV.EST_LOTE > 0
                        AND LV.DATA_VENC_LOTE <= ?
                )
            `;

            valores.push(f.validade);
        }

        if (f.fornecedor) {
            sql += `
                AND EXISTS (
                    SELECT 1
                    FROM ITEM_COMPRA IC
                    INNER JOIN COMPRA CO
                        ON CO.COD_COMPRA = IC.COD_COMPRA
                    WHERE IC.COD_PROD = P.COD_PROD
                        AND CO.COD_PESSOA = ?
                )
            `;

            valores.push(f.fornecedor);
        }

        if (f.ordem == "mais") {
            sql += `
                ORDER BY QTD_PEDIDA DESC, P.NOME_PROD, P.COD_PROD
            `;
        } else if (f.ordem == "menos") {
            sql += `
                ORDER BY QTD_PEDIDA ASC, P.NOME_PROD, P.COD_PROD
            `;
        } else {
            sql += " ORDER BY P.NOME_PROD, P.COD_PROD";
        }

        return await db.ExecutaComando(sql, valores);
    }

    async listarMarcas() {
        return await db.ExecutaComando(`
            SELECT COD_MAR, NOME_MAR
            FROM MARCA
            ORDER BY NOME_MAR
        `);
    }

    async listarCategorias() {
        return await db.ExecutaComando(`
            SELECT COD_CAT, NOME_CAT
            FROM CATEGORIA
            ORDER BY NOME_CAT
        `);
    }

    async listarNomesProdutos() {
        return await db.ExecutaComando(`
            SELECT COD_PROD, NOME_PROD
            FROM PRODUTO
            ORDER BY NOME_PROD
        `);
    }

    async listarClientes() {
        return await db.ExecutaComando(`
            SELECT COD_PESSOA, NOME_PF
            FROM PESSOA_FISICA
            WHERE COD_PESSOA IN (
                SELECT COD_CLI FROM PEDIDO
            )
            ORDER BY NOME_PF
        `);
    }

    async listarFormasRecebimento() {
        return await db.ExecutaComando(`
            SELECT COD_RECEB, NOME_RECEB
            FROM FORMA_RECEBIMENTO
            ORDER BY NOME_RECEB
        `);
    }

    async listarFornecedores() {
        return await db.ExecutaComando(`
            SELECT COD_PESSOA, RAZAO_PJ
            FROM PESSOA_JURIDICA
            ORDER BY RAZAO_PJ
        `);
    }
}

module.exports = RelatorioModel;