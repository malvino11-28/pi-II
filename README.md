# Projeto Integrado II

Este repositório contém o desenvolvimento do projeto da disciplina
**Projeto Integrado II**.\
O objetivo é aplicar, ao longo do semestre, os conhecimentos adquiridos
nas outras matérias para construir uma aplicação completa.

---

# Equipe

Todos os membros possuem acesso ao repositório e podem contribuir com o
código.

---

# Uso de Branches

Para evitar conflitos no código, **ninguém deve trabalhar diretamente na
branch principal (`main`)**.

Cada integrante deve criar sua própria branch para desenvolver
funcionalidades.

# Clonando o repositório

Para vincular o repositório na sua máquina, clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd pasta-do-projeto
```

# Exemplo de criação de branch

```bash
git checkout -b login
```

Outros exemplos de nomes de branch:

    cadastro
    carrinho
    bootstrap-index
    fix-bug-login

---

# Como fazer um Commit

Após realizar alterações no código:

```bash
git add .
git commit -m "Descrição da alteração feita"
```

Exemplo:

```bash
git commit -m "feat: adiciona tela de login"
```

---

# Enviando alterações para o GitHub

Depois de fazer o commit, envie a branch para o repositório:

```bash
git push origin nome-da-branch
```

---

# Pull Request

Depois de terminar a funcionalidade:

1.  Acesse o repositório no GitHub
2.  Vá até a aba **Pull Requests**
3.  Clique em **New Pull Request**
4.  Selecione sua branch
5.  Solicite a integração com a branch `main`

Isso permite que o código seja revisado antes de ser integrado ao
projeto principal.

---

# Atualizando seu projeto

Antes de começar a programar, sempre atualize seu repositório local:

```bash
git pull origin main
```

Isso evita trabalhar em uma versão passada do projeto.

---

### Observação

Este repositório é utilizado exclusivamente para fins acadêmicos na
disciplina **Projeto Integrado II**.
