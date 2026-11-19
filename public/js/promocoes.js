document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector("#formPromocao");
    let botao = document.querySelector("#btnSalvarPromocao");
    let lotes = document.querySelectorAll(".lote-promocao");

    let botoesExcluir = document.querySelectorAll(".btn-excluir-promocao");

    for (let i=0; i<botoesExcluir.length;i++) {
        botoesExcluir[i].addEventListener("click", excluirPromocao);    
    }

    document.querySelector("#btnMarcarCategoria").addEventListener("click", () => {
        let id = document.querySelector("#categoriaPromocao").value;

        for (let i = 0; i<lotes.length;i++) {
            if (id != "" && lotes[i].dataset.categoria == id) {
                lotes[i].checked = true;
            }
        }
    });

    document.querySelector("#btnMarcarMarca").addEventListener("click", () => {
        let id = document.querySelector("#marcaPromocao").value;

        for (let i = 0; i<lotes.length; i++) {
            if (id != "" && lotes[i].dataset.marca == id) {
                lotes[i].checked = true;
            }
        }
    });

    function excluirPromocao() {
        if (!confirm("Deseja excluir esta promoção?")) {
            return;
        }

         fetch("/admin/produto/excluir-promocao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.dataset.id
            })
        }).then(function (res) {
            return res.json();
        }).then(function (resBody) {
            alert(resBody.msg);
            if (resBody.ok) {
                window.location.reload();
            }
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        let nome = document.querySelector("#nomePromocao");
        let percentual = document.querySelector("#percentualPromocao");
        let inicio = document.querySelector("#inicioPromocao");
        let fim = document.querySelector("#fimPromocao");

        if (botao.disabled) {
            return;
        }

        let selec = [];

        for (let i = 0; i <lotes.length; i++) {
            if (lotes[i].checked) {
                selec.push(lotes[i].value);
            }
        }

        if (selec.length == 0) {
            alert("Selecione pelo menos um lote.");
        }

        let obj = {
            nome: nome.value,
            percentual: percentual.value,
            inicio: inicio.value,
            fim: fim.value,
            lotes: selec
        };

        if (!confirm(`Confirma a promoção de ${obj.percentual}% para ${selec.length} lote(s)?`)) {
            return;
        }

        botao.disabled = true;

        fetch("/admin/produto/promocoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(res => {
            return res.json();
        }).then(resBody => {
            alert(resBody.msg);
            if (resBody.ok) {
                window.location.reload();
            } else {
                botao.disabled = false;
            }
        });
    });
});