#!/usr/bin/env python3
"""
Normalize all 101 HTML course files to a canonical design system.
- Replaces :root CSS variables with canonical tokens
- Extracts shared CSS to course-kit.css
- Extracts shared JS to course-kit.js  
- Adds navigation bar for parcours linkage
"""

import os
import re
import json
from pathlib import Path

CORPUS_DIR = Path("/home/chelmooz/Downloads/tuteur scholastique update/tuteur-scolastique/data/corpus")

# ============================================================
# CANONICAL DESIGN TOKENS
# ============================================================

CANONICAL_ROOT = {
    # Core colors (dark theme, aligned with React app)
    "--bg": "#07111f",
    "--bg-elevated": "#0d1b2c",
    "--panel": "#101f33",
    "--panel-hover": "#152a41",
    "--line": "#27415f",
    "--line-soft": "rgba(148,163,184,0.10)",
    "--txt": "#eef6ff",
    "--txt-dim": "#94a3b8",
    "--muted": "#64748b",
    
    # Accent palette (indigo/cyan - matches React app)
    "--accent": "#6366f1",        # indigo-500
    "--accent-soft": "rgba(99,102,241,0.12)",
    "--accent-glow": "rgba(99,102,241,0.28)",
    "--accent-2": "#22d3ee",       # cyan-400
    "--accent-2-soft": "rgba(34,211,228,0.12)",
    
    # Semantic colors
    "--ok": "#22c55e",             # green-500
    "--ok-soft": "rgba(34,197,94,0.12)",
    "--warn": "#f59e0b",           # amber-500
    "--warn-soft": "rgba(245,158,11,0.12)",
    "--bad": "#ef4444",            # red-500
    "--bad-soft": "rgba(239,68,68,0.12)",
    
    # Typography
    "--font-sans": "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    "--font-mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    "--text-base": "16px",
    "--leading": "1.6",
    
    # Spacing
    "--space-xs": "4px",
    "--space-sm": "8px",
    "--space-md": "16px",
    "--space-lg": "24px",
    "--space-xl": "32px",
    
    # Radius
    "--radius-sm": "6px",
    "--radius-md": "12px",
    "--radius-lg": "16px",
    "--radius-full": "9999px",
    
    # Shadows
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.3)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.35)",
    "--shadow-lg": "0 14px 40px rgba(0,0,0,0.4)",
    
    # Transitions
    "--transition-fast": "150ms ease",
    "--transition-normal": "250ms ease",
    "--transition-slow": "350ms ease",
}

# Course-specific accent overrides (optional per-course flavor)
COURSE_ACCENTS = {
    "rag": {"--accent": "#22d3ee", "--accent-2": "#5eead4"},           # cyan/teal
    "zero": {"--accent": "#6ee7a0", "--accent-2": "#c7f36b"},         # green/lime
    "ai-engineer": {"--accent": "#b79cff", "--accent-2": "#6ee7f5"},  # violet/cyan
    "7-couches": {"--accent": "#f59e0b", "--accent-2": "#fde68a"},    # amber/gold
    "rag-agentique": {"--accent": "#a855f7", "--accent-2": "#d8b4fe"}, # purple
    "crag": {"--accent": "#ec4899", "--accent-2": "#f9a8d4"},         # pink
    "multi-agent": {"--accent": "#f97316", "--accent-2": "#fdba74"},  # orange
    "vector": {"--accent": "#14b8a6", "--accent-2": "#5eead4"},       # teal
    "architecture": {"--accent": "#6366f1", "--accent-2": "#a78bfa"}, # indigo/violet
    "security": {"--accent": "#ef4444", "--accent-2": "#fca5a5"},     # red
    "default": {"--accent": "#6366f1", "--accent-2": "#22d3ee"},      # indigo/cyan
}

def detect_course_category(filename):
    """Detect course category from filename for accent override."""
    name = filename.lower()
    if any(k in name for k in ["rag-data", "rag-multimodal", "rag-agent", "streaming"]):
        return "rag"
    if "zero" in name or "0-ai" in name:
        return "zero"
    if "ai-engineer" in name or "devenir-ai" in name:
        return "ai-engineer"
    if "7-couche" in name or "7couche" in name:
        return "7-couches"
    if "agentique" in name or "agent-ia" in name:
        return "rag-agentique"
    if "crag" in name:
        return "crag"
    if "multi-agent" in name or "multiagent" in name:
        return "multi-agent"
    if "vector" in name or "base-vector" in name or "chroma" in name:
        return "vector"
    if "architect" in name or "production" in name or "backend" in name:
        return "architecture"
    if "securite" in name or "guardrail" in name or "safety" in name:
        return "security"
    return "default"

# ============================================================
# SHARED CSS (course-kit.css)
# ============================================================

COURSE_KIT_CSS = """:root {
  /* === Canonical tokens injected per-course === */
  /* --bg, --panel, --line, --txt, --muted, --accent, --accent-2, --ok, --warn, --bad, etc. */
}

/* === Layout === */
.wrap { max-width: 1050px; margin: auto; padding: var(--space-lg); }
.header { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--bg) 94%, transparent); border-bottom: 1px solid var(--line); backdrop-filter: blur(12px); }
.header-inner { display: flex; justify-content: space-between; gap: var(--space-md); align-items: center; }
.eyebrow { color: var(--accent-2); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: .75rem; }
.progress { height: 8px; background: var(--panel-hover); border-radius: var(--radius-full); overflow: hidden; margin-top: var(--space-md); }
.bar { height: 100%; width: 0; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width var(--transition-normal); }
.tabs { display: flex; gap: 8px; overflow: auto; padding: var(--space-sm) 0; }

/* === Buttons === */
.btn, .tabs button { border: 1px solid var(--line); background: var(--panel); color: var(--txt); border-radius: var(--radius-md); padding: 9px 13px; cursor: pointer; white-space: nowrap; font: inherit; transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast); }
.btn:hover, .tabs button:hover { background: var(--panel-hover); }
.btn:focus-visible, .tabs button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.tabs button.active, .btn.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 700; }
.btn.ghost { background: transparent; }
.btn.danger { background: var(--bad-soft); border-color: var(--bad); color: var(--bad); }

/* === Cards & Modules === */
.card { background: color-mix(in srgb, var(--panel) 92%, transparent); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: var(--space-lg); margin: var(--space-lg) 0; box-shadow: var(--shadow-lg); }
.module { display: none; }
.module.active { display: block; animation: fade-in var(--transition-normal); }
@keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

/* === Typography === */
h1 { font-size: clamp(1.8rem, 4vw, 3.5rem); line-height: 1.05; margin: .3em 0; }
h2 { color: var(--accent); margin-top: 0; }
h3 { color: var(--txt); }
.muted { color: var(--muted); }
.pill { display: inline-block; padding: 4px 9px; border-radius: var(--radius-full); background: var(--panel-hover); color: var(--accent-2); font-size: .8rem; font-weight: 600; }

/* === Grid === */
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-md); }

/* === Diagrams === */
.diagram { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 10px; margin: var(--space-md) 0; overflow: auto; }
.diagram svg { width: 100%; height: auto; }
.flow { stroke-dasharray: 8 8; animation: dash 2s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -32; } }
@media (prefers-reduced-motion: reduce) { .flow { animation: none; } }

/* === Quiz === */
.quiz { margin-top: var(--space-lg); }
.quiz h3 { margin-bottom: var(--space-sm); }
.choice { display: block; width: 100%; text-align: left; border: 1px solid var(--line); background: var(--panel); color: var(--txt); border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); margin: var(--space-xs) 0; cursor: pointer; transition: background var(--transition-fast), border-color var(--transition-fast); }
.choice:hover { background: var(--panel-hover); }
.choice:disabled { cursor: default; opacity: 0.7; }
.choice.correct { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
.choice.wrong { background: var(--bad-soft); border-color: var(--bad); color: var(--bad); }
.feedback { margin-top: var(--space-sm); font-size: .9rem; }

/* === Checklists === */
.check { display: block; margin: var(--space-sm) 0; cursor: pointer; font-size: .95rem; }
.check input { margin-right: var(--space-sm); accent-color: var(--accent); }

/* === Footer Navigation === */
.footer-nav { display: flex; justify-content: space-between; gap: var(--space-md); padding: var(--space-lg); border-top: 1px solid var(--line); margin-top: var(--space-xl); }
.footer-nav .btn { flex: 1; text-align: center; }

/* === Parcours Navigation Bar (injected at top) === */
.parcours-bar { background: var(--panel); border-bottom: 1px solid var(--line); padding: var(--space-sm) var(--space-md); font-size: .85rem; display: flex; items-center; gap: var(--space-md); flex-wrap: wrap; }
.parcours-bar a { color: var(--accent-2); text-decoration: none; padding: 2px 8px; border-radius: var(--radius-sm); transition: background var(--transition-fast); }
.parcours-bar a:hover { background: var(--accent-soft); color: var(--accent); }
.parcours-bar .current { color: var(--txt); font-weight: 600; pointer-events: none; }
.parcours-bar .sep { color: var(--muted); }

/* === Copy button === */
.copy-btn { margin-top: var(--space-sm); }

/* === Reset === */
* { box-sizing: border-box; }
body { margin: 0; background: radial-gradient(circle at top, color-mix(in srgb, var(--panel) 30%, var(--bg)) 0%, var(--bg) 55%); color: var(--txt); font: var(--text-base)/var(--leading) var(--font-sans); }
"""


# ============================================================
# SHARED JS (course-kit.js)
# ============================================================

COURSE_KIT_JS = """// === course-kit.js ===
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
          if (fb) { fb.textContent = 'À revoir : relisez l\'idée clé de ce module.'; fb.style.color = 'var(--bad)'; }
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
"""


def build_canonical_root(course_category):
    """Build canonical :root block for a specific course."""
    root = CANONICAL_ROOT.copy()
    accents = COURSE_ACCENTS.get(course_category, COURSE_ACCENTS["default"])
    root.update(accents)
    
    # Format as CSS
    lines = [":root {"]
    for k, v in root.items():
        lines.append(f"  {k}: {v};")
    lines.append("}")
    return "\n".join(lines)


def normalize_file(filepath, dry_run=False):
    """Normalize a single HTML file."""
    content = filepath.read_text(encoding='utf-8')
    
    # Detect course category
    category = detect_course_category(filepath.name)
    canonical_root = build_canonical_root(category)
    
    # Extract original <style> content
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if not style_match:
        return {"file": filepath.name, "status": "no-style-tag"}
    
    original_css = style_match.group(1)
    
    # Replace :root block
    new_css = re.sub(
        r':root\s*{[\s\S]*?}',
        canonical_root,
        original_css,
        count=1
    )
    
    # Also replace any other :root occurrences (shouldn't be many)
    new_css = re.sub(
        r':root\s*{[\s\S]*?}',
        canonical_root,
        new_css
    )
    
    # Inject course-kit.css link and remove inline styles (keep only course-specific overrides)
    # For now, we'll keep a minimal inline style for any course-specific overrides
    # and link to course-kit.css
    
    # Build new <head> with links
    new_head = f"""<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{re.search(r'<title>(.*?)</title>', content).group(1) if re.search(r'<title>(.*?)</title>', content) else filepath.stem}</title>
<link rel="stylesheet" href="/course-kit.css">
<style>
{canonical_root}
</style>
</head>"""
    
    # Replace head
    new_content = re.sub(r'<head>.*?</head>', new_head, content, flags=re.DOTALL)
    
    # Convert inline answer handlers to data-correct attributes for new pattern
    # onclick="answer(this, true)" -> data-correct="true" (keep onclick for legacy)
    def convert_answer_handler(match):
        btn_tag = match.group(0)
        # Extract the boolean value
        onclick_match = re.search(r'onclick=["\']answer\(this,\s*(true|false)\)["\']', btn_tag)
        if onclick_match:
            correct_val = onclick_match.group(1)
            # Add data-correct attribute if not present
            if 'data-correct=' not in btn_tag:
                # Insert before the onclick attribute
                btn_tag = btn_tag.replace(onclick_match.group(0), f'data-correct="{correct_val}" {onclick_match.group(0)}')
        return btn_tag
    
    new_content = re.sub(r'<button[^>]*class="choice"[^>]*onclick="answer\(this,\s*(true|false)\)"[^>]*>', convert_answer_handler, new_content)
    
    # Inject parcours bar after <body> if not present
    if 'parcours-bar' not in new_content:
        parcours_html = build_parcours_bar(filepath.name)
        new_content = new_content.replace('<body>', '<body>\n' + parcours_html)
    
    # Inject course-kit.js before </body>
    if 'course-kit.js' not in new_content:
        new_content = new_content.replace('</body>', '<script src="/course-kit.js"></script>\n</body>')
    
    # Remove inline script that duplicates course-kit.js functionality
    # Keep only course-specific scripts (if any)
    new_content = re.sub(
        r'<script>\s*const modules=\[.*?</script>',
        '',
        new_content,
        flags=re.DOTALL
    )
    
    if not dry_run:
        filepath.write_text(new_content, encoding='utf-8')
    
    return {"file": filepath.name, "category": category, "status": "normalized"}


def build_parcours_bar(current_filename):
    """Build the parcours navigation bar."""
    # Define the course sequence
    courses = [
        ("1-fondations", "Fondations LLM", [
            "cours-interactif-architecture-transformer.html",
            "cours-interactif-zero-ai-stack.html",
            "cours-interactif-9-techniques-ia-moderne.html",
        ]),
        ("2-rag", "RAG Avancé", [
            "cours-interactif-5-familles-rag.html",
            "cours-interactif-rag-data-streaming.html",
            "cours-interactif-rag-multimodal-deux-architectures.html",
            "cours-interactif-architecture-rag-agentique.html",
            "cours-interactif-trois-ages-rag.html",
            "cours-interactif-deep-research-langgraph.html",
        ]),
        ("3-agents", "Agents & MCP", [
            "cours-interactif-graphe-ia-agentique.html",
            "cours-interactif-devenir-ai-engineer.html",
            "cours-interactif-connaissance-persistante.html",
            "cours-interactif-architecture-ia-zero-cost.html",
            "cours-interactif-stack-agent-ia.html",
            "cours-interactif-guide-concepts-systemes-ia.html",
            "cours-interactif-maitriser-ingenierie-ia.html",
        ]),
        ("4-specialisation", "Spécialisation Drive", [
            "cours-interactif-parcours-tuteur-6-semaines.html",
            # Advanced drive files...
        ]),
    ]
    
    # Flatten and find current index
    flat = []
    for _, _, files in courses:
        flat.extend(files)
    
    try:
        idx = flat.index(current_filename)
    except ValueError:
        idx = 0
    
    # Build nav
    parts = []
    for phase_id, phase_name, files in courses:
        parts.append(f'<span class="sep">{phase_name}</span>')
        for f in files:
            cls = 'current' if f == current_filename else ''
            parts.append(f'<a href="{f}" class="{cls}">{f.replace("cours-interactif-", "").replace(".html", "").replace("-", " ").title()}</a>')
        if phase_id != courses[-1][0]:
            parts.append('<span class="sep">→</span>')
    
    return f'<nav class="parcours-bar" aria-label="Navigation du parcours">{" ".join(parts)}</nav>'


def write_shared_assets():
    """Write course-kit.css and course-kit.js to corpus directory."""
    (CORPUS_DIR / "course-kit.css").write_text(COURSE_KIT_CSS, encoding='utf-8')
    (CORPUS_DIR / "course-kit.js").write_text(COURSE_KIT_JS, encoding='utf-8')
    print("Written: course-kit.css, course-kit.js")


def main():
    import sys
    dry_run = "--dry-run" in sys.argv
    
    write_shared_assets()
    
    html_files = list(CORPUS_DIR.glob("*.html"))
    results = []
    
    for f in html_files:
        if f.name in ("course-kit.css", "course-kit.js"):
            continue
        result = normalize_file(f, dry_run=dry_run)
        results.append(result)
        print(f"  {result['status']}: {result['file']} ({result.get('category', '?')})")
    
    print(f"\nProcessed {len(results)} files")
    if dry_run:
        print("DRY RUN - no files modified. Run without --dry-run to apply.")


if __name__ == "__main__":
    main()