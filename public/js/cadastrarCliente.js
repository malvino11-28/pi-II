document.addEventListener("DOMContentLoaded", function () {

    let btn = document.querySelector("#btnSalvar");
    btn.addEventListener("click", cadastrarCliente);

    

    function cadastrarCliente() {

        let nome = document.querySelector("#nomeCli");
        let cpf = document.querySelector("#cpfCli");
        let rg = document.querySelector("#rgCli");
        let dt_nasc = document.querySelector("#dataNascCli");
        let email = document.querySelector("#emailCli");
        let cel = document.querySelector("#celCli");
        let senha = document.querySelector("#senhaCli");

        if(nome.value != "" && cpf.value != "" && rg.value != "" && dt_nasc.value != "" && email.value != "" && cel.value != "" && senha.value != "") {

            let obj = {
                nome: nome.value,
                cpf: cpf.value,
                rg: rg.value,
                dt_nasc: dt_nasc.value,
                email: email.value,
                cel: cel.value,
                senha: senha.value
            }

            fetch("/admin/cadastrar-clientes", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(resposta){
                return resposta.json();

            }).then(function(corpoResp){
                if(corpoResp.ok) {
                    alert("Cliente Cadastrado com Sucesso!");
                    window.location.reload();

                } else {
                    alert("Erro ao cadastrar o cliente.")
                }
            })
        } else {

            alert("Por favor, preencha todos os campos solicitados!");
        }
    }
})