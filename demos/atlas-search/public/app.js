import { $, $$, h, api, toast, busy, codeBlock, jsonBlock, esc, initTheme } from '/js/ui.js';
import { createI18n } from '/js/i18n.js';
import { initSteps } from '/js/steps.js';
import { dicts } from './i18n.js';
import { getSnippets } from './snippets.js';

const API = '/api/atlas-search';
const INDEX_NAME = 'catalog_search';
const LIFECYCLE = ['PENDING', 'BUILDING', 'READY'];
// Must match PRICE_BOUNDARIES in ../indexes.js.
const PRICE_BOUNDARIES = [0, 100, 300, 1000, 3000, 10000];

const { lang, t, apply, initToggle } = createI18n(dicts);
const state = { status: null };

apply();
initToggle();
initTheme();
const snippets = getSnippets(lang);
$$('[data-snippet]').forEach((el) => el.append(codeBlock(snippets[el.dataset.snippet])));

const search = (body) => api(`${API}/search`, { method: 'POST', body: { lang, ...body } });
const show = (el, visible) => (el.style.display = visible ? '' : 'none');
// Prices in the dataset are BRL; only the number formatting follows the UI language.
const money = (v) => Number(v).toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const category = (c) => t(`cat.${c}`);

/* ───────────── status ───────────── */

const searchIndex = () => state.status?.indexes?.find((i) => i.name === INDEX_NAME);

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
  $('#syn-coll').textContent = `${s.db}.${s.synonymsCollection}`;
  renderIndexStatus();
}

function renderIndexStatus() {
  const box = $('#index-status');
  const idx = searchIndex();
  box.innerHTML = '';
  show($('#create-index'), !idx);
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

$('#create-index').onclick = (e) => busy(e.currentTarget, async () => {
  const r = await api(`${API}/index`, { method: 'POST' });
  toast(r.exists ? t('toast.idxExists') : t('toast.idxSent'));
  await refreshStatus();
});

/* ───────────── data ───────────── */

async function loadProducts() {
  const products = await api(`${API}/products?lang=${lang}`).catch(() => []);
  const tbody = $('#products-table tbody');
  tbody.innerHTML = '';
  products.forEach((p) => tbody.append(h('tr', {},
    h('td', {}, h('code', {}, p.sku)),
    h('td', {}, p.name),
    h('td', {}, h('span', { class: 'tag gray' }, category(p.category))),
    h('td', {}, p.brand),
    h('td', {}, money(p.price)),
    h('td', { class: 'muted' }, p.description))));
  if (!products.length) tbody.append(h('tr', {}, h('td', { colspan: 6, class: 'muted' }, t('data.empty'))));
}

/* ───────────── results rendering ───────────── */

// searchHighlights -> HTML with <mark> on the hits, or the plain field when nothing matched there.
function highlighted(r, field) {
  const hl = r.highlights?.filter((x) => x.path === `${field}.${lang}`);
  if (!hl?.length) return esc(r[field]);
  return hl
    .sort((a, b) => b.score - a.score)
    .slice(0, field === 'name' ? 1 : 2)
    .map((x) => x.texts.map((tx) => (tx.type === 'hit' ? `<mark>${esc(tx.value)}</mark>` : esc(tx.value))).join(''))
    .join(' … ');
}

function renderResult(r, i, { max, extra } = {}) {
  const scored = r.score > 0;
  const pct = scored ? (r.score / (max || 1)) * 100 : 0;
  return h('div', { class: 'result', style: `animation-delay:${i * 40}ms` },
    h('span', { class: 'rank' }, `#${i + 1}`),
    h('h4', {}, h('span', { html: highlighted(r, 'name') }), scored && h('span', { class: 'score' }, r.score.toFixed(3))),
    h('p', { html: highlighted(r, 'description') }),
    h('div', { class: 'facts' },
      h('span', { class: 'tag gray' }, category(r.category)),
      h('span', {}, r.brand),
      h('span', {}, money(r.price)),
      h('span', {}, `★ ${r.rating}`),
      h('span', { class: `tag ${r.inStock ? '' : 'warn'}` }, r.inStock ? t('inStock') : t('outOfStock'))),
    extra?.(r),
    scored && h('div', { class: 'scorebar' }, h('div', { style: `width:${Math.max(2, Math.min(100, pct))}%` })));
}

function renderResults(box, res, opts = {}) {
  box.innerHTML = '';
  if (!res.results.length) return box.append(h('div', { class: 'empty' }, t('res.empty')));
  const max = Math.max(...res.results.map((r) => r.score || 0));
  res.results.forEach((r, i) => box.append(renderResult(r, i, { max, ...opts })));
}

function renderError(box, err) {
  box.innerHTML = '';
  box.append(h('div', { class: 'error-box', html: `<b>${esc(err.code || t('error'))}:</b> ${esc(err.message)}` }));
}

const metaLine = (res) => `<span>${t('meta.results')} <b>${res.total ?? res.results.length}</b></span><span>${t('meta.latency')} <b>${res.ms} ms</b></span>`;

function chipRow(chips, input, run) {
  return h('div', { class: 'chips' }, chips.map((c) => h('button', { class: 'chip', onclick: () => { input.value = c; run(); } }, c)));
}

function rangeField(label, attrs, fmt = (v) => v) {
  const out = h('span', { class: 'val' });
  const input = h('input', { type: 'range', ...attrs });
  const sync = () => (out.textContent = fmt(input.value));
  input.addEventListener('input', sync);
  sync();
  return { el: h('div', {}, h('label', {}, `${label} `, out), input), input };
}

const checkbox = (label, checked = false) => {
  const input = h('input', { type: 'checkbox', checked });
  return { input, el: h('label', { class: 'toggle' }, input, h('span', { html: label })) };
};

/* ───────────── compare columns (steps 6 & 10) ───────────── */

function ComparePanel(root, { cols, chips, defaultQuery, controls, body = () => ({}) }) {
  const input = h('input', { type: 'text', value: defaultQuery, placeholder: t('search.placeholder') });
  const go = h('button', { class: 'btn primary' }, t('compare.btn'));
  const views = cols.map((c) => {
    const meta = h('div', { class: 'meta-line' });
    const list = h('div');
    const pipe = h('details', {}, h('summary', {}, t('compare.view')));
    const col = h('div', {}, h('div', { class: 'col-head' }, h('h3', {}, c.label), h('span', { class: 'tag gray' }, c.tag)), meta, list, pipe);
    return { ...c, col, meta, list, pipe };
  });
  root.append(
    h('div', { class: 'search-box' }, input, go),
    chipRow(chips, input, run),
    controls ? h('div', { class: 'controls' }, controls.map((c) => c.el)) : '',
    h('div', { class: 'compare' }, views.map((v) => v.col)));

  async function run() {
    go.disabled = true;
    await Promise.all(views.map(async (v) => {
      v.meta.innerHTML = '<span class="spinner"></span>';
      try {
        const res = await search({ text: input.value, ...v.body, ...(v.ownControls === false ? {} : body()) });
        v.meta.innerHTML = metaLine(res);
        renderResults(v.list, res);
        v.pipe.replaceChildren(h('summary', {}, t('compare.view')), jsonBlock(res.pipeline, 'aggregate()'));
      } catch (err) {
        v.meta.innerHTML = '';
        renderError(v.list, err);
      }
    }));
    go.disabled = false;
  }
  go.onclick = run;
  input.addEventListener('keydown', (e) => e.key === 'Enter' && run());
  controls?.forEach((c) => c.input.addEventListener('change', run));
  return { run, input };
}

const fuzzySelect = (() => {
  const input = h('select', {}, [0, 1, 2].map((n) => h('option', { value: n, selected: n === 1 }, n === 0 ? t('ctl.off') : `maxEdits: ${n}`)));
  return { input, el: h('div', {}, h('label', {}, 'fuzzy'), input) };
})();
const matchAll = checkbox('matchCriteria: "all"');
const highlight = checkbox('highlight', true);

ComparePanel($('#fulltext-panel'), {
  defaultQuery: t('q.fulltext'),
  chips: t('chips.fulltext'),
  controls: [fuzzySelect, matchAll, highlight],
  body: () => ({ fuzzy: Number(fuzzySelect.input.value), matchAll: matchAll.input.checked, highlight: highlight.input.checked }),
  cols: [
    { label: t('mode.regex'), tag: '$regex', body: { mode: 'regex' }, ownControls: false },
    { label: 'Atlas Search', tag: '$search · text', body: { mode: 'fulltext' } },
  ],
});

ComparePanel($('#synonyms-panel'), {
  defaultQuery: t('q.synonyms'),
  chips: t('chips.synonyms'),
  cols: [
    { label: t('syn.without'), tag: 'text', body: { mode: 'synonyms', synonyms: false } },
    { label: t('syn.with'), tag: 'synonyms: "catalog_synonyms"', body: { mode: 'synonyms', synonyms: true } },
  ],
});

/* ───────────── autocomplete (step 7) ───────────── */

const acInput = $('#ac-input');
const acList = $('#ac-list');
let acSeq = 0;

async function suggest() {
  const text = acInput.value.trim();
  const seq = ++acSeq;
  if (!text) {
    acList.innerHTML = '';
    $('#ac-meta').innerHTML = '';
    return;
  }
  try {
    const res = await search({ mode: 'autocomplete', text, limit: 6, fuzzy: $('#ac-fuzzy').checked ? 1 : 0 });
    if (seq !== acSeq) return; // a newer keystroke already answered
    acList.replaceChildren(...(res.results.length
      ? res.results.map((r) => h('li', {}, h('span', { html: highlighted(r, 'name') }), h('small', {}, `${category(r.category)} · ${money(r.price)}`)))
      : [h('li', { class: 'muted' }, t('ac.none'))]));
    $('#ac-meta').innerHTML = `<span>${t('ac.keystroke')} <b>${res.ms} ms</b></span><span>${t('meta.results')} <b>${res.results.length}</b></span>`;
    $('#ac-pipeline').replaceChildren(jsonBlock(res.pipeline, 'aggregate()'));
  } catch (err) {
    if (seq !== acSeq) return;
    acList.replaceChildren(h('li', {}, h('div', { class: 'error-box', html: esc(err.message) })));
  }
}

acInput.addEventListener('input', () => {
  clearTimeout(suggest.t);
  suggest.t = setTimeout(suggest, 120);
});
$('#ac-fuzzy').addEventListener('change', suggest);
$('#ac-chips').append(...t('chips.ac').map((c) => h('button', { class: 'chip', onclick: () => typeOut(c) }, c)));

// Types the chip one letter at a time, so the audience sees suggestions narrow down.
async function typeOut(word) {
  acInput.value = '';
  for (const ch of word) {
    acInput.value += ch;
    await suggest();
    await new Promise((r) => setTimeout(r, 140));
  }
  acInput.focus();
}

/* ───────────── relevance (step 8) ───────────── */

(function RelevancePanel(root) {
  const input = h('input', { type: 'text', value: t('q.relevance'), placeholder: t('search.placeholder') });
  const go = h('button', { class: 'btn primary' }, t('search.btn'));
  const ratingBoost = checkbox(t('rel.ratingBoost'));
  const stockBoost = checkbox(t('rel.stockBoost'));
  const details = checkbox('scoreDetails');
  const maxPrice = rangeField(t('ctl.maxPrice'), { min: 100, max: 6000, step: 100, value: 6000 }, (v) => (v >= 6000 ? t('ctl.noLimit') : money(v)));
  const controls = [ratingBoost, stockBoost, maxPrice, details];
  const meta = h('div', { class: 'meta-line' });
  const list = h('div');
  const pipe = h('div');
  root.append(
    h('div', { class: 'search-box' }, input, go),
    chipRow(t('chips.relevance'), input, run),
    h('div', { class: 'controls' }, controls.map((c) => c.el)),
    h('div', { class: 'results-wrap' }, h('div', {}, meta, list), h('div', {}, h('div', { class: 'eyebrow' }, t('pipeline.title')), pipe)));

  const explain = (r) => r.scoreDetails && h('details', { class: 'why' }, h('summary', {}, t('rel.why')), jsonBlock(r.scoreDetails, 'searchScoreDetails'));

  async function run() {
    go.disabled = true;
    meta.innerHTML = '<span class="spinner"></span>';
    try {
      const res = await search({
        mode: 'relevance',
        text: input.value,
        ratingBoost: ratingBoost.input.checked,
        stockBoost: stockBoost.input.checked,
        scoreDetails: details.input.checked,
        maxPrice: Number(maxPrice.input.value) >= 6000 ? null : Number(maxPrice.input.value),
      });
      meta.innerHTML = metaLine(res);
      renderResults(list, res, { extra: explain });
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
  controls.forEach((c) => c.input.addEventListener('change', run));
})($('#relevance-panel'));

/* ───────────── facets (step 9) ───────────── */

const facets = (function FacetsPanel(root) {
  const picked = { categories: new Set(), brands: new Set(), priceFrom: null };
  const input = h('input', { type: 'text', value: '', placeholder: t('facets.placeholder') });
  const go = h('button', { class: 'btn primary' }, t('search.btn'));
  const sort = h('select', {}, ['relevance', 'priceAsc', 'priceDesc', 'rating'].map((s) => h('option', { value: s }, t(`sort.${s}`))));
  const side = h('aside', { class: 'facet-side' });
  const meta = h('div', { class: 'meta-line' });
  const list = h('div');
  const pipe = h('details', {}, h('summary', {}, t('compare.view')));
  root.append(
    h('div', { class: 'search-box' }, input, go),
    chipRow(t('chips.facets'), input, run),
    h('div', { class: 'facet-layout' }, side, h('div', {},
      h('div', { class: 'facet-top' }, meta, h('label', { class: 'sort' }, t('facets.sort'), sort)), list, pipe)));

  const priceLabel = (from) => {
    const to = PRICE_BOUNDARIES.find((b) => b > from);
    return to ? `${money(from)} – ${money(to)}` : `${money(from)}+`;
  };

  function group(title, buckets, { label, isOn, toggle }) {
    return h('div', { class: 'facet-group' },
      h('h4', {}, title),
      buckets.length
        ? buckets.map((b) => h('label', { class: `facet ${isOn(b._id) ? 'on' : ''}` },
          h('input', { type: 'checkbox', checked: isOn(b._id), onchange: () => { toggle(b._id); run(); } }),
          h('span', {}, label(b._id)), h('b', {}, b.count)))
        : h('div', { class: 'muted' }, '—'));
  }

  const flip = (set, v) => (set.has(v) ? set.delete(v) : set.add(v));

  function renderFacets(f = {}) {
    side.replaceChildren(
      group(t('facets.category'), f.category ?? [], { label: category, isOn: (v) => picked.categories.has(v), toggle: (v) => flip(picked.categories, v) }),
      group(t('facets.brand'), f.brand ?? [], { label: (v) => v, isOn: (v) => picked.brands.has(v), toggle: (v) => flip(picked.brands, v) }),
      // Empty number buckets come back with count 0; hide them.
      group(t('facets.price'), (f.price ?? []).filter((b) => b.count > 0 || picked.priceFrom === b._id), {
        label: priceLabel,
        isOn: (v) => picked.priceFrom === v,
        toggle: (v) => (picked.priceFrom = picked.priceFrom === v ? null : v),
      }),
      (picked.categories.size || picked.brands.size || picked.priceFrom != null)
        ? h('button', { class: 'btn sm', onclick: () => { picked.categories.clear(); picked.brands.clear(); picked.priceFrom = null; run(); } }, t('facets.clear'))
        : '');
  }

  async function run() {
    go.disabled = true;
    meta.innerHTML = '<span class="spinner"></span>';
    try {
      const res = await search({
        mode: 'facets',
        text: input.value,
        limit: 8,
        sort: sort.value,
        categories: [...picked.categories],
        brands: [...picked.brands],
        priceFrom: picked.priceFrom,
      });
      meta.innerHTML = metaLine(res);
      renderFacets(res.facets);
      renderResults(list, res);
      pipe.replaceChildren(h('summary', {}, t('compare.view')), jsonBlock(res.pipeline, 'aggregate()'));
    } catch (err) {
      meta.innerHTML = '';
      renderError(list, err);
    } finally {
      go.disabled = false;
    }
  }
  go.onclick = run;
  input.addEventListener('keydown', (e) => e.key === 'Enter' && run());
  sort.addEventListener('change', run);
  return { run };
})($('#facets-panel'));

/* ───────────── live synonyms (step 10) ───────────── */

async function loadSynonyms() {
  const docs = await api(`${API}/synonyms`).catch(() => []);
  $('#syn-list').replaceChildren(...docs.map((d) => h('li', { class: d.live ? 'live' : '' },
    h('code', {}, d.mappingType), ' ', d.synonyms.join(' ⇄ '), d.live && h('span', { class: 'tag' }, 'live'))));
}

const stamp = (t0) => `${((performance.now() - t0) / 1000).toFixed(1)}s`;

$('#syn-add').onclick = (e) => busy(e.currentTarget, async () => {
  const timeline = $('#syn-timeline');
  const probe = $('#syn-probe').value.trim();
  timeline.innerHTML = '';
  const before = await search({ mode: 'synonyms', text: probe, synonyms: true });
  if (before.results.length) {
    timeline.append(h('li', {}, h('time', {}, '0.0s'), t('syn.alreadyMatches', { q: probe })));
    return;
  }
  $('#syn-state').textContent = t('syn.measuring');
  const t0 = performance.now();
  const tick = setInterval(() => ($('#syn-timer').textContent = stamp(t0)), 100);
  try {
    const doc = await api(`${API}/synonyms`, { method: 'POST', body: { words: $('#syn-words').value } });
    timeline.append(h('li', { class: 'ok' }, h('time', {}, stamp(t0)), t('syn.inserted', { words: doc.synonyms.join(' ⇄ ') })));
    loadSynonyms();
    const wait = h('li', { class: 'wait' }, h('time', {}, stamp(t0)), t('syn.waitMap'));
    timeline.append(wait);
    for (let attempt = 1; attempt <= 120; attempt++) {
      const res = await search({ mode: 'synonyms', text: probe, synonyms: true });
      if (res.results.length) {
        wait.remove();
        const secs = stamp(t0);
        timeline.append(h('li', { class: 'ok' }, h('time', {}, secs), t('syn.found', { q: probe, n: res.results.length, name: res.results[0].name })));
        $('#syn-state').textContent = t('syn.applied');
        $('#syn-timer').textContent = secs;
        return;
      }
      wait.replaceChildren(h('time', {}, stamp(t0)), t('syn.attempt', { n: attempt }));
      await new Promise((r) => setTimeout(r, 1000));
    }
    wait.className = '';
    wait.append(t('syn.timeout'));
  } finally {
    clearInterval(tick);
  }
});

/* ───────────── boot ───────────── */

initSteps({
  t,
  onEnter: {
    data: loadProducts,
    facets: () => facets.run(),
    synonyms: loadSynonyms,
  },
});
refreshStatus();
loadProducts();
