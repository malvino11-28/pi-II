// Navegação realizada pelas rotas. Aqui ficam apenas as ações demonstrativas.

// Preenche os textos do modal. O próprio Bootstrap abre e fecha a janela.
function escolherPlano(nome, valor) {
    document.getElementById('nome-plano').textContent = nome;
    document.getElementById('valor-plano').textContent = 'R$ ' + valor + '/mês';
}

// Atualiza apenas os textos da página; não cria uma assinatura real.
function confirmarPlano() {
    let nome = document.getElementById('nome-plano').textContent;

    document.getElementById('plano-atual').textContent = nome;
    document.getElementById('situacao-plano').textContent =
        'Plano selecionado na demonstração. Nenhuma cobrança foi realizada.';
}

// Impede o envio dos formulários enquanto o back-end não estiver conectado.
function avisarFormulario(event) {
    event.preventDefault();
    alert('Esta é uma demonstração. Os dados não foram salvos no sistema.');
}

