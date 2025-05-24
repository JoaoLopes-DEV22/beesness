# 🐝 Beesness

> Projeto colaborativo versionado com Git e GitHub.

Bem-vindo ao repositório **Beesness**! Aqui você encontrará um passo a passo completo para configurar seu ambiente, contribuir com segurança utilizando branches e manter seu código sincronizado com a branch principal.

---

## 📦 Sumário

- [🛠️ Pré-requisitos](#️-pré-requisitos)
- [📥 Clonando o Repositório](#-clonando-o-repositório)
- [🌱 Criando e Usando Branches](#-criando-e-usando-branches)
- [📝 Commitando e Monitorando Alterações](#-commitando-e-monitorando-alterações)
- [🔄 Atualizando sua Branch com a Main](#-atualizando-sua-branch-com-a-main)
- [💡 Dicas Úteis](#-dicas-úteis)
- [👨‍💻 Autor](#-autor)
- [📎 Links Úteis](#-links-úteis)
- [📄 Licença](#-licença)

---

## 🛠️ Pré-requisitos

Antes de tudo, instale o **Git** na sua máquina e configure sua identidade global para o GitHub:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

Clone este repositório para sua máquina:
```bash
git clone https://github.com/JoaoLopes-DEV22/beesness.git
```

Entre na pasta:
```bash
cd beesness
```

Verifique se o repositório foi clonado corretamente:
```bash
git remote -v
```

Você verá algo como:
```bash
origin  https://github.com/JoaoLopes-DEV22/beesness.git (fetch)
origin  https://github.com/JoaoLopes-DEV22/beesness.git (push)
```

## 🛠️ Criando e Usando Branches
Branches permitem que você desenvolva novas funcionalidades de forma isolada da branch principal (main).

### Criar uma nova branch
```bash
git checkout -b nome-da-branch
```
📍 Após criar, você será automaticamente movido para ela. Confirme o nome da branch ativa no canto inferior esquerdo do VS Code.

## 🔄 Navegar entre branches
```bash
git checkout nome-da-branch
```

## 📝 Commitando e Monitorando Alterações
Ao editar arquivos, o Git os marca:

🟡 Amarelo → Modificado

🟢 Verde → Novo arquivo adicionado

Verifique as alterações no ícone de source control no VS Code (barra lateral esquerda).

## 🔄 Atualizando sua Branch com a Main
Para manter sua branch sincronizada com a main, estando na sua branch:
```bash
git merge main
```
⚠️ Resolva eventuais conflitos manualmente e faça um commit após o merge.

## 💡 Dicas Úteis
✅ Sempre atualize sua branch antes de criar um pull request

✍️ Use commits descritivos como: feat: adiciona tela de login, fix: corrige bug no carrinho