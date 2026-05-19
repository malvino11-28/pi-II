import * as validadores from "./utils/validacoes.js";

const form = document.getElementById("form");

const diaInput = document.getElementById("dia_nasc");
const mesInput = document.getElementById("mes_nasc");
const anoInput = document.getElementById("ano_nasc");

form.addEventListener("submit", (e) => {
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
