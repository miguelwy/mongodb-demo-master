import { readFile } from 'node:fs/promises';
import { ObjectId } from 'mongodb';
import { config, maskedHost } from '../../lib/config.js';
import { getDb, isConfigured } from '../../lib/db.js';
import { AUTOEMBED_MODELS, COLLECTION, INDEXES, autoEmbedDefinition } from './indexes.js';
import { autoEmbedStage, buildPipeline } from './pipelines.js';
import { embed, voyageConfigured } from './voyage.js';

const DATA_URL = new URL('./data/products.json', import.meta.url);

const fail = (status, message) => Object.assign(new Error(message), { status });
const products = async () => (await getDb()).collection(COLLECTION);
const elapsed = (t0) => Math.round(performance.now() - t0);

async function listIndexes() {
  try {
    return await (await products()).listSearchIndexes().toArray();
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound' || err.code === 26) return [];
    throw err;
  }
}

export async function status() {
  if (!isConfigured()) return { configured: false };
  const db = await getDb();
  const coll = db.collection(COLLECTION);
  const [info, count, embedded, live, indexes] = await Promise.all([
    db.command({ buildInfo: 1 }),
    coll.countDocuments(),
    coll.countDocuments({ descriptionEmbedding: { $exists: true } }),
    coll.countDocuments({ live: true }),
    listIndexes(),
  ]);
  return {
    configured: true,
    host: maskedHost(),
    version: info.version,
    db: config.dbName,
    collection: COLLECTION,
    count,
    embedded,
    live,
    voyage: voyageConfigured(),
    autoModel: config.autoEmbedModel,
    manualModel: config.manualEmbedModel,
    models: AUTOEMBED_MODELS,
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

export async function seed() {
  const t0 = performance.now();
  const docs = JSON.parse(await readFile(DATA_URL, 'utf8')).map((d) => ({ ...d, createdAt: new Date() }));
  const coll = await products();
  // deleteMany (not drop) keeps the search indexes, so autoEmbed re-syncs on its own.
  const { deletedCount } = await coll.deleteMany({});
  const { insertedCount } = await coll.insertMany(docs);
  return { deleted: deletedCount, inserted: insertedCount, ms: elapsed(t0) };
}

// One click before a meeting: data plus the indexes the client-facing steps query.
export async function prepare() {
  const seeded = await seed();
  const auto = await createIndex('auto');
  const text = await createIndex('text');
  return { seeded, auto, text };
}

export async function createIndex(kind) {
  const spec = INDEXES[kind];
  if (!spec) throw fail(400, `Unknown index kind: ${kind}`);
  const coll = await products();
  if ((await coll.estimatedDocumentCount()) === 0) throw fail(409, 'The products collection is empty.');
  if ((await listIndexes()).some((i) => i.name === spec.name)) return { name: spec.name, exists: true };
  await coll.createSearchIndex({ name: spec.name, type: spec.type, definition: spec.definition });
  return { name: spec.name, created: true, definition: spec.definition };
}

// Editable definitions (GA): switching the model re-embeds in the background while
// queries keep being served by the previous embeddings.
export async function changeAutoEmbedModel(model) {
  if (!AUTOEMBED_MODELS.includes(model)) throw fail(400, `Unsupported model: ${model}`);
  const definition = autoEmbedDefinition(model);
  await (await products()).updateSearchIndex(INDEXES.auto.name, definition);
  return { name: INDEXES.auto.name, definition };
}

export async function dropIndex(kind) {
  const spec = INDEXES[kind];
  if (!spec) throw fail(400, `Unknown index kind: ${kind}`);
  await (await products()).dropSearchIndex(spec.name);
  return { name: spec.name, dropped: true };
}

export async function definitions() {
  return Object.fromEntries(Object.entries(INDEXES).map(([k, v]) => [k, { name: v.name, type: v.type, definition: v.definition }]));
}

// What you have to build yourself without Automated Embedding.
export async function embedManually() {
  const t0 = performance.now();
  const coll = await products();
  const pending = await coll.find({ descriptionEmbedding: { $exists: false } }, { projection: { description: 1 } }).toArray();
  let tokens = 0;
  for (let i = 0; i < pending.length; i += 64) {
    const batch = pending.slice(i, i + 64);
    const { vectors, tokens: used } = await embed(batch.map((d) => d.description), 'document');
    tokens += used;
    await coll.bulkWrite(batch.map((d, j) => ({
      updateOne: {
        filter: { _id: d._id },
        update: { $set: { descriptionEmbedding: vectors[j], embeddingModel: config.manualEmbedModel, embeddedAt: new Date() } },
      },
    })));
  }
  return { embedded: pending.length, tokens, ms: elapsed(t0) };
}

export async function clearManualEmbeddings() {
  const { modifiedCount } = await (await products()).updateMany({}, { $unset: { descriptionEmbedding: '', embeddingModel: '', embeddedAt: '' } });
  return { cleared: modifiedCount };
}

function vectorPreview(v) {
  return `[${v.slice(0, 4).map((x) => x.toFixed(4)).join(', ')}, … +${v.length - 4} dims]`;
}

export async function search(body) {
  const mode = body.mode || 'auto';
  const text = String(body.text || '').trim();
  if (!text) throw fail(400, 'Type a query.');
  const params = {
    text,
    limit: Math.min(Math.max(Number(body.limit) || 5, 1), 50),
    numCandidates: Number(body.numCandidates) || undefined,
    exact: Boolean(body.exact),
    filters: body.filters || {},
    vectorWeight: body.vectorWeight,
    model: body.model || undefined,
  };
  const t0 = performance.now();
  let queryVector;
  let embedMs;
  let tokens;
  if (mode === 'manual') {
    const e0 = performance.now();
    const r = await embed([text], 'query');
    queryVector = r.vectors[0];
    tokens = r.tokens;
    embedMs = elapsed(e0);
  }
  const pipeline = buildPipeline(mode, params, queryVector);
  const display = queryVector
    ? JSON.parse(JSON.stringify(pipeline).replace(JSON.stringify(queryVector), JSON.stringify(vectorPreview(queryVector))))
    : pipeline;
  try {
    const q0 = performance.now();
    const results = await (await products()).aggregate(pipeline).toArray();
    return { mode, pipeline: display, results, ms: { total: elapsed(t0), query: elapsed(q0), embed: embedMs }, tokens };
  } catch (err) {
    err.status = 400;
    err.pipeline = display;
    throw err;
  }
}

export async function listProducts() {
  return (await products())
    .aggregate([
      { $sort: { live: -1, category: 1, name: 1 } },
      { $project: { sku: 1, name: 1, description: 1, category: 1, brand: 1, price: 1, rating: 1, inStock: 1, live: 1, hasManualEmbedding: { $isArray: '$descriptionEmbedding' } } },
    ])
    .toArray();
}

export async function addProduct(body) {
  const { name, description, category = 'Camping', price = 199, inStock = true } = body;
  if (!name || !description) throw fail(400, 'name and description are required.');
  const doc = {
    sku: `LIVE-${Date.now().toString(36).toUpperCase()}`,
    name, description, category, brand: 'Live Demo', price: Number(price), rating: 5, inStock: Boolean(inStock),
    tags: ['live'], live: true, createdAt: new Date(),
  };
  const { insertedId } = await (await products()).insertOne(doc);
  return { _id: insertedId, ...doc };
}

export async function updateDescription(id, description) {
  if (!description) throw fail(400, 'description is required.');
  const res = await (await products()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { description, updatedAt: new Date() } },
    { returnDocument: 'after', projection: { descriptionEmbedding: 0 } },
  );
  if (!res) throw fail(404, 'Product not found.');
  return res;
}

export async function removeLiveProducts() {
  const { deletedCount } = await (await products()).deleteMany({ live: true });
  return { deleted: deletedCount };
}

// Is this document already searchable? Runs a semantic query and looks for its _id.
export async function probe(id, text) {
  const _id = new ObjectId(id);
  const coll = await products();
  const doc = await coll.findOne({ _id }, { projection: { description: 1 } });
  if (!doc) throw fail(404, 'Product not found.');
  const t0 = performance.now();
  const results = await coll
    .aggregate([autoEmbedStage({ text: text || doc.description, limit: 10, numCandidates: 200 }), { $project: { _id: 1, score: { $meta: 'vectorSearchScore' } } }])
    .toArray();
  const rank = results.findIndex((r) => r._id.equals(_id));
  return { found: rank >= 0, rank: rank + 1, score: rank >= 0 ? results[rank].score : null, ms: elapsed(t0) };
}

export async function teardown() {
  const coll = await products();
  for (const idx of await listIndexes()) await coll.dropSearchIndex(idx.name);
  const dropped = await coll.drop().catch(() => false);
  return { dropped };
}
