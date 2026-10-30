// UI copy for the Vector Search demo. Keys are used by data-i18n attributes in
// index.html and by t() in app.js. Values may be HTML.

const pt = {
  'cover.lead': 'Busca semântica sem construir um pipeline de embeddings',
  'cover.start': 'Começar →',
  present: '⛶ Tela cheia',
  presentTitle: 'Tela cheia (P)',
  'conn.offline': 'offline',
  'eyebrow.concept': 'Conceito',
  'eyebrow.practice': 'Na prática',
  'eyebrow.summary': 'Resumo',
  'step.intro': 'O problema',
  'step.concepts': 'O que são embeddings',
  'step.how': 'Como o Atlas resolve',
  'step.data': 'Os dados',
  'step.index': 'Criar o índice',
  'step.search': 'Busca semântica',
  'step.filters': 'Pré-filtros',
  'step.sync': 'Sincronização ao vivo',
  'step.manual': 'Manual vs automático',
  'step.hybrid': 'Busca híbrida',
  'step.summary': 'Resumo',

  'intro.title': 'As pessoas buscam por intenção, não por palavras exatas',
  'intro.lead': 'Quem procura um produto descreve o que precisa. O catálogo descreve o que o produto é. Essas duas frases raramente usam as mesmas palavras.',
  'intro.query': '"algo para manter meu café quente durante a trilha"',
  'intro.keywordTitle': 'Busca por palavra-chave',
  'intro.keywordBody': 'Compara os termos da busca com os termos do documento. A garrafa térmica do catálogo fala em "vacuum insulated" e "holds temperature", sem as palavras café, quente ou trilha.',
  'intro.keywordResult': 'Nenhum termo relevante em comum',
  'intro.semanticTitle': 'Busca semântica',
  'intro.semanticBody': 'Compara o significado. A frase e a descrição tratam da mesma ideia, mesmo em idiomas diferentes, e por isso ficam próximas.',
  'intro.semanticResult': 'Encontra pelo significado',
  'intro.agendaTitle': 'O que vamos ver',
  'intro.agenda': `
    <div class="card"><h3>Conceito</h3><p class="muted">O que são embeddings e como o Atlas cuida deles para a sua aplicação.</p></div>
    <div class="card"><h3>Prática</h3><p class="muted">Índice, busca, filtros e sincronização em um cluster real, com o código de cada passo.</p></div>
    <div class="card"><h3>Comparação</h3><p class="muted">A abordagem manual lado a lado e a busca híbrida com palavra-chave.</p></div>`,

  'concepts.title': 'Embeddings transformam significado em números',
  'concepts.lead': 'Um modelo de embedding lê um texto e devolve um vetor: uma lista de números que representa o significado desse texto. Textos com significado parecido geram vetores próximos.',
  'concepts.embeddingTitle': 'Do texto ao vetor',
  'concepts.sample': 'Garrafa térmica de aço',
  'concepts.sampleSub': 'texto do documento ou da busca',
  'concepts.model': 'Modelo',
  'concepts.vectorSub': '1024 números',
  'concepts.spaceTitle': 'Proximidade é semelhança de significado',
  'concepts.c1': 'café e bebidas quentes',
  'concepts.c2': 'acampamento',
  'concepts.c3': 'trabalho remoto',
  'concepts.queryPoint': 'sua busca',
  'concepts.spaceNote': 'Ilustração em 2 dimensões. Os vetores reais têm 1024 dimensões.',
  'concepts.termsTitle': 'Três termos que aparecem daqui em diante',
  'concepts.terms': `
    <div class="card"><h3>Similaridade</h3><p class="muted">A medida de proximidade entre dois vetores. Aparece no resultado como score. Cosine é a mais comum.</p></div>
    <div class="card"><h3>ANN</h3><p class="muted">Approximate Nearest Neighbor. Um grafo HNSW encontra os vizinhos mais próximos sem comparar a busca com todos os documentos.</p></div>
    <div class="card"><h3>ENN</h3><p class="muted">Exact Nearest Neighbor. Compara com todos os documentos. Serve para coleções pequenas ou como referência de qualidade do ANN.</p></div>`,

  'how.title': 'Com autoEmbed, o Atlas cuida dos vetores',
  'how.lead': 'Você declara o campo de texto e o modelo no índice. O Atlas gera os vetores com modelos Voyage AI ao indexar e ao consultar, armazena esses vetores e os mantém sincronizados. A aplicação grava texto e consulta com texto.',
  'how.changeTitle': 'O que sai da sua aplicação',
  'how.diyTitle': 'Embeddings feitos pela aplicação',
  'how.diyList': `<li>Chamar a API de embedding em cada insert e update</li>
    <li>Guardar 1024 floats dentro de cada documento</li>
    <li>Change streams ou triggers para manter os vetores sincronizados</li>
    <li>Retries, rate limits, backfill e gestão de chaves</li>
    <li>Na consulta, gerar o embedding com o mesmo modelo e as mesmas dimensões</li>
    <li>Trocar de modelo exige reprocessar a base inteira</li>`,
  'how.autoTitle': 'Com <code>autoEmbed</code>',
  'how.autoList': `<li>Um índice declara o campo e o modelo</li>
    <li>Insert e update normais, a sincronização é automática</li>
    <li><code>query: { text }</code> no <code>$vectorSearch</code></li>
    <li>Vetores ficam numa coleção interna gerenciada, fora do seu schema</li>
    <li>Trocar de modelo é editar o índice; o re-embedding roda em background</li>`,

  's2.title': 'Um catálogo de produtos comum, só com texto',
  's2.lead': 'Esta coleção está em um cluster Atlas real. São 40 produtos com descrições em inglês, português e espanhol. Nenhum documento tem campo de vetor.',
  's5.point': '<p>Com os vetores no banco operacional, o filtro de estoque usa o mesmo dado do checkout. Não existe um segundo sistema que possa ficar desatualizado.</p>',
  's6.tip': '<p>O tempo até ficar pesquisável depende do tier, da carga e dos rate limits do modelo. Sob contenção de recursos, o Atlas aplica <b>backpressure automático</b>: o embedding desacelera para proteger o cluster.</p>',
  's7.tip': '<p>Com o mesmo modelo, os rankings tendem a coincidir. A diferença está no que precisa existir em volta da busca: chave de API, chamada extra na consulta, sincronização e documentos maiores.</p>',
  's8.tip': '<p>Palavra-chave é mais forte em termos exatos, como uma marca ou um código de produto. Semântica é mais forte em intenção. A busca híbrida atende os dois tipos de consulta com um único pipeline.</p>',
  's9.title': 'O que vimos e perguntas frequentes',
  's9.faqTitle': 'Perguntas frequentes',
  's9.recapTitle': 'O que vimos',
  's9.recap': `<li>Um índice <code>autoEmbed</code> substitui o pipeline de embeddings</li>
    <li>Busca em linguagem natural, entre idiomas, com <code>query.text</code></li>
    <li>Filtros de negócio na mesma query, sobre o dado operacional</li>
    <li>Inserts e updates viram pesquisáveis sem código adicional</li>
    <li>Busca híbrida com <code>$rankFusion</code>, base para RAG e agentes</li>`,
  'data.empty': 'Nenhum produto na coleção.',
  // chrome
  theme: 'Tema claro/escuro',
  prev: '← Anterior',
  next: 'Próximo →',
  code: 'Código',


  // 0 overview
  'diag.app': 'Aplicação',
  'diag.appSub': 'driver MongoDB',
  'diag.cluster': 'Cluster Atlas',
  'diag.clusterSub': 'mongod · coleção products',
  'diag.vsSub': 'mongot · índice autoEmbed',
  'diag.voyageSub': 'voyage-4 · gerenciado',
  'diag.sync': 'sync automático',
  'diag.vector': 'vetor 1024d',
  'diag.store': 'grava em coleção interna',
  'diag.ann': 'pré-filtro + ANN (HNSW)',

  // 1 connect

  // 2 data
  's2.docs': 'documentos',
  's2.collection': 'Coleção <code>products</code>',
  's2.thead': '<tr><th>SKU</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Descrição</th></tr>',

  // 3 index
  's3.title': 'Um índice faz o trabalho do pipeline inteiro',
  's3.lead': 'O campo do tipo <code>autoEmbed</code> diz qual campo de texto vetorizar e com qual modelo. Os campos <code>filter</code> permitem pré-filtrar por categoria, preço e estoque.',
  's3.live': 'Ao vivo no cluster',
  's3.create': '＋ Criar índice autoEmbed',
  's3.modelTitle': 'Trocar o modelo <span class="tag">GA · definição editável</span>',
  apply: 'Aplicar',
  's3.modelNote': 'O re-embedding roda em background. Enquanto isso, as queries continuam respondendo com os embeddings anteriores.',
  's3.wait': 'Aguardar o índice ficar pronto',
  's3.which': 'Qual modelo escolher?',
  's3.modelTable': `<thead><tr><th>Modelo</th><th>Quando usar</th></tr></thead><tbody>
    <tr><td><code>voyage-4-lite</code></td><td>Alto volume, foco em latência</td></tr>
    <tr><td><code>voyage-4</code> <span class="tag">recomendado</span></td><td>Uso geral, multilíngue, bom equilíbrio</td></tr>
    <tr><td><code>voyage-4-large</code></td><td>Máxima precisão, semântica complexa</td></tr>
    <tr><td><code>voyage-code-4</code></td><td>Código e documentação técnica (somente Atlas)</td></tr></tbody>`,
  's3.warn': '<p>Em clusters dedicados (M10+), o <b>storage auto-scaling</b> é obrigatório. Se o disco encher, a geração de embeddings pausa, o índice fica <code>STALE</code> e volta sozinho quando houver espaço.</p>',
  's3.tip': '<p>Os vetores não entram no seu documento. Ficam numa coleção interna gerenciada, no mesmo cluster, uma por índice. O schema e os documentos da aplicação não mudam, e o app não trafega vetores. O espaço em disco ocupado pelos vetores continua no cluster: inclua isso no sizing.</p>',

  // 4 search
  's4.title': 'Pergunte em linguagem natural, em qualquer idioma',
  's4.lead': 'A query vai como texto em <code>query.text</code>. O Atlas gera o embedding da consulta com o modelo do índice e roda a busca ANN.',
  's4.tip1': '<p><b>numCandidates</b>: use pelo menos 20× o <code>limit</code>. Mais candidatos melhora o recall e custa um pouco de latência. Ligue o <b>ENN (exact)</b> para ter o resultado de referência e comparar com o ANN. Em coleções pequenas, o ENN costuma ser rápido o bastante.</p>',
  's4.tip2': '<p><b>Modelo da query ≠ modelo do índice</b>: todos os modelos da família <code>voyage-4</code> são compatíveis entre si. Dá para indexar com <code>voyage-4-large</code> e consultar com <code>voyage-4-lite</code>, que é mais rápido. Teste no seletor "modelo da query".</p>',

  // 5 filters
  's5.title': 'Semântica + regras de negócio na mesma query',
  's5.lead': 'O <code>filter</code> do <code>$vectorSearch</code> aceita MQL e é aplicado <em>antes</em> da busca vetorial. Os resultados respeitam estoque, faixa de preço e categoria sem pós-processamento.',
  's5.warn': '<p>Todo campo usado no <code>filter</code> precisa estar declarado no índice como <code>{ type: "filter", path }</code>. Operadores suportados: <code>$eq $ne $gt $gte $lt $lte $in $nin $exists $and $or $not $nor</code>.</p>',

  // 6 sync
  's6.title': 'Grave um documento e veja quando ele vira pesquisável',
  's6.lead': 'Um <code>insertOne</code> normal. Medimos o tempo até o novo produto aparecer numa busca semântica.',
  's6.insert': '1. Inserir produto novo',
  'f.name': 'Nome',
  'f.desc': 'Descrição (campo vetorizado)',
  'f.category': 'Categoria',
  'f.price': 'Preço',
  'f.probe': 'Busca usada para verificar',
  's6.insertBtn': '⚡ insertOne + medir',
  's6.waiting': 'aguardando…',
  's6.edit': '2. Atualizar um texto existente → re-embedding automático',
  'f.product': 'Produto',
  'f.newDesc': 'Nova descrição',
  's6.editBtn': '✎ updateOne + medir',
  's6.editNote': 'Escolha qualquer produto. A descrição nova muda o significado dele por completo.',
  's6.appCode': 'O código da aplicação',
  's6.probeDefault': 'fazer café expresso acampando sem tomada',
  's6.editProbeDefault': 'brinquedo para gato',

  // 7 manual
  's7.title': 'A mesma busca, construída do jeito antigo',
  's7.lead': 'Para comparar, geramos os embeddings na aplicação com a API da Voyage, gravamos no documento e criamos um índice <code>vector</code> tradicional.',
  's7.live': 'Ao vivo',
  's7.embed': '① Gerar embeddings na aplicação',
  's7.index': '② Criar índice vector',

  // 8 hybrid
  's8.title': 'Palavra-chave + semântica com <code>$rankFusion</code>',
  's8.lead': 'A busca lexical acerta SKUs, nomes e termos exatos. A semântica acerta intenção. O <code>$rankFusion</code> combina as duas com Reciprocal Rank Fusion e pesos ajustáveis.',
  's8.textIndex': '＋ Criar índice Atlas Search (products_text)',

  // 9 tips
  's9.faq': `
    <details><summary>Fico preso ao Voyage AI?</summary><p>Não. O tipo <code>vector</code> continua disponível para qualquer modelo (OpenAI, Cohere, modelo próprio). O <code>autoEmbed</code> é a opção gerenciada. Os dois convivem na mesma coleção.</p></details>
    <details><summary>Para onde vai o meu texto?</summary><p>O texto do campo indexado e das queries é enviado aos modelos Voyage AI (MongoDB) para gerar os vetores, que ficam armazenados no seu cluster. Para perguntas de compliance e residência de dados, consulte a documentação oficial e o time de segurança.</p></details>
    <details><summary>E se eu trocar de modelo?</summary><p>Edite a definição do índice. O Atlas re-gera os embeddings em background e as queries continuam funcionando com os antigos até a troca terminar.</p></details>
    <details><summary>Funciona fora do Atlas?</summary><p>Funciona em deployments self-managed com <code>mongot</code> (Community 8.2+, inclusive via Kubernetes Operator). Nesse caso, você informa as chaves Voyage na configuração. Verifique o status atual na documentação.</p></details>
    <details><summary>Dá para vetorizar vários campos?</summary><p>Cada campo <code>autoEmbed</code> aponta para um <code>path</code> de texto. Para buscar sobre título e descrição juntos, uma estratégia comum é manter um campo concatenado. O GA também suporta campos aninhados (<code>nestedRoot</code>).</p></details>
    <details><summary>Imagens?</summary><p>A <code>modality</code> atual é <code>text</code>. Para multimodal, gere vetores com um modelo multimodal e use o tipo <code>vector</code>.</p></details>`,
  's9.docs': 'Documentação',

  // dynamic (app.js)
  error: 'Erro',
  'manual.info': ({ embedded, count, badge }) => `${embedded}/${count} documentos com <code>descriptionEmbedding</code> · índice manual: ${badge}`,
  'idx.notCreated': 'não criado',
  'idx.missing': 'Índice products_autoembed ainda não existe.',
  'idx.raw': 'listSearchIndexes(): resposta bruta',
  'toast.idxExists': 'Índice já existe',
  'toast.idxSent': 'createSearchIndex enviado. Acompanhe o build ↓',
  'toast.model': ({ model }) => `updateSearchIndex → ${model}. Re-embedding em background.`,
  'res.empty': 'Nenhum resultado. O índice está READY? Os filtros estão restritivos demais?',
  inStock: 'em estoque',
  outOfStock: 'sem estoque',
  'search.placeholder': 'Descreva o que você procura…',
  'search.btn': 'Buscar',
  'ctl.queryModel': 'modelo da query',
  'ctl.indexDefault': 'padrão do índice',
  'ctl.categories': 'category $in',
  'ctl.maxPrice': 'preço máximo',
  'ctl.noLimit': 'sem limite',
  'ctl.inStock': 'somente em estoque',
  'meta.results': 'resultados',
  'meta.latency': 'latência total',
  'pipeline.title': 'Pipeline executado',
  'compare.btn': 'Comparar',
  'compare.weight': 'peso vetor ↔ keyword',
  'compare.embed': 'embed na app',
  'compare.view': 'ver pipeline',
  'mode.semantic': 'Semântica',
  'mode.hybrid': 'Híbrida',
  'toast.embedded': ({ n, ms }) => `${n} docs vetorizados na aplicação · ${ms} ms`,
  'toast.manualExists': 'Índice manual já existe',
  'toast.manualCreated': 'Índice vector criado',
  'toast.textExists': 'Índice de texto já existe',
  'toast.textCreated': 'Índice Atlas Search criado',
  'sync.waitEmbed': 'aguardando o embedding…',
  'sync.found': ({ rank, score, ms }) => `pesquisável! posição #${rank} · score ${score} · query ${ms} ms`,
  'sync.searchable': 'documento pesquisável ✓',
  'sync.attempt': ({ n }) => `tentativa ${n}: ainda não aparece no top 10…`,
  'sync.timeout': ' (timeout de 90 s: veja o status do índice)',
  'sync.error': ({ msg }) => `erro: ${msg}`,
  'sync.measuring': 'medindo…',
  'sync.inserted': ({ id }) => `insertOne ✓ _id ${id}`,
  'sync.updated': ({ name }) => `updateOne ✓ "${name}" agora tem outra descrição`,

  // example queries
  'q.main': 'algo para manter meu café quente durante a trilha',
  'chips.main': [
    'algo para manter meu café quente durante a trilha',
    'equipamento para dormir no frio da montanha',
    'something to stay dry in a storm',
    'trabalhar remoto de uma cafeteria barulhenta',
    'regalo para un niño que ama el espacio',
    'cozinhar sem óleo',
    'aliviar dor nas costas no home office',
  ],
  'q.filters': 'presente para quem ama fotografia',
  'chips.filters': ['presente para quem ama fotografia', 'gear para trilha na chuva', 'algo para relaxar depois do treino', 'presente para criança curiosa'],
  'q.manual': 'trabalhar remoto de uma cafeteria barulhenta',
  'chips.manual': ['trabalhar remoto de uma cafeteria barulhenta', 'presente nostálgico para casamento', 'proteger os joelhos na descida'],
  'q.hybrid': 'something to stay dry in a storm',
  'chips.hybrid': ['something to stay dry in a storm', 'Andes', 'K65', 'carbon', 'café', 'luz para ler à noite'],
};

const en = {
  'cover.lead': 'Semantic search without building an embedding pipeline',
  'cover.start': 'Start →',
  present: '⛶ Full screen',
  presentTitle: 'Full screen (P)',
  'conn.offline': 'offline',
  'eyebrow.concept': 'Concept',
  'eyebrow.practice': 'In practice',
  'eyebrow.summary': 'Summary',
  'step.intro': 'The problem',
  'step.concepts': 'What embeddings are',
  'step.how': 'How Atlas solves it',
  'step.data': 'The data',
  'step.index': 'Create the index',
  'step.search': 'Semantic search',
  'step.filters': 'Pre-filters',
  'step.sync': 'Live sync',
  'step.manual': 'Manual vs automated',
  'step.hybrid': 'Hybrid search',
  'step.summary': 'Summary',

  'intro.title': 'People search by intent, not by exact words',
  'intro.lead': 'A shopper describes what they need. The catalog describes what the product is. Those two sentences rarely share the same words.',
  'intro.query': '"how do I stop my drink going lukewarm on a hike"',
  'intro.keywordTitle': 'Keyword search',
  'intro.keywordBody': "Matches the search terms against the document terms. The catalog's insulated bottle talks about \"vacuum insulated\" and \"holds temperature\", with no mention of drink, lukewarm or hike.",
  'intro.keywordResult': 'No meaningful terms in common',
  'intro.semanticTitle': 'Semantic search',
  'intro.semanticBody': 'Compares meaning. The sentence and the description are about the same idea, even across languages, so they end up close together.',
  'intro.semanticResult': 'Finds it by meaning',
  'intro.agendaTitle': 'What we will cover',
  'intro.agenda': `
    <div class="card"><h3>Concept</h3><p class="muted">What embeddings are and how Atlas handles them for your application.</p></div>
    <div class="card"><h3>Practice</h3><p class="muted">Index, search, filters and sync on a real cluster, with the code for each step.</p></div>
    <div class="card"><h3>Comparison</h3><p class="muted">The manual approach side by side, and hybrid search with keywords.</p></div>`,

  'concepts.title': 'Embeddings turn meaning into numbers',
  'concepts.lead': 'An embedding model reads text and returns a vector: a list of numbers that represents what the text means. Texts with similar meaning produce vectors that sit close together.',
  'concepts.embeddingTitle': 'From text to vector',
  'concepts.sample': 'Insulated steel bottle',
  'concepts.sampleSub': 'document or query text',
  'concepts.model': 'Model',
  'concepts.vectorSub': '1024 numbers',
  'concepts.spaceTitle': 'Closeness is similarity of meaning',
  'concepts.c1': 'coffee and hot drinks',
  'concepts.c2': 'camping',
  'concepts.c3': 'remote work',
  'concepts.queryPoint': 'your search',
  'concepts.spaceNote': 'Illustration in 2 dimensions. Real vectors have 1024 dimensions.',
  'concepts.termsTitle': 'Three terms you will see from here on',
  'concepts.terms': `
    <div class="card"><h3>Similarity</h3><p class="muted">How close two vectors are. It shows up in results as the score. Cosine is the most common measure.</p></div>
    <div class="card"><h3>ANN</h3><p class="muted">Approximate Nearest Neighbor. An HNSW graph finds the closest neighbors without comparing the query against every document.</p></div>
    <div class="card"><h3>ENN</h3><p class="muted">Exact Nearest Neighbor. Compares against every document. Useful for small collections or as a quality baseline for ANN.</p></div>`,

  'how.title': 'With autoEmbed, Atlas handles the vectors',
  'how.lead': 'You declare the text field and the model in the index. Atlas generates vectors with Voyage AI models at index time and at query time, stores them and keeps them in sync. Your application writes text and queries with text.',
  'how.changeTitle': 'What leaves your application',
  'how.diyTitle': 'Embeddings built by the application',
  'how.diyList': `<li>Call the embedding API on every insert and update</li>
    <li>Store 1024 floats inside every document</li>
    <li>Change streams or triggers to keep vectors in sync</li>
    <li>Retries, rate limits, backfills and key management</li>
    <li>At query time, embed with the same model and dimensions</li>
    <li>Switching models means reprocessing the whole dataset</li>`,
  'how.autoTitle': 'With <code>autoEmbed</code>',
  'how.autoList': `<li>One index declares the field and the model</li>
    <li>Plain inserts and updates, sync is automatic</li>
    <li><code>query: { text }</code> in <code>$vectorSearch</code></li>
    <li>Vectors live in a managed internal collection, outside your schema</li>
    <li>Switching models is an index edit; re-embedding runs in the background</li>`,

  's2.title': 'An ordinary product catalog, text only',
  's2.lead': 'This collection lives on a real Atlas cluster. It holds 40 products with descriptions in English, Portuguese and Spanish. No document has a vector field.',
  's5.point': '<p>With vectors in the operational database, the stock filter reads the same data as checkout. There is no second system that can drift out of date.</p>',
  's6.tip': '<p>Time to searchable depends on the tier, load and model rate limits. Under resource contention, Atlas applies <b>automatic backpressure</b>: embedding slows down to protect the cluster.</p>',
  's7.tip': '<p>With the same model, rankings tend to match. The difference is what has to exist around the search: an API key, an extra call at query time, sync code and bigger documents.</p>',
  's8.tip': '<p>Keyword is stronger on exact terms, such as a brand or a product code. Semantic is stronger on intent. Hybrid search handles both kinds of query in one pipeline.</p>',
  's9.title': 'What we saw, and common questions',
  's9.faqTitle': 'Common questions',
  's9.recapTitle': 'What we saw',
  's9.recap': `<li>One <code>autoEmbed</code> index replaces the embedding pipeline</li>
    <li>Natural-language, cross-language search with <code>query.text</code></li>
    <li>Business filters in the same query, on operational data</li>
    <li>Inserts and updates become searchable with no extra code</li>
    <li>Hybrid search with <code>$rankFusion</code>, the foundation for RAG and agents</li>`,
  'data.empty': 'No products in the collection.',
  theme: 'Light/dark theme',
  prev: '← Back',
  next: 'Next →',
  code: 'Code',


  'diag.app': 'Application',
  'diag.appSub': 'MongoDB driver',
  'diag.cluster': 'Atlas cluster',
  'diag.clusterSub': 'mongod · products collection',
  'diag.vsSub': 'mongot · autoEmbed index',
  'diag.voyageSub': 'voyage-4 · managed',
  'diag.sync': 'automatic sync',
  'diag.vector': '1024d vector',
  'diag.store': 'stored in internal collection',
  'diag.ann': 'pre-filter + ANN (HNSW)',


  's2.docs': 'documents',
  's2.collection': '<code>products</code> collection',
  's2.thead': '<tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Description</th></tr>',

  's3.title': 'One index does the whole pipeline’s job',
  's3.lead': 'The <code>autoEmbed</code> field says which text field to vectorize and with which model. The <code>filter</code> fields enable pre-filtering by category, price and stock.',
  's3.live': 'Live on the cluster',
  's3.create': '＋ Create autoEmbed index',
  's3.modelTitle': 'Switch models <span class="tag">GA · editable definition</span>',
  apply: 'Apply',
  's3.modelNote': 'Re-embedding runs in the background. Meanwhile, queries keep being served from the previous embeddings.',
  's3.wait': 'Wait for the index to be ready',
  's3.which': 'Which model?',
  's3.modelTable': `<thead><tr><th>Model</th><th>When to use</th></tr></thead><tbody>
    <tr><td><code>voyage-4-lite</code></td><td>High volume, latency first</td></tr>
    <tr><td><code>voyage-4</code> <span class="tag">recommended</span></td><td>General purpose, multilingual, balanced</td></tr>
    <tr><td><code>voyage-4-large</code></td><td>Maximum accuracy, complex semantics</td></tr>
    <tr><td><code>voyage-code-4</code></td><td>Code and technical docs (Atlas only)</td></tr></tbody>`,
  's3.warn': '<p>On dedicated clusters (M10+), <b>storage auto-scaling</b> is required. If the disk fills up, embedding generation pauses, the index goes <code>STALE</code>, and it resumes on its own once space is freed.</p>',
  's3.tip': '<p>Vectors never enter your documents. They live in a managed internal collection on the same cluster, one per index. Your application schema and documents stay the same, and the app never ships vectors over the wire. The vectors still take disk space on the cluster, so include them in sizing.</p>',

  's4.title': 'Ask in natural language, in any language',
  's4.lead': 'The query goes in as text in <code>query.text</code>. Atlas embeds it with the index model and runs the ANN search.',
  's4.tip1': '<p><b>numCandidates</b>: use at least 20× the <code>limit</code>. More candidates improves recall at a small latency cost. Turn on <b>ENN (exact)</b> to get the ground-truth result and compare it with ANN. On small collections, ENN is usually fast enough.</p>',
  's4.tip2': '<p><b>Query model ≠ index model</b>: every model in the <code>voyage-4</code> family is compatible with the others. You can index with <code>voyage-4-large</code> and query with <code>voyage-4-lite</code>, which is faster. Try the "query model" selector.</p>',

  's5.title': 'Semantics + business rules in one query',
  's5.lead': 'The <code>$vectorSearch</code> <code>filter</code> takes MQL and runs <em>before</em> the vector search. Results respect stock, price range and category with no post-processing.',
  's5.warn': '<p>Every field used in <code>filter</code> must be declared in the index as <code>{ type: "filter", path }</code>. Supported operators: <code>$eq $ne $gt $gte $lt $lte $in $nin $exists $and $or $not $nor</code>.</p>',

  's6.title': 'Write a document and watch it become searchable',
  's6.lead': 'A plain <code>insertOne</code>. We time how long until the new product shows up in a semantic search.',
  's6.insert': '1. Insert a new product',
  'f.name': 'Name',
  'f.desc': 'Description (vectorized field)',
  'f.category': 'Category',
  'f.price': 'Price',
  'f.probe': 'Query used to verify',
  's6.insertBtn': '⚡ insertOne + measure',
  's6.waiting': 'waiting…',
  's6.edit': '2. Update existing text → automatic re-embedding',
  'f.product': 'Product',
  'f.newDesc': 'New description',
  's6.editBtn': '✎ updateOne + measure',
  's6.editNote': 'Pick any product. The new description changes its meaning entirely.',
  's6.appCode': 'The application code',
  's6.probeDefault': 'make espresso while camping with no power outlet',
  's6.editProbeDefault': 'toy for my cat',

  's7.title': 'The same search, built the old way',
  's7.lead': 'For comparison, we generate embeddings in the application with the Voyage API, write them to the document and create a classic <code>vector</code> index.',
  's7.live': 'Live',
  's7.embed': '① Generate embeddings in the app',
  's7.index': '② Create vector index',

  's8.title': 'Keyword + semantic with <code>$rankFusion</code>',
  's8.lead': 'Lexical search nails SKUs, names and exact terms. Semantic search nails intent. <code>$rankFusion</code> combines both with Reciprocal Rank Fusion and tunable weights.',
  's8.textIndex': '＋ Create Atlas Search index (products_text)',

  's9.faq': `
    <details><summary>Am I locked into Voyage AI?</summary><p>No. The <code>vector</code> type is still available for any model (OpenAI, Cohere, your own). <code>autoEmbed</code> is the managed option. Both can live in the same collection.</p></details>
    <details><summary>Where does my text go?</summary><p>Text from the indexed field and from queries is sent to Voyage AI models (MongoDB) to generate vectors, which are stored in your cluster. For compliance and data residency questions, check the official docs and loop in the security team.</p></details>
    <details><summary>What if I switch models?</summary><p>Edit the index definition. Atlas re-generates embeddings in the background and queries keep working on the old ones until the switch completes.</p></details>
    <details><summary>Does it work outside Atlas?</summary><p>It works on self-managed deployments with <code>mongot</code> (Community 8.2+, including via the Kubernetes Operator). There, you supply the Voyage keys in the configuration. Check the docs for the current status.</p></details>
    <details><summary>Can I vectorize several fields?</summary><p>Each <code>autoEmbed</code> field points to one text <code>path</code>. To search title and description together, a common approach is to keep a concatenated field. GA also supports nested fields (<code>nestedRoot</code>).</p></details>
    <details><summary>Images?</summary><p>The current <code>modality</code> is <code>text</code>. For multimodal, generate vectors with a multimodal model and use the <code>vector</code> type.</p></details>`,
  's9.docs': 'Documentation',

  error: 'Error',
  'manual.info': ({ embedded, count, badge }) => `${embedded}/${count} documents with <code>descriptionEmbedding</code> · manual index: ${badge}`,
  'idx.notCreated': 'not created',
  'idx.missing': 'Index products_autoembed does not exist yet.',
  'idx.raw': 'listSearchIndexes(): raw response',
  'toast.idxExists': 'Index already exists',
  'toast.idxSent': 'createSearchIndex sent. Watch the build ↓',
  'toast.model': ({ model }) => `updateSearchIndex → ${model}. Re-embedding in the background.`,
  'res.empty': 'No results. Is the index READY? Are the filters too strict?',
  inStock: 'in stock',
  outOfStock: 'out of stock',
  'search.placeholder': 'Describe what you are looking for…',
  'search.btn': 'Search',
  'ctl.queryModel': 'query model',
  'ctl.indexDefault': 'index default',
  'ctl.categories': 'category $in',
  'ctl.maxPrice': 'max price',
  'ctl.noLimit': 'no limit',
  'ctl.inStock': 'in stock only',
  'meta.results': 'results',
  'meta.latency': 'total latency',
  'pipeline.title': 'Pipeline executed',
  'compare.btn': 'Compare',
  'compare.weight': 'vector ↔ keyword weight',
  'compare.embed': 'embed in app',
  'compare.view': 'view pipeline',
  'mode.semantic': 'Semantic',
  'mode.hybrid': 'Hybrid',
  'toast.embedded': ({ n, ms }) => `${n} docs embedded by the app · ${ms} ms`,
  'toast.manualExists': 'Manual index already exists',
  'toast.manualCreated': 'Vector index created',
  'toast.textExists': 'Text index already exists',
  'toast.textCreated': 'Atlas Search index created',
  'sync.waitEmbed': 'waiting for the embedding…',
  'sync.found': ({ rank, score, ms }) => `searchable! rank #${rank} · score ${score} · query ${ms} ms`,
  'sync.searchable': 'document searchable ✓',
  'sync.attempt': ({ n }) => `attempt ${n}: not in the top 10 yet…`,
  'sync.timeout': ' (90 s timeout: check the index status)',
  'sync.error': ({ msg }) => `error: ${msg}`,
  'sync.measuring': 'measuring…',
  'sync.inserted': ({ id }) => `insertOne ✓ _id ${id}`,
  'sync.updated': ({ name }) => `updateOne ✓ "${name}" now has a different description`,

  'q.main': 'something to keep my coffee hot on the trail',
  'chips.main': [
    'something to keep my coffee hot on the trail',
    'gear for sleeping in freezing mountains',
    'something to stay dry in a storm',
    'working remotely from a noisy coffee shop',
    'presente para criança que ama o espaço',
    'cooking without oil',
    'back pain relief while working from home',
  ],
  'q.filters': 'gift for someone who loves photography',
  'chips.filters': ['gift for someone who loves photography', 'gear for hiking in the rain', 'something to relax after a workout', 'gift for a curious kid'],
  'q.manual': 'working remotely from a noisy coffee shop',
  'chips.manual': ['working remotely from a noisy coffee shop', 'nostalgic wedding gift', 'protect my knees on steep descents'],
  'q.hybrid': 'something to stay dry in a storm',
  'chips.hybrid': ['something to stay dry in a storm', 'Andes', 'K65', 'carbon', 'coffee', 'light for reading at night'],
};

export const dicts = { pt, en };
