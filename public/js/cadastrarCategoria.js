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

    function validarNomeCategoria() {
        const tamanho = nome.value.trim().length;
        let valido;
        if (tamanho >= 2 && tamanho <= 50) {
            valido = true;
            nome.classList.remove("is-invalid");
            nome.classList.add("is-valid");
        } else {
            valido = false;
            nome.classList.remove("is-valid");
            nome.classList.add("is-invalid");
        }

        return valido;
    }

    nome.addEventListener("blur", validarNomeCategoria);

    nome.addEventListener("input", () => {
            validarNomeCategoria();
    })

    function cadastrarCategoria() { 
        if (validarNomeCategoria()) {
            let obj = {nome: nome.value.trim()}

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
            alert("Revise os campos em vermelho.")
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

        if (idAlteracao.value > 0 && validarNomeCategoria()) {
            
            let obj = {
                id: idAlteracao.value,
                nome: nome.value.trim(),
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
        } else {
            alert("Revise os campos em vermelho.");
        }
    }
});