function mascaraCNPJ(valor) {
    return valor
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");

    regex = /^(\d)\1{13}$/;

    if (cnpj.length !== 14 || regex.test(cnpj)) {
        return false;
    }

    let soma = 0;
    let resto;
    const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesosSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * pesosPrimeiroDigito[i];
    }

    resto = soma % 11;
    const primeiroDigito = resto < 2 ? 0 : 11 - resto;

    if (primeiroDigito !== parseInt(cnpj.charAt(12))) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * pesosSegundoDigito[i];
    }

    resto = soma % 11;
    const segundoDigito = resto < 2 ? 0 : 11 - resto;

    if (segundoDigito !== parseInt(cnpj.charAt(13))) {
        return false;
    }

    return true;
}

function mascaraTelefone(valor) {
    const numero = valor.replace(/\D/g, "").slice(0, 11);

    if (numero.length <= 2) {
        return numero;
    }

    if (numero.length <= 6) {
        return numero.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    if (numero.length <= 10) {
        return numero.replace(
            /^(\d{2})(\d{4})(\d{0,4})/,
            "($1) $2-$3"
        );
    }

    return numero.replace(
        /^(\d{2})(\d{5})(\d{0,4})/,
        "($1) $2-$3"
    );
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email.trim());
}

function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, "");

    return telefoneLimpo.length === 10 ||
        telefoneLimpo.length === 11;
}

document.addEventListener("DOMContentLoaded", function() {

    let btn = document.querySelector(".btn-save");
    btn.addEventListener("click", cadastrarFornecedor);

    let cnpjCampo = document.querySelector("#inputCNPJ");
    let emailCampo = document.querySelector("#inputEmail");
    let telefoneCampo = document.querySelector("#inputTel");

    cnpjCampo.addEventListener("input", function () {
        cnpjCampo.value = mascaraCNPJ(cnpjCampo.value);
    });

    cnpjCampo.addEventListener("blur", function () {
        if (validarCNPJ(cnpjCampo.value)) {
            cnpjCampo.classList.remove("is-invalid");
            cnpjCampo.classList.add("is-valid");
        } else {
            cnpjCampo.classList.remove("is-valid");
            cnpjCampo.classList.add("is-invalid");
        }
    });

    emailCampo.addEventListener("blur", function () {
        if (validarEmail(emailCampo.value)) {
            emailCampo.classList.remove("is-invalid");
            emailCampo.classList.add("is-valid");
        } else {
            emailCampo.classList.remove("is-valid");
            emailCampo.classList.add("is-invalid");
        }
    });

    telefoneCampo.addEventListener("input", function () {
        telefoneCampo.value = mascaraTelefone(telefoneCampo.value);
    });

    telefoneCampo.addEventListener("blur", function () {
        if (validarTelefone(telefoneCampo.value)) {
            telefoneCampo.classList.remove("is-invalid");
            telefoneCampo.classList.add("is-valid");
        } else {
            telefoneCampo.classList.remove("is-valid");
            telefoneCampo.classList.add("is-invalid");
        }
    });

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

            fetch("/admin/cadastrar-fornecedores", {

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