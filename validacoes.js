let regex;

// =========================
// VALIDAÇÕES
// =========================

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return false;
  }

  regex = /^(\d)\1{10}$/;

  if (regex.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
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

async function validarCEP(cep) {
  cep = cep.replace(/\D/g, "");

  regex = /^[0-9]{8}$/;

  if (!regex.test(cep)) {
    return false;
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await res.json();

    if (!res.ok || dados.erro === true) {
      return false;
    }

    return {
      logradouro: dados.logradouro || "",
      cidade: dados.localidade || "",
      bairro: dados.bairro || "",
      estado: dados.uf || "",
    };
  } catch (error) {
    console.log(error);

    // Para apresentação/local sem internet: se o CEP tiver 8 dígitos,
    // o usuário ainda pode preencher o endereço manualmente.
    return {
      logradouro: "",
      cidade: "",
      bairro: "",
      estado: "",
    };
  }
}

function validarData(data) {
  regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  const format = data.match(regex);

  if (!format) {
    return false;
  }

  const dia = parseInt(format[1], 10);
  const mes = parseInt(format[2], 10) - 1;
  const ano = parseInt(format[3], 10);

  const dataForm = new Date(ano, mes, dia);
  const dataAtual = new Date();

  dataAtual.setHours(0, 0, 0, 0);
  dataForm.setHours(0, 0, 0, 0);

  if (
    dataForm.getDate() !== dia ||
    dataForm.getMonth() !== mes ||
    dataForm.getFullYear() !== ano
  ) {
    return false;
  }

  if (dataForm > dataAtual) {
    return false;
  }

  return true;
}

function validarEmail(email) {
  regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function validarNomeCompleto(nome) {
  const partes = nome.trim().split(/\s+/);
  return partes.length >= 2 && partes.every((parte) => parte.length >= 2);
}

function validarTextoObrigatorio(valor) {
  return valor.trim().length > 0;
}

function validarTelefone(telefone) {
  const telefoneLimpo = telefone.replace(/\D/g, "");

  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11;
}

function validarSenha(senha) {
  return senha.length >= 8;
}

function validarConfirmarSenha(senha, confirmarSenha) {
  return senha === confirmarSenha && confirmarSenha.length > 0;
}

// =========================
// MÁSCARAS
// =========================

function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function mascaraCNPJ(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
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
    return numero.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }

  return numero.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function mascaraCEP(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

function mascaraData(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

// =========================
// INTEGRAÇÃO COM O HTML
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("formCad");

  if (!formCadastro) {
    return;
  }

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const cpfInput = document.getElementById("cpf");
  const cnpjInput = document.getElementById("cnpj");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");
  const enderecoInput = document.getElementById("endereco");
  const numeroInput = document.getElementById("numero");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const ufInput = document.getElementById("uf");
  const dataInput = document.getElementById("data_nasc");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");

  function mensagemErro(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  function mensagemValida(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  function limparValidacao(input) {
    input.classList.remove("is-invalid");
    input.classList.remove("is-valid");
  }

  cpfInput.addEventListener("input", () => {
    cpfInput.value = mascaraCPF(cpfInput.value);
  });

  cnpjInput.addEventListener("input", () => {
    cnpjInput.value = mascaraCNPJ(cnpjInput.value);
  });

  telefoneInput.addEventListener("input", () => {
    telefoneInput.value = mascaraTelefone(telefoneInput.value);
  });

  cepInput.addEventListener("input", () => {
    cepInput.value = mascaraCEP(cepInput.value);
  });

  ufInput.addEventListener("input", () => {
    ufInput.value = ufInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
  });

  dataInput.addEventListener("input", () => {
    dataInput.value = mascaraData(dataInput.value);
  });

  nomeInput.addEventListener("blur", () => {
    validarNomeCompleto(nomeInput.value) ? mensagemValida(nomeInput) : mensagemErro(nomeInput);
  });

  emailInput.addEventListener("blur", () => {
    validarEmail(emailInput.value) ? mensagemValida(emailInput) : mensagemErro(emailInput);
  });

  cpfInput.addEventListener("blur", () => {
    validarCPF(cpfInput.value) ? mensagemValida(cpfInput) : mensagemErro(cpfInput);
  });

  cnpjInput.addEventListener("blur", () => {
    if (cnpjInput.value.trim() === "") {
      limparValidacao(cnpjInput);
    } else {
      validarCNPJ(cnpjInput.value) ? mensagemValida(cnpjInput) : mensagemErro(cnpjInput);
    }
  });

  telefoneInput.addEventListener("blur", () => {
    validarTelefone(telefoneInput.value) ? mensagemValida(telefoneInput) : mensagemErro(telefoneInput);
  });

  dataInput.addEventListener("blur", () => {
    validarData(dataInput.value.trim()) ? mensagemValida(dataInput) : mensagemErro(dataInput);
  });

  cepInput.addEventListener("blur", async () => {
    const info = await validarCEP(cepInput.value);

    if (info) {
      if (info.logradouro !== "") {
        enderecoInput.value = info.logradouro;
      }

      if (info.bairro !== "") {
        bairroInput.value = info.bairro;
      }

      if (info.cidade !== "") {
        cidadeInput.value = info.cidade;
      }

      if (info.estado !== "") {
        ufInput.value = info.estado;
      }

      mensagemValida(cepInput);
    } else {
      mensagemErro(cepInput);
    }
  });

  senhaInput.addEventListener("input", () => {
    validarSenha(senhaInput.value) ? mensagemValida(senhaInput) : mensagemErro(senhaInput);

    if (confirmarSenhaInput.value !== "") {
      validarConfirmarSenha(senhaInput.value, confirmarSenhaInput.value)
        ? mensagemValida(confirmarSenhaInput)
        : mensagemErro(confirmarSenhaInput);
    }
  });

  confirmarSenhaInput.addEventListener("input", () => {
    validarConfirmarSenha(senhaInput.value, confirmarSenhaInput.value)
      ? mensagemValida(confirmarSenhaInput)
      : mensagemErro(confirmarSenhaInput);
  });

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeValido = validarNomeCompleto(nomeInput.value);
    const emailValido = validarEmail(emailInput.value);
    const cpfValido = validarCPF(cpfInput.value);
    const cnpjValido = cnpjInput.value.trim() === "" || validarCNPJ(cnpjInput.value);
    const telefoneValido = validarTelefone(telefoneInput.value);
    const cepValido = cepInput.value.replace(/\D/g, "").length === 8;
    const enderecoValido = validarTextoObrigatorio(enderecoInput.value);
    const numeroValido = validarTextoObrigatorio(numeroInput.value);
    const bairroValido = validarTextoObrigatorio(bairroInput.value);
    const cidadeValida = validarTextoObrigatorio(cidadeInput.value);
    const ufValida = /^[A-Z]{2}$/.test(ufInput.value.trim());
    const dataNascimentoValida = validarData(dataInput.value.trim());
    const senhaValida = validarSenha(senhaInput.value);
    const confirmarSenhaValida = validarConfirmarSenha(senhaInput.value, confirmarSenhaInput.value);

    nomeValido ? mensagemValida(nomeInput) : mensagemErro(nomeInput);
    emailValido ? mensagemValida(emailInput) : mensagemErro(emailInput);
    cpfValido ? mensagemValida(cpfInput) : mensagemErro(cpfInput);

    if (cnpjInput.value.trim() === "") {
      limparValidacao(cnpjInput);
    } else {
      cnpjValido ? mensagemValida(cnpjInput) : mensagemErro(cnpjInput);
    }

    telefoneValido ? mensagemValida(telefoneInput) : mensagemErro(telefoneInput);

    cepValido ? mensagemValida(cepInput) : mensagemErro(cepInput);
    enderecoValido ? mensagemValida(enderecoInput) : mensagemErro(enderecoInput);
    numeroValido ? mensagemValida(numeroInput) : mensagemErro(numeroInput);
    bairroValido ? mensagemValida(bairroInput) : mensagemErro(bairroInput);
    cidadeValida ? mensagemValida(cidadeInput) : mensagemErro(cidadeInput);
    ufValida ? mensagemValida(ufInput) : mensagemErro(ufInput);
    dataNascimentoValida ? mensagemValida(dataInput) : mensagemErro(dataInput);
    senhaValida ? mensagemValida(senhaInput) : mensagemErro(senhaInput);
    confirmarSenhaValida ? mensagemValida(confirmarSenhaInput) : mensagemErro(confirmarSenhaInput);

    if (
      nomeValido &&
      emailValido &&
      cpfValido &&
      cnpjValido &&
      telefoneValido &&
      cepValido &&
      enderecoValido &&
      numeroValido &&
      bairroValido &&
      cidadeValida &&
      ufValida &&
      dataNascimentoValida &&
      senhaValida &&
      confirmarSenhaValida
    ) {
      alert("Cadastro realizado com sucesso!");
      formCadastro.reset();

      const camposValidados = formCadastro.querySelectorAll(".is-valid, .is-invalid");
      camposValidados.forEach((campo) => limparValidacao(campo));
    }
  });
});
