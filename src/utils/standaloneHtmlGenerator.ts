/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  PROJECT_OVERVIEW, 
  SEMAINE_1_DATA, 
  SEMAINE_2_PLAN, 
  DOCUMENTS_CATALOG, 
  GLOSSARY_ITEMS, 
  PROMPT_TEMPLATES 
} from '../data/projectData';

export function generateStandaloneHtml(): string {
  // Serialize data safely
  const projectJson = JSON.stringify({
    overview: PROJECT_OVERVIEW,
    semaine1: SEMAINE_1_DATA,
    semaine2: SEMAINE_2_PLAN,
    documents: DOCUMENTS_CATALOG,
    glossaire: GLOSSARY_ITEMS,
    templates: PROMPT_TEMPLATES
  });

  return `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tuteur Scolastique IA - Cursus AI Engineer & RAG Local</title>
  <style>
    :root {
      --bg: #030712;
      --card: #0f172a;
      --card-border: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #06b6d4;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.5;
      padding-bottom: 60px;
    }
    header {
      background-color: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 12px 24px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }
    .brand h1 { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; }
    .brand p { font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }
    .nav-tabs {
      display: flex;
      gap: 8px;
      max-width: 1280px;
      margin: 12px auto 0;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .nav-tab {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .nav-tab:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-main);
    }
    .nav-tab.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }
    main {
      max-width: 1280px;
      margin: 24px auto;
      padding: 0 20px;
    }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; animation: fadeIn 0.2s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    
    .card {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
    }
    .card-title {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-primary { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    
    pre {
      background: #020617;
      border: 1px solid #1e293b;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      margin: 8px 0;
    }
    .task-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .task-item.done {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.03);
    }
    .task-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
    }
    .task-header input[type="checkbox"] {
      margin-top: 4px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--success);
    }
    .search-bar {
      width: 100%;
      padding: 12px 16px;
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      color: white;
      font-size: 0.95rem;
      margin-bottom: 16px;
      outline: none;
    }
    .search-bar:focus { border-color: var(--primary); }
    .btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
    }
    .btn:hover { background: var(--primary-hover); }
    .btn-secondary {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
    }
    .btn-secondary:hover { background: #334155; }
  </style>
</head>
<body>

  <header>
    <div class="header-top">
      <div class="brand">
        <div class="brand-icon">TS</div>
        <div>
          <h1>Tuteur Scolastique IA</h1>
          <p>AI Engineer Edition • Ollama • RAG & Multi-Agents • Hors-ligne Autonome</p>
        </div>
      </div>
      <div>
        <span class="badge badge-success">Export Complet Drive</span>
      </div>
    </div>

    <div class="nav-tabs" id="tabContainer">
      <button class="nav-tab active" onclick="switchTab('diagnostic')">Diagnostic Projet</button>
      <button class="nav-tab" onclick="switchTab('roadmap')">Roadmap Jalon 1 (Tracker)</button>
      <button class="nav-tab" onclick="switchTab('corpus')">Corpus RAG (36 Docs)</button>
      <button class="nav-tab" onclick="switchTab('survival')">Boîte à Outils & Commandes</button>
      <button class="nav-tab" onclick="switchTab('lab')">Lab IA & Prompts</button>
      <button class="nav-tab" onclick="switchTab('semaine2')">Plan Jalon 2 (RAG)</button>
    </div>
  </header>

  <main>
    <!-- TAB 1: DIAGNOSTIC -->
    <section id="pane-diagnostic" class="tab-pane active">
      <div class="card" style="margin-bottom: 20px;">
        <h2 class="card-title">État d'Avancement & Synthèse du Diagnostic</h2>
        <p style="color: var(--text-muted); margin-bottom: 12px;">
          Toutes les sources de vos dossiers Google Drive ont été analysées et synthétisées. Le projet est structuré pour vous former au métier d'AI Engineer à travers un cas concret d'architecture RAG locale.
        </p>
        <div class="grid-3" style="margin-top: 16px;">
          <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid var(--card-border);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">Runtime & Moteur IA</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent);">Python + Ollama</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid var(--card-border);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">Sources RAG Cataloguées</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--primary);">36 Fichiers Techniques</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid var(--card-border);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">Méthodologie</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--success);">Pomodoro + CoT + RTOC</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">Règle d'Or Environnement Python (PEP 668)</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">
            Les systèmes modernes appliquent la norme <strong>PEP 668</strong>. Ne jamais utiliser <code>sudo pip install</code>. Toujours travailler dans un environnement virtuel isolé (<code>venv</code>).
          </p>
          <pre># Bonne pratique :
python -m venv .venv
source .venv/bin/activate
pip install requests langchain</pre>
        </div>

        <div class="card">
          <h3 class="card-title">Cycle RTOC Obligatoire</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            <strong>Run</strong> la commande unique.<br>
            <strong>Test</strong> avec un cas normal et un cas d'erreur.<br>
            <strong>Observe</strong> la sortie console.<br>
            <strong>Commit</strong> uniquement lorsque le critère de succès est vérifié.
          </p>
        </div>
      </div>
    </section>

    <!-- TAB 2: ROADMAP -->
    <section id="pane-roadmap" class="tab-pane">
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.2rem;">Suivi des Tâches Semaine 1 (Jalon 1)</h2>
        <span id="trackerProgressBadge" class="badge badge-success">Progression : 0 / 23</span>
      </div>
      <div id="roadmapTasksContainer"></div>
    </section>

    <!-- TAB 3: CORPUS -->
    <section id="pane-corpus" class="tab-pane">
      <h2 style="font-size: 1.2rem; margin-bottom: 12px;">Catalogue Exhaustif des 31 Sources du Corpus</h2>
      <input type="text" id="corpusSearch" class="search-bar" placeholder="Rechercher par titre, catégorie ou stratégie de chunking..." onkeyup="filterCorpus()">
      <div id="corpusGrid" class="grid-2"></div>
    </section>

    <!-- TAB 4: SURVIVAL -->
    <section id="pane-survival" class="tab-pane">
      <h2 style="font-size: 1.2rem; margin-bottom: 16px;">Boîte à Outils Terminal & Glossaire IA</h2>
      <div class="card" style="margin-bottom: 20px;">
        <h3 class="card-title">Les 10 Commandes Vitales</h3>
        <div id="survivalCommands"></div>
      </div>
      <div class="card">
        <h3 class="card-title">Glossaire des 20 Termes Fondamentaux</h3>
        <div id="glossaryList"></div>
      </div>
    </section>

    <!-- TAB 5: AI LAB -->
    <section id="pane-lab" class="tab-pane">
      <h2 style="font-size: 1.2rem; margin-bottom: 16px;">Lab IA & Modèles de Prompts</h2>
      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">Templates de Prompts Prêts à l'Emploi</h3>
          <div style="margin-bottom: 14px;">
            <strong>1. Contexte Débutant (PROMPT_CTX) :</strong>
            <pre>${PROMPT_TEMPLATES.PROMPT_CTX}</pre>
          </div>
          <div style="margin-bottom: 14px;">
            <strong>2. Raisonnement Pas à Pas (PROMPT_COT) :</strong>
            <pre>${PROMPT_TEMPLATES.PROMPT_COT}</pre>
          </div>
          <div style="margin-bottom: 14px;">
            <strong>3. Pédagogie Explicite (PROMPT_PED) :</strong>
            <pre>${PROMPT_TEMPLATES.PROMPT_PED}</pre>
          </div>
        </div>
        <div class="card">
          <h3 class="card-title">Test Local avec Ollama CLI</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px;">
            Interrogez directement votre modèle local en ligne de commande :
          </p>
          <pre>ollama run deepseek-r1:8b "Explique-moi la différence entre un commit et une branche Git en 3 phrases simples."</pre>
          <pre>curl -X POST http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:8b",
  "prompt": "Vérifie ce code Python : print(\\"Hello\\")",
  "stream": false
}'</pre>
        </div>
      </div>
    </section>

    <!-- TAB 6: SEMAINE 2 -->
    <section id="pane-semaine2" class="tab-pane">
      <h2 style="font-size: 1.2rem; margin-bottom: 16px;">Semaine 2 : Pipeline RAG & Base Vectorielle</h2>
      <div id="semaine2Container"></div>
    </section>
  </main>

  <script>
    const DATA = ${projectJson};
    let completedTasks = JSON.parse(localStorage.getItem('tuteur_standalone_tasks') || '{}');

    function switchTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      
      const pane = document.getElementById('pane-' + tabId);
      if (pane) pane.classList.add('active');
      
      const tabs = Array.from(document.querySelectorAll('.nav-tab'));
      const activeBtn = tabs.find(t => t.getAttribute('onclick').includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');
    }

    function toggleTask(id) {
      completedTasks[id] = !completedTasks[id];
      localStorage.setItem('tuteur_standalone_tasks', JSON.stringify(completedTasks));
      renderRoadmap();
    }

    function renderRoadmap() {
      const container = document.getElementById('roadmapTasksContainer');
      if (!container) return;
      container.innerHTML = '';

      let total = 0;
      let done = 0;

      Object.keys(DATA.semaine1).forEach(dayKey => {
        const day = DATA.semaine1[dayKey];
        const dayDiv = document.createElement('div');
        dayDiv.className = 'card';
        dayDiv.style.marginBottom = '20px';
        
        let html = '<h3 class="card-title" style="color: var(--accent);">' + day.date + ' — ' + day.objectif + '</h3>';
        
        day.pomodoros.forEach((pomo, pIdx) => {
          html += '<div style="margin: 16px 0 8px; font-weight: 600; color: #cbd5e1;">' + pomo.titre + '</div>';
          pomo.taches.forEach((t, tIdx) => {
            total++;
            const taskId = dayKey + '-' + pIdx + '-' + tIdx;
            const isDone = !!completedTasks[taskId];
            if (isDone) done++;

            html += '<div class="task-item ' + (isDone ? 'done' : '') + '">';
            html += '  <label class="task-header" onclick="toggleTask(\\'' + taskId + '\\')">';
            html += '    <input type="checkbox" ' + (isDone ? 'checked' : '') + ' onclick="event.stopPropagation(); toggleTask(\\'' + taskId + '\\')">';
            html += '    <div>';
            html += '      <strong style="font-size: 0.95rem;">' + t.label + '</strong>';
            html += '      <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">' + t.detail + '</p>';
            html += '    </div>';
            html += '  </label>';
            html += '  <pre>' + t.commande + '</pre>';
            html += '  <div style="font-size: 0.8rem; color: var(--success); margin-top: 4px;">Critère de succès : ' + t.succes + '</div>';
            html += '</div>';
          });
        });
        
        dayDiv.innerHTML = html;
        container.appendChild(dayDiv);
      });

      const badge = document.getElementById('trackerProgressBadge');
      if (badge) badge.innerText = 'Progression : ' + done + ' / ' + total;
    }

    function renderCorpus(filterText = '') {
      const grid = document.getElementById('corpusGrid');
      if (!grid) return;
      grid.innerHTML = '';

      const query = filterText.toLowerCase();
      const filtered = DATA.documents.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.filename.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      );

      filtered.forEach(d => {
        const item = document.createElement('div');
        item.className = 'card';
        item.innerHTML = 
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">' +
          '  <span class="badge badge-primary">' + d.category + '</span>' +
          '  <span class="badge badge-warning">' + d.importance + '</span>' +
          '</div>' +
          '<h4 style="font-size: 1rem; margin-bottom: 4px;">' + d.title + '</h4>' +
          '<code style="font-size: 0.75rem; color: #38bdf8;">' + d.filename + '</code>' +
          '<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;">' + d.description + '</p>' +
          '<div style="margin-top: 10px; font-size: 0.78rem; color: #a5b4fc; background: rgba(99,102,241,0.08); padding: 6px 10px; border-radius: 6px;">' +
          '  <strong>Chunking :</strong> ' + d.chunkingStrategy +
          '</div>';
        grid.appendChild(item);
      });
    }

    function filterCorpus() {
      const val = document.getElementById('corpusSearch').value;
      renderCorpus(val);
    }

    function renderSurvival() {
      const cmdsDiv = document.getElementById('survivalCommands');
      if (cmdsDiv) {
        cmdsDiv.innerHTML = 
          '<pre># 1. Dossier courant\\npwd\\n\\n' +
          '# 2. Liste détaillée\\nls -la\\n\\n' +
          '# 3. Activer venv Python\\nsource .venv/bin/activate\\n\\n' +
          '# 4. Statut Git\\ngit status\\n\\n' +
          '# 5. État Ollama\\ncurl http://localhost:11434/api/tags\\n\\n' +
          '# 6. Lister les modèles installés\\nollama list</pre>';
      }

      const glossDiv = document.getElementById('glossaryList');
      if (glossDiv) {
        let html = '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">';
        DATA.glossaire.forEach(g => {
          html += '<div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid var(--card-border);">';
          html += '  <strong style="color: var(--accent); font-size: 0.9rem;">' + g.terme + '</strong>';
          html += '  <p style="color: var(--text-muted); font-size: 0.82rem; margin-top: 4px;">' + g.definition + '</p>';
          html += '</div>';
        });
        html += '</div>';
        glossDiv.innerHTML = html;
      }
    }

    function renderSemaine2() {
      const container = document.getElementById('semaine2Container');
      if (!container) return;
      let html = '';
      DATA.semaine2.forEach(d => {
        html += '<div class="card" style="margin-bottom: 16px;">';
        html += '  <h3 class="card-title" style="color: var(--accent);">' + d.day + ' — ' + d.title + '</h3>';
        html += '  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;"><strong>Objectif :</strong> ' + d.goal + '</p>';
        html += '  <ul>';
        d.tasks.forEach(t => {
          html += '    <li style="margin-bottom: 6px; font-size: 0.85rem; color: #cbd5e1;">✅ ' + t + '</li>';
        });
        html += '  </ul>';
        html += '</div>';
      });
      container.innerHTML = html;
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      renderRoadmap();
      renderCorpus();
      renderSurvival();
      renderSemaine2();
    });
  </script>
</body>
</html>`;
}
