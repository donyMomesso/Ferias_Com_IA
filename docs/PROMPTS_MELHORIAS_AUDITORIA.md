# Prompts de melhoria — Férias com IA

Este documento transforma a auditoria do projeto em uma sequência segura de implementação.

## Como usar

1. Execute **um prompt por vez**, na ordem indicada.
2. Antes de alterar código, o agente deve inspecionar os arquivos atuais e explicar resumidamente o impacto.
3. Cada etapa deve terminar com:
   - build sem erros;
   - typecheck sem erros;
   - testes criados ou atualizados;
   - resumo dos arquivos alterados;
   - riscos e pendências;
   - commit separado e objetivo.
4. Não avance para a próxima etapa se os critérios de aceite da etapa atual não forem atendidos.
5. Não apagar funcionalidades existentes sem justificar e fornecer migração ou alternativa.
6. Nunca colocar secrets, chaves privadas ou `service_role` no frontend ou no repositório.

---

# PROMPT 00 — Diagnóstico técnico e plano de execução

```text
Você é o engenheiro principal do projeto Férias com IA.

Repositório: donyMomesso/Ferias_Com_IA
Stack atual: Next.js App Router, React, TypeScript, Prisma/PostgreSQL, Supabase, Dexie, Express opcional, Leaflet e múltiplos provedores de IA.

Sua tarefa nesta etapa é SOMENTE diagnosticar e preparar o plano. Não faça alterações de produto ainda.

1. Inspecione a estrutura completa do repositório.
2. Execute ou prepare os comandos de instalação, lint, typecheck, testes e build.
3. Identifique:
   - erros atuais de build;
   - scripts obsoletos;
   - dependências sem versão fixa;
   - arquivos excessivamente grandes;
   - APIs públicas sem proteção;
   - dados demo apresentados como reais;
   - inconsistências entre Dexie, Prisma e Supabase;
   - riscos de autenticação, autorização e LGPD;
   - ausência de testes, CI e observabilidade.
4. Crie um plano de implementação dividido em P0, P1 e P2.
5. Liste a ordem exata das mudanças e as dependências entre elas.
6. Não invente funcionalidades que não estejam ligadas à proposta do produto.
7. Preserve o fluxo principal de criação de roteiro.

Entregáveis:
- relatório curto do estado atual;
- lista de bloqueadores;
- árvore de módulos proposta;
- comandos que deverão passar ao final do projeto;
- checklist de aceite global.

Não faça commit nesta etapa, a menos que seja necessário apenas para corrigir scripts mínimos de diagnóstico.
```

---

# PROMPT 01 — Remover relatos falsos e restaurar confiança

```text
Corrija o módulo de experiências sociais do Férias com IA.

Problema atual:
Quando não há conteúdo externo suficiente, o sistema fabrica autores, relatos, valores, curtidas e perfis de Reddit, YouTube e Instagram, enquanto a interface usa expressões como “experiências reais”. Isso não pode continuar.

Objetivos:
1. Remover completamente qualquer post fictício apresentado como conteúdo real.
2. Nunca inventar:
   - autor;
   - perfil;
   - avaliação;
   - curtidas;
   - preço;
   - testemunho;
   - viagem realizada.
3. Separar conteúdos em dois tipos explícitos:
   - `external_verified`: conteúdo obtido de fonte externa com URL válida;
   - `ai_suggestion`: sugestão criada por IA, sem fingir ser relato de usuário.
4. Quando não houver conteúdo real, mostrar um estado vazio útil:
   “Ainda não encontramos relatos externos para este destino.”
5. Caso existam sugestões da IA, exibi-las em uma seção separada com selo:
   “Sugestão criada por IA”.
6. Para conteúdo externo, exibir:
   - plataforma;
   - autor quando disponível;
   - data quando disponível;
   - URL original;
   - aviso de que o conteúdo pertence à fonte externa.
7. Renomear textos da interface para não prometer verificação inexistente.
8. Criar tipos TypeScript discriminados para impedir mistura entre conteúdo real e IA.
9. Criar testes garantindo que um item sem URL externa não possa ser exibido como relato real.
10. Tratar falhas do Reddit e YouTube sem inserir conteúdo falso.

Critérios de aceite:
- nenhum perfil ou depoimento fictício aparece como real;
- a origem de cada item é visível;
- estados vazio, carregando e erro estão claros;
- build e testes passam.

Ao finalizar:
- mostre os arquivos alterados;
- explique a nova regra de confiança;
- use o commit: `fix: remove relatos sociais ficticios`.
```

---

# PROMPT 02 — Autenticação Supabase e RLS seguro

```text
Implemente autenticação e segurança real de dados no Supabase para o Férias com IA.

Problema atual:
O backup usa `install_id` salvo no localStorage e as políticas RLS permitem operações anônimas com validação insuficiente. Isso não prova propriedade e não oferece restauração confiável entre aparelhos.

Objetivos:
1. Implementar Supabase Auth com fluxo inicial por:
   - magic link por email;
   - e estrutura preparada para login social no futuro.
2. Adicionar `user_id uuid references auth.users(id)` nas tabelas de dados pessoais.
3. Criar migração SQL segura para:
   - viagens;
   - parceiros salvos pelo usuário;
   - gastos;
   - lugares visitados;
   - checklists;
   - preferências.
4. Substituir políticas anônimas por políticas baseadas em:
   `auth.uid() = user_id`.
5. Remover a confiança em `install_id` como autenticação.
6. Manter o modo local sem conta funcionando.
7. Quando o usuário entrar, oferecer migração dos dados locais para a conta.
8. Criar sincronização bidirecional:
   - upload;
   - download/restauração;
   - `updated_at`;
   - resolução simples de conflito pelo registro mais recente;
   - aviso antes de sobrescrever dados.
9. Adicionar tela ou modal de conta com:
   - entrar;
   - sair;
   - última sincronização;
   - sincronizar agora;
   - exportar dados;
   - excluir conta.
10. Nunca expor `service_role` no cliente.
11. Atualizar `.env.example` para usar placeholders, sem apontar para chaves reais.
12. Documentar como criar o projeto Supabase e executar migrações.
13. Criar testes de RLS ou instruções reproduzíveis para validar que:
   - usuário A não lê dados do usuário B;
   - usuário A não altera dados do usuário B;
   - usuário anônimo não acessa dados privados.

Critérios de aceite:
- modo local continua funcionando sem login;
- usuário autenticado recupera a viagem em outro aparelho;
- nenhum dado privado depende apenas de `install_id`;
- RLS bloqueia acesso cruzado;
- build e testes passam.

Commit: `feat: adiciona autenticacao e sincronizacao segura`.
```

---

# PROMPT 03 — Autorização segura da Comunidade

```text
Proteja completamente o módulo Comunidade.

Problema atual:
As APIs confiam em `userId` enviado pelo navegador para editar, excluir, entrar em grupos e confirmar presença. Alguns endpoints também retornam emails de usuários.

Objetivos:
1. Todas as rotas mutáveis devem obter o usuário pela sessão do servidor.
2. Remover `userId` do body, query string e formulários públicos.
3. Criar helpers server-side:
   - `requireUser()`;
   - `requireGroupOrganizer(groupId)`;
   - `requireGroupMember(groupId)`;
   - `requireEventOrganizer(eventId)`.
4. Definir papéis:
   - ORGANIZER;
   - MODERATOR;
   - MEMBER.
5. Atualizar Prisma e migrações se necessário.
6. Não retornar email de membro em endpoints públicos.
7. Para grupos privados:
   - criar solicitação de entrada;
   - permitir aprovação ou recusa;
   - impedir entrada direta.
8. Impedir que o organizador saia sem transferir a propriedade ou excluir o grupo.
9. Validar capacidade de eventos e lista de espera.
10. Criar logs de ações administrativas.
11. Adicionar proteção contra spam na criação de grupos, eventos e RSVPs.
12. Se a autenticação ainda não estiver configurada no ambiente, esconder ações mutáveis e mostrar mensagem clara.
13. Criar testes de autorização cobrindo tentativas de falsificação de identidade.

Critérios de aceite:
- alterar `userId` no navegador não permite agir como outra pessoa;
- emails não vazam;
- grupos privados funcionam com aprovação;
- apenas organizador ou moderador autorizado administra o grupo;
- testes de autorização passam.

Commit: `fix: protege autorizacao da comunidade`.
```

---

# PROMPT 04 — Rate limit, abuso e controle de custos

```text
Implemente proteção de produção nas APIs do Férias com IA.

Rotas prioritárias:
- geração de roteiro;
- fotos;
- social;
- prospecção de parceiros;
- sugestões de comunidade;
- grupos e eventos.

Objetivos:
1. Implementar rate limiting por IP e, quando autenticado, por usuário.
2. Criar limites diferentes por rota e custo.
3. Adicionar timeout com AbortController em todas as integrações externas.
4. Criar retry apenas para falhas transitórias, com backoff e limite pequeno.
5. Adicionar cache para:
   - geocodificação;
   - fotos;
   - clima;
   - POIs;
   - pesquisas por destino.
6. Impedir cliques duplicados e requisições concorrentes idênticas.
7. Definir limite máximo de body e comprimento dos campos.
8. Sanitizar entradas e bloquear payloads claramente abusivos.
9. Retornar status 429 com mensagem amigável.
10. Registrar por requisição:
   - provedor usado;
   - duração;
   - sucesso ou falha;
   - custo estimado quando disponível;
   - cache hit/miss;
   - sem registrar secrets ou conteúdo sensível desnecessário.
11. Criar orçamento diário configurável para IA e busca.
12. Quando o orçamento diário for atingido, usar fallback seguro ou informar indisponibilidade, sem fingir que houve pesquisa real.
13. Preparar opção de CAPTCHA após comportamento suspeito.
14. Criar testes para 429, timeout, cache e fallback.

Critérios de aceite:
- chamadas repetidas não multiplicam custos desnecessários;
- APIs externas não ficam penduradas indefinidamente;
- erros têm códigos corretos;
- logs permitem identificar custo e falha.

Commit: `feat: adiciona protecao contra abuso e controle de custos`.
```

---

# PROMPT 05 — LGPD, privacidade, termos e gestão dos dados

```text
Crie a base de privacidade e LGPD do Férias com IA.

Objetivos:
1. Criar páginas:
   - `/privacidade`;
   - `/termos`;
   - `/cookies` quando aplicável;
   - `/contato`.
2. Explicar claramente:
   - quais dados são coletados;
   - por que são coletados;
   - onde são armazenados;
   - quais provedores externos recebem dados;
   - como solicitar exclusão;
   - tempo de retenção;
   - uso de IA;
   - riscos de informações desatualizadas em viagens.
3. Adicionar consentimento para analytics e cookies não essenciais.
4. Não bloquear recursos essenciais por recusa de analytics.
5. Criar função de exportação dos dados da conta em JSON.
6. Criar fluxo de exclusão da conta e dados relacionados.
7. Criar opção para apagar dados somente do aparelho.
8. Adicionar rodapé com links legais em todas as páginas.
9. Exibir aviso antes de enviar preferências de viagem a provedores externos de IA.
10. Não usar dark patterns.
11. Criar placeholders para responsável e canal LGPD, destacados para revisão jurídica.
12. Documentar que o conteúdo precisa de revisão jurídica antes do lançamento.

Critérios de aceite:
- usuário encontra e entende as políticas;
- consegue exportar e excluir dados;
- consentimento é registrado quando necessário;
- nenhum texto afirma conformidade jurídica definitiva sem revisão profissional.

Commit: `feat: adiciona base de privacidade e lgpd`.
```

---

# PROMPT 06 — Validação da IA e proteção contra prompt injection

```text
Torne a camada de IA robusta e segura.

Objetivos:
1. Criar schemas Zod completos para:
   - TripPlan;
   - atividades;
   - orçamento;
   - fontes;
   - sugestões de comunidade.
2. Validar toda resposta de OpenAI, Gemini ou Claude antes de retorná-la ao frontend.
3. Preferir structured output ou JSON schema quando o provedor suportar.
4. Implementar reparação controlada de JSON inválido com no máximo uma nova tentativa.
5. Se a resposta continuar inválida, retornar erro amigável ou fallback identificado como demo.
6. Separar claramente:
   - instruções do sistema;
   - dados do usuário;
   - resultados externos não confiáveis.
7. Delimitar entradas e instruir o modelo a nunca obedecer comandos encontrados em resultados web.
8. Limitar tamanho de campos, número de dias e quantidade de atividades.
9. Sanitizar links e permitir somente protocolos seguros.
10. Não renderizar HTML produzido pela IA.
11. Criar validações de coerência:
   - datas;
   - número de dias;
   - destino;
   - orçamento não negativo;
   - atividades com título e período;
   - fontes válidas.
12. Adicionar testes com:
   - JSON quebrado;
   - campos faltando;
   - prompt injection no objetivo;
   - links perigosos;
   - saída excessivamente grande.

Critérios de aceite:
- nenhuma resposta não validada chega à interface;
- prompt injection não altera o formato nem as regras principais;
- erros são recuperáveis e transparentes.

Commit: `fix: valida respostas e protege camada de ia`.
```

---

# PROMPT 07 — Formulário inteligente em etapas

```text
Substitua o formulário livre atual por um assistente de planejamento em etapas, mantendo uma experiência rápida.

Objetivos de UX:
1. Criar wizard responsivo com quatro etapas:
   1. Origem e destino.
   2. Datas e viajantes.
   3. Preferências e necessidades.
   4. Orçamento e revisão.
2. Campos estruturados:
   - cidade/aeroporto de origem;
   - destino;
   - data de ida;
   - data de volta;
   - datas flexíveis;
   - adultos;
   - crianças e idades;
   - bebês;
   - idosos;
   - animais;
   - ritmo tranquilo/moderado/intenso;
   - interesses;
   - mobilidade reduzida;
   - restrições alimentares;
   - tipo de hospedagem;
   - transporte desejado;
   - orçamento total ou por pessoa;
   - moeda;
   - itens incluídos no orçamento.
3. Usar React Hook Form e Zod, ou solução equivalente consistente com o projeto.
4. Preservar estado ao voltar etapas.
5. Salvar rascunho local automaticamente.
6. Permitir “planejamento rápido” com poucos campos e “personalizar mais”.
7. Validar datas passadas, volta antes da ida e quantidade inválida de viajantes.
8. Exibir resumo antes de gerar.
9. Atualizar os tipos e APIs para dados estruturados.
10. Criar migração compatível para roteiros salvos no formato antigo.
11. Melhorar acessibilidade:
   - labels reais;
   - mensagens associadas aos campos;
   - foco no primeiro erro;
   - navegação por teclado;
   - `aria-live`.
12. Criar testes de validação e fluxo completo mobile/desktop.

Critérios de aceite:
- usuário pode concluir rapidamente;
- dados enviados à IA não dependem de interpretação frágil de texto;
- links de reserva recebem datas e viajantes corretos;
- estado não se perde ao voltar.

Commit: `feat: cria planejamento guiado em etapas`.
```

---

# PROMPT 08 — Roteiro fundamentado em pesquisa real e fontes

```text
Conecte a pesquisa dos agentes à geração final do roteiro.

Problema atual:
A pesquisa de clima, hospedagem, passeios e restaurantes acontece, mas o prompt final recebe principalmente os campos do formulário.

Objetivos:
1. Criar um pipeline explícito:
   - entender solicitação;
   - pesquisar;
   - normalizar;
   - remover duplicados;
   - pontuar confiança;
   - selecionar achados;
   - gerar roteiro;
   - validar roteiro.
2. Passar ao modelo apenas os melhores achados estruturados.
3. Cada achado deve conter:
   - título;
   - categoria;
   - descrição curta;
   - URL;
   - fonte;
   - data da consulta;
   - confiança;
   - preço quando disponível;
   - necessidade de validação humana.
4. O roteiro final deve associar atividades às fontes utilizadas.
5. Não inventar preço, horário, avaliação ou disponibilidade.
6. Quando uma informação não estiver confirmada, marcar:
   “Confirme antes de reservar”.
7. Criar estados de fonte:
   - real;
   - estimada;
   - histórica;
   - sugestão de IA;
   - indisponível.
8. Exibir no frontend uma área “Fontes e última atualização”.
9. Atualizar o texto “Pontos verificados” para uma descrição precisa.
10. Criar cache e deduplicação de resultados.
11. Criar testes garantindo que:
   - toda recomendação factual importante tenha origem;
   - dados demo sejam identificados;
   - o modelo não invente URL.

Critérios de aceite:
- o roteiro utiliza resultados reais da pesquisa;
- usuário consegue distinguir fato, estimativa e sugestão;
- fontes são clicáveis e datadas.

Commit: `feat: fundamenta roteiros em fontes pesquisadas`.
```

---

# PROMPT 09 — Clima correto para as datas da viagem

```text
Corrija a inteligência de clima do Férias com IA.

Objetivos:
1. Usar as datas estruturadas da viagem.
2. Para viagens dentro da janela de previsão disponível:
   - consultar previsão diária real;
   - exibir máxima, mínima, chuva e condição.
3. Para viagens distantes:
   - usar médias históricas ou climatologia de fonte adequada;
   - deixar explícito que não é previsão.
4. Nunca mostrar a previsão dos próximos sete dias como se fosse o clima da data futura.
5. Criar plano B por dia quando houver risco de chuva.
6. Mostrar data da última consulta e fonte.
7. Permitir atualizar clima manualmente próximo da viagem.
8. Criar alertas de dados indisponíveis.
9. Tratar fuso horário e virada de data.
10. Criar testes para:
   - viagem amanhã;
   - viagem daqui a seis meses;
   - destino sem coordenadas;
   - API indisponível.

Critérios de aceite:
- previsão e histórico nunca são confundidos;
- roteiro ajusta atividades externas e internas;
- informação tem data e fonte.

Commit: `fix: usa clima compativel com as datas da viagem`.
```

---

# PROMPT 10 — Editor de roteiro por dia e atividade

```text
Transforme o roteiro textual em um editor visual e personalizável.

Objetivos:
1. Criar modelo de dados:
   - Trip;
   - TripDay;
   - Activity;
   - Reservation;
   - SourceReference.
2. Cada atividade deve suportar:
   - título;
   - categoria;
   - data;
   - início e fim;
   - duração;
   - endereço;
   - coordenadas;
   - preço estimado;
   - moeda;
   - link;
   - fonte;
   - observação;
   - status de reserva;
   - plano B.
3. Exibir manhã, tarde e noite.
4. Permitir:
   - adicionar atividade;
   - editar;
   - excluir;
   - mover entre dias;
   - reordenar;
   - duplicar;
   - favoritar;
   - marcar como reservado;
   - trocar somente uma atividade com IA;
   - regenerar somente um dia.
5. Antes de substituir, preservar a versão anterior para desfazer.
6. Calcular tempo de deslocamento quando possível.
7. Alertar sobre horários sobrepostos e deslocamentos inviáveis.
8. Salvar versões do roteiro.
9. Criar histórico simples de alterações.
10. Garantir excelente uso em celular.
11. Criar testes de edição, reordenação, undo e persistência.

Critérios de aceite:
- usuário não precisa regenerar a viagem inteira para mudar um item;
- alterações persistem;
- conflitos de horário são identificados;
- versão anterior pode ser recuperada.

Commit: `feat: adiciona editor completo de roteiro`.
```

---

# PROMPT 11 — Identidade única da viagem e restauração completa

```text
Corrija a persistência local e em nuvem para que cada viagem seja independente.

Problema atual:
Gastos, lugares e checklist usam uma chave baseada apenas no destino. Duas viagens para a mesma cidade podem misturar dados.

Objetivos:
1. Criar `tripId` UUID/CUID único no momento em que uma viagem é criada.
2. Relacionar ao `tripId`:
   - roteiro;
   - atividades;
   - gastos;
   - lugares visitados;
   - checklist;
   - fotos selecionadas;
   - coordenadas;
   - links de reserva;
   - POIs;
   - fontes;
   - versões.
3. Migrar registros antigos do Dexie de forma segura.
4. Atualizar schema do Dexie com nova versão e índices.
5. Atualizar Prisma e Supabase.
6. Ao abrir uma viagem salva, restaurar exatamente:
   - mapa;
   - fontes;
   - reservas;
   - fotos;
   - atrações;
   - gastos;
   - checklist;
   - aba ou seção principal.
7. Limpar estados da viagem anterior antes de carregar outra.
8. Implementar exclusão em cascata somente depois de confirmação.
9. Oferecer duplicação de viagem.
10. Criar testes com duas viagens para o mesmo destino.

Critérios de aceite:
- duas viagens para Gramado não compartilham dados;
- abrir uma viagem salva reproduz o estado original;
- migração não apaga dados antigos.

Commit: `fix: isola dados por identificador unico de viagem`.
```

---

# PROMPT 12 — PDF completo e compartilhamento profissional

```text
Substitua o `window.print()` por uma exportação de viagem profissional.

Objetivos:
1. Gerar um PDF completo no servidor ou por biblioteca adequada, sem depender da aba aberta.
2. Estrutura do PDF:
   - capa com marca;
   - destino e datas;
   - origem;
   - viajantes;
   - resumo;
   - roteiro dia a dia;
   - mapa ou QR code para o mapa;
   - orçamento;
   - reservas;
   - checklist;
   - contatos úteis;
   - fontes;
   - data da última atualização;
   - avisos de confirmação.
3. Criar versão para impressão A4.
4. Criar versão leve para WhatsApp.
5. Gerar nome de arquivo seguro e legível.
6. Não incluir dados pessoais desnecessários.
7. Criar link compartilhável com permissão:
   - somente leitura;
   - expiração opcional;
   - revogação.
8. Adicionar Web Share API quando disponível e fallback por cópia de link.
9. Criar QR code para abrir a viagem.
10. Testar caracteres acentuados, muitas páginas e imagens ausentes.

Critérios de aceite:
- PDF sempre contém a viagem completa;
- funciona em celular e desktop;
- compartilhamento não expõe edição nem dados privados.

Commit: `feat: gera pdf completo e compartilhamento seguro`.
```

---

# PROMPT 13 — Erros, carregamento, retry e transparência

```text
Padronize o tratamento de erros e estados assíncronos.

Objetivos:
1. Criar formato de erro da API com:
   - code;
   - message;
   - fieldErrors;
   - retryable;
   - requestId.
2. Usar códigos HTTP corretos:
   - 400 validação;
   - 401 autenticação;
   - 403 autorização;
   - 404 não encontrado;
   - 409 conflito;
   - 429 limite;
   - 502 provedor externo;
   - 504 timeout.
3. Não retornar detalhes internos, chaves ou stack trace ao usuário.
4. Criar Error Boundary e páginas de erro.
5. Exibir progresso real da geração:
   - entendendo preferências;
   - pesquisando;
   - analisando;
   - montando;
   - validando.
6. Permitir tentar novamente somente a etapa que falhou.
7. Não usar `catch` vazio sem registrar ou representar o estado.
8. Diferenciar:
   - nenhum resultado;
   - erro da fonte;
   - integração não configurada;
   - conteúdo demo.
9. Adicionar toasts acessíveis ou região `aria-live`.
10. Criar testes de falha para cada integração.

Critérios de aceite:
- usuário entende o que aconteceu;
- falha em fotos não apaga o roteiro;
- erro de validação não vira 500;
- cada erro tem requestId para suporte.

Commit: `fix: padroniza erros e estados de carregamento`.
```

---

# PROMPT 14 — Nova arquitetura de informação e acessibilidade

```text
Melhore a organização visual e atinja uma base sólida de acessibilidade WCAG 2.2 AA.

Objetivos de informação:
1. Reduzir as oito abas principais para quatro áreas:
   - Meu roteiro;
   - Mapa e lugares;
   - Reservas e orçamento;
   - Preparação da viagem.
2. Colocar em “Mais opções”:
   - fotos;
   - relatos;
   - fontes;
   - detalhes técnicos da IA.
3. Trocar termos técnicos como “Agentes” por linguagem de usuário.

Objetivos de acessibilidade:
4. Implementar abas com:
   - `role=tablist`;
   - `role=tab`;
   - `aria-selected`;
   - `aria-controls`;
   - setas do teclado.
5. Adicionar skip link.
6. Garantir labels, descrições e mensagens de erro associadas.
7. Implementar `focus-visible` em todos os controles.
8. Garantir contraste AA.
9. Respeitar `prefers-reduced-motion`.
10. Anunciar carregamento e conclusão com `aria-live`.
11. Tornar botões de exclusão descritivos.
12. Adicionar texto alternativo correto e evitar alt genérico.
13. Garantir alvos de toque adequados no celular.
14. Testar com teclado e ferramenta automática de acessibilidade.
15. Criar testes com axe ou equivalente.

Critérios de aceite:
- fluxo completo pode ser usado sem mouse;
- animações respeitam preferência do sistema;
- interface fica mais simples para usuários não técnicos;
- nenhuma ação depende somente de cor ou ícone.

Commit: `feat: simplifica navegacao e melhora acessibilidade`.
```

---

# PROMPT 15 — Modularização e melhoria de desempenho

```text
Refatore a tela principal sem alterar o comportamento aprovado.

Problema atual:
A página principal concentra formulário, mapa, fotos, social, gastos, checklist, backup e renderização do resultado em um componente cliente muito grande.

Objetivos:
1. Dividir por domínio:
   - trip-form;
   - itinerary;
   - bookings;
   - map;
   - budget;
   - checklist;
   - sources;
   - account.
2. Usar Server Components por padrão.
3. Manter Client Components apenas onde houver interação.
4. Criar hooks ou services claros para dados remotos.
5. Evitar estados duplicados e efeitos com dependências ignoradas.
6. Cancelar fetches obsoletos ao trocar destino.
7. Evitar que resposta de uma busca antiga sobrescreva a nova.
8. Aplicar lazy loading em mapa, galeria, PDF e módulos pesados.
9. Substituir imagens externas sem otimização por estratégia adequada do Next quando possível.
10. Medir bundle e renderizações antes/depois.
11. Não fazer uma refatoração gigante em um único arquivo ou commit.
12. Criar testes de regressão do fluxo principal.

Critérios de aceite:
- `app/page.tsx` passa a ser um compositor pequeno;
- nenhuma funcionalidade se perde;
- redução mensurável de complexidade e bundle inicial;
- efeitos assíncronos não geram race condition.

Commit principal: `refactor: modulariza experiencia de planejamento`.
```

---

# PROMPT 16 — Testes, CI, versões e segurança do Next

```text
Prepare o projeto para integração contínua e produção.

Objetivos:
1. Fixar versões de Next, React, TypeScript e dependências principais.
2. Definir versão suportada do Node em `engines` e `.nvmrc`.
3. Corrigir script de lint conforme a versão instalada do Next.
4. Adicionar scripts:
   - lint;
   - typecheck;
   - test;
   - test:e2e;
   - build;
   - prisma:validate.
5. Instalar e configurar:
   - Vitest;
   - Testing Library;
   - Playwright;
   - axe ou equivalente.
6. Criar GitHub Actions para executar em pull requests.
7. Testes mínimos:
   - schemas;
   - datas;
   - orçamento;
   - links de reserva;
   - validação de IA;
   - autenticação/autorização;
   - duas viagens no mesmo destino;
   - fluxo E2E de criar, salvar, abrir e exportar.
8. Adicionar headers de segurança:
   - Content-Security-Policy compatível;
   - X-Content-Type-Options;
   - Referrer-Policy;
   - Permissions-Policy;
   - proteção contra framing.
9. Configurar política segura de imagens externas.
10. Adicionar Dependabot ou Renovate.
11. Adicionar auditoria de dependências no CI sem quebrar por alertas irrelevantes; documentar exceções.
12. Garantir que `.env.example` contenha somente placeholders.

Critérios de aceite:
- PR falha se lint, typecheck, testes ou build falharem;
- versões são reproduzíveis;
- headers aparecem em produção;
- secrets não entram no repositório.

Commit: `ci: adiciona testes e pipeline de qualidade`.
```

---

# PROMPT 17 — Observabilidade, analytics e suporte

```text
Implemente observabilidade e analytics com privacidade.

Objetivos:
1. Adicionar monitoramento de erros com ferramenta apropriada.
2. Criar requestId nas APIs e correlacionar logs.
3. Registrar métricas técnicas:
   - duração por etapa;
   - taxa de erro por provedor;
   - cache hit;
   - timeouts;
   - custo estimado por roteiro.
4. Criar analytics de produto com consentimento quando necessário:
   - landing_viewed;
   - trip_form_started;
   - trip_form_completed;
   - trip_generation_started;
   - trip_generation_failed;
   - trip_generated;
   - itinerary_item_replaced;
   - trip_saved;
   - trip_shared;
   - pdf_generated;
   - booking_link_clicked.
5. Nunca enviar texto completo do roteiro, observações privadas ou dados sensíveis ao analytics.
6. Criar painel ou documentação das métricas principais.
7. Adicionar página ou formulário de suporte com requestId.
8. Criar health checks para banco e serviços essenciais sem expor secrets.
9. Criar alertas para aumento de erro ou custo.
10. Documentar como desativar analytics em desenvolvimento.

Critérios de aceite:
- falhas podem ser investigadas por requestId;
- custo por geração é mensurável;
- analytics não coleta dados excessivos;
- consentimento é respeitado.

Commit: `feat: adiciona observabilidade e metricas de produto`.
```

---

# PROMPT 18 — PWA e modo viagem offline

```text
Transforme o Férias com IA em uma experiência útil durante a viagem.

Objetivos:
1. Adicionar manifest e instalação como PWA.
2. Criar modo offline para viagens salvas.
3. Permitir baixar uma viagem para uso sem internet.
4. Cachear com segurança:
   - roteiro;
   - checklist;
   - reservas;
   - contatos úteis;
   - mapa simplificado ou links;
   - imagens essenciais limitadas.
5. Não cachear respostas privadas de outros usuários.
6. Criar tela “Hoje” com:
   - próxima atividade;
   - horário;
   - endereço;
   - como chegar;
   - reserva;
   - clima atualizado quando houver internet.
7. Permitir registrar gastos offline e sincronizar depois.
8. Exibir claramente o estado:
   - offline;
   - sincronizando;
   - sincronizado;
   - conflito.
9. Adicionar contatos de emergência e telefones úteis do destino com fonte.
10. Criar testes E2E de uso offline.

Critérios de aceite:
- viagem baixada abre sem internet;
- alterações offline não são perdidas;
- dados sincronizam quando a conexão volta;
- usuário entende o estado da sincronização.

Commit: `feat: adiciona pwa e modo viagem offline`.
```

---

# PROMPT 19 — SEO, marca e páginas públicas

```text
Melhore a presença pública do Férias com IA sem criar conteúdo enganoso.

Objetivos:
1. Configurar metadata completa:
   - title template;
   - canonical;
   - Open Graph;
   - Twitter/X card;
   - ícones;
   - imagem social.
2. Criar sitemap e robots.
3. Adicionar Schema.org apropriado para software e FAQ.
4. Criar páginas públicas:
   - Como funciona;
   - Recursos;
   - Segurança e privacidade;
   - Perguntas frequentes;
   - Contato.
5. Criar exemplos de roteiros claramente marcados como exemplo.
6. Não indexar viagens privadas ou links compartilhados privados.
7. Melhorar performance Core Web Vitals.
8. Evitar imagens aleatórias do Picsum na versão de produção.
9. Usar a identidade visual oficial Férias com IA.
10. Adicionar footer completo.
11. Criar redirects e página 404 útil.

Critérios de aceite:
- preview social funciona;
- páginas privadas não são indexadas;
- textos não prometem preços ou verificações inexistentes;
- Lighthouse melhora sem sacrificar acessibilidade.

Commit: `feat: melhora seo e presenca publica`.
```

---

# PROMPT 20 — Comunidade segura, moderação e parceiros

```text
Depois que autenticação e autorização estiverem concluídas, finalize a comunidade e o módulo de parceiros.

Comunidade:
1. Criar perfil público com dados mínimos.
2. Adicionar regras do grupo.
3. Criar denúncia de usuário, grupo, evento e conteúdo.
4. Criar bloqueio entre usuários.
5. Criar moderação e trilha de auditoria.
6. Implementar limites de criação e anti-spam.
7. Proteger localização exata de eventos privados.
8. Adicionar cancelamento e comunicação aos participantes.
9. Criar lista de espera e capacidade real.
10. Não exibir email ou telefone sem consentimento.

Parceiros:
11. Criar status:
   - prospectado;
   - em validação;
   - verificado;
   - suspenso;
   - rejeitado.
12. Registrar:
   - fonte;
   - responsável pela validação;
   - data da última verificação;
   - documentos quando legalmente necessário;
   - histórico de alterações.
13. Não chamar parceiro de verificado sem processo concluído.
14. Separar recomendação orgânica de conteúdo patrocinado.
15. Identificar comissão ou link de afiliado.
16. Criar critérios transparentes de ranking.
17. Criar painel administrativo protegido.
18. Adicionar revisão periódica dos parceiros.

Critérios de aceite:
- comunidade possui ferramentas mínimas de segurança;
- dados de contato não vazam;
- parceiros patrocinados são identificados;
- status de verificação é auditável.

Commit: `feat: conclui comunidade segura e validacao de parceiros`.
```

---

# PROMPT 21 — Auditoria final de lançamento

```text
Realize a auditoria final de lançamento do Férias com IA.

Não adicione novas funcionalidades nesta etapa. Valide o que foi construído.

1. Executar:
   - instalação limpa;
   - lint;
   - typecheck;
   - testes unitários;
   - testes de integração;
   - testes E2E;
   - build de produção;
   - validação Prisma;
   - auditoria de dependências.
2. Testar em:
   - Chrome desktop;
   - Edge;
   - Safari quando disponível;
   - Android;
   - iPhone;
   - tela pequena;
   - teclado sem mouse;
   - leitor de tela básico.
3. Validar jornadas:
   - visitante cria roteiro sem conta;
   - cria conta depois;
   - migra dados locais;
   - abre em outro aparelho;
   - edita atividade;
   - salva;
   - compartilha;
   - gera PDF;
   - usa offline;
   - exclui conta.
4. Testar segurança:
   - usuário A não acessa usuário B;
   - falsificação de userId falha;
   - rate limit funciona;
   - payload grande é rejeitado;
   - prompt injection não quebra formato;
   - links perigosos não são renderizados.
5. Validar confiança:
   - nenhum conteúdo demo aparece como real;
   - fontes e datas aparecem;
   - estimativas são identificadas;
   - parceiros patrocinados são identificados.
6. Validar acessibilidade com ferramenta automática e teclado.
7. Medir Core Web Vitals.
8. Criar checklist GO/NO-GO com:
   - bloqueadores;
   - riscos aceitos;
   - plano de rollback;
   - responsáveis;
   - monitoramento pós-lançamento.
9. Produzir um relatório final em `docs/AUDITORIA_FINAL_LANCAMENTO.md`.

Critério final:
O produto só recebe GO quando não houver vulnerabilidade crítica, conteúdo enganoso, perda de dados ou bloqueador de jornada principal.

Commit: `docs: adiciona auditoria final de lancamento`.
```

---

# PROMPT MESTRE — Executar o plano completo com segurança

Use este prompt somente em um agente capaz de trabalhar por várias etapas e criar commits separados.

```text
Você é o tech lead responsável por preparar o Férias com IA para um beta público seguro.

Leia integralmente `docs/PROMPTS_MELHORIAS_AUDITORIA.md`.

Regras obrigatórias:
1. Execute os prompts na ordem 00 a 21.
2. Faça uma etapa por vez.
3. Antes de cada etapa, inspecione a implementação atual e confirme as dependências já concluídas.
4. Não acumule todas as mudanças em um único commit.
5. Não use dados falsos apresentados como reais.
6. Não confie em userId enviado pelo cliente.
7. Não exponha secrets.
8. Não reduza RLS para facilitar desenvolvimento.
9. Preserve modo local sem conta.
10. Toda informação externa deve ter origem e estado de confiança.
11. Todo dado privado deve ser associado ao usuário autenticado.
12. Toda resposta de IA deve ser validada.
13. Toda etapa precisa de testes.
14. Se uma etapa exigir decisão de produto, adote a opção mais segura e documente a decisão.
15. Caso encontre risco crítico não previsto, interrompa a publicação, corrija ou documente como bloqueador.

Após cada etapa, entregue:
- o que foi encontrado;
- o que foi alterado;
- arquivos modificados;
- migrações;
- testes executados;
- resultado do build;
- riscos restantes;
- hash e mensagem do commit.

Ao final, execute o Prompt 21 e gere o relatório GO/NO-GO.
```
