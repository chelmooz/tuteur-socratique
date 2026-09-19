# 🎓 COURS N°2 — Les Trois Âges du RAG
## *Classic · Graph · Agentic : comment la récupération d'information est devenue un raisonnement*

> Commentaire illustré de l'infographie de Brij Kishore Pandey  
> Complément du Cours n°1 (*Induction de compétences pour agents IA*)

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLAN DU COURS                            │
│                                                                 │
│  §0  Pourquoi récupérer ? (le péché originel du LLM)            │
│  §1  CLASSIC RAG  — « Retrieves »   : le bibliothécaire         │
│  §2  GRAPH RAG    — « Connects »    : le cartographe            │
│  §3  AGENTIC RAG  — « Reasons »     : l'enquêteur               │
│  §4  Synthèse : choisir (et combiner)                           │
│  §5  Pont avec le cours n°1 : mémoire, jugement, compétences    │
│  ✏️  Exercices · 📚 Références                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## §0 — Pourquoi récupérer ? Le péché originel du LLM

> 🏛️ **Analogie** : un LLM seul, c'est un candidat à l'examen **sans documents** : il récite ce qu'il a mémorisé au cours (ses poids), il invente quand il a un trou.

```
        LLM SEUL                          LLM + RAG
   ┌──────────────────┐            ┌──────────────────┐
   │ Connaissance     │            │ Connaissance     │   ┌────────────┐
   │ figée au training│            │ paramétrique     │◄──┤ Documents  │
   │                  │            │      +           │   │ privés,    │
   │ ❌ Hallucine      │            │ 📚 connaissance  │   │ récents,   │
   │ ❌ Ignoré post-   │            │    récupérée     │   │ vérifiables│
   │    cutoff        │            └──────────────────┘   └────────────┘
   │ ❌ Pas de sources │                    ✅ Réponse sourcée
   └──────────────────┘
```

> 📌 **À retenir** : RAG = *Retrieval-Augmented Generation* — on **branche une mémoire externe consultable** sous le modèle. Toute la suite du cours n'est que l'histoire des **trois façons de consulter** cette mémoire.

---

## §1 — CLASSIC RAG : « *Retrieves* » — Le bibliothécaire

### 1.1 Le pipeline (colonne bleue de l'image)

```
 👤 Query                "Quelle est la politique de retour ?"
    │
    ▼
 🌪️ EMBED                la requête devient un VECTEUR
    │                    query → [0.12, -0.87, 0.44, ...]
    ▼
 🗄️ VECTOR DB            index de tous les chunks du corpus
    │                    (mêmes vecteurs, calculés offline)
    ▼
 🔍 TOP-K CHUNKS         les K fragments les plus proches
    │                    (similarité cosinus)
    ▼
 🧠 LLM                  prompt = question + chunks
    ▼
 📜 ANSWER               réponse sourcée par les fragments
```

### 1.2 Zoom : les 5 gestes techniques

```
┌────────────────────────────────────────────────────────────────┐
│ 1️⃣ CHUNKING      📄📄📄 → [📃][📃][][📃]                      │
│    découper le corpus en fragments (256–1024 tokens)           │
│                                                                │
│ 2️⃣ EMBEDDING     "chat assis" → [0.8, 0.1, ...]               │
│    sens → géométrie (phrases proches = vecteurs proches)       │
│                                                                │
│ 3️⃣ INDEXATION    Vector DB (FAISS, Chroma, pgvector...)       │
│    structure pour recherche de voisins en ms                   │
│                                                                │
│ 4️⃣ RETRIEVAL     cosinus(query, chunk) → top-K                │
│    K = 3..10 typiquement                                       │
│                                                                │
│ 5️⃣ GÉNÉRATION    LLM(question ⊕ chunks) → réponse             │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Force et faiblesse : l'aiguille vs le fil

```
✅ SINGLE-HOP : "Quelle est la politique de retour ?"
   → 1 chunk contient la réponse → retrieval direct → PARFAIT

❌ MULTI-HOP : "Qui dirige l'entreprise où travaille Marie ?"
   ┌──────────────┐      ┌──────────────┐
   │ chunk A :    │      │ chunk B :    │
   │ "Marie       │  ??  │ "Le CEO de   │
   │  travaille   │──✂──│  CompanyX    │
   │  chez X"     │      │  est Paul"   │
   └──────────────┘      └──────────────┘
   Aucun chunk ne contient la réponse : il faut RELIER A et B.
   Le retrieval par similarité échoue : la question ne ressemble
   ni à A ni à B pris isolément.
```

> ⚖️ **Bilan** : *Fast, Simple, Single-hop* (bandeau de l'image). Idéal pour FAQ / docs homogènes. Fragile dès que la réponse est **éparpillée** ou qu'on demande une **vue globale** (« résume tout le corpus »).

---

## §2 — GRAPH RAG : « *Connects* » — Le cartographe

### 2.1 Le pipeline (colonne verte de l'image)

```
 👤 Query
    │
    ▼
 🏷️ ENTITY EXTRACTION        le LLM lit le corpus et extrait :
    │                        [personne:Marie] [org:CompanyX]
    │                        [location:Paris] + relations
    ▼
 🕸️ KNOWLEDGE GRAPH          nœuds = entités, arêtes = relations
    │
    ▼
 🔗 CONNECTED CONTEXT        on récupère le VOISINAGE pertinent
    │                        (sous-graphe, communauté, résumé)
    ▼
 🧠 LLM  →  📜 ANSWER
```

### 2.2 Mini-graphe : comprendre le multi-hop en un coup d'œil

```
              (Marie)
             /       \
      works_at       friend_of
           /             \
     (CompanyX)--------(Paul)
           \
        located_in
             \
           (Paris)

 Question : "Dans quelle ville travaille l'employeur de Marie ?"
 Parcours : Marie ──works_at──► CompanyX ──located_in──► Paris
            └────────────── 2 HOPS : impossible en Classic RAG ──┘
```

### 2.3 Deux régimes de retrieval (Microsoft GraphRAG)

```
┌─────────────────────────────┬──────────────────────────────────┐
│  LOCAL search               │  GLOBAL search                   │
│  "voisinage d'une entité"   │  "communautés + résumés"         │
│                             │                                  │
│  (Marie)→(CompanyX)→(Paris) │  🗺️ cluster {Marie,X,Paris,Paul} │
│                             │  → résumé : "Pôle emploi parisien│
│  → questions précises       │    autour de CompanyX..."        │
│                             │  → questions HOLISTIQUES         │
│                             │    ("thèmes principaux du corpus")│
└─────────────────────────────┴──────────────────────────────────┘
```

> ⚖️ **Bilan** : *Relational, Entity-rich, Multi-source*. Bat Classic RAG sur le multi-hop et le sensemaking global. **Mais** : coût d'extraction élevé, graphe à maintenir, erreurs d'extraction = erreurs de graphe.

---

## §3 — AGENTIC RAG : « *Reasons* » — L'enquêteur

### 3.1 Le pipeline (colonne violette de l'image)

```
                    👤 Query
                       │
                       ▼
              🤖 REASONING AGENT
              (planifie, route, décide)
              ┌────────┼────────┐
              ▼        ▼        ▼
          🗄️ Vector  🕸️ Know.  🛠️ Tools
             DB      Graph   (web, SQL, API…)
              └────────┼────────┘
                       ▼
              🔄 SELF-EVALUATION
              "ma réponse est-elle
               suffisante ? sourcée ?"
                 │           │
            insuffisant   suffisant
                 │           │
                 └─► retry   ▼
                       📜 FINAL ANSWER
```

### 3.2 L'agent = orchestrateur de sources

```
   Query : "Compare nos ventes 2025 (SQL) avec l'étude de marché
            (PDF) et l'actualité récente (web)"

   Agent : ① plan  → 3 sous-requêtes
           ② route → SQL / Vector DB / Search tool
           ③ agrège→ synthèse
           ④ juge  → "source web trop ancienne" → re-requête ✅
```

> 🔑 **Point clé de l'image** : la colonne violette **contient** les deux autres — Vector DB *et* Knowledge Graph deviennent des **outils** parmi d'autres. Agentic RAG n'est pas un remplaçant : c'est un **niveau d'organisation supérieur**.

### 3.3 La boucle d'auto-évaluation (Self-RAG, Corrective RAG, Reflection)

```
        ┌──────────────┐
        │  Générer une │
        │  réponse     │
        └──────┬───────┘
               ▼
        ┌──────────────┐     non    ┌──────────────────┐
        │  CRITIQUER : │───────────►│  Corriger :       │
        │  pertinente ?│            │  re-retrieve,     │
        │  soutenue ?  │            │  reformuler,      │
        └─────────────┘            │  changer de source│
               │ oui                └────────┬─────────┘
               ▼                             │
        ┌──────────────┐                     │
        │ FINAL ANSWER │◄────────────────────┘ (budget max !)
        └──────────────┘
```

> ⚖️ **Bilan** : *Adaptive, Self-correcting*. Le seul des trois qui **sait renoncer et recommencer**. **Mais** : latence ×3–×10, coût tokens, complexité, et risque d'erreur cumulative si le juge est mauvais (cf. cours n°1, §10 : juge < 50 % de précision → effondrement).

---

## §4 — Synthèse : choisir (et combiner)

### 4.1 Le bandeau de l'image, mis à plat

| | 🔵 Classic | 🟢 Graph | 🟣 Agentic |
|---|---|---|---|
| **Verbe** | *Retrieves* | *Connects* | *Reasons* |
| **Profil** | Fast, Simple | Relational, Entity-rich | Adaptive, Self-correcting |
| **Sauts** | Single-hop | Multi-hop | Multi-hop + multi-source |
| **Latence / coût** | 🟢 faible | 🟡 moyen (index) | 🔴 élevé (runtime) |
| **Infrastructure** | vector DB | + pipeline d'extraction | + orchestrateur + outils |
| **Cas type** | FAQ, docs | données relationnelles, corpus multi-sources | tâches ouvertes, vérification |

### 4.2 Arbre de décision

```
                  Votre question type ?
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
   Fait localisé     Relations entre    Tâche ouverte,
   dans 1 doc ?      entités / vue      sources hétéro-
        │            globale ?          gènes, besoin de
        │                │              vérification ?
        ▼                ▼                 ▼
   🔵 CLASSIC        🟢 GRAPH          🟣 AGENTIC
        │                │                 │
        └────────────────┴─────────────────┘
                         │
              💡 Et souvent : AGENTIC qui
                 pilote CLASSIC + GRAPH
```

---

## §5 — Pont avec le Cours n°1 (mémoire & compétences)

```
┌─────────────────────────────────────────────────────────────────┐
│  RAG  = mémoire externe en LECTURE seule (cours n°1, niveau 2)  │
│  AGENTIC RAG = agent + outils + BOUCLE DE JUGEMENT              │
│                 = Reflection / SkillWeaver appliqués au retrieval│
│  Étape suivante naturelle : que l'agent INDUISE des compétences │
│  de recherche ("skill : interroger le graphe du domaine X")     │
│  → convergence RAG × induction de compétences = agent complet   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✏️ Exercices

1. **Classic mini** 🟢 : 20 phrases → embeddings (sentence-transformers) + FAISS ; top-3 sur 5 questions.
2. **Multi-hop killer** 🟢 : montrez une question à 2 hops où votre RAG classic échoue.
3. **Graphe mini** 🟡 : extrayez des triplets de 10 phrases, répondez à la question de l'ex. 2 par parcours de graphe.
4. **Boucle critique** 🟡 : ajoutez un juge (0–5) ; si score < 4 → re-retrieval avec requête reformulée.
5. **Router** 🟠 : un agent choisit entre vector DB / graphe / web selon la query ; loggez ses choix.
6. **Benchmark maison** 🔴 : mêmes 10 questions × 3 architectures → précision, latence, coût tokens.

## 📚 Références

Lewis et al. 2020 (RAG) · Edge et al. 2024 (GraphRAG, Microsoft) · Guo et al. 2024 (LightRAG) · Asai et al. 2023 (Self-RAG) · Yan et al. 2024 (Corrective RAG) · Yao et al. 2022 (ReAct) · Shinn et al. 2023 (Reflexion) · Singh et al. 2025 (survey Agentic RAG).