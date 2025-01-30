const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de mensagens para apagar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction) {
        try {
            const amount = interaction.options.getInteger('quantidade');
            
            // Deleta as mensagens
            const deleted = await interaction.channel.bulkDelete(amount, true);

            // Envia confirmação
            const reply = await interaction.reply({
                content: `✅ ${deleted.size} mensagens foram apagadas!`,
                fetchReply: true
            });

            // Deleta a mensagem de confirmação após 3 segundos
            setTimeout(() => {
                reply.delete().catch(() => {});
            }, 3000);

        } catch (error) {
            console.error('[CLEAR] Erro:', error);

            let errorMessage = '❌ Não foi possível apagar as mensagens.';
            
            // Mensagens específicas para erros comuns
            if (error.code === 50034) {
                errorMessage = '❌ Não é possível apagar mensagens com mais de 14 dias.';
            }

            const errorReply = await interaction.reply({
                content: errorMessage,
                fetchReply: true
            });

            // Deleta a mensagem de erro após 3 segundos
            setTimeout(() => {
                errorReply.delete().catch(() => {});
            }, 3000);
        }
    }
}; 