// Synonyms are data: insert into catalog_synonyms and Atlas Search applies them, no reindex.

use('mongo_demos');

const query = (synonyms) => db.catalog.aggregate([
  { $search: { index: 'catalog_search', text: { query: 'cantil', path: ['name.pt', 'description.pt', 'brand'], ...(synonyms ? { synonyms: 'catalog_synonyms' } : {}) } } },
  { $limit: 6 },
  { $project: { name: '$name.pt' } },
]).toArray();

query(true); // [] before the insert

db.catalog_synonyms.insertOne({ mappingType: 'equivalent', synonyms: ['cantil', 'garrafa'], live: true });

// Run again after a few seconds: the flask shows up.
query(true);

// Cleanup
db.catalog_synonyms.deleteMany({ live: true });
