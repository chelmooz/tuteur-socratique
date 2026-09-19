# Plan de travail détaillé — Semaine 1
## Fondations, Python lisible et premier dialogue avec Ollama

**Période : mercredi 9 septembre 2026 → mardi 15 septembre 2026**  
**Jalon : mardi 15 septembre 2026**  
**Projet : tuteur scolastique local basé sur Ollama et le corpus *AI Engineering* de Chip Huyen**  
**Machine de travail : Omarchy/Linux avec Quadro RTX 4000, Ollama en local**

## 1. Résultat attendu en fin de semaine

À la fin de cette semaine, tu dois être capable de lancer depuis un terminal un programme Python que tu comprends, qui envoie une question à un modèle Ollama local, affiche la réponse progressivement et conserve l’historique de la conversation. Le programme doit fonctionner sans cloud et sans FastAPI, Docker, Chroma ou interface web.

Le livrable final sera composé de quatre éléments :

| Livrable | Critère de réussite |
|---|---|
| `chat.py` | Question au clavier, appel HTTP à Ollama, réponse affichée, streaming, historique et gestion d’erreur |
| Dépôt Git propre | Au moins cinq commits descriptifs et un `README.md` permettant de refaire l’installation |
| `docs/PYTHON-NOTES.md` | Dix concepts expliqués avec tes propres mots et un exemple minimal |
| Kanban Obsidian | Cartes organisées, une seule tâche en cours, blocages documentés |

### Test de passage du mardi

Tu recevras un petit script Python contenant trois bugs. Tu devras les corriger en moins de 45 minutes et expliquer oralement chaque correction : ce que faisait le code, pourquoi il était incorrect et comment tu as vérifié la réparation.

> **Règle de priorité :** cette semaine, comprendre et expliquer vaut mieux qu’ajouter des fonctionnalités. Toute fonctionnalité non nécessaire à `chat.py` est reportée.

## 2. Règles de travail

### Cadence

Un pomodoro dure **45 minutes de travail concentré**, suivi de **15 minutes de pause réelle**. Une carte Kanban correspond à un pomodoro. La limite WIP (*Work in Progress*) est de **une seule carte dans « En cours »**.

Pendant la pause, quitte le terminal. Bois de l’eau, marche quelques minutes ou repose tes yeux. Ne transforme pas la pause en recherche YouTube supplémentaire.

### Méthode de compréhension du code généré

Pour chaque bloc généré par l’IA :

1. Demande une version courte et commentée.
2. Lis le code ligne par ligne avant de l’exécuter.
3. Écris ce que tu penses que le programme va faire.
4. Exécute-le avec un cas normal et un cas d’erreur.
5. Reformule son fonctionnement avec tes propres mots.
6. Ne committe le code qu’après cette vérification.

### Débrief quotidien

À la fin de chaque journée, écris exactement trois lignes :

```text
✅ Fait : ...
🚧 Bloqué : ...
🎯 Demain : ...
```

Si rien ne bloque, écris `🚧 Bloqué : aucun blocage`. Un blocage non documenté ne doit pas rester dans ta tête.

## 3. Organisation du Kanban Obsidian

Crée les colonnes suivantes :

| Colonne | Usage |
|---|---|
| Backlog semaine | Toutes les tâches prévues mais non commencées |
| Aujourd’hui | Trois cartes maximum sélectionnées le matin |
| En cours | Une seule carte active |
| Bloqué | Problème nécessitant une recherche ou une décision |
| Done | Travail terminé et vérifié |

### Cartes initiales à créer

- [ ] Créer le dépôt `tuteur-scolastique` et son `README.md`.
- [ ] Créer le venv Python.
- [ ] Installer et tester `requests`.
- [ ] Vérifier Ollama et le modèle local.
- [ ] Étudier variables, types et f-strings.
- [ ] Étudier fonctions, arguments et `return`.
- [ ] Étudier conditions et boucles.
- [ ] Étudier listes et dictionnaires.
- [ ] Étudier JSON et fichiers.
- [ ] Explorer `/api/tags` et `/api/generate` en `curl`.
- [ ] Créer `chat.py` v1 sans streaming.
- [ ] Créer `chat.py` v2 avec streaming.
- [ ] Ajouter l’historique multi-tours.
- [ ] Ajouter `OLLAMA_HOST` et la gestion d’erreur.
- [ ] Rédiger `docs/PYTHON-NOTES.md`.
- [ ] Effectuer le test de passage à trois bugs.

## 4. Préparation technique unique

À exécuter depuis le dossier de travail, en adaptant le chemin si nécessaire :

```bash
mkdir -p ~/projets
cd ~/projets
git clone https://github.com/chelmooz/tuteur-scolastique.git 2>/dev/null || mkdir tuteur-scolastique
cd tuteur-scolastique
python3 --version
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install requests
mkdir -p docs
printf ".venv/\n__pycache__/\n*.pyc\n.env\n" > .gitignore
git status
```

Si la création du venv échoue sous Omarchy/Arch, ne contourne pas silencieusement le problème. Note le message exact dans le Kanban, puis utilise l’une des solutions suivantes :

```bash
sudo pacman -S python-pip
python3 -m venv .venv
```

ou :

```bash
uv venv
source .venv/bin/activate
uv pip install requests
```

Vérifie ensuite Ollama :

```bash
ollama --version
systemctl --user status ollama --no-pager
curl http://localhost:11434/api/tags
```

Si aucun modèle approprié n’est présent, télécharge celui que tu as choisi. Le nom exact doit être confirmé par `ollama list`; n’invente pas un tag qui n’existe pas :

```bash
ollama list
ollama pull qwen2.5:7b-instruct-q4_k_m
```

La variable de connexion utilisée cette semaine est :

```bash
export OLLAMA_HOST=http://localhost:11434
```

## 5. Calendrier détaillé

### Mercredi 9 septembre — Installation et premier contact

**Objectif du jour :** disposer d’un environnement reproductible et obtenir une première réponse d’Ollama depuis Python.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Créer le dépôt, le venv, `.gitignore`, `docs/` et le README. Vérifier `python3`, `pip`, `requests` et Git. | `git status`, versions et première carte déplacée dans `Done` |
| P2 | Étudier les variables, les chaînes, les nombres, les booléens et les f-strings. Demander trois mini-scripts à l’IA, prédire leur sortie, puis vérifier. | Notes avec prédiction, sortie réelle et correction |
| P3 | Explorer Ollama avec `/api/tags` et `/api/generate`. Comparer `"stream": false` et `"stream": true`. | Deux réponses sauvegardées dans `docs/ollama-api-notes.md` |
| P4 | Construire `chat.py` v1 : lire une question avec `input()`, appeler `/api/generate` avec `requests.post`, afficher une réponse non streamée. | Script commenté ligne par ligne et test réussi |
| P5 | Rédiger le premier débrief et committer le travail. | Commit `feat: add first local Ollama chat` |

Commande de test minimale :

```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"qwen2.5:7b-instruct-q4_k_m","prompt":"Explique un token en une phrase.","stream":false}'
```

### Jeudi 10 septembre — Lire du Python et transformer le script en fonction

**Objectif du jour :** comprendre le chemin d’une donnée dans un programme Python.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Étudier fonctions, paramètres, arguments et `return`. Réécrire un exemple sans copier la solution de l’IA. | Trois fonctions expliquées avec entrée et sortie |
| P2 | Refactoriser l’appel Ollama dans une fonction `generate_response(prompt)`. Identifier les données qui entrent et sortent. | Schéma texte : `question → requête → JSON → réponse` |
| P3 | Étudier les conditions `if/elif/else` et les exceptions `try/except`. Tester une question vide. | Cas normal et cas invalide documentés |
| P4 | Ajouter des messages d’erreur lisibles lorsque le serveur est arrêté ou que la réponse HTTP échoue. | Test avec Ollama arrêté puis redémarré |
| P5 | Mettre à jour `PYTHON-NOTES.md` et committer. | Commit `refactor: isolate Ollama request` |

### Vendredi 11 septembre — Streaming et structures de données

**Objectif du jour :** afficher la réponse token par token et commencer à comprendre le JSON ligne par ligne.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Étudier listes et dictionnaires. Repérer dans la réponse Ollama les clés `model`, `response` et `done`. | Tableau clé/valeur dans les notes |
| P2 | Étudier le format NDJSON produit par le streaming. Lire la réponse avec `response.iter_lines()`. | Exemple de trois lignes décodées |
| P3 | Construire `chat.py` v2 avec affichage progressif. Ne pas ajouter de framework. | Démonstration d’une réponse affichée progressivement |
| P4 | Ajouter une boucle de conversation simple avec une commande `quit` ou `exit`. | Deux tours de dialogue réussis |
| P5 | Relire le code à voix haute, corriger les commentaires inexacts et committer. | Commit `feat: stream Ollama responses` |

### Samedi 12 septembre — Historique multi-tours et fichiers JSON

**Objectif du jour :** comprendre comment une conversation est représentée et transmise au modèle.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Étudier JSON, `json.dumps`, `json.loads` et lecture/écriture de fichiers. | Petit fichier d’exemple chargé puis affiché |
| P2 | Choisir une structure d’historique simple : liste de messages avec rôle et contenu. | Exemple de trois messages annotés |
| P3 | Ajouter l’historique à `chat.py`. Vérifier que la question précédente influence le tour suivant. | Test : question de suivi dépendante du premier tour |
| P4 | Sauvegarder éventuellement une session dans un fichier local de test, sans en faire une fonctionnalité prioritaire. | Fichier JSON lisible ou décision documentée de report |
| P5 | Faire une revue de sécurité et de propreté : pas de clé API, pas de mot de passe, pas de fichier `.env` committé. | `git diff`, `git status` et débrief |

### Dimanche 13 septembre — Consolidation et documentation

**Objectif du jour :** transformer les essais en un outil reproductible et compréhensible.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Relire tout `chat.py` sans l’IA. Pour chaque fonction, écrire son rôle en une phrase. | Tableau fonction/rôle/entrée/sortie |
| P2 | Ajouter la configuration `OLLAMA_HOST`, avec la valeur par défaut `http://localhost:11434`. | Test avec variable définie puis non définie |
| P3 | Tester trois pannes : serveur arrêté, modèle absent, réponse vide ou invalide. | Tableau panne/message attendu/résultat obtenu |
| P4 | Rédiger `README.md` : prérequis, installation, activation du venv, lancement, arrêt avec `exit`, dépannage. | Une autre personne pourrait-elle suivre le README ? |
| P5 | Rédiger ou compléter les dix concepts : variable, type, chaîne, f-string, fonction, `return`, condition, boucle, liste/dictionnaire, JSON/exception. | `docs/PYTHON-NOTES.md` relu à voix haute |

### Lundi 14 septembre — Répétition du jalon et correction ciblée

**Objectif du jour :** vérifier que le projet est explicable et que tu peux déboguer sans dépendre immédiatement de l’IA.

| Bloc | Travail | Preuve à conserver |
|---|---|---|
| P1 | Repartir d’un terminal propre : activer le venv, vérifier Ollama, lancer le programme. | Procédure chronométrée |
| P2 | Faire une revue ligne par ligne de `chat.py`. Marquer les lignes encore incomprises dans une carte temporaire. | Liste des points éclaircis |
| P3 | Simuler trois bugs : mauvaise URL, mauvaise clé JSON, erreur de syntaxe ou indentation. Diagnostiquer avant de demander de l’aide. | Journal de diagnostic |
| P4 | Corriger uniquement les problèmes réellement nécessaires au jalon. Éviter toute nouvelle fonctionnalité. | Dernier commit fonctionnel |
| P5 | Préparer le test du lendemain et nettoyer le dépôt. | `git log --oneline`, `git status` propre, débrief |

### Mardi 15 septembre — Checkpoint du jalon 1

**Objectif du jour :** réussir le test de passage et figer la version de la Semaine 1.

| Bloc | Travail | Critère |
|---|---|---|
| P1 | Révision courte des notes et de la procédure de lancement. | Lancement sans aide extérieure |
| P2 | Test de passage : corriger trois bugs dans un script en moins de 45 minutes. | Trois corrections fonctionnelles |
| P3 | Explication orale : rôle des variables, fonctions, dictionnaires, `try/except`, JSON et streaming. | Explication compréhensible et cohérente |
| P4 | Vérification finale du dépôt : README, `chat.py`, notes, historique Git et absence de secrets. | Checklist complète |
| P5 | Rétrospective de semaine et préparation de la Semaine 2. | Jalon validé ou plan de rattrapage précis |

## 6. Structure minimale recommandée du dépôt

```text
tuteur-scolastique/
├── .gitignore
├── README.md
├── chat.py
├── docs/
│   ├── PYTHON-NOTES.md
│   └── ollama-api-notes.md
└── tests/
    └── README.md
```

Le dossier `tests/` peut rester documentaire cette semaine. L’objectif n’est pas encore de mettre en place une suite de tests complète.

## 7. Définition de « terminé » pour `chat.py`

Le script est considéré comme terminé uniquement si les conditions suivantes sont toutes vraies :

- Il demande une question dans le terminal.
- Il utilise une URL locale configurable par `OLLAMA_HOST`.
- Il transmet le nom du modèle à Ollama.
- Il affiche la réponse en streaming.
- Il conserve un historique multi-tours raisonnable.
- Il quitte proprement avec `exit` ou `quit`.
- Il affiche une erreur compréhensible si Ollama n’est pas accessible.
- Il ne contient aucune clé secrète.
- Tu peux expliquer le rôle de chaque bloc principal.

## 8. Ce qui est explicitement reporté

Ne travaille pas cette semaine sur Docker, FastAPI, Chainlit, Chroma, GraphRAG, fine-tuning, les quinze livres, l’interface web ou le déploiement LAN. Ces sujets sont importants, mais ils ajouteraient des variables avant que les fondations Python et API soient stables.

Le corpus principal de cette semaine reste limité aux ressources Python débutant et à la documentation de l’API Ollama. Le livre *AI Engineering* de Chip Huyen sera réintroduit à partir de la Semaine 2, lorsque l’ingestion du corpus deviendra le sujet principal.

## 9. Ressources à fournir à NotebookLM

Cette semaine, limite les sources à :

1. Les chapitres 1 à 6 d’*Automate the Boring Stuff with Python*, ou les sections équivalentes du tutoriel officiel Python.
2. La documentation de l’API Ollama, en particulier les endpoints `/api/tags` et `/api/generate`.
3. Tes propres sorties de terminal, erreurs et notes de compréhension.

Demande à NotebookLM de produire des questions de vérification, pas de réécrire automatiquement le projet. Une bonne question est : « Explique cette fonction sans donner directement la correction, puis donne-moi un exercice de modification d’une seule ligne. »

## 10. Rétroplanning de réussite

| Date | Preuve indispensable |
|---|---|
| 9 septembre | Environnement prêt, Ollama répond, `chat.py` v1 existe |
| 10 septembre | Fonction d’appel et gestion de la première erreur |
| 11 septembre | Streaming et deux tours de conversation |
| 12 septembre | Historique et bases JSON comprises |
| 13 septembre | Configuration, README et notes finalisés |
| 14 septembre | Répétition de débogage et dépôt propre |
| 15 septembre | Test à trois bugs réussi en moins de 45 minutes |

## 11. Débrief final du mardi

À la fin du checkpoint, complète ce bilan :

```text
Jalon : VALIDÉ / NON VALIDÉ
Temps de correction des 3 bugs : ... minutes
Ce que je sais maintenant expliquer : ...
Ce qui reste incompris : ...
Blocage principal rencontré : ...
Décision pour la Semaine 2 : ...
```

## Références

[1]: https://docs.python.org/3/tutorial/ "Python 3 Tutorial — Documentation officielle"

[2]: https://docs.ollama.com/api "Ollama API — Documentation officielle"

[3]: https://automatetheboringstuff.com/ "Automate the Boring Stuff with Python"

[4]: https://github.com/chelmooz "Dépôt GitHub chelmooz"
