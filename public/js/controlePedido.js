document.addEventListener("DOMContentLoaded", function () {
    let botoes = document.querySelectorAll(".btn-status");
    let botaoEntrega = document.querySelector("#btnDefinirEntrega");

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", atualizarStatus);
    }

    if (botaoEntrega) {
        botaoEntrega.addEventListener("click", definirEntrega);
    }

    function bloquearBotoes(bloquear) {
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].disabled = bloquear;
        }

        if (botaoEntrega) {
            botaoEntrega.disabled = bloquear;
        }
    }

    function enviar(url, dados) {
        bloquearBotoes(true);

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }).then(function (res) {
            return res.json();
        }).then(function (resBody) {
            alert(resBody.msg);

            if (resBody.ok) {
                window.location.reload();
            } else {
                bloquearBotoes(false);
            }
        });
    }

    function atualizarStatus() {
        let id = this.dataset.id;
        let novoStatus = this.dataset.status;

        let obj = {
            status: novoStatus
        };

        if (novoStatus === "Preparado") {
            let caixas = document.querySelectorAll(".item-conferido");
            let conferidos = [];

            if (caixas.length === 0) {
                alert("O pedido não possui itens.");
                return;
            }

            for (let i = 0; i < caixas.length; i++) {
                if (!caixas[i].checked) {
                    alert("Confira todos os itens antes de concluir.");
                    return;
                }

                conferidos.push({
                    produto: caixas[i].dataset.produto,
                    lote: caixas[i].dataset.lote
                });
            }

            obj.conferidos = conferidos;
        }

        if (!confirm(`Deseja alterar o status para ${novoStatus}?`)) {
            return;
        }

        enviar(`/admin/pedidos/${id}/status${obj}`);
    }

    function definirEntrega() {
        let id = this.dataset.id;
        let codEndereco = document.querySelector("#enderecoEntrega").value;
        let data = document.querySelector("#dataEntrega").value;

        if (!codEndereco || !data) {
            alert("Selecione o endereço e a data da entrega.");
            return;
        }

        if (!confirm("Deseja cadastrar a entrega neste endereço?")) {
            return;
        }

        let obj = {
            codEndereco: codEndereco,
            data: data
        };

        enviar(`/admin/pedidos/${id}/entrega${obj}`);
    }
});