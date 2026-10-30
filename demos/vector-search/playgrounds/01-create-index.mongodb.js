// MongoDB Playground: run with the VS Code MongoDB extension or `mongosh --file`.
// Assumes the data is loaded: npm run vector:seed

use('mongo_demos');

db.products.createSearchIndex('products_autoembed', 'vectorSearch', {
  fields: [
    { type: 'autoEmbed', modality: 'text', path: 'description', model: 'voyage-4' },
    { type: 'filter', path: 'category' },
    { type: 'filter', path: 'price' },
    { type: 'filter', path: 'inStock' },
  ],
});

// Run again until status: 'READY' and queryable: true
db.products.getSearchIndexes('products_autoembed');
