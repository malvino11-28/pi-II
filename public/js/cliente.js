// Esta página é uma demonstração. Nenhuma informação é enviada ao servidor.

// Mostra a seção escolhida e destaca o botão correspondente no menu.
function mostrarSecao(id) {
    let secoes = document.querySelectorAll('.secao-cliente');
    let botoes = document.querySelectorAll('.menu-cliente button');

    for (let i = 0; i < secoes.length; i++) {
        secoes[i].hidden = true;
    }

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove('active');
        botoes[i].removeAttribute('aria-current');
    }

    document.getElementById(id).hidden = false;
    document.getElementById('menu-' + id).classList.add('active');
    document.getElementById('menu-' + id).setAttribute('aria-current', 'page');
    document.getElementById('conteudo').focus();
}

// Preenche os textos do modal. O próprio Bootstrap abre e fecha a janela.
function escolherPlano(nome, valor) {
    document.getElementById('nome-plano').textContent = nome;
    document.getElementById('valor-plano').textContent = 'R$ ' + valor + '/mês';
}

// Atualiza apenas os textos da página; não cria uma assinatura real.
function confirmarPlano() {
    let nome = document.getElementById('nome-plano').textContent;

    document.getElementById('plano-atual').textContent = nome;
    document.getElementById('resumo-plano').textContent = nome;
    document.getElementById('situacao-plano').textContent =
        'Plano selecionado na demonstração. Nenhuma cobrança foi realizada.';
}

// Impede o envio dos formulários enquanto o back-end não estiver conectado.
function avisarFormulario(event) {
    event.preventDefault();
    alert('Esta é uma demonstração. Os dados não foram salvos no sistema.');
}

addEventListener('DOMContentLoaded', function () {

    let btns = document.querySelectorAll('#btn-plano');

    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', cadastrarAssinatura);
    }

    function cadastrarAssinatura(event) {

        
    }
});