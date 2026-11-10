let listaNutri = [];

document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

    let btnAddNutri = document.querySelector("#btnAddNutri");

    if (btnAddNutri) {
        btnAddNutri.addEventListener("click", adicionarNutriente);
    }

    if (btnExcluir.length > 0) {
        for(let i = 0; i < btnExcluir.length; i++) {
            btnExcluir[i].addEventListener("click", excluirProduto);
        }
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarProduto);
    }

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterarProduto);
    }

    let inputArquivo = document.getElementById("inputImagem");
    inputArquivo.addEventListener("change", carregarPrevia);

    function carregarPrevia() {
        console.log(this.files);
        if (this.files.length > 0) {
            const arquivo = this.files[0];
            if (!arquivo.type.startsWith("image/")) {
                alert("Selecione um arquivo de imagem válido.");
                this.value = "";
                return;
            }
            let img = document.getElementById("previaImagem");
            img.removeAttribute("src");
            document.getElementById("divPrevia").style.display = "block";
        }
    }

    let nome = document.querySelector("#nomeProd"); //nomeProd
    let marca = document.querySelector("#marca");// marca
    let categoria = document.querySelector("#categoria");// categoria
    let desc = document.querySelector("#desc");// desc
    let descRed = document.querySelector("#descRed");// descRed
    let uniMedida = document.querySelector("#uniMedida");// uniMedida
    let valor = document.querySelector("#valor");// valor
    let imagem = document.querySelector("#inputImagem");

    // info nutricionais
    let idProd = document.querySelector("#idProd");
    let nomeNutri = document.querySelector("#nomeNutri");
    let qtd100gNutri = document.querySelector("#qtd100gNutri");
    let uniNutri = document.querySelector("#uniNutri");
    let percVDNutri = document.querySelector("#percVDNutri");

    function validarNomeProduto() {
        const tamanho = nome.value.trim().length;
        let validar;
        if (tamanho >= 2 && tamanho <= 100) {
            nome.classList.remove("is-invalid");
            nome.classList.add("is-valid");
            validar = true;
        } else {
            nome.classList.remove("is-valid");
            nome.classList.add("is-invalid");
            validar = false;
        }
        return validar;
    }

    nome.addEventListener("blur", validarNomeProduto);

    function validarMarcaSelecionada() {
        const selecionado = marca.value;
        let validar;
        if (selecionado != 0) {
            marca.classList.remove("is-invalid");
            marca.classList.add("is-valid");
            validar = true;
        } else {
            marca.classList.remove("is-valid");
            marca.classList.add("is-invalid");
            validar = false;
        }
        
        return validar;
    }

    marca.addEventListener("change", validarMarcaSelecionada);

    function validarCategoriaSelecionada() {
        const selecionado = categoria.value;
        let validar;
        if (selecionado != 0) {
            categoria.classList.remove("is-invalid");
            categoria.classList.add("is-valid");
            validar = true;
        } else {
            categoria.classList.remove("is-valid");
            categoria.classList.add("is-invalid");
            validar = false;
        }

        return validar;
    }

    categoria.addEventListener("change", validarCategoriaSelecionada);

    function validarDescricao() {
        const tamanho = desc.value.length;
        let validar;
        if (tamanho >= 50 && tamanho <= 500) {
            desc.classList.remove("is-invalid");
            desc.classList.add("is-valid");
            validar = true;
        } else {
            desc.classList.remove("is-valid");
            desc.classList.add("is-invalid");
            validar = false;
        }
        return validar;
    }

    desc.addEventListener("blur", validarDescricao);

    function validarDescricaoReduzida() {
        const tamanho = descRed.value.length;
        let validar;
        if (tamanho >= 20 && tamanho <= 255) {
            descRed.classList.remove("is-invalid");
            descRed.classList.add("is-valid");
            validar = true;
        } else {
            descRed.classList.remove("is-valid");
            descRed.classList.add("is-invalid");
            validar = false;
        }
        return validar;
    }

    descRed.addEventListener("blur", validarDescricaoReduzida);

    function validarMedidaSelecionada() {
        const selecionado = uniMedida.value;
        if (selecionado != 0) {
            uniMedida.classList.remove("is-invalid");
            uniMedida.classList.add("is-valid");
            validar = true;
        } else {
            uniMedida.classList.remove("is-valid");
            uniMedida.classList.add("is-invalid");
            validar = false;
        }

        return validar;
    }

    uniMedida.addEventListener("change", validarMedidaSelecionada);

    function validarValorProduto() {
        const valorPro = valor.value;
        let validar;
        if (valorPro > 0 && valorPro != "") {
            valor.classList.remove("is-invalid");
            valor.classList.add("is-valid");
            validar = true;
        } else {
            valor.classList.remove("is-valid");
            valor.classList.add("is-invalid");
            validar = false;
        }

        return validar;
    }

    valor.addEventListener("blur", validarValorProduto);

    function validarImagemProduto() {
        const arquivo = imagem.files[0];
        if (arquivo) {
            const tamanhoBytes = arquivo.size;
            const limiteBytes = 16 * 1024 * 1024; // 16 mb
            if (tamanhoBytes > limiteBytes) {
                alert("Limite de tamanho de imagem de 16MB excedido.");
                imagem.classList.remove("is-valid");
                imagem.classList.add("is-invalid");
                return false;
            } else {
                imagem.classList.remove("is-invalid");
                imagem.classList.add("is-valid");
                return true;
            }
        } else {
            imagem.classList.remove("is-valid");
            imagem.classList.add("is-invalid");
            return false;
        } 
    }

    imagem.addEventListener("blur", validarImagemProduto);


async function cadastrarProduto() {
    let nomeValido = validarNomeProduto();
    let marcaValida = validarMarcaSelecionada();
    let categoriaValida = validarCategoriaSelecionada();
    let descValida = validarDescricao();
    let descRedValida = validarDescricaoReduzida();
    let medidaValida = validarMedidaSelecionada();
    let valorValido = validarValorProduto();
    let imagemValida = validarImagemProduto(true);

    if (
        nomeValido &&
        marcaValida &&
        categoriaValida &&
        descValida &&
        descRedValida &&
        medidaValida &&
        valorValido &&
        imagemValida
    ) {
        let formData = new FormData();

        formData.append("nome", nome.value);
        formData.append("marca", marca.value);
        formData.append("categoria", categoria.value);
        formData.append("desc", desc.value);
        formData.append("desc_red", descRed.value);
        formData.append("uni", uniMedida.value);
        formData.append("valor", valor.value);
        formData.append("imagem", imagem.files[0]);

        let respostaProduto = await fetch(
            "/admin/produto/cadastrar-produto",
            {
                method: "POST",
                body: formData
            }
        );
        let resultadoProduto = await respostaProduto.json();

        if (resultadoProduto.ok) {
            if (listaNutri.length > 0) {
                let obj = {
                    idProd: resultadoProduto.idProd,
                    listaNutri: listaNutri
                };
                let respostaNutri = await fetch(
                    "/admin/produto/cadastrar-produto-info-nutri",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(obj)
                    }
                );
                let resultadoNutri = await respostaNutri.json();
                if (resultadoNutri.ok) {
                    alert("Produto e informações nutricionais cadastrados com sucesso!");
                    window.location.reload();
                } else {
                    alert("Produto cadastrado, mas houve um erro nas informações nutricionais.");
                }
            } else {
                alert("Produto cadastrado com sucesso!");
                window.location.reload();
            }
        } else {
            alert("Erro ao cadastrar produto.");
        }
    } else {
        alert("Revise os campos em vermelho antes de salvar.");
    }
}



    function excluirProduto() {

        let idExclusao = this.dataset.id;
        if(confirm("Deseja realmente excluir este produto?")) {

            let obj = {
                id: idExclusao
            }

            fetch("/admin/produto/excluir-produto", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(res){
                return res.json();

            }).then(function (resBody) {
                if (resBody.ok) {
                    alert("Produto excluído com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao excluir produto.");
                    return;
                }
            })
        }
    }

    function alterarProduto() { // corrigir problema imagem
        let idAlteracao = document.querySelector("#idProd");

        let nomeValido = validarNomeProduto();
        let marcaValida = validarMarcaSelecionada();
        let categoriaValida = validarCategoriaSelecionada();
        let descValida = validarDescricao();
        let descRedValida = validarDescricaoReduzida();
        let medidaValida = validarMedidaSelecionada();
        let valorValido = validarValorProduto();

        // imagem não é obrigatória caso venha do buffer
        let imagemValida = validarImagemProduto(false);

        if (
            idAlteracao.value > 0 &&
            nomeValido &&
            marcaValida &&
            categoriaValida &&
            descValida &&
            descRedValida &&
            medidaValida &&
            valorValido &&
            imagemValida
        ) {

            let formData = new FormData();

            formData.append("id", idAlteracao.value);
            formData.append("nome", nome.value);
            formData.append("marca", marca.value);
            formData.append("categoria", categoria.value);
            formData.append("desc", desc.value);
            formData.append("desc_red", descRed.value);
            formData.append("uni", uniMedida.value);
            formData.append("valor", valor.value);

            if (imagem.files.length > 0) {
                formData.append("imagem", imagem.files[0]);
            }

            fetch("/admin/produto/cadastrar-produto", {
                method: "POST",
                body: formData,
            })
            .then((res) => {
                return res.json();
            })
            .then((resBody) => {
                if (resBody.ok) {
                    alert("Produto atualizado com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao atualizar produto.");
                    return;
                }
            })
        } else {
            alert("Revise os campos em vermelho antes de salvar.");
            return;
        }
    }

});

function verificarInfoNutri() {
    const opInfoNutri = document.querySelector("#infoNutri");
    const blocoInfo = document.querySelector("#blocoInfo");

    if (opInfoNutri.checked) {
        blocoInfo.style.display = 'block';
    } else {
        blocoInfo.style.display = 'none';
    }
}

function removerNutriente(i) {
    listaNutri.splice(i, 1);
    atualizarTabela();
}

    function adicionarNutriente() {
        const nomeNutri = document.querySelector("#nomeNutri");
        const qtd100gNutri = document.querySelector("#qtd100gNutri");
        const uniNutri = document.querySelector("#uniNutri");
        const percVDNutri = document.querySelector("#percVDNutri");

        if (!nomeNutri.value || !qtd100gNutri.value) {
            alert("Preencha ao menos o nome e a quantidade do nutriente!");
            return;
        }

        const nutriente = { 
            nome: nomeNutri.value, 
            uni: uniNutri.value,
            qtd: qtd100gNutri.value, 
            percVD: percVDNutri.value };

        listaNutri.push(nutriente);

        atualizarTabela();

        nomeNutri.value = "";
        qtd100gNutri.value = "";
        uniNutri.value = "";
        percVDNutri.value = "";
    }

    function atualizarTabela() {
        const tabela = document.querySelector("#tabelaNutri");

        let html = "";

        for (let i = 0; i < listaNutri.length; i++) {
            html += `
                <tr>
                    <td>${listaNutri[i].nome}</td>
                    <td> ${listaNutri[i].qtd}</td>
                    <td>${listaNutri[i].uni}</td>
                    <td>${listaNutri[i].percVD}%</td>
                    <td><button type="button" class="btn-acao btn-excluir" onclick="removerNutriente(${i})"><i class="bi bi-trash"></i></button></td>
                </tr>
            `
        }

        tabela.innerHTML = html;
    }
