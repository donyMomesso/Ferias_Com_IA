# Férias com IA

MVP para criar roteiros completos de viagem com uma central de IA preparada para OpenAI, Gemini, Claude ou modo demo.

## O que já existe

- Frontend em Next.js com formulário de geração de roteiro.
- Endpoint `/api/roteiros` no próprio Next.js.
- Backend Express opcional em `backend/src/server.ts`.
- Central de IA em `lib/ai` com adaptadores.
- Armazenamento local no aparelho com IndexedDB/Dexie.
- Schema PostgreSQL opcional com Prisma em `prisma/schema.prisma`.
- Estrutura para viagens, roteiros gerados, usuários e parceiros locais.
- Botões para salvar neste aparelho, compartilhar, exportar JSON e gerar PDF pelo navegador.
- Área de parceiros locais para prospectar, copiar mensagem de parceria e acompanhar status no aparelho.
- Computador de bordo local para registrar gastos, lugares visitados e comparar orçamento previsto com gasto real.
- Checklist inteligente de bagagem, com lista extra automática para pescaria quando esse for o objetivo da viagem.

## Armazenamento local-first

O fluxo principal não depende de banco central. Cada pessoa salva os próprios roteiros no navegador do aparelho que estiver usando.

Isso ajuda a manter privacidade, reduzir custo de servidor e facilitar o uso com amigos e familiares. Para compartilhar, use:

- Compartilhar pelo celular/navegador;
- Exportar arquivo JSON;
- Gerar PDF pelo navegador;
- Enviar por WhatsApp, email ou outro app.

Se a pessoa trocar de aparelho, ela precisa exportar/importar ou compartilhar o roteiro. Sincronização automática entre aparelhos exigiria uma conta e um banco online.

## Backup no Supabase

O projeto já está preparado para usar o Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL="https://oeogonqwuqugsbulrpty.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

Para ativar:

1. No Supabase, abra o SQL Editor.
2. Rode o arquivo `supabase/schema.sql`.
3. Copie a chave pública `anon`.
4. Cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env`.
5. Reinicie o app.

Depois disso, o botão **Backup no Supabase** envia roteiros, parceiros, gastos e lugares visitados para o banco do app.

Não coloque `service_role` no frontend. Use apenas a chave pública `anon` no `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Computador de bordo

Durante a viagem, a pessoa pode registrar:

- gastos por categoria;
- lugares, passeios e restaurantes visitados;
- nota e observações de cada lugar;
- orçamento previsto;
- saldo restante;
- projeção final com base no gasto médio.

Esses dados também ficam no aparelho e ajudam o app a melhorar a previsão do custo real da viagem.

## Checklist inteligente

O app sempre mostra uma checklist de bagagem essencial. Quando o objetivo ou destino indicar pesca/pescaria, ele adiciona automaticamente uma checklist de pescaria com equipamentos, segurança e itens de apoio.

Os itens marcados ficam salvos no navegador do aparelho.

## Comunidade

O módulo Comunidade adiciona uma experiência inspirada no Meetup:

- `/comunidade`
- `/comunidade/grupos`
- `/comunidade/grupos/criar`
- `/comunidade/grupos/[id]`
- `/comunidade/eventos/[id]`

APIs adicionadas:

- `GET/POST /api/grupos`
- `GET/PATCH/DELETE /api/grupos/[id]`
- `POST/DELETE /api/grupos/[id]/entrar`
- `GET/POST /api/eventos`
- `GET/PATCH/DELETE /api/eventos/[id]`
- `GET/POST /api/eventos/[id]/rsvp`
- `POST /api/comunidade/sugestoes`

Para persistir grupos e eventos, rode a migração Prisma depois de configurar o banco:

```bash
npm run prisma:migrate
```

As páginas já têm dados demo para navegação visual enquanto o banco não estiver populado.

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

Para fotos reais de destinos e parceiros, configure:

- `UNSPLASH_ACCESS_KEY`

Sem essa chave, o app usa imagens demo para manter a experiência visual durante o desenvolvimento.

## Banco de dados opcional

Com PostgreSQL configurado no `DATABASE_URL`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Use isso apenas quando quiser uma versão com conta, sincronização, painel administrativo ou base central de fornecedores.

## Parceiros locais

O app pode buscar candidatos de turismo por destino e categoria, gerar uma mensagem de parceria e salvar o acompanhamento localmente.
Cada candidato pode vir com foto, origem e pontuação inicial para facilitar a validação visual.

Status sugeridos:

- `prospectado`
- `contatado`
- `aprovado`
- `parceiro`
- `rejeitado`

Antes de recomendar um parceiro no roteiro, valide reputação, preço, disponibilidade, fotos reais, política de cancelamento e segurança.

## Próximos módulos

- Login com email/senha ou social.
- Persistir roteiro gerado no banco.
- Cadastro de parceiros locais.
- Exportação em PDF.
- Painel administrativo.
- Envio do roteiro por WhatsApp.
