use('mongo_demos');

// 1) A normal insert. No embedding call anywhere.
const { insertedId } = db.products.insertOne({
  sku: 'LIVE-PLAY',
  name: 'Brew-to-Go',
  description: 'Hand-powered portable espresso maker. Pump 18 bars of pressure by hand and pull a rich shot anywhere, no electricity or capsules required.',
  category: 'Camping',
  price: 349,
  inStock: true,
  live: true,
});

// 2) Run this a few seconds later: the new product shows up.
db.products.aggregate([
  {
    $vectorSearch: {
      index: 'products_autoembed',
      path: 'description',
      query: { text: 'fazer café expresso acampando sem tomada' },
      numCandidates: 100,
      limit: 3,
    },
  },
  { $project: { name: 1, score: { $meta: 'vectorSearchScore' } } },
]);

// 3) Cleanup
// db.products.deleteMany({ live: true });
