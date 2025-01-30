const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Mostra informações detalhadas do servidor'),

    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        const totalMembers = guild.memberCount;
        const totalBots = guild.members.cache.filter(member => member.user.bot).size;
        const totalChannels = guild.channels.cache.size;
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size;
        const totalRoles = guild.roles.cache.size;
        const createdAt = Math.floor(guild.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle(`📊 Informações do Servidor: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields([
                { 
                    name: '👑 Dono', 
                    value: owner.user.tag,
                    inline: false
                },
                { 
                    name: '📅 Criado em', 
                    value: `<t:${createdAt}:F>\n(<t:${createdAt}:R>)`,
                    inline: false
                },
                { 
                    name: '🌟 Boost Level', 
                    value: `${guild.premiumTier}`,
                    inline: false
                },
                { 
                    name: '👥 Membros', 
                    value: `Total: ${totalMembers}\nUsuários: ${totalMembers - totalBots}\nBots: ${totalBots}`,
                    inline: false
                },
                { 
                    name: '💬 Canais', 
                    value: `Total: ${totalChannels}\nTexto: ${textChannels}\nVoz: ${voiceChannels}\nCategorias: ${categoryChannels}`,
                    inline: false
                },
                { 
                    name: '🎭 Cargos', 
                    value: `${totalRoles}`,
                    inline: false
                }
            ])
            .setFooter({ 
                text: `ID: ${guild.id}`,
                iconURL: guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp();

        // Verifica se tem banner
        if (guild.bannerURL()) {
            embed.setImage(guild.bannerURL({ size: 1024 }));
        }

        await interaction.reply({ embeds: [embed] });
    }
}; 