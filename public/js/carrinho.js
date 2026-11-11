document.addEventListener("DOMContentLoaded", () => {
    let listaCarrinho = [];
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

    // function formatarQuantidade(valor) {
    //     return Number(valor).toLocaleString("pt-BR", {
    //         maximumFractionDigits: 2
    //     });
    // }

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

        // buscando dados do produto no banco

        let res = await fetch(`/produtos/obter/${produtoId}`);
        let dados = await res.json();

        let produto = dados.produto;

        let indice = -1;
        for (let i = 0; i<listaCarrinho.length;i++) {
            if (listaCarrinho[i].id == produtoId) {
                indice = i;
            }
        }

        if (indice >= 0) {
            const novaQtd = Number((listaCarrinho[indice].quantidade + qtd).toFixed(2));

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
                                        Preço unitário:
                                        ${formatarValor(item.preco)}
                                    </p>
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
                                <div class="product-price">
                                    ${formatarValor(item.quantidade * item.preco)}
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

    function atualizarResumo() {
        let qtdProdutos = listaCarrinho.length;

        const subtotal = calcularValorTotal();

        const totalItems = document.querySelector("#totalItems");
        const itemCount = document.querySelector("#itemCount");
        const campoSubtotal = document.querySelector("#subtotal");
        const campoTotal = document.querySelector("#total");

        if (totalItems) {
            totalItems.textContent = qtdProdutos;
        }

        if (itemCount) {
            itemCount.textContent = qtdProdutos;
        }

        if (campoSubtotal) {
            campoSubtotal.textContent = formatarValor(subtotal);
        }

        if (campoTotal) {
            campoTotal.textContent = formatarValor(subtotal);
        }

        atualizarContador();

        const btnFinalizar = document.querySelector("#btnFinalizarCompra");

        if (btnFinalizar) {
            btnFinalizar.disabled = qtdProdutos === 0;
        }
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

            for (let i = 0; i < listaCarrinho.length; i++) {
                if (listaCarrinho[i].id == id) {
                    item = listaCarrinho[i];
                }
            }

            const input = e.target;

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
});