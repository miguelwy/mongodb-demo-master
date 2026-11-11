// Code shown on screen. Kept in sync with ../indexes.js, ../pipelines.js and ../service.js.
// Comments and example queries are localized, and field paths follow the page language
// (name.pt or name.en), exactly as the backend runs them.

const COPY = {
  pt: {
    optionsTab: 'Sinônimos',
    connected: 'Conectado! MongoDB',
    bothLangs: '// Os dois idiomas no mesmo documento.',
    analyzer: '// Analyzer customizado: minúsculas, sem acento, sem stop words.',
    twoTypes: '// O mesmo campo indexado como texto e como autocomplete.',
    facetsSort: '// token: facets, filtros exatos e ordenação.',
    synonymsMap: '// Mapeamento de sinônimos: lê a coleção catalog_synonyms.',
    synonymsFirst: '// A coleção de sinônimos precisa existir, com documentos válidos, ANTES do índice.',
    asyncBuild: '// Índices de busca são construídos de forma assíncrona pelo mongot.',
    regexNote: '// Avaliado pelo mongod: sem ranking, sem acento, sem erro de digitação, frase exata.',
    typoTolerant: '// tolera 1 letra trocada, faltando ou sobrando por termo',
    passages: '// trechos com os termos encontrados',
    perKey: '// Uma query por tecla, com debounce curto na aplicação.',
    mustMatch: '// precisa casar; a nota é multiplicada pela avaliação',
    adds: '// soma pontos quando casa',
    narrows: '// restringe, sem alterar a nota',
    facetsOne: '// Resultados, total e contagens em uma única query.',
    sortIndex: '// ordenação feita pelo índice',
    noFuzzy: '// synonyms não pode ser combinado com fuzzy',
    liveSyn: '// Um insert comum. O Atlas Search percebe a mudança e atualiza os sinônimos, sem reindexar.',
    qFulltext: 'garrafa termica',
    qAc: 'garr',
    qRelevance: 'bateria',
    qFacets: 'cadeira',
    qSynonyms: 'laptop',
    synWords: '"cantil", "garrafa"',
    explicitNote: '// explicit: "sneaker" também busca "tênis", mas "tênis" não busca "sneaker"',
    sameDef: '// A mesma definição da aba mongosh, em indexes.js',
  },
  en: {
    optionsTab: 'Synonyms',
    connected: 'Connected! MongoDB',
    bothLangs: '// Both languages in the same document.',
    analyzer: '// Custom analyzer: lowercase, accents folded, no stop words.',
    twoTypes: '// The same field indexed as text and as autocomplete.',
    facetsSort: '// token: facets, exact filters and sorting.',
    synonymsMap: '// Synonym mapping: reads the catalog_synonyms collection.',
    synonymsFirst: '// The synonym collection must exist, with valid documents, BEFORE the index.',
    asyncBuild: '// Search indexes are built asynchronously by mongot.',
    regexNote: '// Evaluated by mongod: no ranking, no typo tolerance, exact phrase only.',
    typoTolerant: '// tolerates 1 swapped, missing or extra letter per term',
    passages: '// passages with the matched terms',
    perKey: '// One query per keystroke, with a short debounce in the app.',
    mustMatch: '// has to match; the score is multiplied by the rating',
    adds: '// adds points when it matches',
    narrows: '// narrows, without changing the score',
    facetsOne: '// Results, total and counts in one query.',
    sortIndex: '// sorting done by the index',
    noFuzzy: '// synonyms cannot be combined with fuzzy',
    liveSyn: '// A plain insert. Atlas Search picks up the change and updates the synonyms, no reindex.',
    qFulltext: 'insulated botle',
    qAc: 'flas',
    qRelevance: 'battery',
    qFacets: 'chair',
    qSynonyms: 'notebook',
    synWords: '"thermos", "flask"',
    explicitNote: '// explicit: "sneaker" also searches "tênis", but "tênis" does not search "sneaker"',
    sameDef: '// The same definition as the mongosh tab, in indexes.js',
  },
};

export function getSnippets(lang) {
  const l = COPY[lang] ? lang : 'pt';
  const c = COPY[l];
  const pyComment = (s) => s.replace(/^\/\/ ?/gm, '# ');

  return {
    connect: {
      'Node.js': { lang: 'javascript', code: `
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, { appName: 'search-demo' });
await client.connect();
const catalog = client.db('mongo_demos').collection('catalog');

const { version } = await client.db().command({ buildInfo: 1 });
console.log('${c.connected}', version);` },
      Python: { lang: 'python', code: `
import os
from pymongo import MongoClient

client = MongoClient(os.environ["MONGODB_URI"], appname="search-demo")
catalog = client["mongo_demos"]["catalog"]

print("${c.connected}", client.server_info()["version"])` },
      mongosh: { lang: 'bash', code: `
mongosh "mongodb+srv://<cluster>.mongodb.net/" --username <user>

use mongo_demos
db.catalog.countDocuments()` },
    },

    document: {
      lang: 'json',
      code: `
{
  "sku": "HK-001",
  "category": "Hiking",
  "brand": "Andes Gear",
  "price": 189.9,
  "rating": 4.8,
  "inStock": true,
  "name": { "pt": "Garrafa térmica Andes 1L", "en": "Andes Insulated Flask 1L" },
  "description": {
    "pt": "Garrafa de aço inox com parede dupla a vácuo...",
    "en": "Double-wall vacuum stainless steel bottle..."
  }
}
${c.bothLangs}`,
    },

    createIndex: {
      mongosh: { lang: 'javascript', code: `
db.catalog.createSearchIndex("catalog_search", {
  ${c.analyzer}
  analyzers: [{
    name: "folded",
    charFilters: [],
    tokenizer: { type: "standard" },
    tokenFilters: [
      { type: "lowercase" },
      { type: "icuFolding" },
      { type: "stopword", tokens: ["a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "com", "para",
                                   "the", "and", "of", "for", "with", "to"] }
    ]
  }],
  mappings: {
    dynamic: false,
    fields: {
      ${c.twoTypes}
      name: { type: "document", fields: {
        pt: [{ type: "string", analyzer: "folded" },
             { type: "autocomplete", tokenization: "edgeGram", minGrams: 2, maxGrams: 15, foldDiacritics: true }],
        en: [{ type: "string", analyzer: "folded" },
             { type: "autocomplete", tokenization: "edgeGram", minGrams: 2, maxGrams: 15, foldDiacritics: true }]
      } },
      description: { type: "document", fields: {
        pt: { type: "string", analyzer: "folded" },
        en: { type: "string", analyzer: "folded" }
      } },
      ${c.facetsSort}
      brand: [{ type: "token" }, { type: "string", analyzer: "folded" }],
      category: { type: "token" },
      price: { type: "number" },
      rating: { type: "number" },
      inStock: { type: "boolean" }
    }
  },
  ${c.synonymsMap}
  synonyms: [{ name: "catalog_synonyms", analyzer: "folded", source: { collection: "catalog_synonyms" } }]
})` },
      'Node.js': { lang: 'javascript', code: `
import { definition } from './indexes.js';   ${c.sameDef}

await catalog.createSearchIndex({ name: 'catalog_search', type: 'search', definition });` },
      Python: { lang: 'python', code: `
from pymongo.operations import SearchIndexModel

definition = {...}   ${pyComment(c.sameDef)}
catalog.create_search_index(
    model=SearchIndexModel(name="catalog_search", type="search", definition=definition)
)` },
      [c.optionsTab]: { lang: 'javascript', code: `
${c.synonymsFirst}
db.catalog_synonyms.insertMany([
  { mappingType: "equivalent", synonyms: ["notebook", "laptop"] },
  { mappingType: "equivalent", synonyms: ["barraca", "tenda"] },
  { mappingType: "equivalent", synonyms: ["tênis", "sapatilha"] },
  { mappingType: "equivalent", synonyms: ["flashlight", "torch"] },
  { mappingType: "equivalent", synonyms: ["sneakers", "trainers"] }
])` },
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
db.catalog.getSearchIndexes("catalog_search")
// [{ name: 'catalog_search', status: 'READY', queryable: true, latestDefinition: {...} }]` },
    },

    fulltext: {
      '$search': { lang: 'javascript', code: `
db.catalog.aggregate([
  {
    $search: {
      index: "catalog_search",
      text: {
        query: "${c.qFulltext}",
        path: ["name.${l}", "description.${l}", "brand"],
        fuzzy: { maxEdits: 1 }          ${c.typoTolerant}
      },
      highlight: { path: ["name.${l}", "description.${l}"] }
    }
  },
  { $limit: 6 },
  { $project: {
      name: "$name.${l}", description: "$description.${l}", price: 1,
      score: { $meta: "searchScore" },
      highlights: { $meta: "searchHighlights" }   ${c.passages}
  } }
])` },
      Python: { lang: 'python', code: `
results = catalog.aggregate([
    {
        "$search": {
            "index": "catalog_search",
            "text": {
                "query": user_query,
                "path": ["name.${l}", "description.${l}", "brand"],
                "fuzzy": {"maxEdits": 1},
            },
            "highlight": {"path": ["name.${l}", "description.${l}"]},
        }
    },
    {"$limit": 6},
    {"$project": {"name": "$name.${l}", "score": {"$meta": "searchScore"},
                  "highlights": {"$meta": "searchHighlights"}}},
])` },
      '$regex': { lang: 'javascript', code: `
${c.regexNote}
db.catalog.find({
  $or: [
    { "name.${l}": { $regex: "${c.qFulltext}", $options: "i" } },
    { "description.${l}": { $regex: "${c.qFulltext}", $options: "i" } }
  ]
}).limit(6)` },
    },

    autocomplete: {
      'Node.js': { lang: 'javascript', code: `
${c.perKey}
async function suggest(prefix) {
  return catalog.aggregate([
    {
      $search: {
        index: 'catalog_search',
        autocomplete: { query: prefix, path: 'name.${l}', fuzzy: { maxEdits: 1, prefixLength: 3 } },
        highlight: { path: 'name.${l}' },
      },
    },
    { $limit: 6 },
    { $project: { name: '$name.${l}', price: 1, highlights: { $meta: 'searchHighlights' } } },
  ]).toArray();
}

await suggest('${c.qAc}');` },
      mongosh: { lang: 'javascript', code: `
db.catalog.aggregate([
  { $search: { index: "catalog_search",
               autocomplete: { query: "${c.qAc}", path: "name.${l}", fuzzy: { maxEdits: 1, prefixLength: 3 } } } },
  { $limit: 6 },
  { $project: { name: "$name.${l}", score: { $meta: "searchScore" } } }
])` },
    },

    relevance: {
      mongosh: { lang: 'javascript', code: `
db.catalog.aggregate([
  {
    $search: {
      index: "catalog_search",
      compound: {
        must: [{                                           ${c.mustMatch}
          text: {
            query: "${c.qRelevance}",
            path: ["name.${l}", "description.${l}", "brand"],
            fuzzy: { maxEdits: 1 },
            score: { function: { multiply: [
              { score: "relevance" },
              { path: { value: "rating", undefined: 1 } }
            ] } }
          }
        }],
        should: [                                          ${c.adds}
          { equals: { path: "inStock", value: true, score: { boost: { value: 2 } } } }
        ],
        filter: [                                          ${c.narrows}
          { range: { path: "price", lte: 1500 } }
        ]
      },
      scoreDetails: true
    }
  },
  { $limit: 6 },
  { $project: { name: "$name.${l}", score: { $meta: "searchScore" },
                scoreDetails: { $meta: "searchScoreDetails" } } }
])` },
    },

    facets: {
      mongosh: { lang: 'javascript', code: `
${c.facetsOne}
db.catalog.aggregate([
  {
    $search: {
      index: "catalog_search",
      facet: {
        operator: {
          compound: {
            must: [{ text: { query: "${c.qFacets}", path: ["name.${l}", "description.${l}", "brand"], fuzzy: { maxEdits: 1 } } }],
            filter: [{ in: { path: "category", value: ["Home Office"] } }]
          }
        },
        facets: {
          category: { type: "string", path: "category" },
          brand: { type: "string", path: "brand", numBuckets: 10 },
          price: { type: "number", path: "price", boundaries: [0, 100, 300, 1000, 3000, 10000] }
        }
      },
      count: { type: "total" },
      sort: { price: 1 }                 ${c.sortIndex}
    }
  },
  { $limit: 8 },
  {
    $facet: {
      docs: [{ $project: { name: "$name.${l}", price: 1, score: { $meta: "searchScore" } } }],
      meta: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }]
    }
  },
  { $set: { meta: { $arrayElemAt: ["$meta", 0] } } }
])
// meta: { count: { total: 3 }, facet: { category: { buckets: [{ _id: "Home Office", count: 3 }] }, ... } }` },
      '$searchMeta': { lang: 'javascript', code: `
db.catalog.aggregate([
  { $searchMeta: { index: "catalog_search",
                   facet: { facets: { category: { type: "string", path: "category" } } } } }
])` },
    },

    synonyms: {
      Query: { lang: 'javascript', code: `
db.catalog.aggregate([
  {
    $search: {
      index: "catalog_search",
      text: {
        query: "${c.qSynonyms}",
        path: ["name.${l}", "description.${l}", "brand"],
        synonyms: "catalog_synonyms"     ${c.noFuzzy}
      }
    }
  },
  { $limit: 6 }
])` },
      insertOne: { lang: 'javascript', code: `
${c.liveSyn}
db.catalog_synonyms.insertOne({ mappingType: "equivalent", synonyms: [${c.synWords}] })

${c.explicitNote}
db.catalog_synonyms.insertOne({ mappingType: "explicit", input: ["sneaker"], synonyms: ["sneaker", "tênis"] })` },
      Python: { lang: 'python', code: `
${pyComment(c.liveSyn)}
db["catalog_synonyms"].insert_one({"mappingType": "equivalent", "synonyms": [${c.synWords}]})` },
    },
  };
}
