function somenteNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
}

function validarCPF(cpf) {
    cpf = somenteNumeros(cpf);

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
    const partes = String(nome || "").trim().split(/\s+/);

    return partes.length >= 2 &&
        partes.every(function (parte) {
            return parte.length >= 2;
        });
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(String(email || "").trim());
}

function validarTelefone(telefone) {
    const telefoneLimpo = somenteNumeros(telefone);

    return telefoneLimpo.length === 10 ||
        telefoneLimpo.length === 11;
}

function validarSenha(senha) {
    return String(senha || "").length >= 8;
}

function validarDataNascimento(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data || ""))) {
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

module.exports = { somenteNumeros, validarCPF, validarNomeCompleto, validarEmail, validarTelefone, validarSenha, validarDataNascimento };