const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testwelcome')
        .setDescription('Testa a mensagem de boas-vindas')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Simula o evento guildMemberAdd
            const guildMemberAdd = require('../events/guildMemberAdd');
            await guildMemberAdd.execute(interaction.member);

            await interaction.reply({
                content: '✅ Mensagem de boas-vindas enviada com sucesso!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Erro ao testar mensagem de boas-vindas:', error);
            await interaction.reply({
                content: '❌ Erro ao testar a mensagem de boas-vindas.',
                ephemeral: true
            });
        }
    },
}; 