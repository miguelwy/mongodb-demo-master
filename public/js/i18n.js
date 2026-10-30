// Tiny i18n: dictionaries are plain objects of { key: string | (vars) => string }.
// Language comes from ?lang=, then the saved choice, then the browser.

export const LANGS = ['pt', 'en'];
const STORAGE_KEY = 'lang';

export function getLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) {
    try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch {}
    return fromUrl;
  }
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
  if (LANGS.includes(saved)) return saved;
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function setLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  location.href = url.toString();
}

export function createI18n(dicts, lang = getLang()) {
  const dict = dicts[lang] || dicts.pt;
  const t = (key, vars = {}) => {
    const v = dict[key] ?? dicts.pt[key];
    if (v == null) return key;
    return typeof v === 'function' ? v(vars) : v;
  };

  // data-i18n -> innerHTML (textContent for SVG), data-i18n-placeholder / -title / -aria-label -> attributes
  function apply(root = document) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el instanceof SVGElement) el.textContent = t(el.dataset.i18n);
      else el.innerHTML = t(el.dataset.i18n);
    });
    for (const attr of ['placeholder', 'title', 'aria-label', 'value']) {
      root.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
        const value = t(el.getAttribute(`data-i18n-${attr}`));
        if (attr === 'value') el.value = value;
        else el.setAttribute(attr, value);
      });
    }
  }

  // Button shows the language you switch TO.
  function initToggle(button = document.querySelector('[data-lang-toggle]')) {
    if (!button) return;
    const other = LANGS.find((l) => l !== lang);
    button.textContent = other.toUpperCase();
    button.title = other === 'en' ? 'Switch to English' : 'Mudar para português';
    button.addEventListener('click', () => setLang(other));
  }

  return { lang, t, apply, initToggle };
}
