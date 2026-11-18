document.addEventListener("DOMContentLoaded", function () {
    let botoes = document.querySelectorAll(".btn-status");

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", atualizarStatus);
    }

    function bloquearBotoes(bloquear) {
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].disabled = bloquear;
        }
    }

    function atualizarStatus() {
        let id = this.dataset.id;
        let novoStatus = this.dataset.status;

        if (!confirm(`Deseja alterar o status para ${novoStatus}?`)) {
            return;
        }

        let obj = {
            status: novoStatus
        };

        bloquearBotoes(true);

        fetch(`/admin/pedidos/${id}/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(function (res) {
            return res.json();
        }).then(function (resBody) {
            if (resBody.ok) {
                alert(resBody.msg);
                window.location.reload();
            } else {
                alert(resBody.msg);
                bloquearBotoes(false);
            }
        });
    }
});