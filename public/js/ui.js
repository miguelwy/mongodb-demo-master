// Shared helpers for every demo page.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), data);
  return data;
}

export function toast(message, kind = 'ok') {
  let box = $('.toasts');
  if (!box) document.body.append((box = h('div', { class: 'toasts' })));
  const t = h('div', { class: `toast ${kind}` }, message);
  box.append(t);
  setTimeout(() => t.remove(), kind === 'err' ? 7000 : 3500);
}

// Run an async action with a busy button and an error toast.
export async function busy(button, fn) {
  const label = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="spinner"></span> ${label}`;
  try {
    return await fn();
  } catch (err) {
    toast(err.message, 'err');
    throw err;
  } finally {
    button.disabled = false;
    button.innerHTML = label;
  }
}

function highlight(codeEl, lang) {
  codeEl.className = `language-${lang}`;
  if (window.hljs) window.hljs.highlightElement(codeEl);
}

const copyLabels = () => (document.documentElement.lang.startsWith('pt')
  ? { idle: 'copiar', done: 'copiado ✓' }
  : { idle: 'copy', done: 'copied ✓' });

// variants: { 'mongosh': {lang, code}, 'Node.js': {...}, ... } or a single {lang, code}
export function codeBlock(variants, { title } = {}) {
  const entries = 'code' in variants ? [[title || variants.lang, variants]] : Object.entries(variants);
  const pre = h('pre');
  const code = h('code');
  pre.append(code);
  let current = entries[0][1];
  const show = (v) => {
    current = v;
    code.textContent = v.code.trim();
    highlight(code, v.lang);
  };
  const tabs = h('div', { class: 'code-tabs' });
  if (entries.length > 1) {
    entries.forEach(([label, v], i) => {
      const b = h('button', { class: i === 0 ? 'active' : '', onclick: () => {
        $$('button:not(.copy)', tabs).forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        show(v);
      } }, label);
      tabs.append(b);
    });
  } else {
    tabs.append(h('span', { class: 'title' }, entries[0][0]));
  }
  const copy = h('button', { class: 'copy', onclick: async () => {
    await navigator.clipboard.writeText(current.code.trim());
    copy.textContent = copyLabels().done;
    setTimeout(() => (copy.textContent = copyLabels().idle), 1200);
  } }, copyLabels().idle);
  tabs.append(copy);
  show(current);
  return h('div', { class: 'code' }, tabs, pre);
}

export const jsonBlock = (obj, title = 'json') => codeBlock({ lang: 'json', code: JSON.stringify(obj, null, 2) }, { title });

export function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch {}
  if (saved) document.documentElement.dataset.theme = saved;
  const btn = $('[data-theme-toggle]');
  btn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  });
}
