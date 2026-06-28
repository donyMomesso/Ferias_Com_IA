# Pescaria com IA — Documento de Orientação

## Visão geral

O **Pescaria com IA** será um módulo público dentro do projeto **Férias com IA**, criado para ajudar qualquer pessoa a planejar pescarias no Brasil com mais segurança, economia e praticidade.

O objetivo não é ser um guia apenas pessoal. O produto deve atender pescadores iniciantes, famílias, pescadores esportivos, grupos de viagem, guias, pousadas, lojas de pesca e parceiros locais.

A proposta principal é simples:

> A pessoa informa onde quer pescar, quando vai, com quem vai, qual peixe deseja buscar e quais equipamentos possui. A IA monta um roteiro de pescaria com pontos, melhores horários, iscas, equipamentos, checklist, custos e cuidados.

---

## Posicionamento do produto

Nome recomendado para o módulo:

**Pescaria com IA**

Assinatura:

**Planeje sua pescaria com inteligência, segurança e economia.**

Frase curta:

**Escolha o destino, o peixe ou o estilo de pesca. A IA monta o roteiro para você.**

O módulo deve funcionar como uma vertical especializada do Férias com IA:

- Férias com IA: viagens em geral.
- Pescaria com IA: viagens e experiências de pesca.

---

## Público-alvo

### 1. Pescador iniciante

Pessoa que quer começar a pescar, mas não sabe qual vara comprar, onde ir, qual isca usar ou qual horário é melhor.

Necessidades:

- Linguagem simples.
- Equipamentos econômicos.
- Locais fáceis e seguros.
- Explicação de montagens básicas.
- Checklist do que levar.

### 2. Pescador intermediário

Pessoa que já tem varas, carretilhas ou molinetes, mas quer melhorar resultado em viagens e pontos novos.

Necessidades:

- Sugestão de peixe-alvo.
- Iscas naturais e artificiais.
- Montagens por espécie.
- Melhor época e condição.
- Roteiro por dia.

### 3. Família que viaja junto

Famílias em que nem todos pescam. O roteiro deve considerar passeios, alimentação, segurança e conforto.

Necessidades:

- Pesca + lazer.
- Pontos seguros para crianças e acompanhantes.
- Restaurantes próximos.
- Praias, parques, passeios e descanso.
- Custos estimados.

### 4. Grupos de pescaria

Turmas que viajam para rios, pousadas, pantanal, represas, costeiras ou pesqueiros.

Necessidades:

- Organização de equipamentos.
- Divisão de custos.
- Checklist coletivo.
- Barco, guia, pousada e transporte.
- Cronograma da viagem.

### 5. Guias, pousadas e parceiros locais

Profissionais que podem aparecer como parceiros validados no futuro.

Necessidades:

- Cadastro de serviço.
- Região de atendimento.
- Espécies trabalhadas.
- Fotos reais.
- Contato.
- Reputação e validação.

---

## Problema que o módulo resolve

Hoje, quem quer pescar em um lugar novo normalmente precisa pesquisar em muitos lugares:

- YouTube.
- Grupos de WhatsApp.
- Google Maps.
- Sites de maré.
- Previsão do tempo.
- Lojas de pesca.
- Comentários de outros pescadores.

O Pescaria com IA deve juntar essas informações em uma experiência guiada, simples e prática.

---

## Funcionalidades principais do MVP

### 1. Página inicial do módulo

Rota sugerida:

`/pescaria`

Conteúdo:

- Hero com chamada principal.
- Campo para destino.
- Campo para data.
- Campo para tipo de pescaria.
- Campo para peixe-alvo.
- Campo para perfil do grupo.
- Botão: **Montar minha pescaria**.

Tipos de pescaria iniciais:

- Praia.
- Costão.
- Mangue.
- Rio.
- Represa.
- Pesqueiro.
- Barco.
- Caiaque.
- Barranco.

### 2. Gerador de roteiro de pescaria

Rota sugerida:

`/api/pescaria/roteiro`

Entrada esperada:

```ts
{
  destino: string;
  dataInicio?: string;
  dataFim?: string;
  pessoas: string;
  tipoPesca: string;
  peixeAlvo?: string;
  orcamento?: string;
  temBarco?: boolean;
  vaiComFamilia?: boolean;
  equipamentosDisponiveis?: string;
}
```

Saída esperada:

```ts
{
  resumo: string;
  melhoresHorarios: string[];
  especiesProvaveis: string[];
  pontosSugeridos: PontoPesca[];
  iscasNaturais: string[];
  iscasArtificiais: string[];
  equipamentos: string[];
  montagens: string[];
  checklist: string[];
  custosEstimados: string[];
  alertas: string[];
  roteiroPorDia: DiaPescaria[];
}
```

### 3. Base inicial de destinos

Arquivo sugerido:

`lib/pescaria/destinos.ts`

Destinos iniciais:

- Cananéia - SP.
- Ilha Comprida - SP.
- Praia Grande - SP.
- São Vicente - SP.
- Santos - SP.
- Ubatuba - SP.
- Campinas - SP.
- Bataguassu - MS.
- Porto XV - MS/SP.
- Pantanal - MS/MT.
- Três Marias - MG.
- Serra da Mesa - GO.
- Rio Araguaia - GO/TO/MT/PA.
- Rio Negro - AM.

Cada destino deve ter:

```ts
{
  slug: string;
  nome: string;
  estado: string;
  tipo: string[];
  descricao: string;
  especies: string[];
  melhoresMeses: string[];
  iscasNaturais: string[];
  iscasArtificiais: string[];
  equipamentos: string[];
  observacoes: string[];
}
```

### 4. Base inicial de espécies

Arquivo sugerido:

`lib/pescaria/especies.ts`

Espécies iniciais:

Água salgada e mangue:

- Robalo.
- Corvina.
- Pescada.
- Bagre.
- Carapeba.
- Tainha.
- Xaréu.
- Sororoca.
- Espada.
- Garoupa.

Água doce:

- Tucunaré.
- Traíra.
- Dourado.
- Pintado.
- Cachara.
- Pirarara.
- Jaú.
- Piau.
- Pacu.
- Matrinxã.
- Tilápia.
- Tambacu.
- Tambaqui.

Cada espécie deve ter:

```ts
{
  slug: string;
  nome: string;
  nomeCientifico?: string;
  ambiente: string[];
  regioes: string[];
  tamanhoMedio: string;
  dificuldade: "iniciante" | "intermediario" | "avancado";
  iscasNaturais: string[];
  iscasArtificiais: string[];
  equipamentoRecomendado: string[];
  melhoresCondicoes: string[];
  observacoes: string[];
}
```

### 5. Páginas de consulta

Rotas sugeridas:

- `/pescaria/destinos`
- `/pescaria/destinos/[slug]`
- `/pescaria/especies`
- `/pescaria/especies/[slug]`
- `/pescaria/mapa`
- `/pescaria/checklist`

---

## Experiência ideal do usuário

Fluxo básico:

1. Usuário entra em `/pescaria`.
2. Digita o destino, por exemplo: **Cananéia - SP**.
3. Informa a data.
4. Escolhe o tipo de pesca: **mangue, praia, embarcado ou barranco**.
5. Informa se vai com família.
6. Informa peixe-alvo, se souber.
7. Clica em **Montar minha pescaria**.
8. O sistema entrega:
   - roteiro por dia;
   - espécies prováveis;
   - melhores horários;
   - iscas;
   - equipamentos;
   - checklist;
   - alertas;
   - custo estimado;
   - pontos sugeridos.

---

## Regras de segurança e responsabilidade

O sistema deve sempre orientar o usuário a verificar regras locais e condições reais antes da pescaria.

Alertas importantes:

- Verificar licença de pesca quando aplicável.
- Respeitar defeso e tamanho mínimo.
- Consultar previsão do tempo.
- Consultar maré para pesca costeira, praia e mangue.
- Usar colete em barco, caiaque ou locais de risco.
- Não pescar em áreas proibidas.
- Não entrar em costão com mar forte.
- Não recomendar invasão de propriedade privada.
- Não prometer captura garantida.

Frase padrão para resultados:

> As sugestões são estimativas para planejamento. Antes de sair, confirme clima, maré, regras locais, segurança do ponto e legislação de pesca da região.

---

## Tom de voz

O site deve falar de forma:

- Simples.
- Direta.
- Amigável.
- Popular, sem parecer amador.
- Boa para iniciantes, mas útil para pescadores experientes.

Evitar excesso de termos técnicos sem explicação.

Exemplo de frase boa:

> Para robalo em mangue, comece com camarão vivo ou soft no jig head. Trabalhe devagar nas estruturas, principalmente na virada da maré.

Exemplo de frase ruim:

> Utilize abordagem avançada com múltiplos inputs hidrodinâmicos e parâmetros ictiológicos complexos.

---

## Modelo de resultado do roteiro

### Resumo

Destino indicado para pesca de robalo, corvina e pescada, com melhores chances em canais, mangues e estruturas próximas à correnteza.

### Melhor horário

- Nascer do sol.
- Final da tarde.
- Virada da maré.
- Primeiras horas da enchente ou vazante.

### Iscas naturais

- Camarão vivo.
- Sardinha.
- Corrupto.
- Tuvira, quando for água doce.
- Lambari, quando for água doce.

### Iscas artificiais

- Jig head com soft.
- Meia-água.
- Camarão artificial.
- Stick.
- Jumping jig, quando embarcado.

### Equipamento

- Vara 10 a 25 lb para mangue e robalo.
- Molinete 3000 ou 4000.
- Multifilamento 20 a 30 lb.
- Líder fluorcarbono 0,40 a 0,60 mm.
- Alicate de contenção.
- Caixa pequena de iscas.

### Alertas

- Confirmar maré.
- Evitar costão com mar forte.
- Usar colete em embarcações.
- Verificar regras locais.

---

## Monetização futura

Possibilidades:

1. Afiliados de equipamentos de pesca.
2. Indicação de pousadas e barcos.
3. Guias locais parceiros.
4. Plano premium para roteiros avançados.
5. Comunidade de pescadores.
6. Marketplace de excursões.
7. Loja de kits prontos por destino.
8. Publicidade local por cidade ou região.

---

## Roadmap recomendado

### Fase 1 — MVP visual

- Criar `/pescaria`.
- Criar formulário inicial.
- Criar dados mockados de destinos e espécies.
- Criar resultado estático inteligente.
- Integrar com o layout atual do projeto.

### Fase 2 — API própria

- Criar `/api/pescaria/roteiro`.
- Criar schemas com Zod.
- Criar função `generateFishingPlan`.
- Reaproveitar estrutura de agentes do projeto.

### Fase 3 — Banco de dados

- Modelar destinos.
- Modelar espécies.
- Modelar pontos de pesca.
- Modelar parceiros locais.
- Modelar avaliações.

### Fase 4 — Mapa

- Exibir pontos em mapa.
- Filtrar por tipo de pescaria.
- Filtrar por espécie.
- Filtrar por nível.

### Fase 5 — Comunidade

- Criar grupos por destino.
- Criar eventos de pescaria.
- Criar relatos de captura.
- Criar ranking de dicas úteis.

---

## Primeiras tarefas técnicas

1. Criar pasta `lib/pescaria`.
2. Criar `lib/pescaria/types.ts`.
3. Criar `lib/pescaria/destinos.ts`.
4. Criar `lib/pescaria/especies.ts`.
5. Criar `lib/pescaria/planner.ts`.
6. Criar rota `app/pescaria/page.tsx`.
7. Criar rota `app/api/pescaria/roteiro/route.ts`.
8. Criar componentes:
   - `components/pescaria/FishingHero.tsx`
   - `components/pescaria/FishingPlannerForm.tsx`
   - `components/pescaria/FishingPlanResult.tsx`
   - `components/pescaria/FishingDestinationCard.tsx`
   - `components/pescaria/FishingSpeciesCard.tsx`

---

## Critério de pronto do MVP

O MVP estará pronto quando qualquer usuário conseguir:

1. Entrar em `/pescaria`.
2. Preencher destino, data, pessoas, tipo de pesca e peixe-alvo.
3. Gerar um plano de pescaria.
4. Ver iscas, equipamentos, espécies prováveis e checklist.
5. Entender os alertas de segurança.
6. Usar o conteúdo mesmo sem login.

---

## Observação final

Este módulo deve nascer simples, mas com estrutura para crescer. O foco inicial é entregar utilidade real para quem vai pescar no próximo fim de semana ou está planejando uma viagem de pesca em família.

A prioridade não é ter todos os peixes do Brasil no primeiro dia. A prioridade é criar uma experiência clara, bonita e útil, começando por destinos estratégicos e expandindo com dados reais ao longo do tempo.
