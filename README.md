# Férias com IA

MVP para criar roteiros completos de viagem com uma central de IA preparada para OpenAI, Gemini, Claude ou modo demo.

## O que já existe

- Frontend em Next.js com formulário de geração de roteiro.
- Endpoint `/api/roteiros` no próprio Next.js.
- Backend Express opcional em `backend/src/server.ts`.
- Central de IA em `lib/ai` com adaptadores.
- Schema PostgreSQL com Prisma em `prisma/schema.prisma`.
- Estrutura para viagens, roteiros gerados, usuários e parceiros locais.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Rodar a API Express opcional

```bash
npm run dev:api
```

A API sobe em: http://localhost:3333

## Configurar ambiente

Copie `.env.example` para `.env` e ajuste o que precisar:

```bash
cp .env.example .env
```

Por padrão, `AI_PROVIDER="demo"` funciona sem chave externa.

Para usar IA real, configure uma das opções:

- `AI_PROVIDER="openai"` com `OPENAI_API_KEY`
- `AI_PROVIDER="gemini"` com `GEMINI_API_KEY`
- `AI_PROVIDER="claude"` com `ANTHROPIC_API_KEY`

Para busca web real, configure:

- `SEARCH_PROVIDER="serper"`
- `SERPER_API_KEY`

Sem essa chave, o app usa busca demo e mantém a arquitetura de agentes funcionando.

## Banco de dados

Com PostgreSQL configurado no `DATABASE_URL`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Próximos módulos

- Login com email/senha ou social.
- Persistir roteiro gerado no banco.
- Cadastro de parceiros locais.
- Exportação em PDF.
- Painel administrativo.
- Envio do roteiro por WhatsApp.
