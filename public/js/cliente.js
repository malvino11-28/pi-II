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

document.addEventListener('DOMContentLoaded', function () {
    let btns = document.querySelectorAll('.btn-plano');
    let btnConfirmar = document.getElementById('btn-confirmar-assinatura');

    // Este arquivo também é carregado nas outras páginas do cliente.
    if (!btnConfirmar) {
        return;
    }

    let codPlano = null;
    let nomePlano = '';
    let enviando = false;

    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', selecionarPlano);
    }

    btnConfirmar.addEventListener('click', cadastrarAssinatura);

    function selecionarPlano(event) {
        let botao = event.currentTarget;

        codPlano = Number(botao.dataset.codPlano);
        nomePlano = botao.dataset.nomePlano;

        let valorPlano = Number(botao.dataset.valorPlano);

        document.getElementById('nome-plano').textContent = nomePlano;

        document.getElementById('valor-plano').textContent =
            valorPlano.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
    }

    async function cadastrarAssinatura() {
        // Evita enviar novamente enquanto aguarda a resposta.
        if (enviando) {
            return;
        }

        if (!Number.isInteger(codPlano) || codPlano <= 0) {
            alert('Selecione um plano válido.');
            return;
        }

        // Guarda qual plano está sendo enviado nesta requisição.
        let planoEnviado = codPlano;
        let nomeEnviado = nomePlano;

        enviando = true;
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Aguarde...';

        try {
            let resposta = await fetch('/cliente/assinatura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codPlano: planoEnviado
                })
            });

            // Um redirecionamento pode retornar o HTML do login
            // ou de outra página, em vez do JSON esperado.
            let tipoResposta = resposta.headers.get('Content-Type') || '';

            if (resposta.redirected || !tipoResposta.includes('application/json')) {
                throw new Error(
                    'O servidor retornou uma página em vez do resultado. ' +
                    'Verifique seu login e a resposta da controladora.'
                );
            }

            let resultado = await resposta.json();

            if (!resposta.ok || resultado.ok !== true) {
                throw new Error(
                    resultado.mensagem || 'Não foi possível cadastrar a assinatura.'
                );
            }

            alert(resultado.mensagem || 'Assinatura cadastrada com sucesso!');
            window.location.reload();

        } catch (erro) {
            alert(erro.message || 'Erro de comunicação com o servidor.');

        } finally {
            enviando = false;
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar assinatura';
        }
    }
});