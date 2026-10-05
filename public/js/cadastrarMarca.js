document.addEventListener("DOMContentLoaded", () => {
    let btn = document.querySelector("#btnSalvar");
    btn.addEventListener("click", cadastrarMarca);

    let nome = document.querySelector("#nomeMar");

    function cadastrarMarca() { 
        if (nome.value.trim() != "") {
            let obj = {nome: nome.value}

            fetch("/admin/produto/gerenciamento-marca", {
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
})