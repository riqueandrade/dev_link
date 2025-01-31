const express = require('express');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

class TikTokAuth {
    constructor(client) {
        this.client = client;
        this.app = express();
        this.setupServer();
    }

    setupServer() {
        // Servidor para receber o callback do OAuth
        this.app.get('/auth/callback', async (req, res) => {
            const { code } = req.query;
            if (code) {
                try {
                    const token = await this.getAccessToken(code);
                    await this.saveToken(token);
                    res.send('Autenticação concluída! Você pode fechar esta janela.');
                } catch (error) {
                    console.error('Erro na autenticação:', error);
                    res.status(500).send('Erro na autenticação');
                }
            }
        });

        // Inicia o servidor na porta 3000
        this.app.listen(3000, () => {
            console.log('Servidor de autenticação rodando na porta 3000');
        });
    }

    async getAccessToken(code) {
        try {
            const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
                client_key: process.env.TIKTOK_CLIENT_KEY,
                client_secret: process.env.TIKTOK_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.TIKTOK_REDIRECT_URI
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter token:', error);
            throw error;
        }
    }

    async saveToken(token) {
        // Aqui você pode salvar o token no seu arquivo de configuração
        // ou em um banco de dados
    }

    getAuthUrl() {
        const csrfState = Math.random().toString(36).substring(7);
        const scope = 'user.info.basic,video.list,video.upload';
        
        return `https://www.tiktok.com/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=${scope}&response_type=code&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&state=${csrfState}`;
    }

    async getUserInfo(accessToken) {
        try {
            const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter informações do usuário:', error);
            throw error;
        }
    }

    async checkLiveStatus(accessToken) {
        try {
            const response = await axios.get('https://open.tiktokapis.com/v2/video/list/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    fields: ['id', 'title', 'create_time', 'share_url']
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status da live:', error);
            throw error;
        }
    }
}

module.exports = TikTokAuth; 