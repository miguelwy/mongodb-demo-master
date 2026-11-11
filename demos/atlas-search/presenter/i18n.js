// Copy for the presenter-only page. Steps are numbered as in the client sidebar.

const pt = {
  theme: 'Tema claro/escuro',
  crumb: 'Preparação · Atlas Search',
  eyebrow: 'Somente apresentador',
  title: 'Preparação da demo',
  lead: 'Esta página não tem link na demo e só abre na máquina que roda o servidor.',
  openDemo: 'Abrir demo do cliente →',

  setupTitle: 'Antes da reunião',
  setupSteps: `
    <li>Copie <code>.env.example</code> para <code>.env</code> e preencha <code>MONGODB_URI</code>.</li>
    <li>Libere seu IP em <b>Network Access</b> no Atlas.</li>
    <li>Rode <code>npm start</code>.</li>
    <li>Clique em <b>Preparar tudo</b> e aguarde o índice ficar <code>READY</code>.</li>
    <li>Rode as queries da demo uma vez, nos dois idiomas que for usar.</li>
    <li>Depois de cada apresentação, <b>Remover sinônimos ao vivo</b> deixa a etapa 10 pronta para a próxima.</li>`,
  checklistTitle: 'Checklist',
  'check.configured': '<code>MONGODB_URI</code> configurada',
  'check.connected': 'Conexão com o cluster',
  'check.data': 'Catálogo carregado',
  'check.synonyms': 'Coleção de sinônimos carregada (precisa existir antes do índice)',
  'check.index': 'Índice catalog_search pronto',
  'check.tier': 'M0 aceita 3 índices de busca por cluster. Se a demo de Vector Search também estiver no mesmo M0, remova um índice dela antes',

  envTitle: 'Ambiente',
  prepare: 'Preparar tudo',
  seed: 'Recarregar dados',
  clearSynonyms: 'Remover sinônimos ao vivo',
  teardown: 'Teardown completo',
  prepareNote: 'Preparar tudo carrega o catálogo e os sinônimos e cria o índice. Para mostrar a criação do índice ao vivo, remova catalog_search abaixo: a etapa 5 volta a exibir o botão. Recarregar os dados mantém o índice, que se atualiza sozinho.',
  indexesTitle: 'Índice',
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
    <p class="muted">Os dados foram escritos para estas queries. Confira os resultados antes da reunião.</p>
    <code>garrafa termica</code>
    <code>fone com cancelamneto de ruido</code>
    <code>mochla</code> (autocomplete)
    <code>bateria</code> e <code>lanterna</code> (relevância)
    <code>laptop</code> e <code>tenda</code> (sinônimos)
    <code>cantil</code> (sinônimo ao vivo)`,
  shortcutsTitle: 'Atalhos da demo',
  shortcuts: `
    <li><kbd>←</kbd> <kbd>→</kbd> navegar entre etapas</li>
    <li><kbd>P</kbd> tela cheia, sem a barra lateral</li>
    <li><code>?lang=en</code> ou <code>?lang=pt</code> na URL, ou o botão PT/EN. O idioma também muda os campos buscados</li>
    <li>Sem <code>#</code> na URL, a demo abre na capa. <code>#6</code> abre direto a etapa 6</li>`,
  trouble: `
    <tr><td>Índice <code>FAILED</code></td><td>A coleção <code>catalog_synonyms</code> não existe ou tem documento inválido. Recarregue os dados e recrie o índice.</td></tr>
    <tr><td>M0: limite</td><td>No máximo 3 índices de busca por cluster M0 e 1 mapeamento de sinônimos por índice. Esta demo usa 1 índice e 1 mapeamento.</td></tr>
    <tr><td>Sinônimo ao vivo não aplica</td><td>A atualização é eventual. Confira se a busca de verificação não encontrava nada antes e se as palavras não são stop words.</td></tr>
    <tr><td>Erro com <code>synonyms</code></td><td><code>synonyms</code> e <code>fuzzy</code> não podem ser usados juntos no mesmo <code>text</code>.</td></tr>
    <tr><td>Facet vazio</td><td>O campo precisa ser <code>token</code> (texto) ou <code>number</code> (número) no índice.</td></tr>
    <tr><td>Resultados vazios</td><td>O índice ainda está em <code>BUILDING</code>. Aguarde <code>queryable: true</code>.</td></tr>`,

  noUri: 'configure MONGODB_URI',
  noUriDetail: 'Copie <code>.env.example</code> para <code>.env</code>, preencha <code>MONGODB_URI</code> e reinicie o servidor.',
  connError: 'erro de conexão',
  docs: 'Produtos',
  synonymDocs: 'Sinônimos',
  liveDocs: ({ n }) => `${n} ao vivo`,
  done: 'Concluído',
  confirmDrop: ({ name }) => `Remover o índice ${name}?`,
  confirmSeed: 'Apagar o catálogo e os sinônimos e recarregar os originais?',
  confirmTeardown: 'Remover o índice e as coleções catalog e catalog_synonyms?',
};

const en = {
  theme: 'Light/dark theme',
  crumb: 'Setup · Atlas Search',
  eyebrow: 'Presenter only',
  title: 'Demo setup',
  lead: 'This page is not linked from the demo and only opens on the machine running the server.',
  openDemo: 'Open client demo →',

  setupTitle: 'Before the meeting',
  setupSteps: `
    <li>Copy <code>.env.example</code> to <code>.env</code> and fill in <code>MONGODB_URI</code>.</li>
    <li>Allow your IP in Atlas <b>Network Access</b>.</li>
    <li>Run <code>npm start</code>.</li>
    <li>Click <b>Prepare everything</b> and wait for the index to reach <code>READY</code>.</li>
    <li>Run the demo queries once, in each language you will use.</li>
    <li>After each session, <b>Remove live synonyms</b> resets step 10 for the next one.</li>`,
  checklistTitle: 'Checklist',
  'check.configured': '<code>MONGODB_URI</code> set',
  'check.connected': 'Cluster connection',
  'check.data': 'Catalog loaded',
  'check.synonyms': 'Synonym collection loaded (must exist before the index)',
  'check.index': 'catalog_search index ready',
  'check.tier': 'M0 allows 3 search indexes per cluster. If the Vector Search demo shares the same M0, drop one of its indexes first',

  envTitle: 'Environment',
  prepare: 'Prepare everything',
  seed: 'Reload data',
  clearSynonyms: 'Remove live synonyms',
  teardown: 'Full teardown',
  prepareNote: 'Prepare everything loads the catalog and synonyms and creates the index. To show index creation live, drop catalog_search below: step 5 brings its button back. Reloading data keeps the index, which updates on its own.',
  indexesTitle: 'Index',
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
    <p class="muted">The data was written for these queries. Check the results before the meeting.</p>
    <code>insulated botle</code>
    <code>noise cancelling headphones</code>
    <code>backpak</code> (autocomplete)
    <code>battery</code> and <code>light</code> (relevance)
    <code>notebook</code> and <code>torch</code> (synonyms)
    <code>thermos</code> (live synonym)`,
  shortcutsTitle: 'Demo shortcuts',
  shortcuts: `
    <li><kbd>←</kbd> <kbd>→</kbd> move between steps</li>
    <li><kbd>P</kbd> full screen, no sidebar</li>
    <li><code>?lang=en</code> or <code>?lang=pt</code> in the URL, or the PT/EN button. The language also switches the searched fields</li>
    <li>With no <code>#</code> in the URL, the demo opens on the cover. <code>#6</code> opens step 6 directly</li>`,
  trouble: `
    <tr><td>Index <code>FAILED</code></td><td>The <code>catalog_synonyms</code> collection is missing or has an invalid document. Reload the data and recreate the index.</td></tr>
    <tr><td>M0 limit</td><td>At most 3 search indexes per M0 cluster and 1 synonym mapping per index. This demo uses 1 index and 1 mapping.</td></tr>
    <tr><td>Live synonym not applied</td><td>The update is eventual. Check that the verify query found nothing before, and that the words are not stop words.</td></tr>
    <tr><td>Error with <code>synonyms</code></td><td><code>synonyms</code> and <code>fuzzy</code> cannot be used together in the same <code>text</code>.</td></tr>
    <tr><td>Empty facet</td><td>The field must be <code>token</code> (text) or <code>number</code> (numbers) in the index.</td></tr>
    <tr><td>Empty results</td><td>The index is still <code>BUILDING</code>. Wait for <code>queryable: true</code>.</td></tr>`,

  noUri: 'set MONGODB_URI',
  noUriDetail: 'Copy <code>.env.example</code> to <code>.env</code>, fill in <code>MONGODB_URI</code> and restart the server.',
  connError: 'connection error',
  docs: 'Products',
  synonymDocs: 'Synonyms',
  liveDocs: ({ n }) => `${n} live`,
  done: 'Done',
  confirmDrop: ({ name }) => `Drop the ${name} index?`,
  confirmSeed: 'Delete the catalog and synonyms and reload the originals?',
  confirmTeardown: 'Drop the index and the catalog and catalog_synonyms collections?',
};

export const dicts = { pt, en };
