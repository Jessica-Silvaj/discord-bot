// Função para enviar mensagem via webhook do Discord
let primeiraMensagemWebhook = true;
async function enviarMensagemWebhook(mensagem) {
    if (!DISCORD_WEBHOOK_SAIDAS) {
        console.error('❌ DISCORD_WEBHOOK_SAIDAS não configurado.');
        return;
    }
    try {
        await axios.post(DISCORD_WEBHOOK_SAIDAS, {
            content: mensagem
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('✅ Mensagem enviada via webhook!');
        if (!primeiraMensagemWebhook) {
            console.log('ℹ️ Mensagem extra: esta não é a primeira vez que envio via webhook.');
        }
        primeiraMensagemWebhook = false;
    } catch (error) {
        console.error('❌ Erro ao enviar via webhook:', error.response?.data ?? error.message);
    }
}
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
const envExists = fs.existsSync(envPath);

dotenv.config(envExists ? { path: envPath } : undefined);

const {
    DISCORD_BOT_TOKEN,
    DISCORD_API_URL,
    DISCORD_WEBHOOK_TOKEN,
    CANAL_ENTRADA_ID,
    CANAL_SAIDA_ID,
    CANAL_MENSAGEM_APROVADA,
    CANAL_MENSAGEM_REPROVADA,
    CANAL_VENDAS_ID,
    DISCORD_WEBHOOK_SAIDAS,
} = process.env;

if (!DISCORD_BOT_TOKEN) {
    console.error('❌ Defina DISCORD_BOT_TOKEN no arquivo discord-bot/.env');
    process.exit(1);
}

if (!DISCORD_API_URL) {
    console.error('❌ Defina DISCORD_API_URL no arquivo discord-bot/.env');
    process.exit(1);
}

if (!DISCORD_WEBHOOK_TOKEN) {
    console.error('❌ Defina DISCORD_WEBHOOK_TOKEN no arquivo discord-bot/.env (mesmo valor do Laravel).');
    process.exit(1);
}

const canaisMonitorados = new Set(
    [CANAL_ENTRADA_ID, CANAL_SAIDA_ID, CANAL_MENSAGEM_APROVADA, CANAL_MENSAGEM_REPROVADA, CANAL_VENDAS_ID, DISCORD_WEBHOOK_SAIDAS].filter((id) => typeof id === 'string' && id.trim() !== '')
);

if (!canaisMonitorados.size) {
    console.warn('⚠️ Nenhum canal monitorado configurado (CANAL_ENTRADA_ID/CANAL_SAIDA_ID). Todas as mensagens serão ignoradas.');
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('clientReady', () => {
    console.log(`🤖 Bot conectado como ${client.user.tag}`);
    if (canaisMonitorados.size) {
        console.log(`👀 Monitorando ${canaisMonitorados.size} canal(is): ${Array.from(canaisMonitorados).join(', ')}`);
    }
    // Envia mensagem de teste via webhook ao iniciar o bot
    enviarMensagemWebhook('🚀 Bot iniciado e webhook funcionando!');
});

client.on('messageCreate', async (message) => {
    try {
        if (message.author?.bot) return;
        if (canaisMonitorados.size && !canaisMonitorados.has(message.channelId)) return;

        // ...código original...

        // Exemplo de uso: envia mensagem via webhook se o conteúdo for 'webhook'
        if (message.content === 'webhook') {
            await enviarMensagemWebhook('Mensagem enviada pelo webhook do bot em produção!');
        }
    } catch (error) {
        const data = error.response?.data;
        console.error('❌ Erro ao enviar solicitação:', data ?? error.message);
    }
});

client.login(DISCORD_BOT_TOKEN).catch((err) => {
    console.error('❌ Não foi possível autenticar o bot:', err.message);
    process.exit(1);
});
