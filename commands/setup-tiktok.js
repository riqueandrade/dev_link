const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tiktok')
        .setDescription('Configura as notificações do TikTok')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal para enviar as notificações de live')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('usuario-tiktok')
                .setDescription('Seu nome de usuário do TikTok (sem @)')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('cargo-notificacao')
                .setDescription('Cargo que será mencionado nas notificações')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('canal');
            const tiktokUsername = interaction.options.getString('usuario-tiktok');
            const notificationRole = interaction.options.getRole('cargo-notificacao');

            const config = {
                channelId: channel.id,
                tiktokUsername: tiktokUsername,
                notificationRoleId: notificationRole?.id || null,
                guildId: interaction.guildId
            };

            // Criar diretório config se não existir
            const configDir = path.join(process.cwd(), 'config');
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir);
            }

            // Salvar configuração
            const configPath = path.join(configDir, 'tiktok-config.json');
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            // Tentar conectar ao TikTok
            try {
                await interaction.client.tiktokManager.connectToTikTok(config);
                await interaction.reply({
                    content: `✅ Configuração salva com sucesso!\n📢 Canal de notificações: ${channel}\n🎭 Usuário TikTok: @${tiktokUsername}${notificationRole ? `\n💫 Cargo de notificação: ${notificationRole}` : ''}`,
                    ephemeral: true
                });
            } catch (error) {
                await interaction.reply({
                    content: `❌ Erro ao conectar com o TikTok. Verifique se o nome de usuário está correto.\nCanal e outras configurações foram salvos.`,
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Erro ao configurar TikTok:', error);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao salvar as configurações.',
                ephemeral: true
            });
        }
    },
}; 