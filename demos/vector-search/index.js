import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { presenterOnly } from '../../lib/presenter.js';
import * as svc from './service.js';

export const meta = {
  id: 'vector-search',
  title: 'Vector Search & Automated Embedding',
  description: {
    pt: 'Busca semântica sem pipeline de embeddings: o Atlas gera, guarda e sincroniza os vetores com Voyage AI.',
    en: 'Semantic search without an embedding pipeline: Atlas generates, stores and syncs vectors with Voyage AI.',
  },
  tags: ['Vector Search', 'autoEmbed', 'Voyage AI', 'Hybrid Search'],
  path: '/demos/vector-search/',
  accent: '#00ED64',
};

const here = path.dirname(fileURLToPath(import.meta.url));
export const publicDir = path.join(here, 'public');
export const presenterDir = path.join(here, 'presenter');

export const router = Router();

const handle = (fn) => async (req, res) => res.json(await fn(req));

// Client-facing: everything the guided demo needs, nothing destructive.
router.get('/status', handle(async () => {
  const { host, ...status } = await svc.status();
  return status;
}));
router.get('/definitions', handle(() => svc.definitions()));

router.post('/indexes/:kind', handle((req) => svc.createIndex(req.params.kind)));
router.put('/indexes/auto/model', handle((req) => svc.changeAutoEmbedModel(req.body.model)));

router.post('/embeddings/manual', handle(() => svc.embedManually()));

router.post('/search', async (req, res) => {
  try {
    res.json(await svc.search(req.body));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.codeName, pipeline: err.pipeline });
  }
});

router.get('/products', handle(() => svc.listProducts()));
router.post('/products', handle((req) => svc.addProduct(req.body)));
router.patch('/products/:id', handle((req) => svc.updateDescription(req.params.id, req.body.description)));
router.post('/products/:id/probe', handle((req) => svc.probe(req.params.id, req.body.text)));

// Presenter-only: setup, reset and teardown.
const presenter = Router();
presenter.use(presenterOnly);
presenter.get('/status', handle(() => svc.status()));
presenter.post('/prepare', handle(() => svc.prepare()));
presenter.post('/seed', handle(() => svc.seed()));
presenter.post('/indexes/:kind', handle((req) => svc.createIndex(req.params.kind)));
presenter.delete('/indexes/:kind', handle((req) => svc.dropIndex(req.params.kind)));
presenter.delete('/embeddings/manual', handle(() => svc.clearManualEmbeddings()));
presenter.delete('/products/live', handle(() => svc.removeLiveProducts()));
presenter.post('/teardown', handle(() => svc.teardown()));
router.use('/presenter', presenter);
