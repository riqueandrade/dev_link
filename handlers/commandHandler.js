const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    client.commands = new Map();
    const commandsPath = path.join(process.cwd(), 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[AVISO] O comando em ${filePath} está faltando uma propriedade "data" ou "execute" obrigatória.`);
        }
    }
}; 