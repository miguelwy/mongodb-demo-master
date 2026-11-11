// Business rules in the ranking, then facets + total + sort in one query.

use('mongo_demos');

db.catalog.aggregate([
  {
    $search: {
      index: 'catalog_search',
      compound: {
        must: [{ text: {
          query: 'bateria', path: ['name.pt', 'description.pt', 'brand'], fuzzy: { maxEdits: 1 },
          score: { function: { multiply: [{ score: 'relevance' }, { path: { value: 'rating', undefined: 1 } }] } },
        } }],
        should: [
          { equals: { path: 'inStock', value: true, score: { boost: { value: 2 } } } },
        ],
        filter: [{ range: { path: 'price', lte: 1500 } }],
      },
      scoreDetails: true,
    },
  },
  { $limit: 6 },
  { $project: { name: '$name.pt', score: { $meta: 'searchScore' }, scoreDetails: { $meta: 'searchScoreDetails' } } },
]);

db.catalog.aggregate([
  {
    $search: {
      index: 'catalog_search',
      facet: {
        operator: { compound: {
          must: [{ text: { query: 'cadeira', path: ['name.pt', 'description.pt', 'brand'], fuzzy: { maxEdits: 1 } } }],
        } },
        facets: {
          category: { type: 'string', path: 'category' },
          brand: { type: 'string', path: 'brand', numBuckets: 10 },
          price: { type: 'number', path: 'price', boundaries: [0, 100, 300, 1000, 3000, 10000] },
        },
      },
      count: { type: 'total' },
      sort: { price: 1 },
    },
  },
  { $limit: 8 },
  { $facet: {
    docs: [{ $project: { name: '$name.pt', price: 1 } }],
    meta: [{ $replaceWith: '$$SEARCH_META' }, { $limit: 1 }],
  } },
  { $set: { meta: { $arrayElemAt: ['$meta', 0] } } },
]);
