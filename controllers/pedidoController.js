const PedidoModel = require("../models/pedidoModel");
const ItemPedidoModel = require("../models/itemPedidoModel");
const ProdutoModel = require("../models/produtoModel");
const LoteModel = require("../models/loteModel");
const FormaRecebimentoModel = require("../models/formaRecebimentoModel");
const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const ItemPromoModel = require("../models/itemPromoModel");

async function calcularItensPedido(itens) {
        if (itens.length <= 0) {
            return { 
                ok: false,
                msg: "Adicione mais produtos ao carrinho."
            }
        }

        let produtoModel = new ProdutoModel();
        let loteModel = new LoteModel();
        let itemPromoModel = new ItemPromoModel();

        let selec = [];
        let produtos = [];
        let total = 0;
        let totalNormal = 0;

        for (let i = 0; i<itens.length; i++) {
            if (!itens[i]) {
                return {
                    ok: false,
                    msg: "Um dos itens do carrinho é inválido."
                }
            }

            let id = itens[i].id;
            let qtd = itens[i].quantidade;

            if (!id || id <= 0 || qtd <= 0) {
                return {
                    ok: false,
                    msg:"Produto ou quantidade inválida."
                }
            }

            for (let j = 0; j<produtos.length; j++) {
                if (produtos[j] == id) {
                    return {
                        ok: false,
                        msg: "O mesmo produto foi enviado mais de uma vez."
                    }
                }
            }

            produtos.push(id);

            let p = await produtoModel.obterProdutoId(id);

            if (!p) {
                return {
                    ok: false,
                    msg: "Um dos produtos não foi encontrado."
                }
            }

            if (p.UNI_MEDIDA_PROD == "UN" && !Number.isInteger(qtd)) {
                return {
                    ok: false,
                    msg: "Um dos produtos está com o preço inválido."
                }
            }

            let precoNormal = p.VALOR_UNI_PROD;
            
            let lotes = await loteModel.listarLotesDisponiveis(id);
            let restante = qtd;

            for (let j = 0; j<lotes.length && restante > 0; j++) {
                let lote = lotes[j];
                let qtdUsada = Math.min(restante, lote.EST_LOTE);
                let valor = precoNormal;

                let valorPromo = await itemPromoModel.obterValorVigente(id, lote.COD_LOTE);

                if (valorPromo != null) {
                    valor = Math.min(precoNormal, valorPromo);
                }

                let centavos = Math.round(valor * 100);
                let centesimos = Math.round(qtdUsada * 100);
                let subtotal = Math.round(centavos * centesimos / 100) / 100;

                let subtotalNormal = Math.round(Math.round(precoNormal * 100) * centesimos / 100) / 100;

                total = Number((total + subtotal).toFixed(2));
                totalNormal = Number((totalNormal + subtotalNormal).toFixed(2));

                selec.push({
                    produtoId: id,
                    nome: p.NOME_PROD,
                    loteId: lote.COD_LOTE,
                    quantidade: qtdUsada,
                    valorUnitario: valor,
                    valorNormal: precoNormal,
                    subtotalNormal: subtotalNormal,
                    subtotal: subtotal
                });

                restante = restante - qtdUsada
            }

            if (restante > 0) {
                return {
                    ok: false,
                    msg: `Estoque infusficiente para ${p.NOME_PROD}.`
                }
            }
        }

        return {
            ok: true,
            itens: selec,
            total: total,
            totalNormal: totalNormal,
            desconto: Number((totalNormal - total).toFixed(2))
        };
    }

class PedidoController {

    async rotaSalvarPedido(req, res) {
        let pessoaFisica = new PessoaFisicaModel();
        let cod = req.cookies.UserLogado;

        let socio = await pessoaFisica.consultarAssinatura(cod);
        let fun = await pessoaFisica.consultarFuncionario(cod);

        if (fun.length <= 0 || !cod) {
            return res.send({
                ok: false,
                msg: "Faça um login válido antes de fazer um pedido!"
            });
        } else if (socio.length <= 0) {
            res.send({
                socio: false,
                ok: false,
                msg: "Faça parte do clube antes de fazer um pedido!"
            });
        } else {
                
            const itens = req.body.itens;
            const codPag = req.body.codPag;

            if (!itens || itens.length === 0) {
                return res.send({
                    ok: false,
                    msg: "Adicione produtos ao carrinho."
                });
            }

            let FormaRecebimento = new FormaRecebimentoModel();
            let pagamento = await FormaRecebimento.obterPorId(codPag);

            if (!pagamento) {
                return res.send({
                    ok: false,
                    msg: "Forma de pagamento inválida."
                });
            }

            let calculo = await calcularItensPedido(itens);

            if (!calculo.ok) {
                return res.send(calculo);
            }

            let listaItens = calculo.itens;
            let valorTotal = calculo.total;

            let codCliente = req.params.id; // alterar dependendo do nome do cookie

            if (!codCliente) { 
                return res.send({
                    ok: false,
                    msg: "É necessário estar autenticado para realizar um pedido."
                });
            }

            let pedido = new PedidoModel();

            pedido.COD_CLI = codCliente;
            pedido.COD_PROMO = null;
            pedido.COD_RECEB = codPag;
            pedido.TOTAL_PED = valorTotal;

            let resultadoPedido = await pedido.salvarPedido();

            if (!resultadoPedido) {
                return res.send({
                    ok: false,
                    msg: "Não foi possível registrar o pedido."
                });
            }

            let codPedido = pedido.COD_PED; // pegando id gerado pelo mysql

            let loteModel = new LoteModel();

            for (let i = 0; i < listaItens.length; i++) {
                let linha = listaItens[i];

                let itemPedido = new ItemPedidoModel(
                    codPedido,
                    linha.produtoId,
                    linha.loteId,
                    linha.quantidade,
                    linha.valorUnitario
                );

                let itemGravado = await itemPedido.salvarItemPedido();

                if (!itemGravado) {
                    return res.send({
                        ok: false,
                        msg: "Erro ao registrar um dos itens do pedido."
                    });
                }

                let baixou = await loteModel.baixarEstoque(
                    linha.loteId,
                    linha.quantidade
                );

                if (!baixou) {
                    return res.send({
                        ok: false,
                        msg: "Erro ao atualizar o estoque de um dos lotes."
                    });
                }
            }
                
            return res.send({
                ok: true,
                msg: "Pedido realizado com sucesso!",
                codPedido: codPedido,
                total: valorTotal
            });
        }
        
    }

    async rotaCalcularPedido(req, res) {
        let calculo = await calcularItensPedido(req.body.itens);

        return res.send(calculo);
    }
}

module.exports = PedidoController;