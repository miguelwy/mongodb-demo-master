use('mongo_demos');

// Lexical index for the keyword half of hybrid search.
db.products.createSearchIndex('products_text', {
  mappings: {
    dynamic: false,
    fields: {
      name: { type: 'string' },
      description: { type: 'string' },
      category: { type: 'token' },
      price: { type: 'number' },
      inStock: { type: 'boolean' },
    },
  },
});

// Reciprocal Rank Fusion of semantic + keyword (MongoDB 8.0+).
const q = 'waterproof jacket for storms';
db.products.aggregate([
  {
    $rankFusion: {
      input: {
        pipelines: {
          vector: [{ $vectorSearch: { index: 'products_autoembed', path: 'description', query: { text: q }, numCandidates: 200, limit: 10 } }],
          keyword: [{ $search: { index: 'products_text', text: { query: q, path: ['name', 'description'] } } }, { $limit: 10 }],
        },
      },
      combination: { weights: { vector: 0.7, keyword: 0.3 } },
      scoreDetails: true,
    },
  },
  { $limit: 5 },
  { $project: { _id: 0, name: 1, score: { $meta: 'score' }, scoreDetails: { $meta: 'scoreDetails' } } },
]);
