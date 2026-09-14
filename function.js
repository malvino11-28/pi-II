var vetClientes = [];

// ===== MÁSCARAS NOS CAMPOS =====

// Máscara de Telefone - formata enquanto digita: (00) 00000-0000
document.getElementById('telefone').addEventListener('input', function(evento) {
    var campo = evento.target;
    var valor = campo.value.replace(/\D/g, '')
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    campo.value = valor; //Coloca o valor formatado de volta no campo
});

// Máscara de CPF - formata enquanto digita: 000.000.000-00
document.getElementById('cpf').addEventListener('input', function(evento) {
    var campo = evento.target;
    var valor = campo.value.replace(/\D/g, ''); 
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); 
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); 
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
    campo.value = valor;
});

// Máscara de CEP - formata enquanto digita: 00000-000
document.getElementById('cep').addEventListener('input', function(evento) {
    var campo = evento.target;
    var valor = campo.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    campo.value = valor;
});

// ===== ALERTAS =====

// Mostra mensagem de sucesso ou erro na tela durante 5 segundos
function mostrarAlerta(mensagem, tipo) {
    var divAlertas = document.getElementById('alertContainer');
    var novoAlerta = document.createElement('div');
    novoAlerta.className = 'alert alert-' + tipo + ' alert-dismissible fade show';
    novoAlerta.innerHTML = mensagem + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    divAlertas.appendChild(novoAlerta); // Adiciona o alerta na página
    
    setTimeout(function() {
        novoAlerta.remove(); // Remove o alerta após 5 segundos
    }, 5000);
}

// ===== TABELA =====


function montarTabela(dados) {
    var tbody = document.getElementById('tabelaClientes'); // Pega o body da tabela
    var htmlTabela = ''; // Começa vazio
    
    for (var i = 0; i < dados.length; i++) {
        var cliente = dados[i]; // Pega cada cliente
        
        htmlTabela += '<tr>'; // Começa uma linha
        htmlTabela += '<td><input type="checkbox" data-id="' + cliente.id + '"></td>';
        htmlTabela += '<td>' + cliente.id + '</td>';
        htmlTabela += '<td>' + cliente.nome + '</td>';
        htmlTabela += '<td>' + cliente.email + '</td>';
        htmlTabela += '<td>' + cliente.telefone + '</td>';
        htmlTabela += '<td>' + cliente.cpf + '</td>';
        htmlTabela += '<td>' + cliente.cep + '</td>';
        htmlTabela += '<td>' + cliente.status + '</td>';
        htmlTabela += '<td><button class="btn-delete" onclick="excluirCliente(' + cliente.id + ')"><i class="bi bi-trash"></i> Excluir</button></td>';
        htmlTabela += '</tr>';
    }
    
    tbody.innerHTML = htmlTabela; // Coloca todo o HTML na tabela
}

// ===== ADICIONAR CLIENTE =====

// Função principal que pega os dados do formulário, valida e adiciona à lista
function adicionarCliente() {
    // Pega os elementos do formulário
    var campoNome = document.getElementById('nome');
    var campoEmail = document.getElementById('email');
    var campoTelefone = document.getElementById('telefone');
    var campoCpf = document.getElementById('cpf');
    var campoCep = document.getElementById('cep');
    var campoStatus = document.getElementById('status');

    // Remove caracteres especiais para validar
    var telefoneLimpo = campoTelefone.value.replace(/\D/g, '');
    var cpfLimpo = campoCpf.value.replace(/\D/g, '');
    var cepLimpo = campoCep.value.replace(/\D/g, '');

    // Verifica se todos os campos estão preenchidos
    if (
        campoNome.value == '' ||
        campoEmail.value == '' ||
        campoTelefone.value == '' ||
        campoCpf.value == '' ||
        campoCep.value == '' ||
        campoStatus.value == ''
    ) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Valida se tem nome e sobrenome
    var nomeCompleto = campoNome.value.trim();
    if (nomeCompleto.indexOf(' ') == -1) {
        alert('Digite nome e sobrenome!');
        return;
    }

    // Valida email com expressão regular
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(campoEmail.value)) {
        alert('E-mail inválido!');
        return;
    }

    // Valida telefone - tem que ter 11 dígitos
    if (telefoneLimpo.length != 11) {
        alert('Telefone inválido!');
        return;
    }

    // Valida CEP - tem que ter 8 dígitos
    if (cepLimpo.length != 8) {
        alert('CEP inválido!');
        return;
    }

    // Valida CPF usando função específica
    if (!validarCPF(cpfLimpo)) {
        alert('CPF inválido!');
        return;
    }

    // Verifica se o CPF já está cadastrado
    for (var i = 0; i < vetClientes.length; i++) {
        var cpfClienteExistente = vetClientes[i].cpf.replace(/\D/g, '');
        if (cpfClienteExistente == cpfLimpo) {
            alert('Este CPF já está cadastrado!');
            return;
        }
    }

    // Verifica se o email já está cadastrado
    for (var i = 0; i < vetClientes.length; i++) {
        if (vetClientes[i].email.toLowerCase() == campoEmail.value.toLowerCase()) {
            alert('Este e-mail já está cadastrado!');
            return;
        }
    }

    // Cria um objeto com os dados do novo cliente
    var novoCliente = {
        id: new Date().getTime(), // Gera um ID único baseado no timestamp
        nome: campoNome.value,
        email: campoEmail.value,
        telefone: campoTelefone.value,
        cpf: campoCpf.value,
        cep: campoCep.value,
        status: campoStatus.value
    };

    vetClientes.push(novoCliente); // Adiciona o cliente ao array
    montarTabela(vetClientes); // Atualiza a tabela
    atualizarEstatisticas(); // Atualiza os números de clientes
    limparFormulario(); // Limpa os campos

    // Mostra mensagem de sucesso
    mostrarAlerta(
        '<i class="bi bi-check-circle-fill"></i> Cliente cadastrado com sucesso!',
        'success'
    );
}

// ===== VALIDAÇÕES =====

// Valida se o CPF é válido usando algoritmo matemático
function validarCPF(cpf) {
    // Verifica se tem 11 dígitos
    if (cpf.length != 11) {
        return false;
    }

    // Impede CPFs iguais (Ex: 11111111111)
    const regex = /^(\d)\1{10}$/;
    if (regex.test(cpf)) { //
        return false;
    }

    // Calcula o primeiro dígito verificador
    var soma = 0;
    var resto;

    for (var i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(9, 10))) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;

    for (var i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true; // CPF é válido!
}

// ===== EXCLUIR CLIENTES =====

// Exclui um cliente específico
function excluirCliente(idParaExcluir) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        var vetAuxiliar = []; // Cria um array vazio
        
        // Copia todos os clientes MENOS o que quer excluir
        for (var i = 0; i < vetClientes.length; i++) {
            if (vetClientes[i].id != idParaExcluir) {
                vetAuxiliar.push(vetClientes[i]);
            }
        }
        
        vetClientes = vetAuxiliar; // Substitui o array original
        montarTabela(vetClientes); // Atualiza a tabela
        atualizarEstatisticas(); // Atualiza os números
        mostrarAlerta('<i class="bi bi-trash-fill"></i> Cliente excluído com sucesso!', 'danger');
    }
}

// Exclui vários clientes selecionados de uma vez
function excluirSelecionados() {
    var todosCheckbox = document.querySelectorAll('[data-id]'); // Pega todos os checkboxes do Data Attribute
    
    if (todosCheckbox.length > 0) {
        var temSelecionado = false;
        
        // Verifica se tem algum checkbox marcado
        for (var i = 0; i < todosCheckbox.length; i++) {
            if (todosCheckbox[i].checked == true) {
                temSelecionado = true;
                break;
            }
        }
        
        if (temSelecionado) {
            if (confirm('Tem certeza que deseja excluir os clientes selecionados?')) {
                // Exclui todos os que estão marcados
                for (var i = 0; i < todosCheckbox.length; i++) {
                    if (todosCheckbox[i].checked == true) {
                        excluirClienteSemConfirmacao(todosCheckbox[i].dataset.id);
                    }
                }
                mostrarAlerta('<i class="bi bi-trash-fill"></i> Clientes selecionados excluídos com sucesso!', 'danger');
            }
        } else {
            alert('Selecione pelo menos um cliente para excluir!');
        }
    } else {
        alert('Não há clientes para serem excluídos!');
    }
}

// Função auxiliar que exclui sem pedir confirmação novamente
function excluirClienteSemConfirmacao(idParaExcluir) {
    var vetAuxiliar = [];
    
    for (var i = 0; i < vetClientes.length; i++) {
        if (vetClientes[i].id != idParaExcluir) {
            vetAuxiliar.push(vetClientes[i]);
        }
    }
    
    vetClientes = vetAuxiliar;
    montarTabela(vetClientes);
    atualizarEstatisticas();
}

// ===== CHECKBOXES =====

// Marca ou desmarca todos os checkboxes da tabela de uma vez
function selecionarTodos() {
    var todosCheckbox = document.querySelectorAll('[data-id]'); // Pega todos os checkboxes
    var checkboxPai = document.getElementById('ckTodos'); // Pega o checkbox principal
    
    // Faz todos terem o mesmo estado do checkbox principal
    for (var i = 0; i < todosCheckbox.length; i++) {
        todosCheckbox[i].checked = checkboxPai.checked;
    }
}

// ===== FORMULÁRIO =====

// Limpa todos os campos do formulário
function limparFormulario() {
    document.getElementById('formCliente').reset();
}

// ===== ESTATÍSTICAS =====

// Atualiza os números de total, ativos e inativos
function atualizarEstatisticas() {
    var totalClientes = vetClientes.length; // Conta total de clientes
    var totalAtivos = 0;
    var totalInativos = 0;

    // Conta quantos estão ativos e quantos estão inativos
    for (var i = 0; i < vetClientes.length; i++) {
        if (vetClientes[i].status == 'Ativo') {
            totalAtivos++;
        } else {
            totalInativos++;
        }
    }

    // Coloca os números nas caixas de estatísticas
    document.getElementById('totalClientes').textContent = totalClientes;
    document.getElementById('clientesAtivos').textContent = totalAtivos;
    document.getElementById('clientesInativos').textContent = totalInativos;
}

// ===== INICIALIZAÇÃO =====

// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    montarTabela(vetClientes); // Monta a tabela (vazia no início)
    
    // Adiciona eventos aos botões
    var botaoSalvar = document.getElementById('btnSalvar');
    botaoSalvar.addEventListener('click', adicionarCliente, false); // Ao clicar em Salvar, chama adicionarCliente()
    
    var botaoLimpar = document.getElementById('btnLimpar');
    botaoLimpar.addEventListener('click', limparFormulario, false); // Ao clicar em Limpar, limpa o formulário
    
    var botaoExcluirSelecionados = document.getElementById('btnExcluirSelecionados');
    botaoExcluirSelecionados.addEventListener('click', excluirSelecionados, false); // Ao clicar, exclui os selecionados
    
    var checkboxPai = document.getElementById('ckTodos');
    checkboxPai.addEventListener('click', selecionarTodos, false); // Ao clicar, marca/desmarca todos
}, false);