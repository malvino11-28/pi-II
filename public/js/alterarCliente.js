function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
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

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += Number(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== Number(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += Number(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    return resto === Number(cpf.substring(10, 11));
}

function validarNomeCompleto(nome) {
    const partes = nome.trim().split(/\s+/);

    return partes.length >= 2 &&
        partes.every(function (parte) {
            return parte.length >= 2;
        });
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

function validarSenha(senha) {
    return senha.length >= 8;
}

function validarDataNascimento(data) {
    if (data === "") {
        return false;
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(data)) {
        return false;
    }

    const partes = data.split("-");

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    const dataNascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const dataExiste =
        dataNascimento.getFullYear() === ano &&
        dataNascimento.getMonth() === mes - 1 &&
        dataNascimento.getDate() === dia;

    return dataExiste && dataNascimento <= hoje;
}

function mascaraRG(valor) {
    return valor
        .toUpperCase()
        .replace(/[^0-9X]/g, "")
        .slice(0, 9)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/(\d{3})([0-9X])$/, "$1-$2");
}

document.addEventListener("DOMContentLoaded", function () {

    let btn = document.querySelector("#btnSalvarAlteracao");
    btn.addEventListener("click", alterarCliente);

    let cpfCampo = document.querySelector("#cpfCli");
    let rgCampo = document.querySelector("#rgCli");
    let celularCampo = document.querySelector("#celCli");
    let nomeCampo = document.querySelector("#nomeCli");
    let emailCampo = document.querySelector("#emailCli");
    let senhaCampo = document.querySelector("#senhaCli");
    let dataNascCampo = document.querySelector("#dataNascCli");

    cpfCampo.addEventListener("input", function () {
        cpfCampo.value = mascaraCPF(cpfCampo.value);
    });

    cpfCampo.addEventListener("blur", function () {
        if (validarCPF(cpfCampo.value)) {
            cpfCampo.classList.remove("is-invalid");
            cpfCampo.classList.add("is-valid");
        } else {
            cpfCampo.classList.remove("is-valid");
            cpfCampo.classList.add("is-invalid");
        }
    });

    nomeCampo.addEventListener("blur", function () {
        if (validarNomeCompleto(nomeCampo.value)) {
            nomeCampo.classList.remove("is-invalid");
            nomeCampo.classList.add("is-valid");
        } else {
            nomeCampo.classList.remove("is-valid");
            nomeCampo.classList.add("is-invalid");
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

    celularCampo.addEventListener("input", function () {
        celularCampo.value = mascaraTelefone(celularCampo.value);
    });

    celularCampo.addEventListener("blur", function () {
        if (validarTelefone(celularCampo.value)) {
            celularCampo.classList.remove("is-invalid");
            celularCampo.classList.add("is-valid");
        } else {
            celularCampo.classList.remove("is-valid");
            celularCampo.classList.add("is-invalid");
        }
    });

    rgCampo.addEventListener("input", function () {
        rgCampo.value = mascaraRG(rgCampo.value);
    });

    rgCampo.addEventListener("blur", function () {
        if (rgCampo.value.trim() !== "") {
            rgCampo.classList.remove("is-invalid");
            rgCampo.classList.add("is-valid");
        } else {
            rgCampo.classList.remove("is-valid");
            rgCampo.classList.add("is-invalid");
        }
    });

    senhaCampo.addEventListener("input", function () {
        if (validarSenha(senhaCampo.value)) {
            senhaCampo.classList.remove("is-invalid");
            senhaCampo.classList.add("is-valid");
        } else {
            senhaCampo.classList.remove("is-valid");
            senhaCampo.classList.add("is-invalid");
        }
    });

    dataNascCampo.addEventListener("change", function () {
        if (validarDataNascimento(dataNascCampo.value)) {
            dataNascCampo.classList.remove("is-invalid");
            dataNascCampo.classList.add("is-valid");
        } else {
            dataNascCampo.classList.remove("is-valid");
            dataNascCampo.classList.add("is-invalid");
        }
    });

    function alterarCliente() {

        let nome = document.querySelector("#nomeCli");
        let cpf = document.querySelector("#cpfCli");
        let rg = document.querySelector("#rgCli");
        let dt_nasc = document.querySelector("#dataNascCli");
        let email = document.querySelector("#emailCli");
        let cel = document.querySelector("#celCli");
        let senha = document.querySelector("#senhaCli");
        let id = document.querySelector("#codCli")

        let nomeValido = validarNomeCompleto(nome.value);
        let cpfValido = validarCPF(cpf.value);
        let rgValido = rg.value.trim() !== "";
        let dataValida = validarDataNascimento(dt_nasc.value);
        let emailValido = validarEmail(email.value);
        let celularValido = validarTelefone(cel.value);
        let senhaValida = validarSenha(senha.value);

        nome.classList.toggle("is-valid", nomeValido);
        nome.classList.toggle("is-invalid", !nomeValido);

        cpf.classList.toggle("is-valid", cpfValido);
        cpf.classList.toggle("is-invalid", !cpfValido);

        rg.classList.toggle("is-valid", rgValido);
        rg.classList.toggle("is-invalid", !rgValido);

        dt_nasc.classList.toggle("is-valid", dataValida);
        dt_nasc.classList.toggle("is-invalid", !dataValida);

        email.classList.toggle("is-valid", emailValido);
        email.classList.toggle("is-invalid", !emailValido);

        cel.classList.toggle("is-valid", celularValido);
        cel.classList.toggle("is-invalid", !celularValido);

        senha.classList.toggle("is-valid", senhaValida);
        senha.classList.toggle("is-invalid", !senhaValida);

        if (
            id.value < 0 ||
            !nomeValido ||
            !cpfValido ||
            !rgValido ||
            !dataValida ||
            !emailValido ||
            !celularValido ||
            !senhaValida
        ) {
            alert("Revise os campos em vermelho antes de salvar.");
            return;
        }

        let obj = {
            id: id.value,
            nome: nome.value,
            cpf: cpf.value,
            rg: rg.value,
            dt_nasc: dt_nasc.value,
            email: email.value,
            cel: cel.value,
            senha: senha.value
        };

        fetch("/admin/cadastrar-clientes", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (corpoResp) {
            if (corpoResp.ok) {
                alert("Cliente Alterado com Sucesso!");
                window.location.reload();
            } else {
                alert("Erro ao alterar o cliente.");
            }
        });
    }
})




