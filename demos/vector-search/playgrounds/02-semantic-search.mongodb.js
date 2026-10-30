use('mongo_demos');

// Plain text in, ranked documents out. Atlas embeds the query with the index model.
db.products.aggregate([
  {
    $vectorSearch: {
      index: 'products_autoembed',
      path: 'description',
      query: { text: 'algo para manter meu café quente durante a trilha' },
      numCandidates: 100,
      limit: 5,
    },
  },
  { $project: { _id: 0, name: 1, category: 1, score: { $meta: 'vectorSearchScore' } } },
]);

// Same search with business filters and a lighter query model from the voyage-4 family.
db.products.aggregate([
  {
    $vectorSearch: {
      index: 'products_autoembed',
      path: 'description',
      query: { text: 'presente para quem ama fotografia' },
      model: 'voyage-4-lite',
      numCandidates: 100,
      limit: 5,
      filter: { $and: [{ price: { $lte: 1500 } }, { inStock: true }] },
    },
  },
  { $project: { _id: 0, name: 1, price: 1, score: { $meta: 'vectorSearchScore' } } },
]);
