// Code shown on screen. Kept in sync with ../service.js and ../pipelines.js.
// Comments and example queries are localized; the code itself is identical.

const COPY = {
  pt: {
    optionsTab: 'Opções',
    connected: 'Conectado! MongoDB',
    noEmbedding: '// Repare: nenhum campo de embedding. Só texto.',
    magic: '// <- a mágica',
    fieldToEmbed: '// campo de texto a vetorizar',
    optional: '// Todos opcionais: se omitidos, o Atlas aplica defaults.',
    defaultsByQuant: '// default depende da quantization',
    asyncBuild: '// Índices de busca são construídos de forma assíncrona pelo mongot.',
    editable: '// GA: definições editáveis. Trocar o modelo re-gera os embeddings em background\n// e as queries continuam usando os embeddings antigos até a troca terminar.',
    plainText: '// texto puro!',
    atlasEmbeds: '// o Atlas gera o embedding da query',
    candidates: '// ~20x o limit',
    preFilter: '// Pré-filtro MQL: roda ANTES da busca ANN. Cada campo precisa estar no índice como "filter".',
    allYouNeed: '// Isso é TUDO que a aplicação precisa fazer:',
    noPipeline: '// Sem chamada de API de embedding, sem fila, sem change stream, sem worker.\n// O índice autoEmbed detecta o insert e gera o vetor de forma assíncrona.',
    newText: 'novo texto...',
    reEmbed: '// Update no campo indexado => re-embedding automático.',
    diy1: '// 1) Em CADA insert/update você precisa chamar o modelo...',
    retry: '/* retry com backoff... */',
    inDoc: '// 1024 floats dentro do documento',
    diy2: "// 2) ...e manter sincronizado quando alguém altera o texto por fora (change stream / trigger)",
    diy2b: '/* re-embed, tratar falhas, idempotência, backfill... */',
    diy3: '// 3) Backfill de documentos antigos, rate limits, monitoração, troca de modelo = reprocessar tudo.',
    readPath: '// Na leitura: gerar o embedding da query com O MESMO modelo e dimensões',
    rrf: '// $rankFusion (MongoDB 8.0+) combina rankings com Reciprocal Rank Fusion',
    qMain: 'algo para manter meu café quente na trilha',
    qGift: 'presente para quem ama fotografia',
  },
  en: {
    optionsTab: 'Options',
    connected: 'Connected! MongoDB',
    noEmbedding: '// Note: no embedding field. Just text.',
    magic: '// <- the magic',
    fieldToEmbed: '// text field to vectorize',
    optional: '// All optional: Atlas applies defaults when omitted.',
    defaultsByQuant: '// default depends on quantization',
    asyncBuild: '// Search indexes are built asynchronously by mongot.',
    editable: '// GA: editable definitions. Switching models re-generates embeddings in the background\n// while queries keep using the old embeddings until the switch completes.',
    plainText: '// plain text!',
    atlasEmbeds: '// Atlas embeds the query for you',
    candidates: '// ~20x the limit',
    preFilter: '// MQL pre-filter: runs BEFORE the ANN search. Every field must be indexed as "filter".',
    allYouNeed: '// This is ALL the application has to do:',
    noPipeline: '// No embedding API call, no queue, no change stream, no worker.\n// The autoEmbed index picks up the insert and generates the vector asynchronously.',
    newText: 'new text...',
    reEmbed: '// Updating the indexed field => automatic re-embedding.',
    diy1: '// 1) On EVERY insert/update you have to call the model...',
    retry: '/* retry with backoff... */',
    inDoc: '// 1024 floats inside the document',
    diy2: '// 2) ...and keep it in sync when someone changes the text elsewhere (change stream / trigger)',
    diy2b: '/* re-embed, handle failures, idempotency, backfill... */',
    diy3: '// 3) Backfill old documents, rate limits, monitoring, model switch = reprocess everything.',
    readPath: '// At read time: embed the query with THE SAME model and dimensions',
    rrf: '// $rankFusion (MongoDB 8.0+) merges rankings with Reciprocal Rank Fusion',
    qMain: 'something to keep my coffee hot on the trail',
    qGift: 'gift for someone who loves photography',
  },
};

export function getSnippets(lang) {
  const c = COPY[lang] || COPY.pt;
  const pyComment = (s) => s.replace(/^\/\/ ?/gm, '# ');

  return {
    connect: {
      'Node.js': { lang: 'javascript', code: `
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, { appName: 'vector-demo' });
await client.connect();
const products = client.db('mongo_demos').collection('products');

const { version } = await client.db().command({ buildInfo: 1 });
console.log('${c.connected}', version);` },
      Python: { lang: 'python', code: `
import os
from pymongo import MongoClient

client = MongoClient(os.environ["MONGODB_URI"], appname="vector-demo")
products = client["mongo_demos"]["products"]

print("${c.connected}", client.server_info()["version"])` },
      mongosh: { lang: 'bash', code: `
mongosh "mongodb+srv://<cluster>.mongodb.net/" --username <user>

use mongo_demos
db.runCommand({ buildInfo: 1 }).version` },
    },

    document: {
      lang: 'json',
      code: `
{
  "sku": "HK-001",
  "name": "Andes Flask 1L",
  "category": "Hiking",
  "price": 189.9,
  "inStock": true,
  "description": "Double-wall vacuum insulated stainless steel bottle. Holds temperature for up to 24 hours cold or 12 hours hot..."
}
${c.noEmbedding}`,
    },

    createIndex: {
      mongosh: { lang: 'javascript', code: `
db.products.createSearchIndex(
  "products_autoembed",
  "vectorSearch",
  {
    fields: [
      {
        type: "autoEmbed",      ${c.magic}
        modality: "text",
        path: "description",    ${c.fieldToEmbed}
        model: "voyage-4"       // voyage-4-lite | voyage-4 | voyage-4-large | voyage-code-4
      },
      { type: "filter", path: "category" },
      { type: "filter", path: "price" },
      { type: "filter", path: "inStock" }
    ]
  }
)` },
      'Node.js': { lang: 'javascript', code: `
await products.createSearchIndex({
  name: 'products_autoembed',
  type: 'vectorSearch',
  definition: {
    fields: [
      { type: 'autoEmbed', modality: 'text', path: 'description', model: 'voyage-4' },
      { type: 'filter', path: 'category' },
      { type: 'filter', path: 'price' },
      { type: 'filter', path: 'inStock' },
    ],
  },
});` },
      Python: { lang: 'python', code: `
from pymongo.operations import SearchIndexModel

products.create_search_index(
    model=SearchIndexModel(
        name="products_autoembed",
        type="vectorSearch",
        definition={
            "fields": [
                {"type": "autoEmbed", "modality": "text", "path": "description", "model": "voyage-4"},
                {"type": "filter", "path": "category"},
                {"type": "filter", "path": "price"},
                {"type": "filter", "path": "inStock"},
            ]
        },
    )
)` },
      [c.optionsTab]: { lang: 'javascript', code: `
${c.optional}
{
  type: "autoEmbed",
  modality: "text",
  path: "description",
  model: "voyage-4",
  numDimensions: 1024,          // 256 | 512 | 1024 (default) | 2048
  quantization: "scalar",       // float | scalar (default) | binary | binaryNoRescore
  similarity: "cosine",         ${c.defaultsByQuant}
  indexingMethod: "hnsw"        // hnsw | flat
}` },
    },

    waitIndex: {
      'Node.js': { lang: 'javascript', code: `
${c.asyncBuild}
async function waitUntilQueryable(coll, name) {
  while (true) {
    const [idx] = await coll.listSearchIndexes(name).toArray();
    console.log(idx?.status);               // PENDING -> BUILDING -> READY
    if (idx?.queryable) return idx;
    await new Promise((r) => setTimeout(r, 3000));
  }
}` },
      mongosh: { lang: 'javascript', code: `
db.products.getSearchIndexes("products_autoembed")
// [{ name: 'products_autoembed', status: 'READY', queryable: true, latestDefinition: {...} }]` },
    },

    changeModel: {
      'Node.js': { lang: 'javascript', code: `
${c.editable}
await products.updateSearchIndex('products_autoembed', {
  fields: [
    { type: 'autoEmbed', modality: 'text', path: 'description', model: 'voyage-4-large' },
    { type: 'filter', path: 'category' },
    { type: 'filter', path: 'price' },
    { type: 'filter', path: 'inStock' },
  ],
});` },
      mongosh: { lang: 'javascript', code: `
db.products.updateSearchIndex("products_autoembed", {
  fields: [
    { type: "autoEmbed", modality: "text", path: "description", model: "voyage-4-large" },
    { type: "filter", path: "category" },
    { type: "filter", path: "price" },
    { type: "filter", path: "inStock" }
  ]
})` },
    },

    query: {
      mongosh: { lang: 'javascript', code: `
db.products.aggregate([
  {
    $vectorSearch: {
      index: "products_autoembed",
      path: "description",
      query: { text: "${c.qMain}" },  ${c.plainText}
      numCandidates: 100,
      limit: 5
    }
  },
  { $project: { name: 1, description: 1, score: { $meta: "vectorSearchScore" } } }
])` },
      'Node.js': { lang: 'javascript', code: `
const results = await products.aggregate([
  {
    $vectorSearch: {
      index: 'products_autoembed',
      path: 'description',
      query: { text: userQuery },   ${c.atlasEmbeds}
      numCandidates: 100,           ${c.candidates}
      limit: 5,
    },
  },
  { $project: { name: 1, description: 1, score: { $meta: 'vectorSearchScore' } } },
]).toArray();` },
      Python: { lang: 'python', code: `
results = products.aggregate([
    {
        "$vectorSearch": {
            "index": "products_autoembed",
            "path": "description",
            "query": {"text": user_query},
            "numCandidates": 100,
            "limit": 5,
        }
    },
    {"$project": {"name": 1, "description": 1, "score": {"$meta": "vectorSearchScore"}}},
])` },
    },

    filters: {
      'Node.js': { lang: 'javascript', code: `
{
  $vectorSearch: {
    index: 'products_autoembed',
    path: 'description',
    query: { text: '${c.qGift}' },
    numCandidates: 100,
    limit: 5,
    ${c.preFilter}
    filter: {
      $and: [
        { category: { $in: ['Photography', 'Electronics'] } },
        { price: { $lte: 1500 } },
        { inStock: true },
      ],
    },
  },
}` },
      Python: { lang: 'python', code: `
{
    "$vectorSearch": {
        "index": "products_autoembed",
        "path": "description",
        "query": {"text": "${c.qGift}"},
        "numCandidates": 100,
        "limit": 5,
        ${pyComment(c.preFilter)}
        "filter": {"$and": [
            {"category": {"$in": ["Photography", "Electronics"]}},
            {"price": {"$lte": 1500}},
            {"inStock": True},
        ]},
    }
}` },
    },

    sync: {
      'Node.js': { lang: 'javascript', code: `
${c.allYouNeed}
await products.insertOne({
  name: 'Brew-to-Go',
  description: 'Hand-powered portable espresso maker...',
  category: 'Camping',
  price: 349,
  inStock: true,
});
${c.noPipeline}

await products.updateOne({ _id }, { $set: { description: '${c.newText}' } });
${c.reEmbed}` },
    },

    diy: {
      'Write path (DIY)': { lang: 'javascript', code: `
${c.diy1}
async function saveProduct(doc) {
  const res = await fetch('https://ai.mongodb.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: \`Bearer \${process.env.VOYAGE_API_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: [doc.description], model: 'voyage-4', input_type: 'document' }),
  });
  if (res.status === 429) { ${c.retry} }
  const { data } = await res.json();
  doc.descriptionEmbedding = data[0].embedding;   ${c.inDoc}
  return products.insertOne(doc);
}

${c.diy2}
products.watch([{ $match: { 'updateDescription.updatedFields.description': { $exists: true } } }])
  .on('change', async (ev) => { ${c.diy2b} });

${c.diy3}` },
      'Read path (DIY)': { lang: 'javascript', code: `
${c.readPath}
const { data } = await voyage.embed({ input: [userQuery], model: 'voyage-4', input_type: 'query' });

await products.aggregate([
  { $vectorSearch: {
      index: 'products_vector_manual',
      path: 'descriptionEmbedding',
      queryVector: data[0].embedding,
      numCandidates: 100,
      limit: 5 } },
]);` },
      'Index (DIY)': { lang: 'javascript', code: `
db.products.createSearchIndex("products_vector_manual", "vectorSearch", {
  fields: [
    { type: "vector", path: "descriptionEmbedding", numDimensions: 1024, similarity: "dotProduct" },
    { type: "filter", path: "category" }
  ]
})` },
      autoEmbed: { lang: 'javascript', code: `
// Write path
await products.insertOne(doc);

// Read path
await products.aggregate([
  { $vectorSearch: { index: 'products_autoembed', path: 'description',
                     query: { text: userQuery }, numCandidates: 100, limit: 5 } },
]);` },
    },

    hybrid: {
      mongosh: { lang: 'javascript', code: `
${c.rrf}
db.products.aggregate([
  {
    $rankFusion: {
      input: {
        pipelines: {
          vector: [
            { $vectorSearch: { index: "products_autoembed", path: "description",
                               query: { text: "waterproof jacket for storms" },
                               numCandidates: 200, limit: 10 } }
          ],
          keyword: [
            { $search: { index: "products_text",
                         text: { query: "waterproof jacket for storms", path: ["name", "description"] } } },
            { $limit: 10 }
          ]
        }
      },
      combination: { weights: { vector: 0.7, keyword: 0.3 } },
      scoreDetails: true
    }
  },
  { $limit: 5 },
  { $project: { name: 1, score: { $meta: "score" }, scoreDetails: { $meta: "scoreDetails" } } }
])` },
      'Text index': { lang: 'javascript', code: `
db.products.createSearchIndex("products_text", {
  mappings: {
    dynamic: false,
    fields: {
      name: { type: "string" },
      description: { type: "string" },
      category: { type: "token" },
      price: { type: "number" },
      inStock: { type: "boolean" }
    }
  }
})` },
    },
  };
}
