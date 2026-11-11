// Step navigation shared by the guided demos: sidebar, stepper, keyboard and URL hash.
// The first .step is the cover (step 0). It stays out of the sidebar, so the sidebar
// numbers match the presenter script.
import { $, $$, h } from './ui.js';

export function initSteps({ t, onEnter = {} }) {
  const steps = $$('.step');
  const nav = $('#step-nav');
  let current = 0;
  const visited = new Set();

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

  go(Number(location.hash.slice(1)) || 0);
  return { go };
}
