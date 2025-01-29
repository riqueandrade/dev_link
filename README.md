# DevLink Discord Bot

Um bot simples para Discord usando Node.js.

## Link de Convite do Bot

Use este link para convidar o bot para seu servidor (substitua YOUR_CLIENT_ID pelo ID do seu bot):
```
https://discord.com/api/oauth2/authorize?client_id=1331027082691477575&permissions=8&scope=bot%20applications.commands
```

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env`:
- Copie as seguintes informações do [Discord Developer Portal](https://discord.com/developers/applications):
  - `DISCORD_TOKEN`: O token do seu bot
  - `CLIENT_ID`: O ID do seu aplicativo (Application ID)
  - `GUILD_ID`: O ID do servidor onde você vai testar o bot

Para obter essas informações:
1. Crie um aplicativo em https://discord.com/developers/applications
2. Na seção "Bot", crie um bot e copie o token
3. Na seção "General Information", copie o Application ID (Client ID)
4. Para obter o Guild ID, ative o modo desenvolvedor no Discord (Configurações > Avançado > Modo Desenvolvedor) e clique com botão direito no servidor para copiar o ID

## Como executar

Para iniciar o bot em modo desenvolvimento:
```bash
npm run dev
```

## Comandos disponíveis

- `/ping`: Responde com "Pong! 🏓" # dev_link
