function formatarCPF(cpf) {
    const numero = String(cpf || "").replace(/\D/g, "");

    if (numero.length !== 11) {
        return cpf;
    }

    return numero.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
    );
}

function formatarTelefone(telefone) {
    const numero = String(telefone || "").replace(/\D/g, "");

    if (numero.length === 11) {
        return numero.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    if (numero.length === 10) {
        return numero.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );
    }

    return telefone;
}

function formatarData(data) {
    if (!data) {
        return "";
    }

    const dataObj = new Date(data);

    return dataObj.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

function formatarCNPJ(cnpj) {
    const numero = String(cnpj || "").replace(/\D/g, "");

    if (numero.length !== 14) {
        return cnpj;
    }

    return numero.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
    );
}

module.exports = { formatarCPF, formatarTelefone, formatarData, formatarCNPJ };