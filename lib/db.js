import { MongoClient } from 'mongodb';
import { config } from './config.js';

let clientPromise;

export const isConfigured = () => Boolean(config.uri) && !config.uri.includes('<cluster>');

export function getClient() {
  if (!isConfigured()) {
    throw Object.assign(new Error('MONGODB_URI not set. Copy .env.example to .env and add your Atlas connection string.'), { status: 400 });
  }
  clientPromise ??= new MongoClient(config.uri, { appName: 'mongodb-demo-hub' })
    .connect()
    .catch((err) => {
      clientPromise = undefined;
      throw err;
    });
  return clientPromise;
}

export async function getDb() {
  return (await getClient()).db(config.dbName);
}

export async function closeClient() {
  if (clientPromise) await (await clientPromise).close();
  clientPromise = undefined;
}
