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
  PROMPT_TEMPLATES,
  DocumentItem,
  GlossaryItem
} from '../data/projectData';

export function generateReadmeMarkdown(): string {
  return `# Tuteur Scolastique IA - Cursus AI Engineer & RAG Local

> **Portail d'Apprentissage et de Développement AI Engineer**  
> Dépôt & Corpus Google Drive : \`${PROJECT_OVERVIEW.driveFolderId}\`  
> Environnement Cible : Python 3.12, Ollama, DeepSeek-R1, ChromaDB, LangGraph.

---

## 🎯 Vue d'ensemble du Projet

Ce projet a pour objectif de construire un **tuteur scolaire intelligent autonome** servant de projet fil rouge pour devenir **AI Engineer**. Il s'appuie sur :
1. **Ollama local** hébergeant des modèles open-weights optimisés pour le raisonnement (ex. \`deepseek-r1:8b\`, \`qwen2.5:7b\`, \`mistral:7b\`).
2. **Un pipeline RAG (Retrieval-Augmented Generation)** alimenté par un corpus de **36 documents de référence** (architectures RAG, Protocoles MCP, Tokenisation, Embeddings, Multi-Agents, Sécurité).
3. **Une progression structurée** (pédagogie explicite, tests unitaires RTOC, benchmarking Ragas).

---

## 📚 Structure des Fichiers Exportés

| Fichier | Rôle |
|---|---|
| \`site-complet-tuteur-scolastique.html\` | **Le site interactif complet autonome** (utilisable hors-ligne dans tout navigateur) |
| \`01-DIAGNOSTIC-ET-CADRAGE.md\` | Fiche complète du diagnostic environnement, prérequis et métriques clés |
| \`02-ROADMAP-JALON-1-ET-2.md\` | Planning pas à pas des 2 premières semaines avec chaque commande et critère de succès |
| \`03-BOITE-A-OUTILS-TERMINAL-ET-GLOSSAIRE.md\` | Commandes vitales Python/Git/Ollama et glossaire des termes IA indispensables |
| \`04-CATALOGUE-36-SOURCES-RAG.md\` | Inventaire exhaustif des 36 documents du corpus, stratégies de chunking et priorité RAG |
| \`05-LAB-IA-ET-CONFIG-OLLAMA.md\` | Guide d'intégration Ollama, templates de prompts CoT/RTOC et protocoles |
| \`06-SCRIPTS-AUTOMATISATION-ENV.sh\` | Script Bash d'initialisation de l'arborescence et de l'environnement Python virtuel |

---

## ⚡ Démarrage Rapide

\`\`\`bash
# 1. Cloner ou initialiser le projet
mkdir -p ./tuteur-scolastique
cd ./tuteur-scolastique

# 2. Exécuter le script d'automatisation d'environnement
chmod +x 06-SCRIPTS-AUTOMATISATION-ENV.sh
./06-SCRIPTS-AUTOMATISATION-ENV.sh

# 3. Ouvrir le site autonome dans votre navigateur
open site-complet-tuteur-scolastique.html || xdg-open site-complet-tuteur-scolastique.html
\`\`\`
`;
}

export function generateDiagnosticMarkdown(): string {
  return `# 01 - Diagnostic & Cadrage Technique - Tuteur Scolastique

## Profil & Contexte
- **Objectif métier :** Devenir AI Engineer (RAG, Agents, Vector Databases, Prompting, Évaluation).
- **Projet fil rouge :** Tuteur scolaire intelligent autonome fonctionnant 100% en local ($0 stack).
- **Environnement cible :** Python 3.12+, venv, Ollama (localhost:11434), ChromaDB, Git.
- **Objectif Jalon 1 :** Environnement 100% fonctionnel, Git synchronisé, Ollama actif et premier script CLI fonctionnel.
- **Objectif Jalon 2 :** Indexation du corpus de 36 documents et interrogation via RAG local.

---

## Matrice de Conformité Système

| Composant | Statut | Commande de validation |
|---|---|---|
| Environnement Système | Standard Linux / macOS / Windows WSL | \`uname -a\` ou \`python --version\` |
| Isolation Python | PEP 668 conforme (venv obligatoire) | \`python -m venv .venv\` |
| Contrôle de version | Git 2.40+ configuré avec signature auteur | \`git status\` |
| Moteur IA Local | Ollama (\`localhost:11434\`) | \`curl http://localhost:11434/api/tags\` |
| Modèle de raisonnement | \`deepseek-r1:8b\` ou \`mistral:7b\` | \`ollama list\` |
| Base Vectorielle | ChromaDB persistant local | \`pip show chromadb\` |

---

## Les 3 Piliers Méthodologiques
1. **Pédagogie CoT (Chain of Thought) :** Chaque étape explique le *pourquoi*, le *comment* et les *risques*.
2. **Cycle RTOC (Run, Test, Observe, Commit) :** Ne jamais commiter de code sans avoir testé le cas nominal et le cas d'erreur.
3. **Sécurité & Isolation :** Toujours exécuter le code dans un environnement virtuel dédié (\`venv\`).
`;
}

export function generateRoadmapMarkdown(): string {
  let md = `# 02 - Roadmap Détaillée : Jalon 1 & Jalon 2

---

## 🗓️ SEMAINE 1 (Jalon 1 : Socle Système, Git & Ollama CLI)
`;

  Object.entries(SEMAINE_1_DATA).forEach(([dayKey, day]) => {
    md += `\n### 📅 ${day.date} — ${day.objectif}\n\n`;
    day.pomodoros.forEach((pomo) => {
      md += `#### ⏱️ ${pomo.titre}\n\n`;
      pomo.taches.forEach((t) => {
        md += `##### ✅ ${t.label}\n`;
        md += `- **Explication :** ${t.detail}\n`;
        md += `- **Commande Bash :**\n\`\`\`bash\n${t.commande}\n\`\`\`\n`;
        md += `- **Prompt à envoyer à l'IA :**\n> ${t.prompt.replace(/\n/g, '\n> ')}\n`;
        md += `- **Critère de Succès :** \`${t.succes}\`\n\n`;
      });
    });
  });

  md += `\n---\n\n## 🗓️ SEMAINE 2 (Jalon 2 : Pipeline RAG & Indexation Vectorielle)\n\n`;
  SEMAINE_2_PLAN.forEach((day) => {
    md += `### 📅 ${day.day} — ${day.title}\n`;
    md += `- **Objectif :** ${day.goal}\n\n`;
    day.tasks.forEach((t) => {
      md += `- ✅ ${t}\n`;
    });
    md += `\n`;
  });

  return md;
}

export function generateSurvivalKitMarkdown(): string {
  let md = `# 03 - Boîte à Outils Terminal & Glossaire IA

---

## 🛡️ Les 10 Commandes Vitales de l'Ingénieur IA

\`\`\`bash
# 1. Se repérer dans l'arborescence
pwd

# 2. Lister les fichiers du projet
ls -la

# 3. Activer l'environnement virtuel Python du projet
source .venv/bin/activate

# 4. Vérifier l'état de l'arbre de travail Git
git status

# 5. Consulter le journal Git compact
git log --oneline -5

# 6. Vérifier si le serveur Ollama est opérationnel
curl http://localhost:11434/api/tags

# 7. Lister les modèles d'inférence installés
ollama list

# 8. Installer une dépendance sans toucher au système global
pip install chromadb langchain-community

# 9. Surveiller la charge mémoire RAM/VRAM
htop

# 10. Vérifier la consommation disque de la base vectorielle
du -sh data/embeddings
\`\`\`

---

## ⚠️ La Règle d'Or de l'Environnement Python : PEP 668
- **NE JAMAIS** faire \`sudo pip install <paquet>\`.
- Les environnements modernes protègent les bibliothèques système globales.
- **TOUJOURS** activer le venv : \`source .venv/bin/activate\` avant de lancer \`pip install\`.

---

## 📖 Glossaire des 20 Termes Fondamentaux

| Terme | Définition Pédagogique |
|---|---|
`;

  GLOSSARY_ITEMS.forEach((item: GlossaryItem) => {
    md += `| **${item.terme}** | ${item.definition} |\n`;
  });

  return md;
}

export function generateCorpusMarkdown(): string {
  let md = `# 04 - Catalogue Exhaustif des 31 Documents du Corpus RAG

> Tous ces documents sont répertoriés dans le dossier Google Drive source :  
> \`https://drive.google.com/drive/folders/${PROJECT_OVERVIEW.driveFolderId}\`

---

| # | Nom du Fichier | Catégorie | Format | Importance | Stratégie Chunking |
|---|---|---|---|---|---|
`;

  DOCUMENTS_CATALOG.forEach((doc: DocumentItem, idx: number) => {
    md += `| ${idx + 1} | \`${doc.filename}\` | ${doc.category} | ${doc.format} | ${doc.importance} | ${doc.chunkingStrategy} |\n`;
  });

  md += `\n---\n\n## Détails et Synthèse par Document\n\n`;

  DOCUMENTS_CATALOG.forEach((doc: DocumentItem, idx: number) => {
    md += `### ${idx + 1}. ${doc.title}\n`;
    md += `- **Fichier :** \`${doc.filename}\`\n`;
    md += `- **Catégorie :** ${doc.category} | **Format :** ${doc.format} | **Importance :** ${doc.importance}\n`;
    md += `- **Description :** ${doc.description}\n`;
    md += `- **Recommandation Chunking & RAG :** ${doc.chunkingStrategy}\n\n`;
  });

  return md;
}

export function generateAILabMarkdown(): string {
  return `# 05 - Lab IA, Configuration Ollama & Templates de Prompts

---

## 🛠️ Configuration Ollama (Inférence Locale)

\`\`\`bash
# 1. Démarrer le service Ollama
ollama serve &

# 2. Vérifier que le runtime écoute sur le port 11434
curl http://localhost:11434/api/tags

# 3. Téléchargement des modèles d'inférence et d'embeddings
ollama pull deepseek-r1:8b
ollama pull mistral:7b
ollama pull nomic-embed-text

# 4. Test d'inférence en ligne de commande
ollama run deepseek-r1:8b "Explique-moi la différence entre un embedding et un token en 3 phrases."
\`\`\`

---

## 💡 Les 4 Templates de Prompts Incontournables

### 1. Contexte Débutant (\`PROMPT_CTX\`)
\`\`\`text
${PROMPT_TEMPLATES.PROMPT_CTX}
\`\`\`

### 2. Raisonnement Pas à Pas (\`PROMPT_COT\`)
\`\`\`text
${PROMPT_TEMPLATES.PROMPT_COT}
\`\`\`

### 3. Protocole RTOC (\`PROMPT_RTOC\`)
\`\`\`text
${PROMPT_TEMPLATES.PROMPT_RTOC}
\`\`\`

### 4. Pédagogie Explicite (\`PROMPT_PED\`)
\`\`\`text
${PROMPT_TEMPLATES.PROMPT_PED}
\`\`\`

---

## 🧪 Architecture du Script CLI \`tuteur.py\`

\`\`\`python
#!/usr/bin/env python3
"""
Tuteur Scolastique - CLI Interface
Interagit avec Ollama local (localhost:11434)
"""
import sys
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "deepseek-r1:8b"

SYSTEM_PROMPT = """Tu es un tuteur scolaire bienveillant et rigoureux.
Tu expliques chaque concept pas à pas selon la méthode socratique.
Tu aides l'élève à raisonner par lui-même."""

def ask_tutor(user_query: str):
    payload = {
        "model": MODEL_NAME,
        "prompt": f"{SYSTEM_PROMPT}\\n\\nQuestion de l'élève : {user_query}",
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        print("\\n=== Réponse du Tuteur ===")
        print(data.get("response", "Pas de réponse"))
    except Exception as err:
        print(f"[ERREUR] Impossible de contacter Ollama : {err}")
        print("Vérifiez qu'Ollama est démarré avec 'curl http://localhost:11434/api/tags'")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = input("Pose ta question au tuteur : ")
    ask_tutor(query)
\`\`\`
`;
}

export function generateAutomatedBashScript(): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# Script d'automatisation - Initialisation Environnement Tuteur Scolastique IA
# Architecture : Python 3.12, venv isolé, Ollama local, ChromaDB
# ==============================================================================

set -euo pipefail

echo "=================================================="
echo "🚀 Initialisation Projet Tuteur Scolastique (AI Engineer)"
echo "=================================================="

PROJECT_DIR="./tuteur-scolastique"

echo "[1/6] 📁 Création de l'arborescence : \${PROJECT_DIR}"
mkdir -p "\${PROJECT_DIR}/data/corpus"
mkdir -p "\${PROJECT_DIR}/data/embeddings"
mkdir -p "\${PROJECT_DIR}/src/rag"
mkdir -p "\${PROJECT_DIR}/src/tuteur"
mkdir -p "\${PROJECT_DIR}/tests"
cd "\${PROJECT_DIR}"

echo "[2/6] 🔧 Initialisation du dépôt Git"
if [ ! -d ".git" ]; then
    git init
    cat << 'EOF' > .gitignore
.venv/
__pycache__/
*.pyc
.env
data/embeddings/
*.log
EOF
    echo "  -> Git initialisé avec .gitignore standard."
else
    echo "  -> Dépôt Git déjà existant."
fi

echo "[3/6] 🐍 Création de l'environnement virtuel Python (.venv)"
if [ ! -d ".venv" ]; then
    python -m venv .venv
    echo "  -> .venv créé avec succès."
else
    echo "  -> .venv existe déjà."
fi

echo "[4/6] 📦 Création du fichier requirements.txt"
cat << 'EOF' > requirements.txt
requests>=2.31.0
langchain>=0.2.0
langchain-community>=0.2.0
chromadb>=0.5.0
pypdf>=4.2.0
rich>=13.7.0
EOF

echo "[5/6] 🤖 Vérification d'Ollama"
if command -v ollama >/dev/null 2>&1; then
    echo "  -> Ollama est installé."
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        echo "  -> Service Ollama ACTIF et accessible sur port 11434."
    else
        echo "  -> Service Ollama inactif. Lancez: systemctl --user start ollama"
    fi
else
    echo "  -> Ollama n'est pas encore installé. Téléchargez-le sur https://ollama.com"
fi

echo "[6/6] ✅ Structure prête !"
echo "Pour commencer :"
echo "  cd \${PROJECT_DIR}"
echo "  source .venv/bin/activate"
echo "  pip install -r requirements.txt"
echo "=================================================="
`;
}
