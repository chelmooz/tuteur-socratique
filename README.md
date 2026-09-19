# Tuteur Scolastique IA

Plateforme d'apprentissage AI Engineer avec tuteur socratique, RAG local, visualiseur d'architectures et suivi pédagogique.

## 🏗️ Architecture Hybride Local/Cloud

Ce projet adopte une architecture **hybride** explicite :

| Composant | Localisation | Technologie |
|-----------|--------------|-------------|
| **LLM & Chat** | 100% Local | Ollama (qwen2.5:7b, prof-ia, etc.) |
| **Embeddings** | 100% Local | Ollama (bge-m3:latest) |
| **Vector Store** | 100% Local | ChromaDB |
| **Extraction PDF/PPTX/DOCX/OCR** | 100% Local | officeparser (Node.js) |
| **Fallback LLM** | 100% Local | opencode CLI |
| **Authentification** | Cloud | Firebase Auth |
| **Export Google Drive** | Cloud | Google Drive API |
| **Frontend** | Local (dev) / Static (prod) | React + Vite |

### Pourquoi ce choix ?

- **Confidentialité des données** : Vos documents, prompts et embeddings ne quittent jamais votre machine
- **Coût zéro** : Aucune API payante (OpenAI, Anthropic, etc.) pour l'inférence
- **Fonctionnalités cloud optionnelles** : L'auth Firebase et l'export Drive sont des *commodités* — l'application fonctionne pleinement sans elles en mode local pur

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 20+
- (Optionnel) GPU NVIDIA pour accélération Ollama

### 1. Lancer les services (Ollama + ChromaDB)
```bash
npm run predev
# ou manuellement : docker-compose up -d
```

### 2. (Optionnel) Pré-télécharger les modèles
```bash
npm run docker:models
```

### 3. Démarrer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3001`.

## 🔐 Configuration

### Variables d'environnement (`.env`)
```bash
# Ollama (requis)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL_TUTEUR=prof-ia:latest
OLLAMA_MODEL_EXPERT=qwen2.5:7b
OLLAMA_MODEL_EMBEDDING=bge-m3:latest

# Opencode fallback (optionnel)
OPENCODE_FALLBACK_ENABLED=false
OPENCODE_PATH=opencode
OPENCODE_TIMEOUT=120000

# Serveur
PORT=3001

# Sécurité (OBLIGATOIRE en production)
API_KEY=votre-cle-secrete-tres-longue-et-aleatoire
SESSION_SECRET=un-autre-secret-pour-les-sessions

# Firebase (optionnel - pour auth/export Drive)
# Voir firebase-applet-config.json
```

> ⚠️ **En production** : `API_KEY` **doit** être définie. L'application refuse de démarrer avec la valeur par défaut `dev-secret-change-me`.

## 📚 Corpus Pédagogique

Le dossier `data/corpus/` contient ~150 documents (PDF, PPTX, HTML, MD, images) couvrant :
- Fondations LLM & Architecture Transformer
- RAG Avancé (CRAG, GraphRAG, Multimodal, Data Streaming)
- Agents Autonomes, LangGraph, MCP
- Bases Vectorielles, ChromaDB, Qdrant
- Architecture Système, Stack $0, Déploiement
- Sécurité, Guardrails, Évaluation RAGAS

Les 101 pages HTML interactives ont été normalisées avec un design system partagé (`course-kit.css` / `course-kit.js`) et une barre de navigation de parcours.

## 🔌 API Principales

Toutes les routes `/api/ai/*` et `/api/rag/*` nécessitent une authentification par **Bearer token** ou **query parameter** `?api_key=`.

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/health` | GET | État des services (public) |
| `/api/ai/chat` | POST | Chat avec tuteur/expert RAG |
| `/api/ai/quiz-generate` | POST | Génération QCM |
| `/api/ai/test-prompt` | POST | Testeur de prompts |
| `/api/ai/embed` | POST | Embeddings |
| `/api/rag/ingest` | POST | Ingestion document(s) |
| `/api/rag/stats` | GET | Statistiques vector store |

### Exemple d'utilisation
```bash
curl -H "Authorization: Bearer VOTRE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Explique le RAG", "mode": "expert_rag"}' \
  http://localhost:3001/api/ai/chat
```

## 🧪 Tests

```bash
npm run test        # Exécute la suite vitest
npm run lint        # Vérification TypeScript (tsc --noEmit)
```

## 📦 Production

```bash
npm run build       # Build client + serveur
npm run start       # Lance le serveur de production
```

Le build produit :
- `dist/` : Assets client (React + Vite)
- `dist/server.cjs` : Serveur Express bundle

## 🛠️ Scripts Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev server avec hot reload |
| `npm run predev` | Démarre Docker (Ollama + Chroma) puis dev |
| `npm run docker:models` | Pré-télécharge modèles Ollama |
| `npm run docker:down` | Arrête les conteneurs |
| `npm run build` | Build production |
| `npm run start` | Lance serveur production |
| `npm run lint` | TypeScript strict check |
| `npm run test` | Tests unitaires (vitest) |

## 📁 Structure du Projet

```
├── src/
│   ├── components/       # Composants React
│   ├── services/         # Services backend (ollama, vectorStore, rag, ingestion)
│   ├── data/             # Données pédagogiques statiques
│   ├── types.ts          # Types TypeScript partagés
│   └── App.tsx           # Application principale
├── data/
│   └── corpus/           # 150+ documents pédagogiques
├── tests/                # Tests vitest
├── docker-compose.yml    # Ollama + ChromaDB
├── server.ts             # Serveur Express + API
└── vite.config.ts        # Config Vite
```

## 🤝 Contribution

1. Fork & branche feature
2. `npm run lint && npm run test` doivent passer
3. Commit atomiques avec messages conventionnels (`fix:`, `feat:`, `chore:`)
4. PR avec description claire

---

**Licence** : Apache-2.0 (voir en-têtes des fichiers source)