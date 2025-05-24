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