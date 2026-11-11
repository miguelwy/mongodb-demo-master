import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { presenterOnly } from '../../lib/presenter.js';
import * as svc from './service.js';

export const meta = {
  id: 'atlas-search',
  title: 'Atlas Search',
  description: {
    pt: 'Full-text com relevância, autocomplete, facets e sinônimos, direto no cluster e sem um segundo sistema de busca.',
    en: 'Relevance-ranked full-text, autocomplete, facets and synonyms, on the cluster itself with no second search system.',
  },
  tags: ['Atlas Search', 'Full-text', 'Autocomplete', 'Facets', 'Synonyms'],
  path: '/demos/atlas-search/',
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
router.get('/definition', handle(() => svc.getDefinition()));
router.post('/index', handle(() => svc.createIndex()));

router.post('/search', async (req, res) => {
  try {
    res.json(await svc.search(req.body));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, code: err.codeName, pipeline: err.pipeline });
  }
});

router.get('/products', handle((req) => svc.listProducts(req.query.lang)));
router.get('/synonyms', handle(() => svc.listSynonyms()));
router.post('/synonyms', handle((req) => svc.addSynonym(req.body.words)));

// Presenter-only: setup, reset and teardown.
const presenter = Router();
presenter.use(presenterOnly);
presenter.get('/status', handle(() => svc.status()));
presenter.post('/prepare', handle(() => svc.prepare()));
presenter.post('/seed', handle(() => svc.seed()));
presenter.post('/index', handle(() => svc.createIndex()));
presenter.delete('/index', handle(() => svc.dropIndex()));
presenter.delete('/synonyms/live', handle(() => svc.removeLiveSynonyms()));
presenter.post('/teardown', handle(() => svc.teardown()));
router.use('/presenter', presenter);
