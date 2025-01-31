require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');
const TikTokManager = require('./utils/tiktokManager');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildModeration
    ]
});

// Carrega os comandos
commandHandler(client);

// Carrega os eventos
eventHandler(client);

// Inicializa o gerenciador do TikTok
client.tiktokManager = new TikTokManager(client);

client.once('ready', () => {
    console.log(`✅ Bot está online como ${client.user.tag}`);
    client.tiktokManager.initialize();
});

// Tratamento de desconexão do TikTok
process.on('SIGINT', () => {
    console.log('Desconectando do TikTok...');
    client.tiktokManager.disconnect();
    process.exit();
});

// Login do bot
client.login(process.env.DISCORD_TOKEN); 