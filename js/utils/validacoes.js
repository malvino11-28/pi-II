let regex;

// CPF, CNPJ
// data futur/passada
// CEP (API)

export function validarCPF(cpf) {
    let sum = 0, rest, i;
    regex = /^(\d)\1{10}$/; // regex de numeros repetidos

    if (cpf.length !== 11 || !!cpf.match(regex)) { // dupla negação transforma em bool
        return false;
    }

    for (i=1;i<=9;i++) 
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i); // multiplica todos os digitos e soma
    rest = (sum * 10) % 11; // pega o total, multiplica por 10, e calcula o resto da divisão por 11 (regra do módulo 11)
    if ((rest === 10) || (rest === 11))
        rest = 0; // se o resto da conta anterior for 10 ou 11, o dígito verificador deve ser considerado 0 (receita federal)
    if (rest !== parseInt(cpf.substring(9, 10)))
        return false; // validação do 1° digito. substring pega o 10° dígito do CPF, se o resto calculado for diferente dele, o CPF é falso e retorna false

    sum = 0; // zera para verificar o calculo do 2° digito

    for (i = 1;i<=10;i++)
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i); // primeiro dígito verificador agora entra na conta
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11))
        rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) 
        return false;

    return true; // cpf matematicamente validado
    // return console.log(regex.test(cpf));
    // estou deixando esse return para testar posteriormente no terminal
}

export function validarCNPJ(cnpj) {
    let sum = 0, rest, i, d1, d2;
    regex = /^(\d)\1{13}$/;
    if (cnpj.length !== 14 || !!cnpj.match(regex))
        return false;

    let pesosPri = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; // pesos oficiais para o primeiro digito
    for (i=1;i<12;i++)
        sum += parseInt(cnpj.charAt(i)) * pesosPri[i];
    rest = sum % 11;
    if (rest < 2)
        d1 = 0;
    else
        d1 = 11 - rest;   
    if (d1 !== parseInt(cnpj.charAt(12)))
        return false;

    sum = 0;
    let pesosSeg = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (i=0;i<13;i++)
        sum += parseInt(cnpj.charAt(i)) * pesosSeg[i];
    rest = sum % 11;
    if (rest < 2)
        d2 = 0;
    else
        d2 = 11 - rest;
    if (d2 !== parseInt(cnpj.charAt(13)))
        return false;

    return true; // cnpj matematicamente validado
}