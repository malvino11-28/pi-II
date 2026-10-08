document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

    if (btnExcluir.length > 0) {
        for(let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirCategoria);
        }
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarCategoria);
    }

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarCategoria);
    }

    let nome = document.querySelector("#nomeCat");

    function cadastrarCategoria() { 
        if (nome.value.trim() != "") {
            let obj = {nome: nome.value}

            fetch("/admin/produto/cadastrar-categoria", {
                body: JSON.stringify(obj),
                method: "POST",
                headers: { "Content-type": "application/json" }
            }).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Categoria cadastrada com sucesso!");
                    window.location.reload();
                } else 
                {
                    alert("Erro ao cadastrar categoria.")
                }
            })
        } else {
            alert("Preencha todos os campos.")
        }
    }


    function excluirCategoria() {

        let idExclusao = this.dataset.id;
        if(confirm("Deseja realmente excluir essa categoria?")) {

            let obj = {

                id: idExclusao
            }

            fetch("/admin/produto/excluir-categoria", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(res){
                return res.json();

            }).then(function (resBody) {
                if (resBody.ok) {
                    alert("Categoria excluída com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao excluir a categoria.");
                }
            })
        }
    }

    function alterarCategoria() {
        let idAlteracao = document.querySelector("#idCat");

        if (idAlteracao.value > 0 && nome.value.trim() != "") {
            
            let obj = {
                id: idAlteracao.value,
                nome: nome.value,
                }

            fetch("/admin/produto/cadastrar-categoria", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: { "Content-Type": "application/json" },
                }
            ).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Categoria atualizada com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao atualizar categoria.");
                }
            });
        }
    }
});