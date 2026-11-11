// MongoDB Playground: run with the VS Code MongoDB extension or `mongosh --file`.
// Assumes the data is loaded: npm run search:seed (catalog + catalog_synonyms).

use('mongo_demos');

db.catalog.createSearchIndex('catalog_search', {
  analyzers: [{
    name: 'folded',
    charFilters: [],
    tokenizer: { type: 'standard' },
    tokenFilters: [
      { type: 'lowercase' },
      { type: 'icuFolding' },
      { type: 'stopword', tokens: ['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'the', 'and', 'of', 'for', 'with', 'to'] },
    ],
  }],
  mappings: {
    dynamic: false,
    fields: {
      name: { type: 'document', fields: {
        pt: [{ type: 'string', analyzer: 'folded' }, { type: 'autocomplete', tokenization: 'edgeGram', minGrams: 2, maxGrams: 15, foldDiacritics: true }],
        en: [{ type: 'string', analyzer: 'folded' }, { type: 'autocomplete', tokenization: 'edgeGram', minGrams: 2, maxGrams: 15, foldDiacritics: true }],
      } },
      description: { type: 'document', fields: { pt: { type: 'string', analyzer: 'folded' }, en: { type: 'string', analyzer: 'folded' } } },
      brand: [{ type: 'token' }, { type: 'string', analyzer: 'folded' }],
      category: { type: 'token' },
      price: { type: 'number' },
      rating: { type: 'number' },
      inStock: { type: 'boolean' },
    },
  },
  synonyms: [{ name: 'catalog_synonyms', analyzer: 'folded', source: { collection: 'catalog_synonyms' } }],
});

// Run again until status: 'READY' and queryable: true
db.catalog.getSearchIndexes('catalog_search');
