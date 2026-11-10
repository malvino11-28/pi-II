document.addEventListener("DOMContentLoaded", function() {

    const btnCliente = document.querySelector("#btnCliente");
    const btnFuncionario = document.querySelector("#btnFuncionario");
    const identificacao = document.querySelector("#identificacao");
    const textoLogin = document.querySelector("#textoLogin");
    const cadastroCliente = document.querySelector("#cadastroCliente");
    const tipoLogin = document.querySelector("#tipoLogin");

    btnCliente.addEventListener("click", function() {

        identificacao.type = "email";
        identificacao.placeholder = "E-mail";
        identificacao.setAttribute("aria-label", "E-mail");
        identificacao.value = "";

        textoLogin.textContent = "Insira o e-mail e a senha para realizar o login";

        cadastroCliente.classList.remove("d-none");

        tipoLogin.value = "cliente";

        btnCliente.classList.replace("btn-outline-primary", "btn-primary");
        btnFuncionario.classList.replace("btn-primary", "btn-outline-primary");

        btnCliente.setAttribute("aria-pressed", "true");
        btnFuncionario.setAttribute("aria-pressed", "false");

    });

    btnFuncionario.addEventListener("click", function() {

        identificacao.type = "text";
        identificacao.placeholder = "Matrícula";
        identificacao.setAttribute("aria-label", "Matrícula");
        identificacao.value = "";

        textoLogin.textContent = "Insira a matrícula e a senha para realizar o login";

        cadastroCliente.classList.add("d-none");

        tipoLogin.value = "funcionario";

        btnFuncionario.classList.replace("btn-outline-primary", "btn-primary");
        btnCliente.classList.replace("btn-primary", "btn-outline-primary");

        btnFuncionario.setAttribute("aria-pressed", "true");
        btnCliente.setAttribute("aria-pressed", "false");

    });

});