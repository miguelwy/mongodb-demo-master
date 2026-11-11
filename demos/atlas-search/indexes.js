export const COLLECTION = 'catalog';
export const SYNONYMS_COLLECTION = 'catalog_synonyms';
export const INDEX_NAME = 'catalog_search';
export const SYNONYM_MAPPING = 'catalog_synonyms';
export const LANGS = ['pt', 'en'];

// Lowercase, accents folded, common stop words dropped. One analyzer for both
// languages, so a single synonym mapping (the M0 limit) serves pt and en.
const FOLDED = {
  name: 'folded',
  charFilters: [],
  tokenizer: { type: 'standard' },
  tokenFilters: [
    { type: 'lowercase' },
    { type: 'icuFolding' },
    { type: 'stopword', tokens: ['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'the', 'and', 'of', 'for', 'with', 'to'] },
  ],
};

const text = { type: 'string', analyzer: 'folded' };
const autocomplete = { type: 'autocomplete', tokenization: 'edgeGram', minGrams: 2, maxGrams: 15, foldDiacritics: true };

// One index covers every step: full-text, autocomplete, facets, sort and synonyms.
export const definition = {
  analyzers: [FOLDED],
  mappings: {
    dynamic: false,
    fields: {
      name: { type: 'document', fields: { pt: [text, autocomplete], en: [text, autocomplete] } },
      description: { type: 'document', fields: { pt: text, en: text } },
      brand: [{ type: 'token' }, text],
      category: { type: 'token' },
      price: { type: 'number' },
      rating: { type: 'number' },
      inStock: { type: 'boolean' },
    },
  },
  synonyms: [{ name: SYNONYM_MAPPING, analyzer: 'folded', source: { collection: SYNONYMS_COLLECTION } }],
};

// Price buckets for the number facet: [0, 100), [100, 300), ...
export const PRICE_BOUNDARIES = [0, 100, 300, 1000, 3000, 10000];
