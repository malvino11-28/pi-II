document.addEventListener("DOMContentLoaded", () => {
    let btnCadastrar = document.querySelector("#btnSalvar");
    let btnExcluir = document.querySelectorAll(".btn-excluir");
    let btnAlterar = document.querySelector("#btnSalvarAlteracao");

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
            let img = document.getElementById("previaImagem");
            let urlImg = URL.createObjectURL(this.files[0]);
            img.src = urlImg;
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

        // function validarImagemProduto(obrigatoria) {
    //     const arquivo = imagem.files[0];
    //     let validar;

    //     if (arquivo) {
    //         const tamanhoBytes = arquivo.size;
    //         const limiteBytes = 16 * 1024 * 1024;

    //         if (tamanhoBytes > limiteBytes) {
    //             alert("Limite de tamanho de imagem de 16MB excedido.");

    //             imagem.classList.remove("is-valid");
    //             imagem.classList.add("is-invalid");
    //             validar = false;
    //         } else {
    //             imagem.classList.remove("is-invalid");
    //             imagem.classList.add("is-valid");
    //             validar = true;
    //         }

    //     } else {
    //         if (obrigatoria) {
    //             imagem.classList.remove("is-valid");
    //             imagem.classList.add("is-invalid");
    //             validar = false;
    //         } else {
    //             // Na alteração, mantém a imagem do banco.
    //             imagem.classList.remove("is-valid");
    //             imagem.classList.remove("is-invalid");
    //             validar = true;
    //         }
    //     }

    //     return validar;
    // }

    imagem.addEventListener("blur", validarImagemProduto);

    function cadastrarProduto() {
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

            fetch("/admin/produto/cadastrar-produto", {
                method: "POST",
                body: formData,
            })
            .then((res) => {
                return res.json();
            })
            .then((resBody) => {
                if (resBody.ok) {
                    alert("Produto cadastrado com sucesso!");
                    window.location.reload();
                } else {
                    alert("Erro ao cadastrar produto.");
                }
            })
        } else {
            alert("Revise os campos em vermelho antes de salvar.");
            return;
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
