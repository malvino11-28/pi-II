document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");

    for(let i = 0; i < btnExcluir.length; i++) {
        btnExcluir[i].addEventListener("click", excluirMarca);
    }

    btnCadastrar.addEventListener("click", cadastrarMarca);

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
})