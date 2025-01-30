const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateConfig } = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Define o canal de boas-vindas')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('O canal onde as mensagens de boas-vindas serão enviadas')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        try {
            // Adia a resposta inicial
            await interaction.deferReply({ ephemeral: false });

            // Obtém o canal selecionado e o ID do servidor
            const channel = interaction.options.getChannel('canal');
            const guildId = interaction.guild.id;

            // Tenta salvar a configuração
            const saved = updateConfig(guildId, channel.id);
            if (!saved) {
                throw new Error('Falha ao salvar configuração');
            }

            // Envia a resposta
            await interaction.editReply(`✅ Canal de boas-vindas definido como ${channel}!\n\n📝 Agora todas as mensagens de boas-vindas serão enviadas em ${channel}\n\n🔍 Use \`/testwelcome\` para ver como ficou!`);

            // Envia a mensagem no canal
            await channel.send({
                content: '✅ Canal de boas-vindas configurado com sucesso! As mensagens serão enviadas aqui.'
            });

            // Aguarda 3 segundos e deleta a mensagem
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 3000);

        } catch (error) {
            console.error('Erro no comando setwelcome:', error);
            
            if (interaction.deferred) {
                await interaction.editReply('❌ Erro ao configurar o canal de boas-vindas. Por favor, verifique as permissões e tente novamente.');
            } else {
                await interaction.reply('❌ Erro ao configurar o canal de boas-vindas. Por favor, verifique as permissões e tente novamente.');
            }

            // Aguarda 3 segundos e deleta a mensagem de erro
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 3000);
        }
    }
}; 