import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './lib/config.js';
import { getDb, isConfigured } from './lib/db.js';
import { presenterOnly } from './lib/presenter.js';
import { demos, roadmap } from './demos/index.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(root, 'public')));

app.get('/api/hub', (req, res) => {
  res.json({ demos: demos.map((d) => d.meta), roadmap });
});

app.get('/api/health', async (req, res) => {
  if (!isConfigured()) return res.json({ configured: false });
  const db = await getDb();
  const info = await db.command({ buildInfo: 1 });
  res.json({ configured: true, ok: true, version: info.version });
});

for (const demo of demos) {
  app.use(`/api/${demo.meta.id}`, demo.router);
  app.use(`/demos/${demo.meta.id}`, express.static(demo.publicDir));
  app.use(`/presenter/${demo.meta.id}`, presenterOnly, express.static(demo.presenterDir));
}

app.get('/presenter', presenterOnly, (req, res) => {
  const { search } = new URL(req.originalUrl, 'http://localhost');
  res.redirect(`/presenter/${demos[0].meta.id}/${search}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message, code: err.codeName || err.code });
});

app.listen(config.port, config.host, () => {
  console.log(`\n  MongoDB Demo Hub  ->  http://localhost:${config.port}`);
  console.log(`  Presenter setup   ->  http://localhost:${config.port}/presenter\n`);
  if (!isConfigured()) console.log('  ! MONGODB_URI missing: copy .env.example to .env\n');
});
