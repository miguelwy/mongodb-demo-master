import { config } from '../../lib/config.js';

export const COLLECTION = 'products';
export const MANUAL_DIMENSIONS = 1024;

export const AUTOEMBED_MODELS = ['voyage-4-lite', 'voyage-4', 'voyage-4-large'];

const filterFields = [
  { type: 'filter', path: 'category' },
  { type: 'filter', path: 'price' },
  { type: 'filter', path: 'inStock' },
];

export function autoEmbedDefinition(model = config.autoEmbedModel) {
  return {
    fields: [
      { type: 'autoEmbed', modality: 'text', path: 'description', model },
      ...filterFields,
    ],
  };
}

// The three search indexes this demo uses (fits the 3-index limit of an M0).
export const INDEXES = {
  auto: {
    name: 'products_autoembed',
    type: 'vectorSearch',
    get definition() {
      return autoEmbedDefinition();
    },
  },
  manual: {
    name: 'products_vector_manual',
    type: 'vectorSearch',
    definition: {
      fields: [
        { type: 'vector', path: 'descriptionEmbedding', numDimensions: MANUAL_DIMENSIONS, similarity: 'dotProduct' },
        ...filterFields,
      ],
    },
  },
  text: {
    name: 'products_text',
    type: 'search',
    definition: {
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
    },
  },
};
