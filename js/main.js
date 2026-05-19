import * as validadores from "./utils/validacoes.js";

const formCadastro = document.getElementById("formCad");
const formCarrinho = document.getElementById("formCar");

if (formCadastro) {
  const diaInput = document.getElementById("dia_nasc");
  const mesInput = document.getElementById("mes_nasc");
  const anoInput = document.getElementById("ano_nasc");

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validarFormulario()) console.log("data certa");
    else console.log("data errada");
  });

  function validarFormulario() {
    const dia = diaInput.value;
    const mes = mesInput.value;
    const ano = anoInput.value.trim();

    if (ano === "") return false;

    const dataString = `${dia}/${mes}/${ano}`;
    const dataValida = validadores.validarData(dataString);

    return dataValida;
  }
}

if (formCarrinho) {
  const cepInput = document.getElementById("cep");

  formCarrinho.addEventListener("submit", async (e) => {
    e.preventDefault(); // trava para ler antes de mudar de pagina

    const resultado = await validarFormulario(); // espera resposta da API
    if (resultado) {
      console.log("cep correto, dados: ", resultado);
      //    formCarrinho.submit(); // libera pagina (comentado para verificar o resultado do console.log)
    } else console.log("cep invalido");
  });

  function validarFormulario() {
    const cep = cepInput.value.trim();
    if (cep === "") return false;

    const cepValido = validadores.validarCEP(cep);

    return cepValido;
  }
}
