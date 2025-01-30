require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Carrega os comandos
commandHandler(client);

// Carrega os eventos
eventHandler(client);

// Login do bot
client.login(process.env.DISCORD_TOKEN); 