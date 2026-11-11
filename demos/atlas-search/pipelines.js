import { INDEX_NAME, LANGS, PRICE_BOUNDARIES, SYNONYM_MAPPING } from './indexes.js';

const fail = (message) => Object.assign(new Error(message), { status: 400 });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Documents store both languages; results come back in the language of the page.
function project(lang, extra = {}) {
  return {
    $project: {
      sku: 1, brand: 1, category: 1, price: 1, rating: 1, inStock: 1,
      name: `$name.${lang}`,
      description: `$description.${lang}`,
      ...extra,
    },
  };
}

const score = { score: { $meta: 'searchScore' } };
const fuzzyOption = (maxEdits) => (Number(maxEdits) > 0 ? { fuzzy: { maxEdits: Number(maxEdits) } } : {});
const textPaths = (lang) => [`name.${lang}`, `description.${lang}`, 'brand'];

// The baseline most apps start with: a case-insensitive regex, evaluated by mongod.
function regexPipeline(p) {
  const regex = { $regex: escapeRegex(p.text), $options: 'i' };
  return [
    { $match: { $or: [{ [`name.${p.lang}`]: regex }, { [`description.${p.lang}`]: regex }] } },
    { $limit: p.limit },
    project(p.lang),
  ];
}

function fulltextPipeline(p) {
  return [
    {
      $search: {
        index: INDEX_NAME,
        text: { query: p.text, path: textPaths(p.lang), ...fuzzyOption(p.fuzzy), ...(p.matchAll ? { matchCriteria: 'all' } : {}) },
        ...(p.highlight ? { highlight: { path: [`name.${p.lang}`, `description.${p.lang}`] } } : {}),
      },
    },
    { $limit: p.limit },
    project(p.lang, { ...score, ...(p.highlight ? { highlights: { $meta: 'searchHighlights' } } : {}) }),
  ];
}

function autocompletePipeline(p) {
  const path = `name.${p.lang}`;
  return [
    {
      $search: {
        index: INDEX_NAME,
        // prefixLength keeps the first letters exact, so short prefixes don't drift to other words.
        autocomplete: { query: p.text, path, ...(Number(p.fuzzy) > 0 ? { fuzzy: { maxEdits: 1, prefixLength: 3 } } : {}) },
        highlight: { path },
      },
    },
    { $limit: p.limit },
    project(p.lang, { ...score, highlights: { $meta: 'searchHighlights' } }),
  ];
}

function relevancePipeline(p) {
  const base = { text: { query: p.text, path: textPaths(p.lang), fuzzy: { maxEdits: 1 } } };
  if (p.ratingBoost) {
    base.text.score = { function: { multiply: [{ score: 'relevance' }, { path: { value: 'rating', undefined: 1 } }] } };
  }
  const should = [];
  if (p.stockBoost) should.push({ equals: { path: 'inStock', value: true, score: { boost: { value: 2 } } } });
  const filter = [];
  if (p.maxPrice) filter.push({ range: { path: 'price', lte: Number(p.maxPrice) } });
  return [
    {
      $search: {
        index: INDEX_NAME,
        compound: { must: [base], ...(should.length ? { should } : {}), ...(filter.length ? { filter } : {}) },
        ...(p.scoreDetails ? { scoreDetails: true } : {}),
      },
    },
    { $limit: p.limit },
    project(p.lang, { ...score, ...(p.scoreDetails ? { scoreDetails: { $meta: 'searchScoreDetails' } } : {}) }),
  ];
}

const SORTS = {
  relevance: null,
  priceAsc: { price: 1 },
  priceDesc: { price: -1 },
  rating: { rating: -1 },
};

// Selected facet values become filter clauses, so the counts drill down with them.
function facetsPipeline(p) {
  const must = p.text ? [{ text: { query: p.text, path: textPaths(p.lang), fuzzy: { maxEdits: 1 } } }] : [];
  const filter = [];
  if (p.categories?.length) filter.push({ in: { path: 'category', value: p.categories } });
  if (p.brands?.length) filter.push({ in: { path: 'brand', value: p.brands } });
  if (p.priceFrom != null && p.priceFrom !== '') {
    const from = Number(p.priceFrom);
    const to = PRICE_BOUNDARIES.find((b) => b > from);
    filter.push({ range: { path: 'price', gte: from, ...(to ? { lt: to } : {}) } });
  }
  const operator = must.length || filter.length
    ? { compound: { ...(must.length ? { must } : {}), ...(filter.length ? { filter } : {}) } }
    : undefined;
  const sort = SORTS[p.sort] ?? null;
  return [
    {
      $search: {
        index: INDEX_NAME,
        facet: {
          ...(operator ? { operator } : {}),
          facets: {
            category: { type: 'string', path: 'category' },
            brand: { type: 'string', path: 'brand', numBuckets: 10 },
            price: { type: 'number', path: 'price', boundaries: PRICE_BOUNDARIES },
          },
        },
        count: { type: 'total' },
        ...(sort ? { sort } : {}),
      },
    },
    { $limit: p.limit },
    {
      $facet: {
        docs: [project(p.lang, score)],
        meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
      },
    },
    { $set: { meta: { $arrayElemAt: ['$meta', 0] } } },
  ];
}

function synonymsPipeline(p) {
  return [
    {
      $search: {
        index: INDEX_NAME,
        // synonyms and fuzzy can't be combined in the same text operator.
        text: { query: p.text, path: textPaths(p.lang), ...(p.synonyms ? { synonyms: SYNONYM_MAPPING } : {}) },
      },
    },
    { $limit: p.limit },
    project(p.lang, score),
  ];
}

const BUILDERS = {
  regex: regexPipeline,
  fulltext: fulltextPipeline,
  autocomplete: autocompletePipeline,
  relevance: relevancePipeline,
  facets: facetsPipeline,
  synonyms: synonymsPipeline,
};

export function buildPipeline(mode, p) {
  const build = BUILDERS[mode];
  if (!build) throw fail(`Unknown mode: ${mode}`);
  if (!LANGS.includes(p.lang)) throw fail(`Unknown language: ${p.lang}`);
  return build(p);
}
