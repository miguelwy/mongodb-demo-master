// Registry of demos served by the hub. To add one, create demos/<id>/index.js
// exporting { meta, router, publicDir, presenterDir } and list it here.
// User-facing text is { pt, en }.
import * as vectorSearch from './vector-search/index.js';

export const demos = [vectorSearch];

// Shown on the hub as "coming soon" cards.
export const roadmap = [
  { title: 'Atlas Search', description: { pt: 'Full-text, facets, autocomplete e relevância.', en: 'Full-text, facets, autocomplete and relevance.' } },
  { title: 'Queryable Encryption', description: { pt: 'Consultas em dados criptografados ponta a ponta.', en: 'Query data that stays encrypted end to end.' } },
  { title: 'Change Streams', description: { pt: 'Eventos em tempo real a partir do banco.', en: 'Real-time events straight from the database.' } },
  { title: 'Time Series', description: { pt: 'Coleções otimizadas para séries temporais.', en: 'Collections optimized for time-series data.' } },
  { title: 'Atlas Stream Processing', description: { pt: 'Processamento contínuo de streams com MQL.', en: 'Continuous stream processing with MQL.' } },
  { title: 'RAG & Agents', description: { pt: 'Vector Search + LLM + memória de agentes.', en: 'Vector Search + LLM + agent memory.' } },
];
