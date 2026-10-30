// Minimal Voyage AI client, used ONLY by the "manual embeddings" comparison.
// Automated Embedding never needs this: Atlas calls the model for you.
import { config } from '../../lib/config.js';
import { MANUAL_DIMENSIONS } from './indexes.js';

export const voyageConfigured = () => Boolean(config.voyageApiKey);

export async function embed(input, inputType) {
  if (!voyageConfigured()) {
    throw Object.assign(new Error('VOYAGE_API_KEY not set in .env (needed only for the manual comparison).'), { status: 400 });
  }
  const res = await fetch(`${config.voyageApiUrl}/embeddings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.voyageApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input,
      model: config.manualEmbedModel,
      input_type: inputType, // "document" at write time, "query" at read time
      output_dimension: MANUAL_DIMENSIONS,
    }),
  });
  if (!res.ok) throw Object.assign(new Error(`Voyage API ${res.status}: ${await res.text()}`), { status: 502 });
  const json = await res.json();
  return { vectors: json.data.map((d) => d.embedding), tokens: json.usage?.total_tokens ?? 0 };
}
