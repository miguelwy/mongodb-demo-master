// Copy for the presenter-only page. Steps are numbered as in the client sidebar.

const pt = {
  theme: 'Tema claro/escuro',
  crumb: 'Preparação · Vector Search',
  eyebrow: 'Somente apresentador',
  title: 'Preparação da demo',
  lead: 'Esta página não tem link na demo e só abre na máquina que roda o servidor.',
  openDemo: 'Abrir demo do cliente →',

  setupTitle: 'Antes da reunião',
  setupSteps: `
    <li>Copie <code>.env.example</code> para <code>.env</code> e preencha <code>MONGODB_URI</code>.</li>
    <li>Libere seu IP em <b>Network Access</b> no Atlas.</li>
    <li>Rode <code>npm start</code>.</li>
    <li>Clique em <b>Preparar tudo</b> e aguarde os índices ficarem <code>READY</code>.</li>
    <li>Rode as queries da demo uma vez para conferir os resultados.</li>
    <li>Opcional: adicione <code>VOYAGE_API_KEY</code> ao <code>.env</code> para mostrar a comparação manual ao vivo.</li>`,
  checklistTitle: 'Checklist',
  'check.configured': '<code>MONGODB_URI</code> configurada',
  'check.connected': 'Conexão com o cluster',
  'check.version': 'MongoDB 8.0+ (para <code>$rankFusion</code>)',
  'check.data': 'Dados carregados',
  'check.auto': 'Índice autoEmbed pronto',
  'check.text': 'Índice de texto pronto (busca híbrida)',
  'check.voyage': 'Voyage key (opcional): sem ela, a etapa 9 mostra só o código',
  'check.tier': 'M0, Flex ou M10+. Em M10+, storage auto-scaling ligado. Forma de pagamento na org ou dentro dos 200M tokens grátis por modelo',

  envTitle: 'Ambiente',
  prepare: 'Preparar tudo',
  seed: 'Recarregar dados',
  clearLive: 'Remover produtos ao vivo',
  clearVectors: 'Limpar vetores manuais',
  teardown: 'Teardown completo',
  prepareNote: 'Para mostrar a criação do índice ao vivo, remova products_autoembed abaixo: a etapa 5 volta a exibir o botão. Com 40 documentos, o build costuma ser rápido, mas teste no seu tier. Recarregar os dados com o índice ativo gera novo re-embedding dos 40 produtos.',
  indexesTitle: 'Índices',
  drop: 'Remover',
  create: 'Criar',
  notCreated: 'não criado',


  runTitle: 'Roteiro da demo (15 min)',
  runLead: 'Falas, ações e detalhes técnicos de cada etapa. Nada disto aparece para o cliente.',
  expandAll: 'Expandir tudo',
  collapseAll: 'Recolher tudo',
  print: 'Imprimir roteiro',
  'label.say': 'Fala',
  'label.do': 'Na tela',
  'label.tech': 'Detalhes técnicos',
  'label.ask': 'Perguntas prováveis',
  'label.next': 'Transição',

  queriesTitle: 'Queries que contam a história',
  queries: `
    <p class="muted">As descrições evitam estas palavras de propósito. Confira os resultados antes da reunião.</p>
    <code>algo para manter meu café quente durante a trilha</code>
    <code>something to stay dry in a storm</code>
    <code>regalo para un niño que ama el espacio</code>
    <code>trabalhar remoto de uma cafeteria barulhenta</code>`,
  shortcutsTitle: 'Atalhos da demo',
  shortcuts: `
    <li><kbd>←</kbd> <kbd>→</kbd> navegar entre etapas</li>
    <li><kbd>P</kbd> tela cheia, sem a barra lateral</li>
    <li><code>?lang=en</code> ou <code>?lang=pt</code> na URL, ou o botão PT/EN</li>
    <li>Sem <code>#</code> na URL, a demo abre na capa. <code>#6</code> abre direto a etapa 6</li>`,
  trouble: `
    <tr><td><code>STALE</code></td><td>Disco cheio (M10+ sem auto-scaling) ou backpressure. Libere espaço.</td></tr>
    <tr><td>Índice não aparece</td><td>A coleção precisa existir antes de <code>createSearchIndex</code>. Carregue os dados.</td></tr>
    <tr><td>Erro de filtro</td><td>Campo não declarado como <code>filter</code> no índice.</td></tr>
    <tr><td>M0: limite</td><td>No máximo 3 índices de busca por cluster M0. Esta demo usa exatamente 3.</td></tr>
    <tr><td><code>$rankFusion</code> falha</td><td>Requer MongoDB 8.0+ e os dois índices <code>READY</code>.</td></tr>
    <tr><td>Resultados vazios</td><td>O índice ainda está em <code>BUILDING</code>. Aguarde <code>queryable: true</code>.</td></tr>`,

  noUri: 'configure MONGODB_URI',
  noUriDetail: 'Copie <code>.env.example</code> para <code>.env</code>, preencha <code>MONGODB_URI</code> e reinicie o servidor.',
  connError: 'erro de conexão',
  docs: 'Documentos',
  liveDocs: ({ n }) => `${n} ao vivo`,
  models: 'Modelo autoEmbed',
  done: 'Concluído',
  confirmDrop: ({ name }) => `Remover o índice ${name}?`,
  confirmSeed: 'Apagar os produtos e recarregar os 40 originais?',
  confirmTeardown: 'Remover todos os índices de busca e a coleção products?',
};

const en = {
  theme: 'Light/dark theme',
  crumb: 'Setup · Vector Search',
  eyebrow: 'Presenter only',
  title: 'Demo setup',
  lead: 'This page is not linked from the demo and only opens on the machine running the server.',
  openDemo: 'Open client demo →',

  setupTitle: 'Before the meeting',
  setupSteps: `
    <li>Copy <code>.env.example</code> to <code>.env</code> and fill in <code>MONGODB_URI</code>.</li>
    <li>Allow your IP in Atlas <b>Network Access</b>.</li>
    <li>Run <code>npm start</code>.</li>
    <li>Click <b>Prepare everything</b> and wait for the indexes to reach <code>READY</code>.</li>
    <li>Run the demo queries once to check the results.</li>
    <li>Optional: add <code>VOYAGE_API_KEY</code> to <code>.env</code> to show the manual comparison live.</li>`,
  checklistTitle: 'Checklist',
  'check.configured': '<code>MONGODB_URI</code> set',
  'check.connected': 'Cluster connection',
  'check.version': 'MongoDB 8.0+ (for <code>$rankFusion</code>)',
  'check.data': 'Data loaded',
  'check.auto': 'autoEmbed index ready',
  'check.text': 'Text index ready (hybrid search)',
  'check.voyage': 'Voyage key (optional): without it, step 9 shows code only',
  'check.tier': 'M0, Flex or M10+. On M10+, storage auto-scaling on. Payment method on the org, or within the 200M free tokens per model',

  envTitle: 'Environment',
  prepare: 'Prepare everything',
  seed: 'Reload data',
  clearLive: 'Remove live products',
  clearVectors: 'Clear manual vectors',
  teardown: 'Full teardown',
  prepareNote: 'To show index creation live, drop products_autoembed below: step 5 brings its button back. With 40 documents the build is usually quick, but test it on your tier. Reloading data with the index active re-embeds the 40 products.',
  indexesTitle: 'Indexes',
  drop: 'Drop',
  create: 'Create',
  notCreated: 'not created',


  runTitle: 'Demo script (15 min)',
  runLead: 'Lines, actions and technical details for each step. None of this appears to the customer.',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  print: 'Print script',
  'label.say': 'Say',
  'label.do': 'On screen',
  'label.tech': 'Technical details',
  'label.ask': 'Likely questions',
  'label.next': 'Transition',

  queriesTitle: 'Queries that tell the story',
  queries: `
    <p class="muted">The descriptions avoid these words on purpose. Check the results before the meeting.</p>
    <code>something to keep my coffee hot on the trail</code>
    <code>something to stay dry in a storm</code>
    <code>regalo para un niño que ama el espacio</code>
    <code>working remotely from a noisy coffee shop</code>`,
  shortcutsTitle: 'Demo shortcuts',
  shortcuts: `
    <li><kbd>←</kbd> <kbd>→</kbd> move between steps</li>
    <li><kbd>P</kbd> full screen, no sidebar</li>
    <li><code>?lang=en</code> or <code>?lang=pt</code> in the URL, or the PT/EN button</li>
    <li>With no <code>#</code> in the URL, the demo opens on the cover. <code>#6</code> opens step 6 directly</li>`,
  trouble: `
    <tr><td><code>STALE</code></td><td>Disk full (M10+ without auto-scaling) or backpressure. Free up space.</td></tr>
    <tr><td>Index not showing</td><td>The collection must exist before <code>createSearchIndex</code>. Load the data.</td></tr>
    <tr><td>Filter error</td><td>Field not declared as <code>filter</code> in the index.</td></tr>
    <tr><td>M0 limit</td><td>At most 3 search indexes on an M0 cluster. This demo uses exactly 3.</td></tr>
    <tr><td><code>$rankFusion</code> fails</td><td>Requires MongoDB 8.0+ and both indexes <code>READY</code>.</td></tr>
    <tr><td>Empty results</td><td>The index is still <code>BUILDING</code>. Wait for <code>queryable: true</code>.</td></tr>`,

  noUri: 'set MONGODB_URI',
  noUriDetail: 'Copy <code>.env.example</code> to <code>.env</code>, fill in <code>MONGODB_URI</code> and restart the server.',
  connError: 'connection error',
  docs: 'Documents',
  liveDocs: ({ n }) => `${n} live`,
  models: 'autoEmbed model',
  done: 'Done',
  confirmDrop: ({ name }) => `Drop the ${name} index?`,
  confirmSeed: 'Delete the products and reload the original 40?',
  confirmTeardown: 'Drop every search index and the products collection?',
};

export const dicts = { pt, en };
