document.addEventListener("DOMContentLoaded", () => {
    let botao = document.querySelector("#btnDescartar");

    if (botao) {
        botao.addEventListener("click", registrarDescarte);
    }

    function registrarDescarte() {
        let id = this.dataset.id;

        let qtd = document.querySelector("#quantidadeDescarte").value;
        let motivo = document.querySelector("#motivoDescarte").value.trim();

        if (!qtd || qtd <= 0 || motivo === "") {
            alert("Informe uma quantidade válida e um motivo de descarte!");
            return;
        }

        if (!confirm(`Confirma o descarte de ${qtd} deste lote?`)) {
            return;
        }

        botao.disabled = true;

        let obj = {
            qtd: qtd,
            motivo: motivo
        }

        fetch(`/admin/produto/descarte-lote/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
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
        })
    }
});