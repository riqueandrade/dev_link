const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, InteractionResponseFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configura os canais do servidor com uma estrutura para jogos e lives')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('confirmar')
                .setDescription('Digite "confirmar" para prosseguir com a configuração')
                .setRequired(true)),

    async execute(interaction) {
        const confirmacao = interaction.options.getString('confirmar').toLowerCase();
        if (confirmacao !== 'confirmar') {
            return await interaction.reply({
                content: 'Você precisa digitar "confirmar" para prosseguir com esta ação.',
                ephemeral: true
            });
        }

        await interaction.reply({
            content: 'Iniciando configuração dos canais...',
            ephemeral: true
        });

        try {
            const guild = interaction.guild;

            // Estrutura de categorias e canais
            const estrutura = [
                {
                    nome: '👑 ADMINISTRAÇÃO',
                    tipo: 'categoria',
                    canais: [
                        { nome: '⚡┃admin-chat', tipo: ChannelType.GuildText },
                        { nome: '📊┃logs', tipo: ChannelType.GuildText },
                        { nome: '🛠️┃configs', tipo: ChannelType.GuildText },
                        { nome: '🎫┃tickets', tipo: ChannelType.GuildText },
                        { nome: '👑┃Admin Call', tipo: ChannelType.GuildVoice },
                        { nome: '🔧┃Staff Call', tipo: ChannelType.GuildVoice }
                    ]
                },
                {
                    nome: '👋 BOAS-VINDAS',
                    tipo: 'categoria',
                    canais: [
                        { nome: '👋┃bem-vindo', tipo: ChannelType.GuildText },
                        { nome: '📜┃verificação', tipo: ChannelType.GuildText }
                    ]
                },
                {
                    nome: '📌 INFORMAÇÕES',
                    tipo: 'categoria',
                    canais: [
                        { nome: '📢┃anúncios', tipo: ChannelType.GuildText },
                        { nome: '📋┃regras', tipo: ChannelType.GuildText },
                        { nome: '🎮┃programação-lives', tipo: ChannelType.GuildText },
                        { nome: '🎯┃ranks-e-níveis', tipo: ChannelType.GuildText },
                        { nome: '📝┃sugestões', tipo: ChannelType.GuildText }
                    ]
                },
                {
                    nome: '🎮 GAMES',
                    tipo: 'categoria',
                    canais: [
                        { nome: '🎮┃chat-games', tipo: ChannelType.GuildText },
                        { nome: '🎲┃procurando-squad', tipo: ChannelType.GuildText },
                        { nome: '🏆┃highlights', tipo: ChannelType.GuildText },
                        { nome: '📊┃stats-games', tipo: ChannelType.GuildText }
                    ]
                },
                {
                    nome: '🎥 LIVES',
                    tipo: 'categoria',
                    canais: [
                        { nome: '📺┃lives-chat', tipo: ChannelType.GuildText },
                        { nome: '🎬┃clipes', tipo: ChannelType.GuildText },
                        { nome: '💬┃chat-geral', tipo: ChannelType.GuildText },
                        { nome: '🎵┃comandos-música', tipo: ChannelType.GuildText }
                    ]
                },
                {
                    nome: '🤖 COMANDOS',
                    tipo: 'categoria',
                    canais: [
                        { nome: '🤖┃comandos-bot', tipo: ChannelType.GuildText },
                        { nome: '🎯┃level-up', tipo: ChannelType.GuildText },
                        { nome: '🎮┃games-bot', tipo: ChannelType.GuildText }
                    ]
                },
                {
                    nome: '🔊 CANAIS DE VOZ',
                    tipo: 'categoria',
                    canais: [
                        { nome: '🎮┃Squad 1', tipo: ChannelType.GuildVoice, userLimit: 5 },
                        { nome: '🎮┃Squad 2', tipo: ChannelType.GuildVoice, userLimit: 5 },
                        { nome: '🎮┃Squad 3', tipo: ChannelType.GuildVoice, userLimit: 5 },
                        { nome: '🔥┃Competitivo', tipo: ChannelType.GuildVoice, userLimit: 5 },
                        { nome: '🎵┃Música', tipo: ChannelType.GuildVoice },
                        { nome: '💬┃Hangout', tipo: ChannelType.GuildVoice }
                    ]
                },
                {
                    nome: '🎥 LIVES E STREAMING',
                    tipo: 'categoria',
                    canais: [
                        { nome: '🎥┃Live Principal', tipo: ChannelType.GuildVoice },
                        { nome: '🎬┃Stream Team 1', tipo: ChannelType.GuildVoice },
                        { nome: '🎬┃Stream Team 2', tipo: ChannelType.GuildVoice },
                        { nome: '🎙️┃Comentaristas', tipo: ChannelType.GuildVoice }
                    ]
                }
            ];

            // Tenta deletar os canais que podem ser deletados
            const canais = await guild.channels.fetch();
            let canaisExcluidos = 0;
            let canaisProtegidos = 0;

            for (const canal of canais.values()) {
                try {
                    await canal.delete();
                    canaisExcluidos++;
                } catch (error) {
                    if (error.code === 50074) {
                        canaisProtegidos++;
                        continue;
                    }
                    console.error(`Erro ao deletar canal ${canal.name}:`, error);
                }
            }

            // Cria as categorias e seus canais
            let categoriasCriadas = 0;
            let canaisCriados = 0;

            for (const categoria of estrutura) {
                try {
                    // Cria a categoria
                    const novaCat = await guild.channels.create({
                        name: categoria.nome,
                        type: ChannelType.GuildCategory
                    });
                    categoriasCriadas++;

                    // Cria os canais dentro da categoria
                    for (const canal of categoria.canais) {
                        await guild.channels.create({
                            name: canal.nome,
                            type: canal.tipo,
                            parent: novaCat.id,
                            userLimit: canal.userLimit || null,
                            topic: canal.nome.includes('regras') ? '📋 Leia as regras com atenção!' :
                                  canal.nome.includes('anúncios') ? '📢 Fique por dentro das novidades!' :
                                  canal.nome.includes('programação-lives') ? '🎮 Confira os horários das próximas lives!' :
                                  canal.nome.includes('procurando-squad') ? '🎲 Encontre jogadores para seu time!' : undefined
                        });
                        canaisCriados++;
                    }
                } catch (error) {
                    console.error(`Erro ao criar categoria ${categoria.nome}:`, error);
                }
            }

            await interaction.editReply({
                content: `Configuração concluída com sucesso!\n\n` +
                    `📊 Relatório:\n` +
                    `➜ Canais excluídos: ${canaisExcluidos}\n` +
                    `➜ Canais protegidos: ${canaisProtegidos}\n` +
                    `➜ Categorias criadas: ${categoriasCriadas}\n` +
                    `➜ Novos canais criados: ${canaisCriados}\n\n` +
                    `✅ Servidor configurado com sucesso!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro durante a configuração:', error);
            await interaction.editReply({
                content: 'Ocorreu um erro durante a configuração dos canais.',
                ephemeral: true
            });
        }
    },
}; 