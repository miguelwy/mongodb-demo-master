import { $, h, api, toast, busy, initTheme } from '/js/ui.js';
import { createI18n } from '/js/i18n.js';
import { dicts } from './i18n.js';
import { runbook } from './runbook.js';

const API = '/api/vector-search/presenter';
const INDEXES = [
  { kind: 'auto', name: 'products_autoembed' },
  { kind: 'text', name: 'products_text' },
  { kind: 'manual', name: 'products_vector_manual' },
];

const { lang, t, apply, initToggle } = createI18n(dicts);
apply();
initToggle();
initTheme();
$('#open-demo').href = `/demos/vector-search/?lang=${lang}`;

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

function renderStep(step, i) {
  const qa = step.ask.map((q) => `<div class="run-qa"><b>${q.q}</b>${q.a}</div>`).join('');
  return h('details', { class: 'run-step', open: i === 0 },
    h('summary', {}, step.title, h('span', { class: 'tag gray' }, step.time)),
    h('div', { class: 'run-body', html: `
      <div class="run-goal">${step.goal}</div>
      <div class="run-label">${t('label.say')}</div>
      ${step.say.map((line) => `<p class="run-say">${line}</p>`).join('')}
      <div class="run-label">${t('label.do')}</div>${list(step.do)}
      <div class="run-label">${t('label.tech')}</div>${list(step.tech)}
      <div class="run-label">${t('label.ask')}</div>${qa}
      ${step.next ? `<div class="run-next"><b>${t('label.next')}:</b> ${step.next}</div>` : ''}` }));
}

const stepEls = runbook[lang].map(renderStep);
$('#runbook').append(...stepEls);

const setAll = (open) => stepEls.forEach((el) => (el.open = open));
const allOpen = () => stepEls.every((el) => el.open);
const syncToggle = () => ($('#run-toggle').textContent = allOpen() ? t('collapseAll') : t('expandAll'));
$('#run-toggle').onclick = () => {
  setAll(!allOpen());
  syncToggle();
};
stepEls.forEach((el) => el.addEventListener('toggle', syncToggle));
$('#run-print').onclick = () => {
  setAll(true);
  print();
};

const check = (key, ok) => {
  const li = $(`[data-check="${key}"]`);
  li.classList.toggle('ok', ok);
  li.classList.toggle('bad', !ok);
};

function badge(idx) {
  if (!idx) return `<span class="tag gray">${t('notCreated')}</span>`;
  const ready = idx.status === 'READY' && idx.queryable;
  return `<span class="tag ${ready ? '' : 'warn'}">${idx.status}${idx.queryable ? ' · queryable' : ''}</span>`;
}

function renderIndexes(s) {
  $('#indexes').replaceChildren(...INDEXES.map(({ kind, name }) => {
    const idx = s.indexes.find((i) => i.name === name);
    const action = idx
      ? h('button', { class: 'btn sm danger', onclick: (e) => run(e, () => api(`${API}/indexes/${kind}`, { method: 'DELETE' }), { confirm: t('confirmDrop', { name }) }) }, t('drop'))
      : h('button', { class: 'btn sm', onclick: (e) => run(e, () => api(`${API}/indexes/${kind}`, { method: 'POST' })) }, t('create'));
    return h('tr', { class: 'index-row' }, h('td', {}, h('code', {}, name)), h('td', { html: badge(idx) }), h('td', {}, action));
  }));
}

function render(s) {
  const pill = $('#conn');
  check('configured', Boolean(s.configured));
  if (!s.configured || s.error) {
    pill.innerHTML = `<span class="dot ${s.configured ? 'err' : 'warn'}"></span> ${s.configured ? t('connError') : t('noUri')}`;
    check('connected', false);
    $('#env').innerHTML = s.error ? `<div class="muted">${s.error}</div>` : t('noUriDetail');
    return;
  }
  pill.innerHTML = `<span class="dot ok"></span> ${s.host} · ${s.version}`;
  const ready = (name) => s.indexes.some((i) => i.name === name && i.queryable && i.status === 'READY');
  check('connected', true);
  check('version', parseInt(s.version, 10) >= 8);
  check('data', s.count > 0);
  check('auto', ready('products_autoembed'));
  check('text', ready('products_text'));
  $('[data-check="voyage"]').classList.toggle('ok', s.voyage);
  $('#env').innerHTML = `<table>
    <tr><td>Host</td><td><code>${s.host}</code></td></tr>
    <tr><td>Namespace</td><td><code>${s.db}.${s.collection}</code></td></tr>
    <tr><td>${t('docs')}</td><td><code>${s.count}</code> (${t('liveDocs', { n: s.live })})</td></tr>
    <tr><td>${t('models')}</td><td><code>${s.autoModel}</code></td></tr>
  </table>`;
  renderIndexes(s);
}

async function refresh() {
  let s;
  try {
    s = await api(`${API}/status`);
  } catch (err) {
    s = { configured: true, error: err.message };
  }
  render(s);
  const building = s.indexes?.some((i) => !i.queryable || i.status !== 'READY');
  clearTimeout(refresh.t);
  refresh.t = setTimeout(refresh, building ? 3000 : 15000);
}

function run(e, action, { confirm: question } = {}) {
  if (question && !confirm(question)) return;
  return busy(e.currentTarget, async () => {
    await action();
    toast(t('done'));
    await refresh();
  });
}

$('#prepare').onclick = (e) => run(e, () => api(`${API}/prepare`, { method: 'POST' }));
$('#seed').onclick = (e) => run(e, () => api(`${API}/seed`, { method: 'POST' }), { confirm: t('confirmSeed') });
$('#clear-live').onclick = (e) => run(e, () => api(`${API}/products/live`, { method: 'DELETE' }));
$('#clear-vectors').onclick = (e) => run(e, () => api(`${API}/embeddings/manual`, { method: 'DELETE' }));
$('#teardown').onclick = (e) => run(e, () => api(`${API}/teardown`, { method: 'POST' }), { confirm: t('confirmTeardown') });

refresh();
