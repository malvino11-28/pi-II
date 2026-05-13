let regex;

// CPF, CNPJ
// data futur/passada
// CEP (API)

export function validarCPF(cpf) {
    let sum = 0;
    let rest;
    let i;
    regex = /^(\d)\1{10}$/; // regex de numeros repetidos

    if (cpf.length !== 11 || !!cpf.match(regex)) { // dupla negação transforma em bool
        return false;
    }

    for (i=1;i<=9;i++) 
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i); // multiplica todos os digitos e soma
    rest = (sum * 10) % 11; // pega o total, multiplica por 10, e calcula o resto da divisão por 11 (regra do módulo 11)
    if ((rest === 10) || (rest === 11))
        rest = 0; // se o resto da conta anterior for 10 ou 11, o dígito verificador deve ser considerado 0 (receita federal)
    if (rest !== parseInt(cpf.substring(9, 10)))
        return false; // validação do 1° digito. substring pega o 10° dígito do CPF, se o resto calculado for diferente dele, o CPF é falso e retorna false

    sum = 0; // zera para verificar o calculo do 2° digito

    for (i = 1;i<=10;i++)
        sum = sum+ parseInt(cpf.substring(i - 1, i)) * (12 - i); // primeiro dígito verificador agora entra na conta
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11))
        rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) 
        return false;

    return true;
    // return console.log(regex.test(cpf));
    // estou deixando esse return para testar posteriormente no terminal
}
