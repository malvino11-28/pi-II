document.addEventListener("DOMContentLoaded", () => {

    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");
    let btnExcluir = document.querySelectorAll(".btn-excluir");

    let produto = document.querySelector("#produtoLote");
    let numeroLote = document.querySelector("#numLote");
    let dataFabricacao = document.querySelector("#dataFabLote");
    let dataVencimento = document.querySelector("#dataVencLote");
    let estoque = document.querySelector("#estLote");

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarLote);
    }
    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarLote);
    }
    if (btnExcluir.length > 0) {
        for (let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirLote);
        }
    }
    function dadosValidos() {
        if (!produto || produto.value == "" || Number(produto.value) <= 0) {
            alert("Produto inválido.");
            return false;
        }
        if (numeroLote.value.trim() == "") {
            alert("Informe o número do lote.");
            return false;
        }
        if (dataVencimento.value == "") {
            alert("Informe a data de vencimento.");
            return false;
        }
        if (estoque.value == "" || Number(estoque.value) < 0) {
            alert("Informe um estoque válido.");
            return false;
        }
        if (
            dataFabricacao.value != "" &&
            dataVencimento.value <= dataFabricacao.value
        ) {
            alert("A data de vencimento deve ser posterior à data de fabricação.");
            return false;
        }
        return true;
    }
    function montarObjeto() {
        return {
            produto: produto.value,
            numeroLote: numeroLote.value.trim(),
            dataFabricacao: dataFabricacao.value || null,
            dataVencimento: dataVencimento.value,
            estoque: estoque.value
        };
    }
    function cadastrarLote() {
        if (!dadosValidos()) {
            return;
        }
        let obj = montarObjeto();
        fetch("/admin/produto/cadastrar-lote", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((resBody) => {
            if (resBody.ok) {
                alert("Lote cadastrado com sucesso!");
                window.location.reload();
            } else {
                alert("Erro ao cadastrar lote.");
            }
        });
    }
    function alterarLote() {
        let idAlteracao = document.querySelector("#idLote");
        if (!idAlteracao || Number(idAlteracao.value) <= 0) {
            alert("Lote inválido.");
            return;
        }
        if (!dadosValidos()) {
            return;
        }
        let obj = montarObjeto();
        obj.id = idAlteracao.value;
        fetch("/admin/produto/cadastrar-lote", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((resBody) => {
            if (resBody.ok) {
                alert("Lote atualizado com sucesso!");
                window.location.href =
                    "/admin/produto/gerenciamento-lote/" + produto.value;
            } else {
                alert("Erro ao atualizar lote.");
            }
        });
    }
    function excluirLote() {
        let idExclusao = this.dataset.id;
        if (!confirm("Deseja realmente excluir este lote?")) {
            return;
        }
        let obj = {
            id: idExclusao
        };
        fetch("/admin/produto/excluir-lote", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((resBody) => {
            if (resBody.ok) {
                alert("Lote excluído com sucesso!");
                window.location.reload();
            } else {
                alert("Erro ao excluir lote.");
            }
        });
    }
});