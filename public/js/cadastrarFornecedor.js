document.addEventListener("DOMContentLoaded", function() {

    let btn = document.querySelector(".btn-save");
    btn.addEventListener("click", cadastrarFornecedor);

    function cadastrarFornecedor() {

        let razao = document.querySelector("#inputRazao");
        let nomeFan = document.querySelector("#inputNomeFan");
        let cnpj = document.querySelector("#inputCNPJ");
        let email = document.querySelector("#inputEmail");
        let telefone = document.querySelector("#inputTel");

        if(razao.value != "" && nomeFan.value != "" && cnpj.value != "" && email.value != "" && telefone.value != "") {

            obj = {
                razao: razao.value,
                nomeFan: nomeFan.value,
                cnpj: cnpj.value,
                email: email.value,
                telefone: telefone.value
            };

            fetch("/admin/cadastrar-fornecedor", {

                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(resposta){
                return resposta.json();
            }).then(function(corpo){
                if(corpo.ok){
                    alert("Fornecedor cadastrado com sucesso!!!");
                    window.location.reload();

                } else {
                    alert("Erro ao cadastrar o fornecedor");
                }
            })

        } else {

            alert("Por favor, preencha todos os respectivos campos.");
        }
    }
})

document.addEventListener("DOMContentLoaded", function() {

    let btn = document.querySelectorAll(".btn-excluir");
    
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", excluirFornecedor);
    }

    function excluirFornecedor() {

        let idExclusao = this.dataset.id;

        if(confirm("Deseja realmente excluir esse fornecedor?")) {

            let obj = {

                id: idExclusao
            };

            fetch("/admin/excluir-fornecedor", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: { 
                    "Content-Type" : "application/json" 
                }
            }).then(function(resposta){
                return resposta.json();

            }).then(function(corpo) {
                if(corpo.ok) {
                    alert("Fornecedor excluído com sucesso!!!");
                    window.location.reload();

                } else {
                    alert("Erro ao excluir fornecedor");
                }
            })
        } 
    }
})