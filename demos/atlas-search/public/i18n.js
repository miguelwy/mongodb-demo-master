// UI copy for the Atlas Search demo. Keys are used by data-i18n attributes in
// index.html and by t() in app.js. Values may be HTML.

const pt = {
  'cover.lead': 'Busca full-text com relevância, direto no banco que a sua aplicação já usa',
  'cover.start': 'Começar →',
  present: '⛶ Tela cheia',
  presentTitle: 'Tela cheia (P)',
  'conn.offline': 'offline',
  'eyebrow.concept': 'Conceito',
  'eyebrow.practice': 'Na prática',
  'eyebrow.summary': 'Resumo',
  'step.intro': 'O problema',
  'step.concepts': 'Como a busca entende texto',
  'step.how': 'Como o Atlas resolve',
  'step.data': 'Os dados',
  'step.index': 'Criar o índice',
  'step.fulltext': 'Full-text e tolerância a erros',
  'step.autocomplete': 'Autocomplete',
  'step.relevance': 'Relevância sob controle',
  'step.facets': 'Facets e ordenação',
  'step.synonyms': 'Sinônimos ao vivo',
  'step.summary': 'Resumo',

  'intro.title': 'Ninguém digita do jeito que o catálogo foi escrito',
  'intro.lead': 'Quem busca escreve rápido, sem acento, com erro de digitação e com as palavras que usa no dia a dia. E espera os melhores resultados primeiro.',
  'intro.typedTitle': 'O que as pessoas digitam',
  'intro.typed': `<li><code>garrafa termica</code> <span class="muted">sem acento</span></li>
    <li><code>fone com cancelamneto de ruido</code> <span class="muted">com erro de digitação</span></li>
    <li><code>garr</code> <span class="muted">e esperam sugestões enquanto digitam</span></li>
    <li><code>laptop</code> <span class="muted">quando o catálogo diz notebook</span></li>`,
  'intro.regexTitle': 'O que um LIKE ou regex faz',
  'intro.regexCode': 'find({ "name.pt": /garrafa termica/i })',
  'intro.regexBody': 'Compara caracteres. "termica" não é "térmica", a ordem das palavras precisa ser a mesma e não existe nota de relevância: o resultado volta na ordem em que está no disco. Com regex sem âncora, o banco ainda percorre o índice ou a coleção inteira.',
  'intro.regexResult': '0 resultados',
  'intro.agendaTitle': 'O que vamos ver',
  'intro.agenda': `
    <div class="card"><h3>Conceito</h3><p class="muted">Como um motor de busca entende texto e onde ele roda no Atlas.</p></div>
    <div class="card"><h3>Prática</h3><p class="muted">Índice, full-text, autocomplete, relevância, facets e sinônimos em um cluster real, com o código de cada passo.</p></div>
    <div class="card"><h3>Arquitetura</h3><p class="muted">Por que a busca no mesmo cluster elimina um segundo sistema e a sincronização entre eles.</p></div>`,

  'concepts.title': 'Um analyzer transforma texto em termos pesquisáveis',
  'concepts.lead': 'Antes de indexar, o texto passa por um analyzer: ele quebra o texto em palavras e normaliza cada uma. A busca do usuário passa pelo mesmo analyzer. Por isso "TÉRMICA", "térmica" e "termica" viram o mesmo termo.',
  'concepts.analyzerTitle': 'O caminho de um texto até o índice',
  'concepts.stageText': 'TEXTO',
  'concepts.sample': 'Garrafa Térmica de Aço',
  'concepts.t1': 'Garrafa', 'concepts.t2': 'Térmica', 'concepts.t3': 'de', 'concepts.t4': 'Aço',
  'concepts.o1': 'garrafa', 'concepts.o2': 'termica', 'concepts.o4': 'aco',
  'concepts.noteSplit': 'quebra nas palavras',
  'concepts.noteFold': 'minúsculas, sem acento',
  'concepts.noteStop': '"de" é stop word e sai',
  'concepts.noteQuery': 'A busca "garrafa termica" passa pelo mesmo analyzer e gera os mesmos termos.',
  'concepts.invertedTitle': 'O índice invertido',
  'concepts.inverted': `<thead><tr><th>Termo</th><th>Documentos</th></tr></thead><tbody>
    <tr><td><code>garrafa</code></td><td>HK-001</td></tr>
    <tr><td><code>termica</code></td><td>HK-001</td></tr>
    <tr><td><code>cafe</code></td><td>HK-001, KT-029</td></tr>
    <tr><td><code>carbono</code></td><td>HK-003, PH-022</td></tr></tbody>`,
  'concepts.invertedBody': 'Como o índice remissivo de um livro: para cada termo, a lista de documentos onde ele aparece. Buscar vira consultar termos em vez de ler todos os documentos, e o mesmo índice guarda o que é preciso para calcular a relevância.',
  'concepts.termsTitle': 'Três termos que aparecem daqui em diante',
  'concepts.terms': `
    <div class="card"><h3>Analyzer</h3><p class="muted">Tokenizer mais filtros. Existem prontos por idioma, como <code>lucene.portuguese</code>, e você pode montar o seu.</p></div>
    <div class="card"><h3>Score</h3><p class="muted">A nota de relevância de cada resultado. O padrão é BM25: termos raros e repetidos no documento pesam mais.</p></div>
    <div class="card"><h3>Operador</h3><p class="muted">Cada tipo de busca é um operador: <code>text</code>, <code>autocomplete</code>, <code>range</code>, <code>compound</code> e outros.</p></div>`,

  'how.title': 'A busca roda ao lado do banco, no mesmo cluster',
  'how.lead': 'No Atlas, cada nó do cluster tem um processo de busca, o <code>mongot</code>, baseado em Apache Lucene. Ele acompanha as mudanças da coleção e mantém o índice atualizado. A aplicação consulta com um estágio <code>$search</code> no aggregation, com o mesmo driver.',
  'diag.app': 'Aplicação',
  'diag.appSub': 'driver MongoDB',
  'diag.mongodSub': 'coleção catalog',
  'diag.mongotSub': 'Atlas Search · Lucene',
  'diag.sync': 'change stream (automático)',
  'diag.analyze': 'analisa e indexa',
  'diag.ids': '_id + score',
  'diag.fetch': 'busca os documentos',
  'diag.docs': 'documentos ordenados por relevância',
  'how.changeTitle': 'O que deixa de existir',
  'how.diyTitle': 'Motor de busca separado',
  'how.diyList': `<li>Um segundo cluster para operar, dimensionar e atualizar</li>
    <li>Pipeline de sincronização (CDC, filas, reprocessamento)</li>
    <li>Dados de busca atrasados ou divergentes do banco</li>
    <li>Outra linguagem de consulta e outro cliente na aplicação</li>
    <li>Segurança, backup e monitoração duplicados</li>`,
  'how.atlasTitle': 'Com Atlas Search',
  'how.atlasList': `<li>Mesmo cluster, mesmo console, mesma cobrança</li>
    <li>Sincronização automática a partir da coleção</li>
    <li><code>$search</code> é um estágio de aggregation: combine com <code>$lookup</code>, <code>$project</code> e o que precisar</li>
    <li>Mesmo driver, mesma autenticação e mesmo controle de acesso</li>`,

  'data.title': 'Um catálogo comum, em dois idiomas',
  'data.lead': 'Esta coleção está em um cluster Atlas real: 36 produtos com nome e descrição em português e em inglês, no mesmo documento. A demo busca no idioma desta página.',
  'data.docs': 'documentos',
  'data.collection': 'Coleção <code>catalog</code>',
  'data.thead': '<tr><th>SKU</th><th>Nome</th><th>Categoria</th><th>Marca</th><th>Preço</th><th>Descrição</th></tr>',
  'data.empty': 'Nenhum produto na coleção.',

  'index.title': 'Um índice declara como cada campo é buscado',
  'index.lead': 'O mapeamento diz o tipo de cada campo: texto analisado, autocomplete, token para facets e ordenação, número e booleano. O analyzer <code>folded</code> é customizado: minúsculas, sem acento e sem stop words.',
  'index.live': 'Ao vivo no cluster',
  'index.create': '＋ Criar índice catalog_search',
  'index.types': `<thead><tr><th>Tipo</th><th>Campos</th><th>Habilita</th></tr></thead><tbody>
    <tr><td><code>string</code></td><td>name, description, brand</td><td>full-text, highlight, sinônimos</td></tr>
    <tr><td><code>autocomplete</code></td><td>name</td><td>sugestões enquanto digita</td></tr>
    <tr><td><code>token</code></td><td>category, brand</td><td>facets, filtros exatos, ordenação</td></tr>
    <tr><td><code>number</code></td><td>price, rating</td><td>range, facets numéricos, ordenação, score</td></tr>
    <tr><td><code>boolean</code></td><td>inStock</td><td>filtros e boost</td></tr></tbody>`,
  'index.wait': 'Aguardar o índice ficar pronto',
  'index.tipMappings': '<p><b>Mapeamento dinâmico ou estático</b>: com <code>dynamic: true</code>, o Atlas indexa todos os campos com tipos padrão. É ótimo para explorar. Em produção, o estático indexa só o que a busca usa, com o tipo e o analyzer certos, e o índice fica menor.</p>',
  'index.tipAnalyzers': '<p>Um mesmo campo pode ter vários tipos: <code>name.pt</code> é <code>string</code> e <code>autocomplete</code> ao mesmo tempo. Para stemming por idioma, troque o analyzer por <code>lucene.portuguese</code> ou <code>lucene.english</code>, ou use <code>multi</code> para indexar o campo com mais de um analyzer.</p>',

  'fulltext.title': 'Sem acento, fora de ordem e com erro de digitação',
  'fulltext.lead': 'A mesma busca nas duas colunas. À esquerda, um <code>$regex</code> sem diferenciar maiúsculas, como muitas aplicações fazem hoje. À direita, o operador <code>text</code> do Atlas Search, com <code>fuzzy</code> e <code>highlight</code>.',
  'fulltext.tip': '<p><b>fuzzy</b> aceita até <code>maxEdits</code> letras trocadas, faltando ou sobrando por termo. Use 1 na maioria dos casos e combine com <code>prefixLength</code> para manter as primeiras letras fixas. <b>matchCriteria: "all"</b> exige todos os termos. <b>highlight</b> devolve os trechos que deram match, prontos para exibir.</p>',

  'ac.title': 'Sugestões a cada tecla',
  'ac.lead': 'O tipo <code>autocomplete</code> indexa os prefixos de cada palavra (edgeGram). O operador <code>autocomplete</code> responde em milissegundos, ignora acentos e, com <code>fuzzy</code>, tolera erro de digitação.',
  'ac.placeholder': 'Comece a digitar um produto…',
  'ac.none': 'Nenhuma sugestão',
  'ac.keystroke': 'última tecla',
  'ac.tip': '<p>Cada tecla é uma query. A latência na tela inclui a rede entre esta máquina e o cluster. Na aplicação, use um <i>debounce</i> curto e um <code>$limit</code> pequeno. Para sugerir a partir do meio da palavra, existem <code>rightEdgeGram</code> e <code>nGram</code>, que ocupam mais espaço.</p>',

  'rel.title': 'Regras de negócio dentro do ranking',
  'rel.lead': 'O operador <code>compound</code> combina cláusulas: <code>must</code> precisa casar, <code>should</code> soma pontos, <code>filter</code> restringe sem mexer na nota e <code>mustNot</code> exclui. Ligue as regras e veja a ordem mudar.',
  'rel.ratingBoost': 'multiplicar pela avaliação <code>function</code>',
  'rel.stockBoost': 'em estoque sobe <code>should + equals</code>',
  'rel.why': 'por que esta posição? (scoreDetails)',
  'rel.tip': '<p>Comece pela relevância textual e adicione uma regra por vez, medindo com as buscas reais dos usuários. <code>filter</code> não altera o score: use para regras que eliminam, como preço máximo, e <code>should</code> para regras que só priorizam.</p>',

  'facets.title': 'Navegação por facets em uma única query',
  'facets.lead': 'O coletor <code>facet</code> devolve as contagens por categoria, marca e faixa de preço junto com os resultados e o total. Marque um filtro: os números se recalculam com ele.',
  'facets.placeholder': 'Busque ou deixe vazio para ver tudo…',
  'facets.sort': 'Ordenar',
  'facets.category': 'Categoria',
  'facets.brand': 'Marca',
  'facets.price': 'Preço',
  'facets.clear': 'Limpar filtros',
  'facets.tip': '<p>Facets de texto exigem o campo como <code>token</code>, e facets numéricos como <code>number</code>. As contagens vêm do índice. Para só contar, sem documentos, use <code>$searchMeta</code>. A ordenação por <code>sort</code> acontece dentro do índice, sem um <code>$sort</code> no banco.</p>',
  'sort.relevance': 'Relevância',
  'sort.priceAsc': 'Menor preço',
  'sort.priceDesc': 'Maior preço',
  'sort.rating': 'Melhor avaliação',

  'syn.title': 'O vocabulário do cliente, não o do catálogo',
  'syn.lead': 'Sinônimos ficam em uma coleção comum. O índice aponta para ela, e a query ativa o mapeamento com <code>synonyms</code>. Compare a mesma busca com e sem sinônimos.',
  'syn.without': 'Sem sinônimos',
  'syn.with': 'Com sinônimos',
  'syn.liveTitle': 'Adicione um sinônimo e veja quando ele passa a valer',
  'syn.words': 'Palavras equivalentes (separadas por vírgula)',
  'syn.wordsDefault': 'cantil, garrafa',
  'syn.probe': 'Busca usada para verificar',
  'syn.probeDefault': 'cantil',
  'syn.addBtn': '⚡ insertOne + medir',
  'syn.waiting': 'aguardando…',
  'syn.measuring': 'medindo…',
  'syn.applied': 'sinônimo em uso ✓',
  'syn.inserted': ({ words }) => `insertOne ✓ equivalent: ${words}`,
  'syn.waitMap': 'aguardando o Atlas Search aplicar o mapeamento…',
  'syn.attempt': ({ n }) => `tentativa ${n}: a busca ainda não encontra nada…`,
  'syn.found': ({ q, n, name }) => `"${q}" agora encontra ${n} resultado(s): ${name}`,
  'syn.alreadyMatches': ({ q }) => `"${q}" já encontra resultados. Use outra palavra para medir.`,
  'syn.timeout': ' (timeout de 120 s: veja o status do índice)',
  'syn.tip': '<p>Sem reindexar e sem deploy: o time de negócio pode manter a lista de sinônimos como qualquer outro dado. <code>equivalent</code> liga as palavras nos dois sentidos, e <code>explicit</code> expande só a partir de uma entrada. <code>synonyms</code> e <code>fuzzy</code> não podem ser usados no mesmo operador <code>text</code>.</p>',

  'sum.title': 'O que vimos e perguntas frequentes',
  'sum.faqTitle': 'Perguntas frequentes',
  'sum.recapTitle': 'O que vimos',
  'sum.recap': `<li>Um índice com analyzer customizado entende acento e caixa</li>
    <li>Full-text com fuzzy e highlight, comparado com regex</li>
    <li>Autocomplete em milissegundos a cada tecla</li>
    <li>Regras de negócio no ranking com <code>compound</code> e score</li>
    <li>Facets, total e ordenação na mesma query</li>
    <li>Sinônimos como dado, aplicados sem reindexar</li>`,
  'sum.faq': `
    <details><summary>Preciso de outro cluster para a busca?</summary><p>Não. O <code>mongot</code> roda nos nós do próprio cluster. Para cargas grandes de busca, existem <b>Search Nodes</b>: nós dedicados à busca, escalados separadamente do banco.</p></details>
    <details><summary>Quanto tempo até um write aparecer na busca?</summary><p>O índice é atualizado de forma assíncrona a partir do change stream, normalmente em pouco tempo, mas sem garantia transacional. Para ler o próprio write na hora, use uma query normal por <code>_id</code>.</p></details>
    <details><summary>E os outros idiomas?</summary><p>Há analyzers prontos para dezenas de idiomas, inclusive <code>lucene.portuguese</code>, e é possível combinar mais de um no mesmo campo com <code>multi</code>.</p></details>
    <details><summary>Funciona com busca semântica?</summary><p>Sim. O mesmo cluster faz <code>$vectorSearch</code>, e <code>$rankFusion</code> combina os dois rankings em uma busca híbrida. A demo de Vector Search mostra isso.</p></details>
    <details><summary>Dá para buscar em vários tenants?</summary><p>Sim: indexe <code>tenantId</code> como <code>token</code> e aplique um <code>filter</code> em toda query.</p></details>
    <details><summary>Funciona fora do Atlas?</summary><p>O <code>mongot</code> também roda em deployments self-managed com MongoDB Community 8.2+. Confira o status atual na documentação.</p></details>`,
  'sum.docs': 'Documentação',

  // chrome and dynamic text
  theme: 'Tema claro/escuro',
  prev: '← Anterior',
  next: 'Próximo →',
  code: 'Código',
  error: 'Erro',
  'idx.missing': 'Índice catalog_search ainda não existe.',
  'idx.raw': 'listSearchIndexes(): resposta bruta',
  'toast.idxExists': 'Índice já existe',
  'toast.idxSent': 'createSearchIndex enviado. Acompanhe o build ↓',
  'res.empty': 'Nenhum resultado.',
  inStock: 'em estoque',
  outOfStock: 'sem estoque',
  'search.placeholder': 'O que você procura?',
  'search.btn': 'Buscar',
  'compare.btn': 'Comparar',
  'compare.view': 'ver pipeline',
  'pipeline.title': 'Pipeline executado',
  'meta.results': 'resultados',
  'meta.latency': 'latência total',
  'mode.regex': 'Regex',
  'ctl.off': 'desligado',
  'ctl.maxPrice': 'preço máximo (filter)',
  'ctl.noLimit': 'sem limite',
  'cat.Hiking': 'Trilha',
  'cat.Camping': 'Camping',
  'cat.Electronics': 'Eletrônicos',
  'cat.Home Office': 'Home office',
  'cat.Photography': 'Fotografia',
  'cat.Kids': 'Infantil',
  'cat.Kitchen': 'Cozinha',
  'cat.Fitness': 'Fitness',

  // example queries
  'q.fulltext': 'garrafa termica',
  'chips.fulltext': ['garrafa termica', 'mochila impermeavel', 'fone com cancelamneto de ruido', 'cadeira ergonomica', 'moedor de cafe', 'Brasa'],
  'chips.ac': ['garr', 'cadera', 'fon', 'mochla', 'cafe'],
  'q.relevance': 'bateria',
  'chips.relevance': ['bateria', 'lanterna', 'câmera', 'cadeira'],
  'chips.facets': ['cadeira', 'carbono', 'bateria', 'café'],
  'q.synonyms': 'laptop',
  'chips.synonyms': ['laptop', 'tenda', 'sapatilha', 'cantil'],
};

const en = {
  'cover.lead': 'Relevance-ranked full-text search, right in the database your application already uses',
  'cover.start': 'Start →',
  present: '⛶ Full screen',
  presentTitle: 'Full screen (P)',
  'conn.offline': 'offline',
  'eyebrow.concept': 'Concept',
  'eyebrow.practice': 'In practice',
  'eyebrow.summary': 'Summary',
  'step.intro': 'The problem',
  'step.concepts': 'How search understands text',
  'step.how': 'How Atlas solves it',
  'step.data': 'The data',
  'step.index': 'Create the index',
  'step.fulltext': 'Full-text and typo tolerance',
  'step.autocomplete': 'Autocomplete',
  'step.relevance': 'Relevance you control',
  'step.facets': 'Facets and sorting',
  'step.synonyms': 'Live synonyms',
  'step.summary': 'Summary',

  'intro.title': 'Nobody types the way the catalog was written',
  'intro.lead': 'People search fast, with typos, words out of order and their own vocabulary. And they expect the best results first.',
  'intro.typedTitle': 'What people type',
  'intro.typed': `<li><code>insulated botle</code> <span class="muted">with a typo</span></li>
    <li><code>noise cancelling headphones</code> <span class="muted">words in a different order than the catalog</span></li>
    <li><code>flas</code> <span class="muted">and expect suggestions as they type</span></li>
    <li><code>notebook</code> <span class="muted">when the catalog says laptop</span></li>`,
  'intro.regexTitle': 'What a LIKE or regex does',
  'intro.regexCode': 'find({ "name.en": /insulated botle/i })',
  'intro.regexBody': 'It compares characters. "botle" is not "bottle", the words must appear in the same order, and there is no relevance score: results come back in storage order. An unanchored regex still walks the whole index or collection.',
  'intro.regexResult': '0 results',
  'intro.agendaTitle': 'What we will cover',
  'intro.agenda': `
    <div class="card"><h3>Concept</h3><p class="muted">How a search engine understands text and where it runs in Atlas.</p></div>
    <div class="card"><h3>Practice</h3><p class="muted">Index, full-text, autocomplete, relevance, facets and synonyms on a real cluster, with the code for each step.</p></div>
    <div class="card"><h3>Architecture</h3><p class="muted">Why search on the same cluster removes a second system and the sync between them.</p></div>`,

  'concepts.title': 'An analyzer turns text into searchable terms',
  'concepts.lead': 'Before indexing, text goes through an analyzer: it splits the text into words and normalizes each one. The user\'s query goes through the same analyzer. That is why "CAFÉ", "café" and "cafe" become the same term.',
  'concepts.analyzerTitle': 'How text gets into the index',
  'concepts.stageText': 'TEXT',
  'concepts.sample': 'Café Bottle with Lid',
  'concepts.t1': 'Café', 'concepts.t2': 'Bottle', 'concepts.t3': 'with', 'concepts.t4': 'Lid',
  'concepts.o1': 'cafe', 'concepts.o2': 'bottle', 'concepts.o4': 'lid',
  'concepts.noteSplit': 'split into words',
  'concepts.noteFold': 'lowercase, accents folded',
  'concepts.noteStop': '"with" is a stop word, dropped',
  'concepts.noteQuery': 'The query "cafe bottle" goes through the same analyzer and produces the same terms.',
  'concepts.invertedTitle': 'The inverted index',
  'concepts.inverted': `<thead><tr><th>Term</th><th>Documents</th></tr></thead><tbody>
    <tr><td><code>bottle</code></td><td>HK-001</td></tr>
    <tr><td><code>coffee</code></td><td>HK-001, KT-029, KT-030</td></tr>
    <tr><td><code>carbon</code></td><td>HK-003, PH-022</td></tr>
    <tr><td><code>waterproof</code></td><td>HK-002, CP-006, EL-012</td></tr></tbody>`,
  'concepts.invertedBody': 'Like the index at the back of a book: for every term, the list of documents where it appears. Searching becomes a term lookup instead of reading every document, and the same index keeps what is needed to compute relevance.',
  'concepts.termsTitle': 'Three terms you will see from here on',
  'concepts.terms': `
    <div class="card"><h3>Analyzer</h3><p class="muted">A tokenizer plus filters. There are built-in ones per language, such as <code>lucene.english</code>, and you can build your own.</p></div>
    <div class="card"><h3>Score</h3><p class="muted">The relevance of each result. The default is BM25: rare terms, and terms repeated in the document, weigh more.</p></div>
    <div class="card"><h3>Operator</h3><p class="muted">Each kind of search is an operator: <code>text</code>, <code>autocomplete</code>, <code>range</code>, <code>compound</code> and more.</p></div>`,

  'how.title': 'Search runs next to the database, on the same cluster',
  'how.lead': 'In Atlas, every node in the cluster runs a search process, <code>mongot</code>, built on Apache Lucene. It follows the collection changes and keeps the index up to date. The application queries with a <code>$search</code> aggregation stage, through the same driver.',
  'diag.app': 'Application',
  'diag.appSub': 'MongoDB driver',
  'diag.mongodSub': 'catalog collection',
  'diag.mongotSub': 'Atlas Search · Lucene',
  'diag.sync': 'change stream (automatic)',
  'diag.analyze': 'analyzes and indexes',
  'diag.ids': '_id + score',
  'diag.fetch': 'fetches the documents',
  'diag.docs': 'documents ranked by relevance',
  'how.changeTitle': 'What goes away',
  'how.diyTitle': 'A separate search engine',
  'how.diyList': `<li>A second cluster to run, size and upgrade</li>
    <li>A sync pipeline (CDC, queues, reprocessing)</li>
    <li>Search data that lags or drifts from the database</li>
    <li>Another query language and another client in the app</li>
    <li>Security, backup and monitoring, twice</li>`,
  'how.atlasTitle': 'With Atlas Search',
  'how.atlasList': `<li>Same cluster, same console, same bill</li>
    <li>Automatic sync from the collection</li>
    <li><code>$search</code> is an aggregation stage: combine it with <code>$lookup</code>, <code>$project</code> and anything else</li>
    <li>Same driver, same authentication and access control</li>`,

  'data.title': 'An ordinary catalog, in two languages',
  'data.lead': 'This collection lives on a real Atlas cluster: 36 products with name and description in Portuguese and English, in the same document. The demo searches in the language of this page.',
  'data.docs': 'documents',
  'data.collection': '<code>catalog</code> collection',
  'data.thead': '<tr><th>SKU</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Description</th></tr>',
  'data.empty': 'No products in the collection.',

  'index.title': 'One index declares how each field is searched',
  'index.lead': 'The mapping sets each field\'s type: analyzed text, autocomplete, token for facets and sorting, number and boolean. The <code>folded</code> analyzer is custom: lowercase, accents folded, stop words removed.',
  'index.live': 'Live on the cluster',
  'index.create': '＋ Create catalog_search index',
  'index.types': `<thead><tr><th>Type</th><th>Fields</th><th>Enables</th></tr></thead><tbody>
    <tr><td><code>string</code></td><td>name, description, brand</td><td>full-text, highlight, synonyms</td></tr>
    <tr><td><code>autocomplete</code></td><td>name</td><td>search-as-you-type</td></tr>
    <tr><td><code>token</code></td><td>category, brand</td><td>facets, exact filters, sorting</td></tr>
    <tr><td><code>number</code></td><td>price, rating</td><td>range, numeric facets, sorting, scoring</td></tr>
    <tr><td><code>boolean</code></td><td>inStock</td><td>filters and boosts</td></tr></tbody>`,
  'index.wait': 'Wait for the index to be ready',
  'index.tipMappings': '<p><b>Dynamic or static mapping</b>: with <code>dynamic: true</code>, Atlas indexes every field with default types. Great for exploring. In production, a static mapping indexes only what search uses, with the right type and analyzer, and the index stays smaller.</p>',
  'index.tipAnalyzers': '<p>One field can have several types: <code>name.en</code> is both <code>string</code> and <code>autocomplete</code>. For language stemming, switch the analyzer to <code>lucene.english</code> or <code>lucene.portuguese</code>, or use <code>multi</code> to index the field with more than one analyzer.</p>',

  'fulltext.title': 'Typos, any word order, any case',
  'fulltext.lead': 'The same query in both columns. On the left, a case-insensitive <code>$regex</code>, as many applications do today. On the right, the Atlas Search <code>text</code> operator with <code>fuzzy</code> and <code>highlight</code>.',
  'fulltext.tip': '<p><b>fuzzy</b> accepts up to <code>maxEdits</code> swapped, missing or extra letters per term. Use 1 in most cases, and add <code>prefixLength</code> to keep the first letters fixed. <b>matchCriteria: "all"</b> requires every term. <b>highlight</b> returns the matching passages, ready to display.</p>',

  'ac.title': 'Suggestions on every keystroke',
  'ac.lead': 'The <code>autocomplete</code> type indexes the prefixes of each word (edgeGram). The <code>autocomplete</code> operator answers in milliseconds, ignores accents and, with <code>fuzzy</code>, tolerates typos.',
  'ac.placeholder': 'Start typing a product…',
  'ac.none': 'No suggestions',
  'ac.keystroke': 'last keystroke',
  'ac.tip': '<p>Every keystroke is a query. The latency on screen includes the network between this machine and the cluster. In the app, use a short debounce and a small <code>$limit</code>. To suggest from the middle of a word, there are <code>rightEdgeGram</code> and <code>nGram</code>, which take more space.</p>',

  'rel.title': 'Business rules inside the ranking',
  'rel.lead': 'The <code>compound</code> operator combines clauses: <code>must</code> has to match, <code>should</code> adds points, <code>filter</code> narrows without touching the score, and <code>mustNot</code> excludes. Turn the rules on and watch the order change.',
  'rel.ratingBoost': 'multiply by rating <code>function</code>',
  'rel.stockBoost': 'in stock ranks higher <code>should + equals</code>',
  'rel.why': 'why this rank? (scoreDetails)',
  'rel.tip': '<p>Start from text relevance and add one rule at a time, measuring with real user queries. <code>filter</code> does not change the score: use it for rules that exclude, like a max price, and <code>should</code> for rules that only prioritize.</p>',

  'facets.title': 'Faceted navigation in a single query',
  'facets.lead': 'The <code>facet</code> collector returns counts by category, brand and price range together with the results and the total. Tick a filter: the numbers recompute with it.',
  'facets.placeholder': 'Search, or leave empty to see everything…',
  'facets.sort': 'Sort',
  'facets.category': 'Category',
  'facets.brand': 'Brand',
  'facets.price': 'Price',
  'facets.clear': 'Clear filters',
  'facets.tip': '<p>String facets need the field indexed as <code>token</code>, and numeric facets as <code>number</code>. Counts come from the index. To count only, without documents, use <code>$searchMeta</code>. Sorting with <code>sort</code> happens inside the index, with no <code>$sort</code> in the database.</p>',
  'sort.relevance': 'Relevance',
  'sort.priceAsc': 'Lowest price',
  'sort.priceDesc': 'Highest price',
  'sort.rating': 'Top rated',

  'syn.title': 'Your customer\'s vocabulary, not the catalog\'s',
  'syn.lead': 'Synonyms live in a regular collection. The index points to it, and the query turns the mapping on with <code>synonyms</code>. Compare the same query with and without synonyms.',
  'syn.without': 'No synonyms',
  'syn.with': 'With synonyms',
  'syn.liveTitle': 'Add a synonym and see when it takes effect',
  'syn.words': 'Equivalent words (comma separated)',
  'syn.wordsDefault': 'thermos, flask',
  'syn.probe': 'Query used to verify',
  'syn.probeDefault': 'thermos',
  'syn.addBtn': '⚡ insertOne + measure',
  'syn.waiting': 'waiting…',
  'syn.measuring': 'measuring…',
  'syn.applied': 'synonym in use ✓',
  'syn.inserted': ({ words }) => `insertOne ✓ equivalent: ${words}`,
  'syn.waitMap': 'waiting for Atlas Search to apply the mapping…',
  'syn.attempt': ({ n }) => `attempt ${n}: the query still finds nothing…`,
  'syn.found': ({ q, n, name }) => `"${q}" now finds ${n} result(s): ${name}`,
  'syn.alreadyMatches': ({ q }) => `"${q}" already finds results. Pick another word to measure.`,
  'syn.timeout': ' (120 s timeout: check the index status)',
  'syn.tip': '<p>No reindex and no deploy: the business team can maintain the synonym list like any other data. <code>equivalent</code> links words both ways, and <code>explicit</code> expands only from an input term. <code>synonyms</code> and <code>fuzzy</code> cannot be used in the same <code>text</code> operator.</p>',

  'sum.title': 'What we saw, and common questions',
  'sum.faqTitle': 'Common questions',
  'sum.recapTitle': 'What we saw',
  'sum.recap': `<li>One index with a custom analyzer handles accents and case</li>
    <li>Full-text with fuzzy and highlight, next to a regex</li>
    <li>Millisecond autocomplete on every keystroke</li>
    <li>Business rules in the ranking with <code>compound</code> and scoring</li>
    <li>Facets, total and sorting in the same query</li>
    <li>Synonyms as data, applied with no reindex</li>`,
  'sum.faq': `
    <details><summary>Do I need another cluster for search?</summary><p>No. <code>mongot</code> runs on the cluster's own nodes. For heavy search workloads there are <b>Search Nodes</b>: nodes dedicated to search, scaled separately from the database.</p></details>
    <details><summary>How long until a write shows up in search?</summary><p>The index updates asynchronously from the change stream, usually quickly, but with no transactional guarantee. To read your own write right away, use a regular query by <code>_id</code>.</p></details>
    <details><summary>What about other languages?</summary><p>There are built-in analyzers for dozens of languages, including <code>lucene.english</code> and <code>lucene.portuguese</code>, and you can combine more than one on the same field with <code>multi</code>.</p></details>
    <details><summary>Does it work with semantic search?</summary><p>Yes. The same cluster runs <code>$vectorSearch</code>, and <code>$rankFusion</code> merges both rankings into a hybrid search. The Vector Search demo shows this.</p></details>
    <details><summary>Can I search across tenants?</summary><p>Yes: index <code>tenantId</code> as <code>token</code> and apply a <code>filter</code> on every query.</p></details>
    <details><summary>Does it work outside Atlas?</summary><p><code>mongot</code> also runs on self-managed deployments with MongoDB Community 8.2+. Check the docs for the current status.</p></details>`,
  'sum.docs': 'Documentation',

  theme: 'Light/dark theme',
  prev: '← Back',
  next: 'Next →',
  code: 'Code',
  error: 'Error',
  'idx.missing': 'Index catalog_search does not exist yet.',
  'idx.raw': 'listSearchIndexes(): raw response',
  'toast.idxExists': 'Index already exists',
  'toast.idxSent': 'createSearchIndex sent. Watch the build ↓',
  'res.empty': 'No results.',
  inStock: 'in stock',
  outOfStock: 'out of stock',
  'search.placeholder': 'What are you looking for?',
  'search.btn': 'Search',
  'compare.btn': 'Compare',
  'compare.view': 'view pipeline',
  'pipeline.title': 'Pipeline executed',
  'meta.results': 'results',
  'meta.latency': 'total latency',
  'mode.regex': 'Regex',
  'ctl.off': 'off',
  'ctl.maxPrice': 'max price (filter)',
  'ctl.noLimit': 'no limit',
  'cat.Hiking': 'Hiking',
  'cat.Camping': 'Camping',
  'cat.Electronics': 'Electronics',
  'cat.Home Office': 'Home office',
  'cat.Photography': 'Photography',
  'cat.Kids': 'Kids',
  'cat.Kitchen': 'Kitchen',
  'cat.Fitness': 'Fitness',

  'q.fulltext': 'insulated botle',
  'chips.fulltext': ['insulated botle', 'waterprof backpack', 'noise cancelling headphones', 'ergonomic chair', 'coffee grinder', 'Brasa'],
  'chips.ac': ['flas', 'chari', 'head', 'backpak', 'coff'],
  'q.relevance': 'battery',
  'chips.relevance': ['battery', 'light', 'camera', 'chair'],
  'chips.facets': ['chair', 'carbon', 'battery', 'coffee'],
  'q.synonyms': 'notebook',
  'chips.synonyms': ['notebook', 'torch', 'trainers', 'thermos'],
};

export const dicts = { pt, en };
