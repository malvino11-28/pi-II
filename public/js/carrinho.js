document.addEventListener("DOMContentLoaded", () => {
    let listaCarrinho = [];
    let consultaCarrinho = 0;
    let carrinho = localStorage.getItem("carrinho");

    if (carrinho) {
        listaCarrinho = JSON.parse(carrinho);
    }

    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    }

    function atualizarContador() {
        let contador = document.querySelector("#contadorCarrinho");
        if (contador) {
            contador.textContent = listaCarrinho.length;
        }
    }

    function formatarValor(valor) {
        return Number(valor).toFixed(2).replace('.', ',');
    }

    function obterPasso(item) {
         if (["KG", "L"].includes(item.unidade)) {
             return 0.01;
         }
         return 1;
    }

    const btnAdicionar = document.querySelector("#btnAdicionarCarrinho");

    if (btnAdicionar) {
        btnAdicionar.addEventListener("click", adicionarItem);
    }

    const btnFinalizar = document.querySelector("#btnFinalizarCompra");

    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", finalizarCompra);
    }

    async function adicionarItem() {
        const produtoId = this.dataset.produto;
        const estoque = this.dataset.estoque;

        const qtd = document.querySelector("#qty").value;

        if (!produtoId) {
            alert("Produto não encontrado.");
            return;
        }

        if (!qtd || qtd <= 0 || qtd > estoque) {
            alert("Quantidade inválida.");
            return;
        }

        // buscando obj do produto no banco

        let res = await fetch(`/produtos/obter/${produtoId}`);
        let obj = await res.json();

        let produto = obj.produto;

        let indice = -1;
        for (let i = 0; i<listaCarrinho.length;i++) {
            if (listaCarrinho[i].id == produtoId) {
                indice = i;
            }
        }

        if (indice >= 0) {
            const novaQtd = Number((Number(listaCarrinho[indice].quantidade) + Number(qtd)).toFixed(2));

            if (novaQtd > estoque) {
                alert("Quantidade inválida.");
                return;
            }

            listaCarrinho[indice].quantidade = novaQtd;
            listaCarrinho[indice].estoque = estoque;
        } else {
            //adicionando novo produto
            listaCarrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                unidade: produto.unidade,
                quantidade: qtd,
                estoque: estoque
            })
        }

        salvarCarrinho();
        atualizarContador();

        alert("Produto adicionado ao carrinho!");
    }

    function calcularValorTotal() {
        let valorTotal = 0;
        for (let i = 0; i < listaCarrinho.length; i++) {
            const item = listaCarrinho[i];
            valorTotal += item.quantidade * item.preco;
        }
        return valorTotal;
    }

    function exibirCarrinho() {
         const container = document.querySelector("#cartItems");

        if (!container) {
            return;
        }

        if (listaCarrinho.length === 0) {

            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x" style="font-size: 50px;"></i>
                    <h5 class="mt-3">Seu carrinho está vazio!</h5>
                    <p>Adicione alguns produtos para continuar.</p>
                    <a href="/produtos" class="btn-continue">
                        Ver produtos
                    </a>
                </div>
            `;

        } else {
            let html = "";
            for (let i = 0; i < listaCarrinho.length; i++) {
                const item = listaCarrinho[i];

                const passo = obterPasso(item);

                html += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="row align-items-center">
                            <div class="col-md-2 col-12 mb-3 mb-md-0">
                                <img
                                    src="${item.imagem}"
                                    alt="${item.nome}"
                                    class="product-img"
                                >
                            </div>

                            <div class="col-md-4 col-12 mb-3 mb-md-0">
                                <div class="product-info">
                                    <h5>${item.nome}</h5>
                                    <p>
                                        Preço: R$
                                        <span id="preco-normal-${item.id}">
                                            ${formatarValor(item.preco)}
                                        </span>
                                    </p>

                                    <p id="promocao-${item.id}" class="text-success"></p>
                                    <p>
                                        Unidade: ${item.unidade}
                                    </p>
                                </div>
                            </div>

                            <div class="col-md-2 col-6 mb-3 mb-md-0">
                                <div class="quantity-controls">
                                    <button
                                        type="button"
                                        class="qty-btn"
                                        data-acao="diminuir"
                                        data-id="${item.id}"
                                    >
                                        -
                                    </button>

                                    <input
                                        type="number"
                                        class="qty-input"
                                        data-acao="alterar"
                                        data-id="${item.id}"
                                        value="${item.quantidade}"
                                        min="${passo}"
                                        max="${item.estoque}"
                                        step="${passo}"
                                    >
                                    <button
                                        type="button"
                                        class="qty-btn"
                                        data-acao="aumentar"
                                        data-id="${item.id}"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-2 col-6 mb-3 mb-md-0 text-center">
                                <div class="product-price" id="subtotal-${item.id}">
                                Calculando...
                            </div>
                            </div>

                            <div class="col-md-2 col-12 text-center">
                                <button
                                    type="button"
                                    class="btn-remove"
                                    data-acao="remover"
                                    data-id="${item.id}"
                                >
                                    <i class="bi bi-trash"></i>
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        }
        atualizarResumo();
    }

    async function atualizarResumo() {
        let consulta = ++consultaCarrinho;
        let quantidade = listaCarrinho.length;

        document.querySelector("#totalItems").textContent = quantidade;
        document.querySelector("#itemCount").textContent = quantidade;
        atualizarContador();

        let campoSubtotal = document.querySelector("#subtotal");
        let campoTotal = document.querySelector("#total");
        let campoDesconto = document.querySelector("#desconto");

        btnFinalizar.disabled = true;

        if (quantidade === 0) {
            campoSubtotal.textContent = formatarValor(0);
            campoTotal.textContent = formatarValor(0);
            campoDesconto.textContent = formatarValor(0);
            return;
        }

        campoTotal.textContent = "Calculando...";

        let itens = [];

        for (let i = 0; i < listaCarrinho.length; i++) {
            itens.push({
                id: listaCarrinho[i].id,
                quantidade: Number(listaCarrinho[i].quantidade)
            });
        }

        let res = await fetch("/pedido/calcular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itens: itens
            })
        });

        let obj = await res.json();

        if (consulta !== consultaCarrinho) {
            return;
        }

        if (!obj.ok) {
            campoTotal.textContent = "Indisponível";
            alert(obj.msg || obj.mensagem);
            return;
        }

        campoSubtotal.textContent = formatarValor(obj.totalNormal);
        campoDesconto.textContent = formatarValor(obj.desconto);
        campoTotal.textContent = formatarValor(obj.total);

        for (let i = 0; i < listaCarrinho.length; i++) {
            let item = listaCarrinho[i];
            let normal = 0;
            let atual = 0;
            let preco = 0;

            for (let j = 0; j < obj.itens.length; j++) {
                let linha = obj.itens[j];

                if (linha.produtoId == item.id) {
                    normal += Number(linha.subtotalNormal);
                    atual += Number(linha.subtotal);
                    preco = Number(linha.valorNormal);
                }
            }

            document.querySelector("#preco-normal-" + item.id).textContent =
                formatarValor(preco);

            document.querySelector("#subtotal-" + item.id).textContent =
                "R$ " + formatarValor(atual);

            document.querySelector("#promocao-" + item.id).textContent =
                atual < normal
                    ? "Promoção: economia de R$ " + formatarValor(normal - atual)
                    : "";
        }

        btnFinalizar.disabled = false;
    }

    const containerCarrinho = document.querySelector("#cartItems");

    if (containerCarrinho) {
        containerCarrinho.addEventListener("click", function (e) {

            const botao = e.target.closest("[data-acao]");

            if (!botao) {
                return;
            }

            const id = botao.dataset.id;
            const acao = botao.dataset.acao;

            if (acao === "remover") {
                let novaLista = [];

                for (let i = 0; i < listaCarrinho.length; i++) {
                    if (listaCarrinho[i].id != id) {
                        novaLista.push(listaCarrinho[i]);
                    }
                }
                listaCarrinho = novaLista;
            }

            else if (acao === "aumentar" || acao === "diminuir") {
                let item;

                for (let i = 0; i < listaCarrinho.length; i++) {
                    if (listaCarrinho[i].id == id) {
                        item = listaCarrinho[i];
                    }
                }

                const passo = obterPasso(item);

                let novaQtd = item.quantidade;

                if (acao === "aumentar") {
                    novaQtd += passo;
                } else {
                    novaQtd -= passo;
                }

                novaQtd = Number(novaQtd.toFixed(2));

                if (novaQtd < passo) {
                    return;
                }

                if (novaQtd > Number(item.estoque)) {
                    alert("Estoque insuficiente!");
                    return;
                }
                item.quantidade = novaQtd;
            }

            salvarCarrinho();
            exibirCarrinho();
        });

        containerCarrinho.addEventListener("change", function (e) {
            let item;
            const input = e.target;
            const id = input.dataset.id;

            for (let i = 0; i < listaCarrinho.length; i++) {
                if (listaCarrinho[i].id == id) {
                    item = listaCarrinho[i];
                }
            }

            if (input.dataset.acao !== "alterar") {
                return;
            }

            const quantidade = Number(input.value);

            if (!quantidade || quantidade > Number(item.estoque)) {
                alert("Quantidade inválida ou estoque insuficiente.");
                exibirCarrinho();
                return;
            }
            item.quantidade = Number(quantidade.toFixed(2));

            salvarCarrinho();
            exibirCarrinho();
        });
    }

    exibirCarrinho();
    atualizarContador();

    async function finalizarCompra() {
        const FormaRecebimento = document.querySelector("#FormaRecebimento");

        if (!FormaRecebimento.value) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        if (listaCarrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        // preparando os produtos para envio
        let itens = [];

        for (let i = 0; i < listaCarrinho.length; i++) {
            itens.push({
                id: listaCarrinho[i].id,
                quantidade: Number(listaCarrinho[i].quantidade)
            });
        }

        let usuarioId = this.dataset.usuario;

        if (!usuarioId) {
            alert("Faça login antes de realizar um pedido!");
        } else {

            // enviando para o back
            fetch(`/pedido/salvar/${usuarioId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itens: itens,
                    codPag: FormaRecebimento.value
                })
            }).then(res => {
                return res.json();
            }).then(resBody => {
                if (resBody.ok) {
                    alert(`Pedido nº ${resBody.codPedido} realizado com sucesso!\nTotal: ${formatarValor(resBody.total)}`);

                    localStorage.removeItem("carrinho");
                    listaCarrinho = [];
                    atualizarContador();
                    window.location.href = "/";
                } else {
                    alert(resBody.msg || "Erro ao realizar pedido.");
                    if (!resBody.socio) {
                        window.location.href = "/cliente/assinatura";
                    }
                }
            });
        }
    }

    let consultaProduto = 0;

    async function mostrarPromocaoProduto() {
        let campo = document.querySelector("#ofertaProduto");

        if (!campo || !btnAdicionar) {
            return;
        }

        let consulta = ++consultaProduto;
        let quantidade = Number(document.querySelector("#qty").value);

        if (!Number.isFinite(quantidade) || quantidade <= 0) {
            campo.textContent = "";
            return;
        }

        let res = await fetch("/pedido/calcular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itens: [{
                    id: btnAdicionar.dataset.produto,
                    quantidade: quantidade
                }]
            })
        });

        let obj = await res.json();

        if (consulta !== consultaProduto) {
            return;
        }

        if (!obj.ok) {
            campo.textContent = obj.msg || obj.mensagem;
            return;
        }

        campo.textContent = obj.desconto > 0
            ? "Total com promoção para esta quantidade: R$ " +
            formatarValor(obj.total) +
            " — economia de R$ " + formatarValor(obj.desconto)
            : "Total para esta quantidade: R$ " + formatarValor(obj.total);
    }

    if (btnAdicionar && document.querySelector("#ofertaProduto")) {
        document.querySelector("#qty").addEventListener(
            "change",
            mostrarPromocaoProduto
        );

        let botoesQuantidade = document.querySelectorAll(".qty-input button");

        for (let i = 0; i < botoesQuantidade.length; i++) {
            botoesQuantidade[i].addEventListener(
                "click",
                mostrarPromocaoProduto
            );
        }

        mostrarPromocaoProduto();
    }
});