// === course-kit.js ===
// Shared interactive logic for all course HTML files

(function() {
  'use strict';

  // --- Module Navigation ---
  function initModules() {
    const modules = [...document.querySelectorAll('.module')];
    const tabs = document.getElementById('tabs');
    if (!modules.length || !tabs) return;
    
    let current = 0;
    let answers = 0;
    let answered = 0;
    const storageKey = getStorageKey();
    
    modules.forEach((m, i) => {
      const btn = document.createElement('button');
      btn.textContent = `${i + 1}. ${m.dataset.title}`;
      btn.type = 'button';
      btn.onclick = () => show(i);
      tabs.appendChild(btn);
    });
    
    function show(i) {
      current = Math.max(0, Math.min(i, modules.length - 1));
      modules.forEach((m, j) => m.classList.toggle('active', j === current));
      [...tabs.children].forEach((b, j) => b.classList.toggle('active', j === current));
      update();
    }
    
    window.next = () => show(current + 1);
    window.prev = () => show(current - 1);
    
    // Restore state
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (saved.current !== undefined) show(saved.current);
      answers = saved.answers || 0;
      answered = saved.answered || 0;
    } catch {}
    
    function update() {
      const p = modules.length > 1 ? Math.round((current / (modules.length - 1)) * 100) : 100;
      const bar = document.getElementById('bar');
      const score = document.getElementById('score');
      if (bar) bar.style.width = p + '%';
      if (score) score.textContent = `Progression : ${p}% • Quiz : ${answers}/${answered}`;
      localStorage.setItem(storageKey, JSON.stringify({ current, answers, answered }));
    }
    
    window.resetCourse = function() {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKey + '-checks');
      location.reload();
    };
    
    return { modules, update, getAnswers: () => answers, getAnswered: () => answered, incrementAnswers: () => answers++, incrementAnswered: () => answered++ };
  }

  // --- Quiz Answers ---
  function initQuiz(state) {
    document.querySelectorAll('.quiz .choice').forEach(btn => {
      btn.onclick = function() {
        const box = this.closest('.quiz') || this.parentElement;
        if (box.dataset.done) return;
        box.dataset.done = '1';
        state.incrementAnswered();
        const ok = this.dataset.correct === 'true';
        const fb = box.querySelector('.feedback');
        if (ok) {
          this.classList.add('correct');
          state.incrementAnswers();
          if (fb) { fb.textContent = '✓ Bonne réponse : le principe est correctement appliqué.'; fb.style.color = 'var(--ok)'; }
        } else {
          this.classList.add('wrong');
          if (fb) { fb.textContent = 'À revoir : relisez l'idée clé de ce module.'; fb.style.color = 'var(--bad)'; }
        }
        [...box.querySelectorAll('.choice')].forEach(b => b.disabled = true);
        state.update();
      };
    });
  }

  // --- Checklists ---
  function initChecklists(storageKey) {
    document.querySelectorAll('.check input').forEach(input => {
      input.onchange = function() {
        const checks = [...document.querySelectorAll('.check input')].map(x => x.checked);
        localStorage.setItem(storageKey + '-checks', JSON.stringify(checks));
      };
    });
    // Restore
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey + '-checks') || '[]');
      saved.forEach((checked, i) => {
        const input = document.querySelectorAll('.check input')[i];
        if (input) input.checked = checked;
      });
    } catch {}
  }

  // --- Copy to Clipboard ---
  window.copyText = async function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      await navigator.clipboard.writeText(el.textContent);
      const btn = event.target;
      const original = btn.textContent;
      btn.textContent = 'Copié ✓';
      setTimeout(() => btn.textContent = original, 1200);
    } catch {}
  };

  // --- Finish / Validation ---
  window.finish = function() {
    const done = [...document.querySelectorAll('.check input')].filter(x => x.checked).length;
    const total = document.querySelectorAll('.check input').length;
    const result = document.getElementById('result');
    if (result) {
      const state = window.__courseState;
      result.textContent = `Parcours validé : ${done}/${total} étapes. Score quiz : ${state?.getAnswers?.() || 0}/${state?.getAnswered?.() || 0}.`;
    }
  };

  // --- Storage Key ---
  function getStorageKey() {
    // Derive from page title or first h1
    const title = document.querySelector('h1')?.textContent || document.title;
    return 'course-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // --- Initialize on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    const state = initModules();
    window.__courseState = state;
    initQuiz(state);
    initChecklists(getStorageKey());
  });
})();
