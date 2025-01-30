const { Events, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Obtém o ID do canal de boas-vindas das configurações
            const welcomeChannelId = getConfig('welcomeChannel');
            
            if (!welcomeChannelId) {
                console.log('Canal de boas-vindas não configurado!');
                return;
            }

            // Procura o canal pelo ID
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

            if (!welcomeChannel) {
                console.log('Canal de boas-vindas não encontrado!');
                return;
            }

            // Cria uma embed de boas-vindas
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#2ecc71')
                .setTitle('🎉 Bem-vindo(a)!')
                .setDescription(`Olá ${member}! Seja bem-vindo(a) ao ${member.guild.name}!`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '📜 Regras', value: 'Não se esqueça de ler nossas regras!' },
                    { name: '🎮 Games', value: 'Participe das nossas comunidades de jogos!' },
                    { name: '🎥 Lives', value: 'Acompanhe as lives da comunidade!' }
                )
                .setFooter({ 
                    text: `ID do usuário: ${member.id}`,
                    iconURL: member.guild.iconURL({ dynamic: true })
                })
                .setTimestamp();

            // Envia a mensagem de boas-vindas
            await welcomeChannel.send({ 
                content: `${member} acabou de entrar no servidor! 🎉`,
                embeds: [welcomeEmbed] 
            });

        } catch (error) {
            console.error('Erro ao enviar mensagem de boas-vindas:', error);
        }
    },
}; 