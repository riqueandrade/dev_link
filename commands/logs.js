const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Função para carregar a configuração
function loadConfig() {
    const configPath = path.join(process.cwd(), 'config', 'serverConfig.json');
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
        console.error('[LOGS] Erro ao carregar configuração:', error);
        return { logChannels: {} };
    }
}

// Função para salvar a configuração
function saveConfig(config) {
    const configPath = path.join(process.cwd(), 'config', 'serverConfig.json');
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        return true;
    } catch (error) {
        console.error('[LOGS] Erro ao salvar configuração:', error);
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Configura o canal de logs do servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal onde os logs serão enviados')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('canal');
            const guildId = interaction.guild.id;

            // Carrega a configuração atual
            const config = loadConfig();
            if (!config.logChannels) {
                config.logChannels = {};
            }

            // Salva a configuração
            config.logChannels[guildId] = channel.id;
            const saved = saveConfig(config);

            if (saved) {
                await interaction.reply({
                    content: `✅ Canal de logs configurado com sucesso em ${channel}!`,
                    ephemeral: true
                });
            } else {
                throw new Error('Falha ao salvar configuração');
            }

        } catch (error) {
            console.error('[LOGS] Erro:', error);
            await interaction.reply({
                content: '❌ Erro ao configurar o canal de logs. Verifique as permissões e tente novamente.',
                ephemeral: true
            });
        }
    }
}; 