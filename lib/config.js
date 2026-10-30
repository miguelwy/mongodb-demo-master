import 'dotenv/config';

export const config = {
  uri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || 'mongo_demos',
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3000),
  autoEmbedModel: process.env.AUTOEMBED_MODEL || 'voyage-4',
  voyageApiKey: process.env.VOYAGE_API_KEY || '',
  voyageApiUrl: (process.env.VOYAGE_API_URL || 'https://api.voyageai.com/v1').replace(/\/$/, ''),
  manualEmbedModel: process.env.MANUAL_EMBED_MODEL || 'voyage-4',
};

// Host part of the URI without credentials, safe to show on screen.
export function maskedHost(uri = config.uri) {
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/);
  return match ? match[1] : '';
}
