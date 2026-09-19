/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Network, 
  Cpu, 
  Database, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedPipelineIllustration } from './AnimatedPipelineIllustration';

export const InteractiveBlueprintsView: React.FC = () => {
  const [activeBlueprint, setActiveBlueprint] = useState<'7couches' | 'pipeline' | '8rag' | '9techniques' | 'mcp'>('pipeline');

  // State for 7 Couches
  const [selectedLayer, setSelectedLayer] = useState<number>(3); // Couche 4 (Context & RAG) selected by default

  // State for 8 RAG
  const [selectedRagVariant, setSelectedRagVariant] = useState<number>(1); // Sentence-Window by default

  // State for 9 Techniques
  const [selectedTechnique, setSelectedTechnique] = useState<number>(0);

  // 7 Couches Data
  const layersData = [
    {
      level: 7,
      name: "Couche 7 : Interface Utilisateur & Expérience (UI/UX)",
      badge: "Frontend & CLI",
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300",
      description: "Point de contact direct avec l'élève ou l'utilisateur. Gère l'affichage en streaming mot par mot, les formulaires de saisie, l'historique et les feedbacks visuels.",
      tech: ["Terminal CLI Python (rich/curses)", "React + Tailwind CSS", "WebSockets / Server-Sent Events (SSE)"],
      roleInTutor: "Dans tuteur.py, c'est la boucle interactive 'while True: input()' qui affiche les réponses en temps réel.",
      bestPractice: "Toujours afficher un indicateur de pensée et gérer le streaming pour réduire le temps perçu."
    },
    {
      level: 6,
      name: "Couche 6 : Sécurité, Observabilité & Guardrails",
      badge: "Safety & Quality",
      color: "from-red-500/20 to-orange-500/10 border-red-500/30 text-red-300",
      description: "Garde-fous d'entrée (anti-injection de prompt) et de sortie (anti-hallucination, modération). Tracing des requêtes et métriques d'évaluation.",
      tech: ["NeMo Guardrails", "Llama Guard", "Prompts socratiques stricts", "OpenTelemetry / Arize Phoenix"],
      roleInTutor: "Interdit au tuteur de donner les réponses des devoirs toutes faites et bloque les tentatives d'évasion.",
      bestPractice: "Appliquer le principe de Défense en Profondeur : filtres regex en amont + validation sémantique en aval."
    },
    {
      level: 5,
      name: "Couche 5 : Orchestration Agentique & Outillage",
      badge: "Agentic Logic",
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300",
      description: "Le chef d'orchestre qui planifie, prend des décisions, appelle des outils externes (calculatrice, API, terminal) et maintient la mémoire de conversation.",
      tech: ["LangChain", "LangGraph (State Machines)", "Protocole MCP Anthropic", "Boucles ReAct"],
      roleInTutor: "Gère les 35 Pomodoros, décide quand consulter les cours d'histoire ou de maths et formule la question socratique.",
      bestPractice: "Privilégier les graphes déterministes (LangGraph) plutôt que des boucles autonomes imprévisibles."
    },
    {
      level: 4,
      name: "Couche 4 : Données, Contexte & Vector Store (RAG)",
      badge: "Memory & RAG",
      color: "from-indigo-500/20 to-cyan-500/10 border-indigo-500/30 text-indigo-300",
      description: "Le pont entre le modèle et la réalité factuelle. Découpe les 31 cours, génère les embeddings vectoriels et recherche les passages pertinents.",
      tech: ["ChromaDB", "Qdrant", "bge-m3 / nomic-embed-text", "Sentence-Window & Parent-Child Chunker"],
      roleInTutor: "Stocke les 31 documents (PDF, HTML, TXT) et extrait les extraits exacts nécessaires pour chaque leçon.",
      bestPractice: "Ne jamais indexer sans métadonnées riches (matière, niveau scolaire, titre de chapitre)."
    },
    {
      level: 3,
      name: "Couche 3 : Moteur d'Inférence & Runtimes",
      badge: "Inference Engine",
      color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300",
      description: "Le serveur local qui charge les poids en mémoire vive (RAM/VRAM) et exécute les calculs tensoriels à très haute vitesse.",
      tech: ["Ollama (localhost:11434)", "llama.cpp", "vLLM", "TensorRT-LLM"],
      roleInTutor: "Ollama tourne en arrière-plan et expose l'API de streaming pour DeepSeek-R1.",
      bestPractice: "Configurer le bon nombre de threads CPU (OLLAMA_NUM_PARALLEL) et utiliser la quantisation 4-bit."
    },
    {
      level: 2,
      name: "Couche 2 : Modèles de Fondation (Foundation Models)",
      badge: "Weights & Intelligence",
      color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-300",
      description: "Les poids synaptiques pré-entraînés sur des trillions de tokens qui confèrent au système sa capacité de raisonnement et de langage.",
      tech: ["DeepSeek-R1 (Raisonnement CoT)", "Llama 3.2 / 3.3", "Mistral 7B", "Phi-4"],
      roleInTutor: "Le cerveau linguistique qui comprend la question de l'élève et génère l'explication pédagogique.",
      bestPractice: "Choisir un modèle 'Instruct' ou 'Reasoning' (comme DeepSeek-R1) plutôt qu'un modèle de base brut."
    },
    {
      level: 1,
      name: "Couche 1 : Matériel & Système d'Exploitation (Hardware/OS)",
      badge: "Compute & Kernel",
      color: "from-slate-500/20 to-slate-700/10 border-slate-600/30 text-slate-300",
      description: "Le socle physique et système : processeur, carte graphique, mémoire vive (RAM/VRAM) et noyau gérant les allocations matérielles.",
      tech: ["Noyau Linux / Unix standard", "CPU x86_64 / ARM64 avec AVX2", "GPU NVIDIA (CUDA) ou iGPU", "SSD NVMe"],
      roleInTutor: "Héberge l'environnement d'exécution local, le venv Python et les bases vectorielles ChromaDB.",
      bestPractice: "Surveiller l'utilisation mémoire avec htop et éviter le swap sur disque qui ralentit les tokens."
    }
  ];

  // 8 RAG Architectures Data
  const ragVariants = [
    {
      id: 1,
      name: "1. RAG Naïf (Baseline)",
      tag: "Fondamental",
      complexity: "Faible",
      speed: "Ultra-Rapide",
      accuracy: "Moyenne",
      description: "Découpe le texte en blocs de taille fixe (ex: 500 caractères) avec un léger chevauchement. Recherche les top-k chunks par similarité cosinus et les colle dans le prompt.",
      limitations: "Contexte souvent coupé au milieu d'une idée ou d'une équation ; présence de bruit dans les chunks.",
      whenToUse: "Prototypage rapide en 1 heure sur des petits documents textuels homogènes."
    },
    {
      id: 2,
      name: "2. Sentence-Window Retrieval",
      tag: "Recommandé Pédagogie",
      complexity: "Moyenne",
      speed: "Très Rapide",
      accuracy: "Très Haute",
      description: "L'unité de recherche vectorielle est une phrase unique (haute précision), mais l'unité transmise au LLM est une fenêtre de 3 phrases avant et 3 phrases après.",
      limitations: "Nécessite un pré-traitement du corpus un peu plus rigoureux.",
      whenToUse: "Idéal pour les manuels scolaires et les fiches de cours où chaque phrase clé a besoin de son contexte."
    },
    {
      id: 3,
      name: "3. Parent-Child (Hierarchique)",
      tag: "Robuste",
      complexity: "Moyenne",
      speed: "Rapide",
      accuracy: "Excellente",
      description: "Découpe les gros documents en gros blocs parents (ex: un chapitre de 2000 tokens), eux-mêmes sous-découpés en petits enfants (300 tokens). On cherche sur les enfants, on transmet le parent.",
      limitations: "Consomme plus de tokens dans la fenêtre de contexte du modèle.",
      whenToUse: "Parfait pour les PDF longs et les documentations techniques denses."
    },
    {
      id: 4,
      name: "4. Multi-Query & Query Expansion",
      tag: "Anti-Angle Mort",
      complexity: "Moyenne",
      speed: "Moyenne",
      accuracy: "Haute",
      description: "Le LLM prend la question formulée maladroitement par l'élève et génère 3 à 5 reformulations synonymes, puis fusionne les résultats par RRF (Reciprocal Rank Fusion).",
      limitations: "Génère plusieurs requêtes vectorielles, augmentant légèrement la latence.",
      whenToUse: "Quand les utilisateurs sont des débutants qui n'utilisent pas le vocabulaire exact du cours."
    },
    {
      id: 5,
      name: "5. HyDE (Hypothetical Document Embeddings)",
      tag: "Innovant",
      complexity: "Avancée",
      speed: "Moyenne",
      accuracy: "Très Haute",
      description: "Le LLM génère d'abord une 'fausse réponse idéale'. C'est cette réponse hypothétique qui est vectorisée et comparée aux cours. Les vecteurs 'réponse-réponse' matchent mieux que 'question-réponse'.",
      limitations: "Si l'hypothèse est complètement erronée, la recherche peut diverger.",
      whenToUse: "Sur des questions ouvertes ou conceptuelles où la question ne ressemble pas textuellement au cours."
    },
    {
      id: 6,
      name: "6. CRAG (Corrective RAG)",
      tag: "Anti-Hallucination",
      complexity: "Avancée",
      speed: "Moyenne",
      accuracy: "Maximale",
      description: "Un évaluateur note la confiance des chunks trouvés. S'ils sont bons -> raffinage. S'ils sont mauvais -> rejet immédiat et activation d'une recherche de secours ou aveu d'incompétence.",
      limitations: "Nécessite un évaluateur léger et rapide.",
      whenToUse: "Obligatoire dans les applications critiques où l'IA ne doit jamais inventer d'erreurs."
    },
    {
      id: 7,
      name: "7. RAG Hybride (Dense + Sparse BM25)",
      tag: "Standard Industriel",
      complexity: "Moyenne-Haute",
      speed: "Rapide",
      accuracy: "Maximale",
      description: "Combine la recherche sémantique vectorielle (vecteurs denses pour le sens) avec la recherche lexicale BM25 (mots-clés exacts, noms de théorèmes, dates).",
      limitations: "Requiert d'indexer deux fois les documents (vecteur + moteur de recherche plein texte).",
      whenToUse: "Quand les questions portent sur des acronymes stricts, des codes de loi ou des noms propres."
    },
    {
      id: 8,
      name: "8. GraphRAG (Graphe de Connaissances)",
      tag: "Systémique",
      complexity: "Expert",
      speed: "Lente",
      accuracy: "Holistique",
      description: "Extrait les entités (ex: 'RAG', 'VectorDB', 'Embeddings') et leurs relations pour bâtir un graphe de connaissances, combiné aux vecteurs pour des synthèses globales.",
      limitations: "Processus d'indexation très lourd et coûteux en calcul.",
      whenToUse: "Pour résumer des corpus entiers ou répondre à 'Quelles sont les causes communes de ces 10 événements ?'."
    }
  ];

  // 9 Techniques Clés Data
  const techniquesData = [
    {
      title: "1. Prompt Engineering Structuré (CoT & RTOC)",
      category: "Fondations",
      summary: "Forcer le modèle à réfléchir avant de répondre en décomposant les étapes logiques.",
      howToApply: "Utiliser la règle d'or : 1) But, 2) Étapes, 3) Risques, 4) Commandes unitaires.",
      diagram: "User Input -> [CoT Scratchpad: But -> Analyse -> Risques] -> Réponse finale validée"
    },
    {
      title: "2. RAG Hybride & Context Augmentation",
      category: "Données",
      summary: "Associer la recherche de mots-clés exacts et la recherche de sens vectorielle.",
      howToApply: "Indexation ChromaDB + BM25 avec re-classement par Cross-Encoder (BGE-Reranker).",
      diagram: "Requête -> [Index Dense (768d)] + [Index Sparse (BM25)] -> RRF Merger -> Reranker -> Top-3"
    },
    {
      title: "3. Quantisation 4-bit (GGUF / AWQ)",
      category: "Inférence & Hardware",
      summary: "Compresser les poids FP16 en entiers 4-bit sans perte sensible de raisonnement.",
      howToApply: "Sous Ollama : télécharger des modèles tagués 'q4_K_M' pour tourner sur 8 Go à 16 Go de RAM.",
      diagram: "Poids FP16 (16 bits, 16 Go) -> Quantisation matricielle -> GGUF 4-bit (4.8 Go) -> Inférence CPU"
    },
    {
      title: "4. Function Calling & Outillage Externe (Tools)",
      category: "Action",
      summary: "Donner au LLM la capacité d'émettre des arguments JSON stricts pour déclencher des fonctions.",
      howToApply: "Déclarer un schéma Pydantic ou JSON Schema passé à Ollama/Gemini.",
      diagram: "Prompt -> LLM génère JSON: {'tool': 'calc', 'args': [2, '+', 2]} -> Python exécute -> Contexte"
    },
    {
      title: "5. Architectures Multi-Agents Découplées",
      category: "Systèmes",
      summary: "Séparer les rôles : un agent pédagogue, un agent correcteur, un agent bibliothécaire.",
      howToApply: "Utiliser LangGraph pour faire passer un état immuable (State) entre plusieurs nœuds.",
      diagram: "[Agent Élève] <-> [Superviseur] --> [Agent Recherche RAG] --> [Agent Socratique]"
    },
    {
      title: "6. Mémoire Vectorielle & Indexation HNSW",
      category: "Persistance",
      summary: "Représentation géométrique par graphes navigables pour trouver le sens en temps record.",
      howToApply: "Créer des collections Chroma persistantes avec métadonnées de filtrage.",
      diagram: "Paragraphe -> Embedding (Vecteur 768d) -> Graphe HNSW (Couche 0 à Couche N) -> Similarité"
    },
    {
      title: "7. Protocole Ouvert MCP (Anthropic)",
      category: "Interopérabilité",
      summary: "Le standard universel reliant les modèles aux outils, documents et serveurs locaux.",
      howToApply: "Exposer un serveur MCP sur stdio dans votre environnement Linux.",
      diagram: "[Client Hôte IA] <-- (JSON-RPC sur stdio/SSE) --> [Serveur MCP : Resources / Prompts / Tools]"
    },
    {
      title: "8. Évaluation Automatisée (Ragas & Evals)",
      category: "Qualité",
      summary: "Mesurer scientifiquement la fidélité des réponses et la pertinence du retrieval.",
      howToApply: "Créer un jeu de 20 questions de test et calculer le score de non-hallucination.",
      diagram: "[Question + Contexte + Réponse] -> LLM-as-a-Judge -> Scores : Fidélité, Pertinence, Clarté"
    },
    {
      title: "9. Guardrails & Sécurité LLM (OWASP Top 10)",
      category: "Sécurité",
      summary: "Verrouiller le comportement du modèle contre le jailbreak et la fuite d'informations.",
      howToApply: "Filtres regex en entrée, prompts systèmes inviolables et validation du JSON en sortie.",
      diagram: "Input -> [Guardrail Entrée] -> Inférence LLM -> [Guardrail Sortie] -> Affichage"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Visualiseur d'Architectures & Blueprints
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Issu de vos PPTX & HTML
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Cartographie Interactive de l'Ingénierie IA
          </h1>
          <p className="text-slate-300 max-w-4xl text-sm sm:text-base leading-relaxed">
            Vos présentations PowerPoint et schémas HTML ont été traduits en <strong>composants vivants et interactifs</strong>. Explorez l'Architecture en 7 couches, le comparateur des 8 variantes de RAG, les 9 techniques incontournables et le protocole MCP.
          </p>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={() => setActiveBlueprint('pipeline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center space-x-2 relative ${
                activeBlueprint === 'pipeline'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Pipeline Vivant & RAG Animé</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                Interactif
              </span>
            </button>

            <button
              onClick={() => setActiveBlueprint('7couches')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeBlueprint === '7couches'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architecture 7 Couches</span>
            </button>

            <button
              onClick={() => setActiveBlueprint('8rag')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeBlueprint === '8rag'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Les 8 Variantes de RAG</span>
            </button>

            <button
              onClick={() => setActiveBlueprint('9techniques')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeBlueprint === '9techniques'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>9 Techniques Clés (PPTX)</span>
            </button>

            <button
              onClick={() => setActiveBlueprint('mcp')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeBlueprint === 'mcp'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Plomberie MCP Anthropic</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 0: PIPELINE VIVANT & RAG ANIMÉ */}
      {activeBlueprint === 'pipeline' && (
        <div className="space-y-6">
          <AnimatedPipelineIllustration />
        </div>
      )}

      {/* SECTION 1: ARCHITECTURE 7 COUCHES */}
      {activeBlueprint === '7couches' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Stack */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>La Pile Logicielle en 7 Couches</span>
              </h2>
              <span className="text-xs text-slate-400">Cliquez sur une couche pour inspecter</span>
            </div>

            {layersData.map((layer, index) => {
              const isSelected = selectedLayer === index;
              return (
                <div
                  key={layer.level}
                  onClick={() => setSelectedLayer(index)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-r ${layer.color} border-indigo-400 ring-2 ring-indigo-500/20 shadow-md`
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-white text-slate-900 shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                        C{layer.level}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-white">{layer.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span>{layer.badge}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'rotate-90 text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Layer Inspector */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            {(() => {
              const cur = layersData[selectedLayer];
              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        Couche #{cur.level} : {cur.badge}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">{cur.name}</h3>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Rôle & Mission</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{cur.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Technologies & Outils Clés</h4>
                    <div className="flex flex-wrap gap-2">
                      {cur.tech.map((t, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-indigo-300 flex items-center space-x-1.5 mb-1">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Rôle dans votre projet « Tuteur Scolastique »</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{cur.roleInTutor}</p>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Règle d'Or de l'AI Engineer</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{cur.bestPractice}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 2: LES 8 VARIANTES DE RAG */}
      {activeBlueprint === '8rag' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ragVariants.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setSelectedRagVariant(idx)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedRagVariant === idx
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-mono opacity-70 mb-1">VAR #{r.id}</div>
                <div className="font-semibold text-xs sm:text-sm line-clamp-1">{r.name}</div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-slate-950/60 text-slate-300">
                  {r.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed RAG Variant Card */}
          {(() => {
            const v = ragVariants[selectedRagVariant];
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Variante {v.id} / 8 : {v.tag}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-2">{v.name}</h2>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      <span className="text-slate-400">Complexité :</span> <strong className="text-white">{v.complexity}</strong>
                    </div>
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      <span className="text-slate-400">Précision :</span> <strong className="text-emerald-400">{v.accuracy}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Mécanisme & Fonctionnement</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{v.description}</p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-amber-400 mb-1">Limites & Pièges à Éviter</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{v.limitations}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-emerald-400 mb-1">Quand l'utiliser dans le Tuteur Scolastique ?</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{v.whenToUse}</p>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
                      <div className="text-indigo-400 font-semibold mb-2 flex items-center space-x-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Flux de Données</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div>1. Question élève ➜ Ingestion</div>
                        <div>2. Stratégie {v.name} appliquée</div>
                        <div>3. Filtrage vectoriel ➜ Fusion des scores</div>
                        <div>4. Prompt augmentée ➜ Réponse socratique</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 3: 9 TECHNIQUES CLES PPTX */}
      {activeBlueprint === '9techniques' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {techniquesData.map((tech, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTechnique(idx)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  selectedTechnique === idx
                    ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {tech.category}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-2">{tech.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tech.summary}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Voir la mise en œuvre</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Technique Inspector */}
          {(() => {
            const t = techniquesData[selectedTechnique];
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Pilier #{selectedTechnique + 1} du PPTX
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{t.title}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1.5">Comment l'appliquer dans votre projet</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{t.howToApply}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1.5">Schéma Algorithmique</h4>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                      {t.diagram}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 4: PROTOCOLE MCP D'ANTHROPIC */}
      {activeBlueprint === 'mcp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-5">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Standard Ouvert (Anthropic 2024-2026)
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">Architecture et Plomberie du Protocole MCP</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Le Model Context Protocol standardise l'échange entre l'IA (le client) et votre système local (le serveur MCP) via JSON-RPC.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box 1: Resources */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>1. MCP Resources (Données)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sources documentaires passives en lecture seule. Pour le Tuteur Scolastique, ce sont vos 31 documents (cours de maths, fiches d'histoire, schémas).
              </p>
              <div className="bg-slate-900 p-2.5 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                URI: cours://maths/pythagore.md
              </div>
            </div>

            {/* Box 2: Prompts */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>2. MCP Prompts (Gabarits)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Modèles de consignes pré-configurés avec variables paramétrables. Utilisé pour forcer le mode socratique, le CoT ou la révision d'examen.
              </p>
              <div className="bg-slate-900 p-2.5 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                Prompt: "tuteur_socratique(matiere, niveau)"
              </div>
            </div>

            {/* Box 3: Tools */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>3. MCP Tools (Actions)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fonctions exécutables dotées d'effets réels : résoudre une fraction complexe, interroger SQLite ou vérifier la présence d'un paquet sous Arch.
              </p>
              <div className="bg-slate-900 p-2.5 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                Tool: resoudre_equation(a, b, c)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
