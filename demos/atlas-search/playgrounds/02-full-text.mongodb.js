// Full-text with typo tolerance and highlights, next to the regex baseline.

use('mongo_demos');

// Regex: 0 results ("termica" has no accent, the catalog says "térmica").
db.catalog.find({ $or: [
  { 'name.pt': { $regex: 'garrafa termica', $options: 'i' } },
  { 'description.pt': { $regex: 'garrafa termica', $options: 'i' } },
] }).limit(6);

db.catalog.aggregate([
  {
    $search: {
      index: 'catalog_search',
      text: { query: 'garrafa termica', path: ['name.pt', 'description.pt', 'brand'], fuzzy: { maxEdits: 1 } },
      highlight: { path: ['name.pt', 'description.pt'] },
    },
  },
  { $limit: 6 },
  { $project: { name: '$name.pt', score: { $meta: 'searchScore' }, highlights: { $meta: 'searchHighlights' } } },
]);

// Autocomplete, one query per keystroke.
db.catalog.aggregate([
  { $search: { index: 'catalog_search', autocomplete: { query: 'mochla', path: 'name.pt', fuzzy: { maxEdits: 1, prefixLength: 3 } } } },
  { $limit: 6 },
  { $project: { name: '$name.pt', score: { $meta: 'searchScore' } } },
]);
