import { readFile } from 'node:fs/promises';
import { config, maskedHost } from '../../lib/config.js';
import { getDb, isConfigured } from '../../lib/db.js';
import { COLLECTION, INDEX_NAME, LANGS, SYNONYMS_COLLECTION, definition } from './indexes.js';
import { buildPipeline } from './pipelines.js';

const DATA_URL = new URL('./data/catalog.json', import.meta.url);
const SYNONYMS_URL = new URL('./data/synonyms.json', import.meta.url);

const fail = (status, message) => Object.assign(new Error(message), { status });
const catalog = async () => (await getDb()).collection(COLLECTION);
const synonyms = async () => (await getDb()).collection(SYNONYMS_COLLECTION);
const elapsed = (t0) => Math.round(performance.now() - t0);
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

async function listIndexes() {
  try {
    return await (await catalog()).listSearchIndexes().toArray();
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound' || err.code === 26) return [];
    throw err;
  }
}

export async function status() {
  if (!isConfigured()) return { configured: false };
  const db = await getDb();
  const [info, count, synonymCount, liveSynonyms, indexes] = await Promise.all([
    db.command({ buildInfo: 1 }),
    db.collection(COLLECTION).countDocuments(),
    db.collection(SYNONYMS_COLLECTION).countDocuments(),
    db.collection(SYNONYMS_COLLECTION).countDocuments({ live: true }),
    listIndexes(),
  ]);
  return {
    configured: true,
    host: maskedHost(),
    version: info.version,
    db: config.dbName,
    collection: COLLECTION,
    synonymsCollection: SYNONYMS_COLLECTION,
    count,
    synonyms: synonymCount,
    liveSynonyms,
    indexes: indexes.map((i) => ({
      name: i.name,
      type: i.type,
      status: i.status,
      queryable: i.queryable,
      definition: i.latestDefinition,
      statusDetail: i.statusDetail,
    })),
  };
}

// The synonym collection has to exist, with valid documents, before the index is created.
export async function seed() {
  const t0 = performance.now();
  const docs = await readJson(DATA_URL);
  const mappings = await readJson(SYNONYMS_URL);
  const [products, syns] = [await catalog(), await synonyms()];
  // deleteMany (not drop) keeps the search index, which picks up the reload on its own.
  const { deletedCount } = await products.deleteMany({});
  const { insertedCount } = await products.insertMany(docs);
  await syns.deleteMany({});
  const { insertedCount: synonymCount } = await syns.insertMany(mappings);
  return { deleted: deletedCount, inserted: insertedCount, synonyms: synonymCount, ms: elapsed(t0) };
}

export async function prepare() {
  const seeded = await seed();
  const index = await createIndex();
  return { seeded, index };
}

export async function createIndex() {
  const coll = await catalog();
  if ((await coll.estimatedDocumentCount()) === 0) throw fail(409, 'The catalog collection is empty.');
  if ((await listIndexes()).some((i) => i.name === INDEX_NAME)) return { name: INDEX_NAME, exists: true };
  await coll.createSearchIndex({ name: INDEX_NAME, type: 'search', definition });
  return { name: INDEX_NAME, created: true, definition };
}

export async function dropIndex() {
  await (await catalog()).dropSearchIndex(INDEX_NAME);
  return { name: INDEX_NAME, dropped: true };
}

export const getDefinition = () => ({ name: INDEX_NAME, type: 'search', definition });

const clampLimit = (v, fallback) => Math.min(Math.max(Number(v) || fallback, 1), 50);

export async function search(body) {
  const mode = body.mode || 'fulltext';
  const text = String(body.text || '').trim();
  if (!text && mode !== 'facets') throw fail(400, 'Type a query.');
  const p = { ...body, text, lang: LANGS.includes(body.lang) ? body.lang : 'pt', limit: clampLimit(body.limit, 6) };
  const pipeline = buildPipeline(mode, p);
  const t0 = performance.now();
  try {
    const out = await (await catalog()).aggregate(pipeline).toArray();
    const ms = elapsed(t0);
    if (mode !== 'facets') return { mode, pipeline, results: out, ms };
    const [{ docs = [], meta } = {}] = out;
    return { mode, pipeline, results: docs, total: Number(meta?.count?.total ?? 0), facets: normalizeFacets(meta?.facet), ms };
  } catch (err) {
    err.status = 400;
    err.pipeline = pipeline;
    throw err;
  }
}

// Bucket counts come back as Long; plain numbers are easier on the page.
function normalizeFacets(facet = {}) {
  return Object.fromEntries(Object.entries(facet).map(([name, { buckets }]) => [
    name,
    buckets.map((b) => ({ _id: b._id, count: Number(b.count) })),
  ]));
}

export async function listProducts(lang = 'pt') {
  const l = LANGS.includes(lang) ? lang : 'pt';
  return (await catalog())
    .find({}, { projection: { sku: 1, brand: 1, category: 1, price: 1, rating: 1, inStock: 1, name: `$name.${l}`, description: `$description.${l}` } })
    .sort({ category: 1, sku: 1 })
    .toArray();
}

export async function listSynonyms() {
  return (await synonyms()).find({}, { projection: { _id: 0 } }).sort({ live: 1 }).toArray();
}

// Plain insert into the source collection: Atlas Search watches it and updates the
// synonym map without reindexing.
export async function addSynonym(words) {
  const list = [...new Set((Array.isArray(words) ? words : String(words || '').split(','))
    .map((w) => String(w).trim().toLowerCase())
    .filter(Boolean))];
  if (list.length < 2 || list.length > 6) throw fail(400, 'Give between 2 and 6 words.');
  if (list.some((w) => w.length > 40)) throw fail(400, 'Words must be 40 characters or fewer.');
  const doc = { mappingType: 'equivalent', synonyms: list, live: true };
  await (await synonyms()).insertOne(doc);
  return { mappingType: doc.mappingType, synonyms: doc.synonyms, live: true };
}

export async function removeLiveSynonyms() {
  const { deletedCount } = await (await synonyms()).deleteMany({ live: true });
  return { deleted: deletedCount };
}

export async function teardown() {
  const coll = await catalog();
  for (const idx of await listIndexes()) await coll.dropSearchIndex(idx.name);
  const dropped = await coll.drop().catch(() => false);
  const droppedSynonyms = await (await synonyms()).drop().catch(() => false);
  return { dropped, droppedSynonyms };
}
