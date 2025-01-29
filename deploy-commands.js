require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[AVISO] O comando em ${filePath} está faltando a propriedade "data" obrigatória.`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Função para registrar comandos
async function deployCommands() {
    try {
        console.log('Começando o registro dos comandos...');

        let data;
        
        if (process.env.GUILD_ID) {
            // Registro para um servidor específico (desenvolvimento) - INSTANTÂNEO
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(`Comandos registrados com sucesso no servidor ${process.env.GUILD_ID}`);
        } else {
            // Registro global (produção) - PODE DEMORAR ATÉ 1 HORA
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('Comandos globais registrados com sucesso');
        }

        console.log(`Registrados ${data.length} comandos`);
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
}

deployCommands(); 