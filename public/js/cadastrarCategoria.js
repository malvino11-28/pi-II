document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");

    for(let i = 0; i < btnExcluir.length; i++) {
        btnExcluir[i].addEventListener("click", excluirCategoria);
    }

    btnCadastrar.addEventListener("click", cadastrarCategoria);

    let nome = document.querySelector("#nomeMar");

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
})