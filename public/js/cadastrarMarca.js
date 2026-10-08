document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

    if (btnExcluir.length > 0) {
        for(let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirMarca);
        }
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarMarca);
    }

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarMarca);
    }

    let nome = document.querySelector("#nomeMar");

    function cadastrarMarca() { 
        if (nome.value.trim() != "") {
            let obj = {nome: nome.value}

            fetch("/admin/produto/cadastrar-marca", {
                body: JSON.stringify(obj),
                method: "POST",
                headers: { "Content-type": "application/json" }
            }).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Marca cadastrada com sucesso!");
                    window.location.reload();
                } else 
                {
                    alert("Erro ao cadastrar marca.")
                }
            })
        } else {
            alert("Preencha todos os campos.")
        }
    }


    function excluirMarca() {

        let idExclusao = this.dataset.id;
        if(confirm("Deseja realmente excluir essa marca?")) {

            let obj = {

                id: idExclusao
            }

            fetch("/admin/produto/excluir-marca", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(res){
                return res.json();

            }).then(function (resBody) {
                if (resBody.ok) {
                    alert("Marca excluída com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao excluir a marca.");
                }
            })
        }
    }

    function alterarMarca() {
        let idAlteracao = document.querySelector("#idMar");

        if (idAlteracao.value > 0 && nome.value.trim() != "") {
            
            let obj = {
                id: idAlteracao.value,
                nome: nome.value,
                }

            fetch("/admin/produto/cadastrar-marca", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: { "Content-Type": "application/json" },
                }
            ).then((res) => {
                return res.json();
            }).then((resBody) => {
                if (resBody.ok) {
                    alert("Marca atualizada com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao atualizar marca.");
                }
            });
        }
    }
});