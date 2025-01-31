const { WebcastPushConnection } = require('tiktok-live-client');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

class TikTokManager {
    constructor(client) {
        this.client = client;
        this.connections = new Map();
        this.isLive = new Map();
        this.configPath = path.join(process.cwd(), 'config', 'tiktok-config.json');
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
            return null;
        } catch (error) {
            console.error('Erro ao carregar configuração do TikTok:', error);
            return null;
        }
    }

    async initialize() {
        const config = this.loadConfig();
        if (!config) return;

        await this.connectToTikTok(config);
    }

    async connectToTikTok(config) {
        try {
            const tiktokConnection = new WebcastPushConnection(config.tiktokUsername);

            // Eventos da live
            tiktokConnection.on('streamStart', () => {
                console.log(`${config.tiktokUsername} iniciou uma live!`);
                this.isLive.set(config.tiktokUsername, true);
                this.sendLiveNotification(config);
            });

            tiktokConnection.on('streamEnd', () => {
                console.log(`${config.tiktokUsername} encerrou a live!`);
                this.isLive.set(config.tiktokUsername, false);
            });

            // Conectar ao TikTok
            await tiktokConnection.connect();
            this.connections.set(config.tiktokUsername, tiktokConnection);
            console.log(`✅ Conectado ao TikTok: ${config.tiktokUsername}`);

        } catch (error) {
            console.error(`Erro ao conectar ao TikTok (${config.tiktokUsername}):`, error);
        }
    }

    async sendLiveNotification(config) {
        try {
            const channel = await this.client.channels.fetch(config.channelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor('#FF0050')
                .setTitle('🔴 Live no TikTok!')
                .setDescription(`${config.tiktokUsername} está ao vivo agora!`)
                .addFields(
                    { name: '📱 Link da Live', value: `https://tiktok.com/@${config.tiktokUsername}/live` }
                )
                .setTimestamp();

            const mentionText = config.notificationRoleId ? `<@&${config.notificationRoleId}>` : '';

            await channel.send({
                content: mentionText,
                embeds: [embed]
            });

        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    }

    disconnect() {
        for (const [username, connection] of this.connections) {
            connection.disconnect();
            console.log(`Desconectado do TikTok: ${username}`);
        }
        this.connections.clear();
        this.isLive.clear();
    }
}

module.exports = TikTokManager; 