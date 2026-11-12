const PedidoModel = require("../models/pedidoModel");
const ItemPedidoModel = require("../models/itemPedidoModel");
const ItemPedidoLoteModel = require("../models/itemPedidoLoteModel");
const ProdutoModel = require("../models/produtoModel");
const LoteModel = require("../models/loteModel");
const FormaPagamentoModel = require("../models/formaPagamentoModel");

class PedidoController {

    async rotaSalvarPedido(req, res) {
        const itens = req.body.itens;
        const codPag = req.body.codPag;

        if (!itens || itens.length === 0) {
            return res.send({
                ok: false,
                msg: "Adicione produtos ao carrinho."
            });
        }

        let formaPagamento = new FormaPagamentoModel();
        let pagamento = await formaPagamento.obterPorId(codPag);

        if (!pagamento) {
            return res.send({
                ok: false,
                msg: "Forma de pagamento inválida."
            });
        }

        let listaProdutos = [];
        let valorTotal = 0;

        for (let i = 0; i < itens.length; i++) {
            let produtoId = Number(itens[i].id);
            let qtd = Number(itens[i].quantidade);
            
            let produtoModel = new ProdutoModel();

            let produto = await produtoModel.obterProdutoId(produtoId);
            if (!produto) {
                return res.send({
                    ok: false,
                    msg: "Um dos produtos do carrinho não foi encontrado."
                });
            }

            let loteModel = new LoteModel();
            let lotes = await loteModel.listarLotesDisponiveis(produtoId);

            let estoqueTotal = 0;

            for (let j = 0; j < lotes.length; j++) {
                estoqueTotal += Number(lotes[j].EST_LOTE);
            }

            if (qtd <= 0 || qtd > estoqueTotal) {
                return res.send({
                    ok: false,
                    msg: `Estoque insuficiente para o produto ${produto.NOME_PROD}.`
                });
            }

            let valorUnitario = Number(produto.VALOR_UNI_PROD);
            let subtotal = Number((qtd * valorUnitario).toFixed(2));
            valorTotal += subtotal;

            listaProdutos.push({
                produtoId: produtoId,
                nome: produto.NOME_PROD,
                qtd: qtd,
                valorUnitario: valorUnitario,
                lotes: lotes
            });
        }

        valorTotal = Number(valorTotal.toFixed(2));

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
        pedido.COD_PAG = codPag;
        pedido.TOTAL_PED = valorTotal;

        let resultadoPedido = await pedido.salvarPedido();

        if (!resultadoPedido) {
            return res.send({
                ok: false,
                msg: "Não foi possível registrar o pedido."
            });
        }

        let codPedido = pedido.COD_PED; // pegando id gerado pelo mysql

        for (let i = 0; i < listaProdutos.length; i++) {
            let produto = listaProdutos[i];

            let itemPedido = new ItemPedidoModel(
                codPedido,
                produto.produtoId,
                produto.qtd,
                produto.valorUnitario
            );

            let itemGravado = await itemPedido.salvarItemPedido();

            if (!itemGravado) {
                return res.send({
                    ok: false,
                    msg: "Erro ao registrar um dos itens do pedido."
                });
            }

            let qtdRestante = produto.qtd;

            let loteModel = new LoteModel();

            for (let j = 0; j < produto.lotes.length && qtdRestante > 0; j++) {
                if (qtdRestante <= 0) {
                    return;
                } else {
                    let lote = produto.lotes[j];
                    let estoqueLote = Number(lote.EST_LOTE);

                    let qtdUtilizada = Math.min(
                        qtdRestante,
                        estoqueLote
                    );

                    if (qtdUtilizada > 0) {
                        let itemLote = new ItemPedidoLoteModel(
                            codPedido,
                            produto.produtoId,
                            lote.COD_LOTE,
                            qtdUtilizada
                        );

                        let loteGravado = await itemLote.salvarItemPedidoLote();
                        if (!loteGravado) {
                            return res.send({
                                ok: false,
                                msg: "Erro ao registrar os lotes utilizados."
                            });
                        }

                        let estoqueAtualizado = await loteModel.baixarEstoque(
                            lote.COD_LOTE,
                            qtdUtilizada
                        );

                        if (!estoqueAtualizado) {
                            return res.send({
                                ok: false,
                                msg: "Erro ao atualizar o estoque de um dos lotes."
                            });
                        }
                        qtdRestante = Number((qtdRestante - qtdUtilizada).toFixed(2));
                    }
                }
            }
            if (qtdRestante > 0) {
                    return res.send({
                        ok: false,
                        msg: "Não foi possível separar toda a quantidade solicitada."
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

module.exports = PedidoController;