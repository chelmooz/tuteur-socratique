# Dossier Sources Corpus RAG (`data/corpus/`)

Ce dossier est l'emplacement dédié pour déposer tous vos nouveaux documents sources et cours que vous créez au fur et à mesure.

### Formats supportés :
- **Fichiers Markdown** (`.md`) : Cours, résumés techniques, notes de veille.
- **Fichiers Texte** (`.txt`) : Transcriptions, extraits de code, mémentos.
- **Fichiers HTML** (`.html`) : Pages d'architecture, articles enregistrés.
- **Fichiers PDF** (`.pdf`) : Livres blancs, documentations officielles.
- **Fichiers Images** (`.png`, `.jpg`, `.svg`) : Schémas d'architecture, diagrammes RAG, infographies.

### Comment les intégrer à l'application ?
1. Déposez simplement vos fichiers dans ce dossier `data/corpus/` (via l'explorateur de fichiers de Google AI Studio à gauche).
2. Dans le chat, dites simplement : *"J'ai ajouté un nouveau document dans data/corpus/ (nom-du-fichier)"*.
3. L'assistant lira automatiquement le contenu, l'analysera, et créera :
   - L'entrée dans le catalogue de documents `DOCUMENTS_CATALOG` avec sa catégorie et sa stratégie de chunking vectoriel optimale.
   - La fiche détaillée de cours avec résumé, concepts clés et questions d'évaluation (quiz).
   - L'intégration dans le Tuteur Socratique IA pour que vous puissiez poser des questions dessus !
