document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

    if (btnExcluir.length > 0) {
        for(let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirLote);
        }
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarLote);
    }

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarLote);
    }

    let produto = document.querySelector("#produtoLote");
    let numeroLote = document.querySelector("#numLote");
    let dataFabricacao = document.querySelector("#dataFabLote");
    let dataVencimento = document.querySelector("#dataVencLote");
    let estoque = document.querySelector("#estLote");

    function cadastrarLote() {
        if (
            produto.value != "" &&
            produto.value > 0 &&
            numeroLote.value.trim() != "" &&
            dataVencimento.value != "" &&
            estoque.value != "" &&
            estoque.value >= 0 &&
            (dataFabricacao.value == "" || dataVencimento.value > dataFabricacao.value)
        ) {
            let obj = {
                produto: produto.value,
                numeroLote: numeroLote.value,
                dataFabricacao: dataFabricacao.value || null,
                dataVencimento: dataVencimento.value,
                estoque: estoque.value
            }

            fetch("/admin/produto/cadastrar-lote", {
                body: JSON.stringify(obj),
                method: "POST",
                headers: { "Content-type": "application/json" }
            }).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Lote cadastrado com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao cadastrar lote.");
                }
            })
        } else {
            alert("Preencha todos os campos corretamente.");
        }
    }

    function excluirLote() {
        let idExclusao = this.dataset.id;

        if(confirm("Deseja realmente excluir este lote?")) {
            let obj = {
                id: idExclusao
            }

            fetch("/admin/produto/excluir-lote", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(res){
                return res.json();
            }).then(function (resBody) {
                if (resBody.ok) {
                    alert("Lote excluído com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao excluir lote.");
                }
            })
        }
    }

    function alterarLote() {
        let idAlteracao = document.querySelector("#idLote");

        if (
            idAlteracao.value > 0 &&
            produto.value != "" &&
            produto.value > 0 &&
            numeroLote.value.trim() != "" &&
            dataVencimento.value != "" &&
            estoque.value != "" &&
            estoque.value >= 0 &&
            (dataFabricacao.value == "" || dataVencimento.value > dataFabricacao.value)
        ) {
            let obj = {
                id: idAlteracao.value,
                produto: produto.value,
                numeroLote: numeroLote.value,
                dataFabricacao: dataFabricacao.value || null,
                dataVencimento: dataVencimento.value,
                estoque: estoque.value
            }

            fetch("/admin/produto/cadastrar-lote",
                {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: { "Content-Type": "application/json"},
                }).then((res) => {
                    return res.json();
                }).then((resBody) => {
                    if (resBody.ok) {
                        alert("Lote atualizado com sucesso!");
                        window.location.href = "/admin/produto/gerenciamento-lote/" + produto.value;
                    } else {
                        alert("Erro ao atualizar lote.");
                    }
                })
        }
    }
})