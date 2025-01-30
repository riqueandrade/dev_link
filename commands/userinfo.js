const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Mostra informações detalhadas de um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário para ver as informações')
                .setRequired(false)),

    async execute(interaction) {
        // Pega o usuário mencionado ou o autor do comando
        const targetUser = interaction.options.getUser('usuário') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);
        
        // Calcula datas
        const createdAt = Math.floor(targetUser.createdTimestamp / 1000);
        const joinedAt = Math.floor(member.joinedTimestamp / 1000);

        // Verifica permissões do usuário
        const permissions = member.permissions.toArray();
        const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);
        const isModerator = member.permissions.has(PermissionsBitField.Flags.ModerateMembers);
        const isMuted = member.isCommunicationDisabled();
        
        // Lista os 10 primeiros cargos
        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(role => role)
            .slice(0, 10);

        // Status personalizado
        const activities = member.presence?.activities || [];
        const customStatus = activities.find(activity => activity.type === 4)?.state || 'Nenhum';

        const embed = new EmbedBuilder()
            .setColor(member.displayHexColor || '#2ecc71')
            .setTitle(`👤 Informações de ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { 
                    name: '📅 Conta Criada', 
                    value: `<t:${createdAt}:F>\n(<t:${createdAt}:R>)`, 
                    inline: true 
                },
                { 
                    name: '📥 Entrou no Servidor', 
                    value: `<t:${joinedAt}:F>\n(<t:${joinedAt}:R>)`, 
                    inline: true 
                },
                { 
                    name: '🎭 Status', 
                    value: customStatus, 
                    inline: true 
                },
                { 
                    name: '🛡️ Moderação', 
                    value: `Admin: ${isAdmin ? '✅' : '❌'}\nModerador: ${isModerator ? '✅' : '❌'}\nSilenciado: ${isMuted ? '✅' : '❌'}`, 
                    inline: true 
                },
                { 
                    name: `📝 Cargos [${roles.length}]`, 
                    value: roles.length ? roles.join(', ') : 'Nenhum cargo', 
                    inline: false 
                }
            )
            .setFooter({ 
                text: `ID: ${targetUser.id}`, 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp();

        // Se o usuário tiver banner, adiciona
        if (targetUser.banner) {
            const bannerURL = targetUser.bannerURL({ size: 1024 });
            if (bannerURL) embed.setImage(bannerURL);
        }

        await interaction.reply({ embeds: [embed] });
    }
}; 