const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
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
        .addRoleOption(option =>
            option.setName('cargo-notificacao')
                .setDescription('Cargo que será mencionado nas notificações')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('canal');
            const notificationRole = interaction.options.getRole('cargo-notificacao');

            // Salvar configurações iniciais
            const config = {
                channelId: channel.id,
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

            // Criar embed com link de autenticação
            const authUrl = interaction.client.tiktokAuth.getAuthUrl();
            const embed = new EmbedBuilder()
                .setColor('#FF0050')
                .setTitle('🔗 Autenticação TikTok')
                .setDescription('Para completar a configuração, você precisa autenticar sua conta do TikTok.')
                .addFields(
                    { name: '📱 Como fazer:', value: '1. Clique no link abaixo\n2. Faça login na sua conta TikTok\n3. Autorize o aplicativo\n4. Pronto! Você receberá uma confirmação aqui quando terminar.' },
                    { name: '🔐 Link de Autenticação', value: authUrl }
                )
                .setFooter({ text: 'Esta configuração é necessária apenas uma vez' });

            await interaction.reply({
                content: `✅ Canal de notificações configurado: ${channel}${notificationRole ? `\n💫 Cargo de notificação: ${notificationRole}` : ''}`,
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao configurar TikTok:', error);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao salvar as configurações.',
                ephemeral: true
            });
        }
    },
}; 