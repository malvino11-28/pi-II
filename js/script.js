const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        data: {
            dia: document.getElementById("dia").value,
            mes: document.getElementById("mes").value,
            ano: document.getElementById("ano").value
        }
    }
    // depois vou passar as validações aq

    console.log(dados); // testando
})