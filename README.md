# 🎮 DevLink Discord Bot

> Bot Discord avançado para gerenciamento de comunidades de jogos e lives.

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Estrutura](#-estrutura)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Comandos](#-comandos)
- [Desenvolvimento](#-desenvolvimento)
- [Licença](#-licença)

## 📖 Sobre

O DevLink é um bot Discord desenvolvido para gerenciar comunidades focadas em jogos e streaming. Ele oferece uma estrutura completa de canais, sistemas de administração e ferramentas para gerenciamento de lives.

## 🚀 Funcionalidades

### Gerenciamento de Canais
- Sistema completo de criação e organização de canais
- Estrutura otimizada para comunidades gaming
- Categorias separadas para diferentes atividades

### Sistema Administrativo
- Canais específicos para administração
- Sistema de logs e configurações
- Controle de permissões avançado

### Suporte a Lives
- Canais dedicados para streaming
- Sistema de anúncios de lives
- Integração com eventos

## 🏗 Estrutura

### Categorias
- 👋 **BOAS-VINDAS**
  - Canal de boas-vindas
  - Sistema de verificação

- 📌 **INFORMAÇÕES**
  - Anúncios
  - Regras
  - Programação de lives

- 👑 **ADMINISTRAÇÃO**
  - Chat administrativo
  - Logs do servidor
  - Configurações

- 🎮 **GAMES**
  - Chat de jogos
  - Procura de squad
  - Highlights

- 🎥 **LIVES**
  - Chat de lives
  - Clipes
  - Comandos de música

## 📋 Requisitos

- Node.js 16.x ou superior
- NPM
- Conta Discord Developer
- Servidor Discord com permissões de administrador

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/devlink-bot.git
cd devlink-bot
```

2. Instale as dependências
```bash
npm install
```

## ⚙️ Configuração

1. Crie um arquivo `.env` na raiz do projeto:
```env
# Token do seu bot (obrigatório)
DISCORD_TOKEN=seu_token_aqui

# ID do aplicativo (obrigatório)
CLIENT_ID=seu_client_id_aqui

# ID do servidor (desenvolvimento)
GUILD_ID=id_do_servidor_aqui
```

2. Obtenha as credenciais necessárias:
- Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
- Crie uma nova aplicação
- Na seção "Bot", crie um bot e copie o token
- Copie o "Application ID" da seção geral

## 🎮 Comandos

### Administração
- `/setup` - Configura os canais do servidor
  - Requer permissões de administrador
  - Confirmação necessária

### Utilitários
- `/ping` - Verifica a latência do bot

## 👨‍💻 Desenvolvimento

Para iniciar o bot em modo desenvolvimento:
```bash
npm run dev
```

O modo desenvolvimento inclui:
- Reinício automático ao modificar arquivos
- Registro instantâneo de comandos
- Logs detalhados

## 📝 Licença

Este projeto está sob a licença MIT com restrições - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com 💜 por DevLink
