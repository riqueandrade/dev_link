const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Função para carregar a configuração
function loadConfig() {
    const configPath = path.join(process.cwd(), 'config', 'serverConfig.json');
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
        return { logChannels: {} };
    }
}

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog, guild) {
        try {
            // Carrega a configuração
            const config = loadConfig();
            const logChannelId = config.logChannels?.[guild.id];
            if (!logChannelId) return;

            const logChannel = await guild.channels.fetch(logChannelId);
            if (!logChannel) return;

            // Cria o embed base
            const embed = new EmbedBuilder()
                .setColor('#2ecc71')
                .setTimestamp()
                .setFooter({ 
                    text: `ID da Ação: ${auditLog.id}`,
                    iconURL: guild.iconURL({ dynamic: true })
                });

            // Personaliza o embed baseado no tipo de ação
            switch (auditLog.action) {
                case AuditLogEvent.MemberKick:
                    embed.setTitle('👢 Usuário Expulso')
                        .setDescription(`**Usuário:** <@${auditLog.targetId}>\n**Motivo:** ${auditLog.reason || 'Nenhum motivo fornecido'}\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.MemberBan:
                    embed.setTitle('🔨 Usuário Banido')
                        .setDescription(`**Usuário:** <@${auditLog.targetId}>\n**Motivo:** ${auditLog.reason || 'Nenhum motivo fornecido'}\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.MemberUnban:
                    embed.setTitle('🔓 Usuário Desbanido')
                        .setDescription(`**Usuário:** <@${auditLog.targetId}>\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.MemberUpdate:
                    embed.setTitle('👤 Membro Atualizado')
                        .setDescription(`**Usuário:** <@${auditLog.targetId}>\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.ChannelCreate:
                    embed.setTitle('📝 Canal Criado')
                        .setDescription(`**Canal:** <#${auditLog.targetId}>\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.ChannelDelete:
                    embed.setTitle('🗑️ Canal Deletado')
                        .setDescription(`**Canal:** ${auditLog.changes[0]?.old}\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.RoleCreate:
                    embed.setTitle('✨ Cargo Criado')
                        .setDescription(`**Cargo:** <@&${auditLog.targetId}>\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                case AuditLogEvent.RoleDelete:
                    embed.setTitle('💨 Cargo Deletado')
                        .setDescription(`**Cargo:** ${auditLog.changes[0]?.old}\n**Responsável:** <@${auditLog.executorId}>`);
                    break;

                default:
                    return; // Ignora outros tipos de eventos
            }

            // Envia o log
            await logChannel.send({ embeds: [embed] });

        } catch (error) {
            console.error('[LOGS] Erro ao processar log:', error);
        }
    }
}; 