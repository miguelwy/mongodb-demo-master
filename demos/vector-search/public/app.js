import { $, $$, h, api, toast, busy, codeBlock, jsonBlock, initTheme } from '/js/ui.js';
import { createI18n } from '/js/i18n.js';
import { dicts } from './i18n.js';
import { getSnippets } from './snippets.js';

const API = '/api/vector-search';
const CATEGORIES = ['Camping', 'Hiking', 'Electronics', 'Home Office', 'Photography', 'Kids', 'Kitchen', 'Fitness'];
const QUERY_MODELS = ['', 'voyage-4-lite', 'voyage-4', 'voyage-4-large'];
const LIFECYCLE = ['PENDING', 'BUILDING', 'READY'];
const KIND_BY_NAME = { products_autoembed: 'auto', products_vector_manual: 'manual', products_text: 'text' };

const { lang, t, apply, initToggle } = createI18n(dicts);
const state = { status: null, products: [] };

apply();
initToggle();
initTheme();
const snippets = getSnippets(lang);
$$('[data-snippet]').forEach((el) => el.append(codeBlock(snippets[el.dataset.snippet])));

/* ───────────── step navigation ───────────── */

const steps = $$('.step');
const nav = $('#step-nav');
let current = 0;
const visited = new Set();

// The cover is step 0: it stays out of the sidebar, so numbers match the presenter script.
steps.slice(1).forEach((s, i) => {
  nav.append(h('li', {}, h('button', { onclick: () => go(i + 1) }, h('span', { class: 'n' }, i + 1), h('span', {}, t(`step.${s.id}`)))));
});

function go(i) {
  current = Math.max(0, Math.min(steps.length - 1, i));
  visited.add(current);
  steps.forEach((s, j) => s.classList.toggle('active', j === current));
  document.body.classList.toggle('on-cover', current === 0);
  $$('li', nav).forEach((li, j) => {
    li.classList.toggle('active', j + 1 === current);
    li.classList.toggle('done', visited.has(j + 1) && j + 1 !== current);
  });
  $('#progress-bar').style.width = `${(current / (steps.length - 1)) * 100}%`;
  $('#step-count').textContent = `${current} / ${steps.length - 1}`;
  $('#prev').disabled = current === 0;
  $('#next').disabled = current === steps.length - 1;
  history.replaceState(null, '', `${location.search}#${current}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  onEnter[steps[current].id]?.();
}

$('#prev').onclick = () => go(current - 1);
$('#next').onclick = () => go(current + 1);
$('#cover-start').onclick = () => go(1);
const togglePresent = () => document.body.classList.toggle('present');
$('#present-toggle').onclick = togglePresent;
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'ArrowRight') go(current + 1);
  else if (e.key === 'ArrowLeft') go(current - 1);
  else if (e.key.toLowerCase() === 'p') togglePresent();
});

/* ───────────── status ───────────── */

const indexByKind = (kind) => state.status?.indexes?.find((i) => KIND_BY_NAME[i.name] === kind);

async function refreshStatus() {
  try {
    state.status = await api(`${API}/status`);
  } catch (err) {
    state.status = { configured: true, error: err.message };
  }
  renderStatus();
  const building = state.status.indexes?.some((i) => !i.queryable || i.status !== 'READY');
  clearTimeout(refreshStatus.t);
  refreshStatus.t = setTimeout(refreshStatus, building ? 3000 : 15000);
}

const show = (el, visible) => (el.style.display = visible ? '' : 'none');

function renderStatus() {
  const s = state.status;
  const pill = $('#conn');
  if (!s.configured || s.error) {
    pill.innerHTML = `<span class="dot warn"></span> ${t('conn.offline')}`;
    return;
  }
  pill.innerHTML = `<span class="dot ok"></span> Atlas · MongoDB ${s.version}`;
  $('#stat-count').textContent = s.count;
  $('#stat-db').textContent = `${s.db}.${s.collection}`;

  renderIndexStatus();

  const sel = $('#model-select');
  const activeModel = indexByKind('auto')?.definition?.fields?.find((f) => f.type === 'autoEmbed')?.model;
  if (activeModel && document.activeElement !== sel) sel.value = activeModel;

  // Without a Voyage key the step still tells the story through the code tabs.
  show($('#manual-live'), s.voyage);
  $('#manual-info').innerHTML = t('manual.info', { embedded: s.embedded, count: s.count, badge: indexBadge(indexByKind('manual')) });
  show($('#manual-embed'), s.embedded < s.count);
  show($('#manual-index'), !indexByKind('manual'));
  show($('#text-index'), !indexByKind('text'));
  $('#text-index-status').innerHTML = indexBadge(indexByKind('text'));
}

function indexBadge(idx) {
  if (!idx) return `<span class="tag gray">${t('idx.notCreated')}</span>`;
  const cls = idx.status === 'READY' && idx.queryable ? '' : idx.status === 'FAILED' || idx.status === 'STALE' ? 'err' : 'warn';
  return `<span class="tag ${cls}">${idx.status}${idx.queryable ? ' · queryable' : ''}</span>`;
}

function renderIndexStatus() {
  const box = $('#index-status');
  const idx = indexByKind('auto');
  box.innerHTML = '';
  show($('#create-auto'), !idx);
  if (!idx) {
    box.append(h('div', { class: 'muted' }, t('idx.missing')));
    return;
  }
  const at = LIFECYCLE.indexOf(idx.status);
  box.append(
    h('div', { class: 'idx-row' },
      h('span', { class: 'name' }, idx.name),
      h('div', { class: 'lifecycle' }, LIFECYCLE.map((st, i) => h('span', { class: `${i <= at ? 'on' : ''} ${i === at ? 'now' : ''}` }, st))),
      !LIFECYCLE.includes(idx.status) && h('span', { class: 'tag err' }, idx.status),
      h('span', { class: `tag ${idx.queryable ? '' : 'gray'}` }, idx.queryable ? 'queryable ✓' : 'not queryable'),
    ),
    h('details', {}, h('summary', {}, t('idx.raw')), jsonBlock(idx, 'latest')),
  );
}

/* ───────────── data ───────────── */

// Prices in the dataset are BRL; only the number formatting follows the UI language.
const money = (v) => Number(v).toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' });

async function loadProducts() {
  state.products = await api(`${API}/products`).catch(() => []);
  const tbody = $('#products-table tbody');
  tbody.innerHTML = '';
  state.products.forEach((p) => tbody.append(h('tr', {},
    h('td', {}, h('code', {}, p.sku)),
    h('td', {}, p.name, p.live && h('span', { class: 'tag', style: 'margin-left:.4rem' }, 'live')),
    h('td', {}, h('span', { class: 'tag gray' }, p.category)),
    h('td', {}, money(p.price)),
    h('td', { class: 'muted' }, p.description))));
  if (!state.products.length) tbody.append(h('tr', {}, h('td', { colspan: 5, class: 'muted' }, t('data.empty'))));
  const sel = $('#edit-product');
  const prev = sel.value;
  sel.innerHTML = '';
  state.products.forEach((p) => sel.append(h('option', { value: p._id }, `${p.name} — ${p.category}`)));
  if (prev) sel.value = prev;
}

/* ───────────── index ───────────── */

$('#model-select').append(...QUERY_MODELS.filter(Boolean).map((m) => h('option', { value: m }, m)));

$('#create-auto').onclick = (e) => busy(e.currentTarget, async () => {
  const r = await api(`${API}/indexes/auto`, { method: 'POST' });
  toast(r.exists ? t('toast.idxExists') : t('toast.idxSent'));
  await refreshStatus();
});
$('#model-apply').onclick = (e) => busy(e.currentTarget, async () => {
  const model = $('#model-select').value;
  await api(`${API}/indexes/auto/model`, { method: 'PUT', body: { model } });
  toast(t('toast.model', { model }));
  await refreshStatus();
});

/* ───────────── results rendering ───────────── */

const isVector = (mode) => mode === 'auto' || mode === 'manual';

function renderResult(r, i, { mode, max }) {
  const pct = isVector(mode) ? r.score * 100 : (r.score / (max || 1)) * 100;
  const fusion = r.scoreDetails?.details
    ?.map((d) => `${d.inputPipelineName}: ${d.rank === 'N/A' || d.rank == null ? '—' : `#${d.rank}`}`)
    .join(' · ');
  return h('div', { class: 'result', style: `animation-delay:${i * 40}ms` },
    h('span', { class: 'rank' }, `#${i + 1}`),
    h('h4', {}, r.name, r.live && h('span', { class: 'tag' }, 'live'), h('span', { class: 'score' }, r.score?.toFixed(4))),
    h('p', {}, r.description),
    h('div', { class: 'facts' },
      h('span', { class: 'tag gray' }, r.category),
      h('span', {}, money(r.price)),
      h('span', { class: `tag ${r.inStock ? '' : 'warn'}` }, r.inStock ? t('inStock') : t('outOfStock'))),
    fusion && h('div', { class: 'fusion' }, fusion),
    h('div', { class: 'scorebar' }, h('div', { style: `width:${Math.max(2, Math.min(100, pct))}%` })));
}

function renderResults(box, res) {
  box.innerHTML = '';
  if (!res.results.length) return box.append(h('div', { class: 'empty' }, t('res.empty')));
  const max = Math.max(...res.results.map((r) => r.score || 0));
  res.results.forEach((r, i) => box.append(renderResult(r, i, { mode: res.mode, max })));
}

function renderError(box, err) {
  box.innerHTML = '';
  box.append(h('div', { class: 'error-box', html: `<b>${err.code || t('error')}:</b> ${err.message}` }));
}

/* ───────────── search panel (steps 4 & 5) ───────────── */

function rangeField(label, attrs, fmt = (v) => v) {
  const out = h('span', { class: 'val' });
  const input = h('input', { type: 'range', ...attrs });
  const sync = () => (out.textContent = fmt(input.value));
  input.addEventListener('input', sync);
  sync();
  return { el: h('div', {}, h('label', {}, `${label} `, out), input), input };
}

function chipRow(chips, input, run) {
  return h('div', { class: 'chips' }, chips.map((c) => h('button', { class: 'chip', onclick: () => { input.value = c; run(); } }, c)));
}

function SearchPanel(root, { chips, defaultQuery, filters = false, presetFilters }) {
  const input = h('input', { type: 'text', value: defaultQuery, placeholder: t('search.placeholder') });
  const go = h('button', { class: 'btn primary' }, t('search.btn'));
  const limit = rangeField('limit', { min: 1, max: 20, value: 5 });
  const cands = rangeField('numCandidates', { min: 10, max: 1000, step: 10, value: 100 });
  const exact = h('input', { type: 'checkbox' });
  const qModel = h('select', {}, QUERY_MODELS.map((m) => h('option', { value: m }, m || t('ctl.indexDefault'))));
  const controls = h('div', { class: 'controls' },
    limit.el, cands.el,
    h('div', {}, h('label', {}, t('ctl.queryModel')), qModel),
    h('label', { class: 'toggle' }, exact, 'ENN (exact: true)'));
  exact.addEventListener('change', () => (cands.input.disabled = exact.checked));

  let cats = [], maxPrice, inStock;
  if (filters) {
    cats = CATEGORIES.map((c) => h('input', { type: 'checkbox', value: c, checked: presetFilters?.categories?.includes(c) }));
    maxPrice = rangeField(t('ctl.maxPrice'), { min: 50, max: 6000, step: 50, value: presetFilters?.maxPrice ?? 6000 }, (v) => (v >= 6000 ? t('ctl.noLimit') : money(v)));
    inStock = h('input', { type: 'checkbox', checked: presetFilters?.inStock });
    controls.append(
      h('div', { style: 'grid-column:1/-1' }, h('label', {}, t('ctl.categories')), h('div', { class: 'cat-list' }, cats.map((c) => h('label', {}, c, c.value)))),
      maxPrice.el,
      h('label', { class: 'toggle' }, inStock, t('ctl.inStock')));
  }

  const meta = h('div', { class: 'meta-line' });
  const list = h('div');
  const pipe = h('div');
  root.append(
    h('div', { class: 'search-box' }, input, go),
    chipRow(chips, input, run),
    controls,
    h('div', { class: 'results-wrap' }, h('div', {}, meta, list), h('div', {}, h('div', { class: 'eyebrow' }, t('pipeline.title')), pipe)));

  async function run() {
    const body = {
      mode: 'auto',
      text: input.value,
      limit: Number(limit.input.value),
      numCandidates: Number(cands.input.value),
      exact: exact.checked,
      model: qModel.value,
    };
    if (filters) {
      body.filters = {
        categories: cats.filter((c) => c.checked).map((c) => c.value),
        maxPrice: Number(maxPrice.input.value) >= 6000 ? null : Number(maxPrice.input.value),
        inStock: inStock.checked,
      };
    }
    go.disabled = true;
    meta.innerHTML = '<span class="spinner"></span>';
    try {
      const res = await api(`${API}/search`, { method: 'POST', body });
      meta.innerHTML = `<span>${t('meta.results')} <b>${res.results.length}</b></span><span>${t('meta.latency')} <b>${res.ms.total} ms</b></span><span>${exact.checked ? 'ENN' : 'ANN'}</span>`;
      renderResults(list, res);
      pipe.replaceChildren(jsonBlock(res.pipeline, 'aggregate()'));
    } catch (err) {
      meta.innerHTML = '';
      renderError(list, err);
      if (err.pipeline) pipe.replaceChildren(jsonBlock(err.pipeline, 'aggregate()'));
    } finally {
      go.disabled = false;
    }
  }
  go.onclick = run;
  input.addEventListener('keydown', (e) => e.key === 'Enter' && run());
}

SearchPanel($('#search-main'), { defaultQuery: t('q.main'), chips: t('chips.main') });

SearchPanel($('#search-filters'), {
  defaultQuery: t('q.filters'),
  chips: t('chips.filters'),
  filters: true,
  presetFilters: { categories: ['Photography', 'Electronics'], maxPrice: 1500, inStock: true },
});

/* ───────────── compare panel (steps 7 & 8) ───────────── */

function ComparePanel(root, { modes, chips, defaultQuery, weight = false }) {
  const input = h('input', { type: 'text', value: defaultQuery });
  const go = h('button', { class: 'btn primary' }, t('compare.btn'));
  const w = weight ? rangeField(t('compare.weight'), { min: 0, max: 1, step: 0.05, value: 0.6 }, (v) => `vector ${Number(v).toFixed(2)} · keyword ${(1 - v).toFixed(2)}`) : null;
  const cols = modes.map((m) => {
    const meta = h('div', { class: 'meta-line' });
    const list = h('div');
    const pipe = h('details', {}, h('summary', {}, t('compare.view')));
    const col = h('div', {}, h('div', { class: 'col-head' }, h('h3', {}, m.label), m.tag && h('span', { class: 'tag gray' }, m.tag)), meta, list, pipe);
    return { ...m, col, meta, list, pipe };
  });
  root.append(
    h('div', { class: 'search-box' }, input, go),
    chipRow(chips, input, run),
    w ? h('div', { class: 'controls' }, w.el) : '',
    h('div', { class: 'compare' }, cols.map((c) => c.col)));

  async function run() {
    go.disabled = true;
    await Promise.all(cols.map(async (c) => {
      c.meta.innerHTML = '<span class="spinner"></span>';
      try {
        const res = await api(`${API}/search`, { method: 'POST', body: { mode: c.mode, text: input.value, limit: 5, numCandidates: 100, vectorWeight: w ? Number(w.input.value) : undefined } });
        const parts = [`<span>total <b>${res.ms.total} ms</b></span>`];
        if (res.ms.embed != null) parts.push(`<span>${t('compare.embed')} <b>${res.ms.embed} ms</b></span>`, `<span>query <b>${res.ms.query} ms</b></span>`);
        c.meta.innerHTML = parts.join('');
        renderResults(c.list, res);
        c.pipe.replaceChildren(h('summary', {}, t('compare.view')), jsonBlock(res.pipeline, 'aggregate()'));
      } catch (err) {
        c.meta.innerHTML = '';
        renderError(c.list, err);
      }
    }));
    go.disabled = false;
  }
  go.onclick = run;
  input.addEventListener('keydown', (e) => e.key === 'Enter' && run());
  w?.input.addEventListener('change', run);
}

ComparePanel($('#compare-manual'), {
  defaultQuery: t('q.manual'),
  chips: t('chips.manual'),
  modes: [
    { mode: 'auto', label: 'autoEmbed', tag: 'query.text' },
    { mode: 'manual', label: 'Manual', tag: 'queryVector' },
  ],
});

ComparePanel($('#compare-hybrid'), {
  defaultQuery: t('q.hybrid'),
  chips: t('chips.hybrid'),
  weight: true,
  modes: [
    { mode: 'keyword', label: 'Keyword', tag: '$search' },
    { mode: 'auto', label: t('mode.semantic'), tag: '$vectorSearch' },
    { mode: 'hybrid', label: t('mode.hybrid'), tag: '$rankFusion' },
  ],
});

$('#manual-embed').onclick = (e) => busy(e.currentTarget, async () => {
  const r = await api(`${API}/embeddings/manual`, { method: 'POST' });
  toast(t('toast.embedded', { n: r.embedded, ms: r.ms }));
  await refreshStatus();
});
$('#manual-index').onclick = (e) => busy(e.currentTarget, async () => {
  const r = await api(`${API}/indexes/manual`, { method: 'POST' });
  toast(r.exists ? t('toast.manualExists') : t('toast.manualCreated'));
  await refreshStatus();
});
$('#text-index').onclick = (e) => busy(e.currentTarget, async () => {
  const r = await api(`${API}/indexes/text`, { method: 'POST' });
  toast(r.exists ? t('toast.textExists') : t('toast.textCreated'));
  await refreshStatus();
});

/* ───────────── live sync (step 6) ───────────── */

$('#sync-cat').append(...CATEGORIES.map((c) => h('option', { value: c, selected: c === 'Camping' }, c)));

function stamp(t0) {
  return `${((performance.now() - t0) / 1000).toFixed(1)}s`;
}

// Poll the probe endpoint until the document shows up in a semantic search.
async function measure({ id, text, timeline, timer, stateEl, t0 }) {
  let tick;
  if (timer) {
    tick = setInterval(() => (timer.textContent = stamp(t0)), 100);
  }
  const wait = h('li', { class: 'wait' }, h('time', {}, stamp(t0)), t('sync.waitEmbed'));
  timeline.append(wait);
  try {
    for (let attempt = 1; attempt <= 90; attempt++) {
      const r = await api(`${API}/products/${id}/probe`, { method: 'POST', body: { text } });
      if (r.found) {
        wait.remove();
        const secs = stamp(t0);
        timeline.append(h('li', { class: 'ok' }, h('time', {}, secs), t('sync.found', { rank: r.rank, score: r.score.toFixed(4), ms: r.ms })));
        if (stateEl) stateEl.textContent = t('sync.searchable');
        if (timer) timer.textContent = secs;
        return;
      }
      wait.replaceChildren(h('time', {}, stamp(t0)), t('sync.attempt', { n: attempt }));
      await new Promise((r) => setTimeout(r, 1000));
    }
    wait.className = '';
    wait.append(t('sync.timeout'));
  } catch (err) {
    wait.remove();
    timeline.append(h('li', {}, h('time', {}, stamp(t0)), t('sync.error', { msg: err.message })));
  } finally {
    clearInterval(tick);
  }
}

$('#sync-insert').onclick = (e) => busy(e.currentTarget, async () => {
  const timeline = $('#sync-timeline');
  timeline.innerHTML = '';
  $('#sync-state').textContent = t('sync.measuring');
  const t0 = performance.now();
  const doc = await api(`${API}/products`, {
    method: 'POST',
    body: { name: $('#sync-name').value, description: $('#sync-desc').value, category: $('#sync-cat').value, price: $('#sync-price').value },
  });
  timeline.append(h('li', { class: 'ok' }, h('time', {}, stamp(t0)), t('sync.inserted', { id: doc._id })));
  await measure({ id: doc._id, text: $('#sync-probe').value, timeline, timer: $('#sync-timer'), stateEl: $('#sync-state'), t0 });
  loadProducts();
});

$('#edit-apply').onclick = (e) => busy(e.currentTarget, async () => {
  const id = $('#edit-product').value;
  if (!id) return;
  const timeline = $('#edit-timeline');
  timeline.innerHTML = '';
  const t0 = performance.now();
  const doc = await api(`${API}/products/${id}`, { method: 'PATCH', body: { description: $('#edit-desc').value } });
  timeline.append(h('li', { class: 'ok' }, h('time', {}, stamp(t0)), t('sync.updated', { name: doc.name })));
  await measure({ id, text: $('#edit-probe').value, timeline, t0 });
  loadProducts();
});

/* ───────────── boot ───────────── */

const onEnter = { data: loadProducts, sync: loadProducts };

go(Number(location.hash.slice(1)) || 0);
refreshStatus();
loadProducts();
