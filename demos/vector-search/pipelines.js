import { INDEXES } from './indexes.js';

const FIELDS = { _id: 1, sku: 1, name: 1, description: 1, category: 1, brand: 1, price: 1, rating: 1, inStock: 1, live: 1 };

const project = (scoreMeta, extra = {}) => ({ $project: { ...FIELDS, score: { $meta: scoreMeta }, ...extra } });

// MQL pre-filter for $vectorSearch. Every path here must be a `filter` field in the index.
function vectorFilter({ categories, maxPrice, inStock } = {}) {
  const clauses = [];
  if (categories?.length) clauses.push({ category: { $in: categories } });
  if (maxPrice != null && maxPrice !== '') clauses.push({ price: { $lte: Number(maxPrice) } });
  if (inStock) clauses.push({ inStock: true });
  if (clauses.length === 0) return undefined;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// Same filters expressed with Atlas Search operators.
function searchFilter({ categories, maxPrice, inStock } = {}) {
  const clauses = [];
  if (categories?.length) clauses.push({ in: { path: 'category', value: categories } });
  if (maxPrice != null && maxPrice !== '') clauses.push({ range: { path: 'price', lte: Number(maxPrice) } });
  if (inStock) clauses.push({ equals: { path: 'inStock', value: true } });
  return clauses;
}

function annOrEnn({ exact, numCandidates, limit }) {
  return exact ? { exact: true } : { numCandidates: Math.max(Number(numCandidates) || limit * 20, limit) };
}

export function autoEmbedStage(p) {
  const filter = vectorFilter(p.filters);
  return {
    $vectorSearch: {
      index: INDEXES.auto.name,
      path: 'description',
      query: { text: p.text },
      ...(p.model ? { model: p.model } : {}),
      ...annOrEnn(p),
      limit: p.limit,
      ...(filter ? { filter } : {}),
    },
  };
}

export function manualStage(p, queryVector) {
  const filter = vectorFilter(p.filters);
  return {
    $vectorSearch: {
      index: INDEXES.manual.name,
      path: 'descriptionEmbedding',
      queryVector,
      ...annOrEnn(p),
      limit: p.limit,
      ...(filter ? { filter } : {}),
    },
  };
}

export function keywordStage(p) {
  const filter = searchFilter(p.filters);
  return {
    $search: {
      index: INDEXES.text.name,
      compound: {
        must: [{ text: { query: p.text, path: ['name', 'description'], fuzzy: { maxEdits: 1 } } }],
        ...(filter.length ? { filter } : {}),
      },
    },
  };
}

export function buildPipeline(mode, p, queryVector) {
  switch (mode) {
    case 'auto':
      return [autoEmbedStage(p), project('vectorSearchScore')];
    case 'manual':
      return [manualStage(p, queryVector), project('vectorSearchScore')];
    case 'keyword':
      return [keywordStage(p), { $limit: p.limit }, project('searchScore')];
    case 'hybrid': {
      const depth = p.limit * 2;
      const weight = Math.min(Math.max(Number(p.vectorWeight ?? 0.5), 0), 1);
      return [
        {
          $rankFusion: {
            input: {
              pipelines: {
                vector: [autoEmbedStage({ ...p, limit: depth })],
                keyword: [keywordStage(p), { $limit: depth }],
              },
            },
            combination: { weights: { vector: weight, keyword: Number((1 - weight).toFixed(2)) } },
            scoreDetails: true,
          },
        },
        { $limit: p.limit },
        project('score', { scoreDetails: { $meta: 'scoreDetails' } }),
      ];
    }
    default:
      throw Object.assign(new Error(`Unknown mode: ${mode}`), { status: 400 });
  }
}
