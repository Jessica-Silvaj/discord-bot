# Discord Bot – Projeto-Fac-GtaRp

Bot simples que captura mensagens dos canais de Discord (baú de entrada/saída) e envia para o endpoint `/api/webhook/discord/solicitacoes` do sistema Laravel.

## Pré-requisitos

- Node.js 18+ e npm
- Token do bot criado no [Discord Developer Portal](https://discord.com/developers/applications/)
- IDs dos canais de entrada/saída (habilite o *Developer Mode* no Discord e use “Copy ID”)
- Mesma chave usada no Laravel (`DISCORD_WEBHOOK_TOKEN`)

## Instalação

```bash
cd discord-bot
npm install
```

Copie o arquivo `.env.example` para `.env` e preencha:

```
DISCORD_BOT_TOKEN=seu_token_do_bot
DISCORD_API_URL=https://seu-dominio/api/webhook/discord/solicitacoes
DISCORD_WEBHOOK_TOKEN=mesma_chave_do_Laravel
CANAL_ENTRADA_ID=123456789012345678
CANAL_SAIDA_ID=123456789012345678
```

## Execução

```bash
npm start
```

O processo precisa permanecer rodando (use PM2/Supervisor em produção). Cada mensagem nos canais configurados gera uma solicitação pendente no painel do sistema. Ao aprovar ou rejeitar, o Laravel enviará o feedback usando os webhooks `DISCORD_WEBHOOK_ENTRADAS` e `DISCORD_WEBHOOK_SAIDAS`.
# discord-bot
