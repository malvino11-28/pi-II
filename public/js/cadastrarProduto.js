document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

    if (btnExcluir.length > 0) {
        for(let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirProduto);
        }
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarProduto);
    }

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarProduto);
    }

    let nome = document.querySelector("#nomeProd"); //nomeProd
    let marca = document.querySelector("#marca");// marca
    let categoria = document.querySelector("#categoria");// categoria
    let desc = document.querySelector("#desc");// desc
    let descRed = document.querySelector("#descRed");// descRed
    let uniMedida = document.querySelector("#uniMedida");// uniMedida
    let valor = document.querySelector("#valor");// valor

    function cadastrarProduto() { 
        if (nome.value.trim() != "" && marca.value != "0" && categoria.value != "0" && desc.value.trim() != "" && descRed.value.trim() != "" && uniMedida.value != "0" && valor.value != "") {
            let obj = {
                nome: nome.value,
                marca: marca.value,
                categoria: categoria.value,
                desc: desc.value,
                desc_red: descRed.value,
                uni: uniMedida.value,
                valor: valor.value,
            }

            fetch("/admin/produto/cadastrar-produto", {
                body: JSON.stringify(obj),
                method: "POST",
                headers: { "Content-type": "application/json" }
            }).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Produto cadastrado com sucesso!");
                    window.location.reload();
                } else 
                {
                    alert("Erro ao cadastrar produto.")
                }
            })
        } else {
            alert("Preencha todos os campos.")
        }
    }


    function excluirProduto() {

        let idExclusao = this.dataset.id;
        if(confirm("Deseja realmente excluir este produto?")) {

            let obj = {
                id: idExclusao
            }

            fetch("/admin/produto/excluir-produto", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(res){
                return res.json();

            }).then(function (resBody) {
                if (resBody.ok) {
                    alert("Produto excluído com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao excluir produto.");
                }
            })
        }
    }

    function alterarProduto() {
        let idAlteracao = document.querySelector("#idProd");

        if (idAlteracao.value > 0 && nome.value.trim() != "" && marca.value != "0" && categoria.value != "0" && desc.value.trim() != "" && descRed.value.trim() != "" && uniMedida.value != "0" && valor.value != "") {
            let obj = {
                id: idAlteracao.value,
                nome: nome.value,
                marca: marca.value,
                categoria: categoria.value,
                desc: desc.value,
                desc_red: descRed.value,
                uni: uniMedida.value,
                valor: valor.value,
            }

            fetch("/admin/produto/cadastrar-produto",
                {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: { "Content-Type": "application/json"},
                }).then((res) => {
                    return res.json();
                }).then((resBody) => {
                    if (resBody.ok) {
                        alert("Produto atualizado com sucesso!");
                        window.location.reload();
                    } else {
                        alert("Erro ao atualizar produto.");
                    }
                })
        }
    }
})