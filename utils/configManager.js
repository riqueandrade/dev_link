const fs = require('node:fs');
const path = require('node:path');

const CONFIG_PATH = path.join(process.cwd(), 'config', 'serverConfig.json');

// Carrega as configurações
function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            // Se o arquivo não existir, cria com configurações padrão
            const defaultConfig = { welcomeChannels: {} };
            saveConfig(defaultConfig);
            return defaultConfig;
        }
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        return config;
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        return { welcomeChannels: {} };
    }
}

// Salva as configurações
function saveConfig(config) {
    try {
        // Garante que o diretório config existe
        const configDir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
        return true;
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        return false;
    }
}

// Atualiza uma configuração específica
function updateConfig(guildId, channelId) {
    try {
        const config = loadConfig();
        if (!config.welcomeChannels) {
            config.welcomeChannels = {};
        }
        config.welcomeChannels[guildId] = channelId;
        return saveConfig(config);
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        return false;
    }
}

// Obtém uma configuração específica
function getConfig(guildId) {
    const config = loadConfig();
    return config.welcomeChannels?.[guildId] || null;
}

module.exports = {
    loadConfig,
    saveConfig,
    updateConfig,
    getConfig
}; 