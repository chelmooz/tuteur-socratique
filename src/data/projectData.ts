/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  label: string;
  detail: string;
  commande: string;
  prompt: string;
  succes: string;
}

export interface Pomodoro {
  titre: string;
  taches: Task[];
}

export interface DayData {
  date: string;
  objectif: string;
  pomodoros: Pomodoro[];
}

export interface DocumentItem {
  filename: string;
  category: 'RAG & Pipeline' | 'Fondations LLM' | 'Agents & Protocoles' | 'Agents & Orchestration' | 'Données & Persistance' | 'Architecture & Production' | 'Sécurité & Contrôle';
  title: string;
  format: 'PDF' | 'HTML' | 'PPTX' | 'TXT' | 'JPEG' | 'JPG' | 'MD';
  importance: 'Très Haute' | 'Haute' | 'Moyenne';
  description: string;
  chunkingStrategy?: string;
}

export interface GlossaryItem {
  terme: string;
  definition: string;
}

export const PROMPT_TEMPLATES = {
  "PROMPT_CTX": "Contexte : débutant total en Python et Git, projet tuteur-scolastique, dossier /home/chelmooz/Projects/tuteur-scolastique.",
  "PROMPT_COT": "CoT : raisonne étape par étape AVANT d'agir, en écrivant : 1) le but, 2) les étapes prévues, 3) les risques.",
  "PROMPT_RTOC": "RTOC : Run chaque commande une par une ; Test avec un cas normal ET un cas d'erreur ; Observe le résultat et explique-le-moi en une phrase simple ; Commit seulement si je te le demande, avec le message exact que je te donne.",
  "PROMPT_PED": "Explique chaque commande ou ligne de code en commentaire français simple AVANT de la lancer."
};

export const SEMAINE_1_DATA: Record<string, DayData> = {
  "mercredi9": {
    "date": "Mercredi 9 septembre",
    "objectif": "Installation et premier contact",
    "pomodoros": [
      {
        "titre": "P1 - Setup environnement",
        "taches": [
          {
            "label": "Créer le dossier du projet",
            "detail": "Un dossier (répertoire) est une boîte pour ranger tes fichiers. Tu vas créer la boîte principale du projet : elle contiendra le code, les notes et le suivi Git. L'option -p crée le dossier et, au besoin, ses dossiers parents d'un coup.",
            "commande": "mkdir -p /home/chelmooz/Projects/tuteur-scolastique",
            "prompt": "1) Explique-moi ce que fait la commande mkdir -p en une phrase simple ;\n2) Vérifie que le dossier /home/chelmooz/Projects existe avec ls /home/chelmooz/Projects ;\n3) Crée le dossier du projet avec la commande exacte : mkdir -p /home/chelmooz/Projects/tuteur-scolastique ;\n4) Vérifie le résultat avec ls /home/chelmooz/Projects/tuteur-scolastique ;\n5) Explique-moi le symbole ~ : il désigne mon dossier personnel (/home/chelmooz).",
            "succes": "ls /home/chelmooz/Projects/tuteur-scolastique fonctionne (dossier vide ou non, ça suffit)"
          },
          {
            "label": "Initialiser Git (git init)",
            "detail": "Git est un cahier de bord qui photographie chaque version de tes fichiers. Un dépôt (repository) est un projet suivi par Git. git init déclenche ce suivi dans le dossier courant : tu verras apparaître un dossier caché .git qui contient tout l'historique.",
            "commande": "git init",
            "prompt": "1) Vérifie que tu es bien dans le dossier du projet avec pwd (le chemin doit finir par tuteur-scolastique) ;\n2) Explique-moi ce que fait git init avant de le lancer ;\n3) Lance git init ;\n4) Montre-moi le dossier caché créé avec ls -a ;\n5) Lance git status et explique-moi ce qu'il affiche (branche, fichier .gitignore déjà fait ou non).",
            "succes": "git status affiche « Sur la branche main » (ou master) sans erreur"
          },
          {
            "label": "Créer le venv (python -m venv .venv)",
            "detail": "Un venv (environnement virtuel) est une salle privée qui contient SON Python et SES bibliothèques, rien que pour ton projet : le Python du système n'est pas touché. La commande crée un dossier caché .venv dans le dossier actuel.",
            "commande": "python -m venv .venv",
            "prompt": "1) Vérifie que python3 existe avec python3 --version ; s'il manque, donne-moi la commande d'installation Arch SANS l'exécuter à ma place ;\n2) Crée le venv avec la commande exacte : python -m venv .venv ;\n3) Montre le contenu créé avec ls -a .venv ;\n4) Explique-moi en une phrase à quoi sert ce dossier ;\n5) Ne lance pas encore l'activation.",
            "succes": "Le dossier .venv existe et contient des sous-dossiers (bin, lib...)"
          },
          {
            "label": "Activer le venv (source .venv/bin/activate)",
            "detail": "Activer le venv = dire au terminal : « utilise désormais le Python du projet, pas celui du système ». Après activation, le début de ta ligne de commande affiche (.venv), c'est ton repère visuel.",
            "commande": "source .venv/bin/activate",
            "prompt": "1) Explique-moi le rôle de la commande source avant de la lancer ;\n2) Active le venv avec la commande exacte : source .venv/bin/activate ;\n3) Montre-moi l'invite de commande : elle doit commencer par (.venv) ;\n4) Vérifie quel Python est utilisé avec which python : le chemin doit contenir .venv ;\n5) Teste la sortie avec deactivate puis montre que (.venv) disparaît, puis réactive-le.",
            "succes": "L'invite du terminal affiche (.venv) en début de ligne et which python pointe vers .venv"
          },
          {
            "label": "Installer requests (pip install requests)",
            "detail": "pip est le magasin d'installations de Python : il télécharge et pose des bibliothèques. requests est un messager qui permet à Python de parler à des serveurs web (comme Ollama) via le protocole HTTP.",
            "commande": "pip install requests",
            "prompt": "1) Vérifie que le venv est actif (l'invite doit afficher (.venv)) ; sinon active-le d'abord ;\n2) Explique la différence entre pip et python AVANT d'exécuter ;\n3) Lance pip install requests ;\n4) Vérifie l'installation avec pip list | grep requests ;\n5) Explique-moi ce qu'est une bibliothèque Python en une phrase avec une analogie.",
            "succes": "pip list montre requests avec un numéro de version"
          },
          {
            "label": "Créer .gitignore",
            "detail": ".gitignore est une liste de règles qui dit à Git : « ne surveille PAS ces fichiers-là ». On y met .venv/ car l'environnement virtuel est personnel et volumineux : chacun doit créer le sien.",
            "commande": "echo '.venv/' > .gitignore",
            "prompt": "1) Explique-moi ce que fait la commande echo 'texte' > fichier ;\n2) Crée .gitignore avec le contenu exact : .venv/ ;\n3) Affiche-le avec cat .gitignore pour vérifier ;\n4) Lance git status et montre-moi que .venv n'apparaît PAS dans la liste des fichiers à commiter ;\n5) Explique-moi pourquoi on ignore .venv.",
            "succes": "git status ne montre pas .venv/ dans les fichiers suivis"
          },
          {
            "label": "Créer dossier docs/",
            "detail": "docs/ est le dossier des notes du projet : explications Python, observations des réponses Ollama. Un bon projet sépare le code (à la racine) des documents (dans docs/).",
            "commande": "mkdir -p docs",
            "prompt": "1) Crée le dossier docs avec mkdir -p docs ;\n2) Crée dedans un fichier vide de notes avec touch docs/PYTHON-NOTES.md ;\n3) Vérifie avec ls -R docs ;\n4) Explique-moi pourquoi séparer code et documentation ;\n5) Ne coche pas la tâche tant que le fichier n'existe pas vraiment.",
            "succes": "Le fichier docs/PYTHON-NOTES.md existe"
          },
          {
            "label": "Créer README.md vide",
            "detail": "Le README est la page d'accueil du projet : on y écrira (un jour) comment installer et lancer le programme. Aujourd'hui on crée juste le fichier vide, il sera rempli en fin de semaine.",
            "commande": "touch README.md",
            "prompt": "1) Explique le rôle du README en une phrase ;\n2) Crée le fichier avec touch README.md ;\n3) Vérifie avec ls -la ;\n4) Demande-moi de confirmer que je comprends sa future utilité.",
            "succes": "Le fichier README.md existe à la racine du projet"
          },
          {
            "label": "Premier commit (git add + commit)",
            "detail": "Un commit est une photo-souvenir du projet à un instant T. git add sélectionne les fichiers à photographier, git commit prend la photo en lui donnant un message. Le premier commit fige l'ossature du projet.",
            "commande": "git add . && git commit -m \"chore: project skeleton\"",
            "prompt": "1) Lance git status et explique-moi la liste des fichiers affichés ;\n2) Ajoute tous les fichiers avec git add . ;\n3) Relance git status pour voir les fichiers « staged » (verts) et explique-moi ;\n4) Fais le commit avec le message EXACT : chore: project skeleton ;\n5) Montre l'historique avec git log --oneline et explique en une phrase ce que ce commit a enregistré.",
            "succes": "git log --oneline affiche le message « chore: project skeleton »"
          }
        ]
      },
      {
        "titre": "P2 - Python basique",
        "taches": [
          {
            "label": "Demander à opencode 3 mini-scripts sur variables",
            "detail": "Une variable est une boîte étiquetée qui contient une valeur (un nombre, du texte...). Tu vas demander à opencode 3 petits scripts qui montrent des variables, et les enregistrer pour les lire ensuite.",
            "commande": "aucune (le prompt génère et enregistre les scripts)",
            "prompt": "1) Génère 3 mini-scripts différents, de 4 lignes maximum chacun, sur les variables : l'un avec un nombre, l'un avec du texte, l'un qui remplace la valeur d'une variable ;\n2) Commente chaque ligne en français simple ;\n3) Enregistre les 3 scripts dans le fichier docs/exemples-variables.py, séparés par un titre (Script 1, Script 2, Script 3) ;\n4) Affiche le fichier complet à l'écran ;\n5) N'exécute PAS les scripts : on va les prédire d'abord.",
            "succes": "docs/exemples-variables.py contient 3 scripts commentés"
          },
          {
            "label": "Prédire la sortie du script 1 par écrit",
            "detail": "Lecture active : avant d'exécuter un programme, tu écris ce que tu penses qu'il va afficher. Ensuite tu exécutes et tu compares. C'est l'exercice le plus rapide pour comprendre Python sans mémoriser.",
            "commande": "aucune (papier ou docs/PYTHON-NOTES.md)",
            "prompt": "1) Ouvre docs/exemples-variables.py et affiche le SCRIPT 1 uniquement ;\n2) Explique-moi ce que fait chaque ligne sans le lancer ;\n3) Demande-moi : « Selon toi, qu'affiche ce script ? » et ATTENDS que j'écrive ma prédiction ;\n4) Écris ma prédiction dans docs/PYTHON-NOTES.md sous la section « Script 1 - prédiction » ;\n5) NE l'exécute PAS encore : l'exécution est la tâche suivante.",
            "succes": "Ma prédiction du script 1 est écrite dans docs/PYTHON-NOTES.md"
          },
          {
            "label": "Exécuter et vérifier prédiction 1",
            "detail": "Maintenant on lance le script et on compare avec la prédiction écrite. L'écart (ou l'égalité) est la leçon : tu apprends en comparant, pas en lisant des cours.",
            "commande": "python docs/exemples-variables.py",
            "prompt": "1) Exécute le SCRIPT 1 seulement (isole-le dans un fichier temporaire si besoin) ;\n2) Montre-moi la sortie réelle ;\n3) Compare avec ma prédiction écrite dans les notes et explique l'écart en 2 phrases simples ;\n4) Ajoute dans docs/PYTHON-NOTES.md la section « Script 1 - sortie réelle » avec la sortie affichée ;\n5) Pose-moi une question de vérification : pourquoi ce résultat ?",
            "succes": "La sortie réelle du script 1 est notée à côté de ma prédiction"
          },
          {
            "label": "Prédire la sortie du script 2 par écrit",
            "detail": "Même exercice que pour le script 1 : on PRÉDIT avant d'exécuter. Plus tu prédiras juste, mieux tu comprendras Python. Fais un effort écrit, pas dans ta tête.",
            "commande": "aucune (papier ou docs/PYTHON-NOTES.md)",
            "prompt": "1) Ouvre docs/exemples-variables.py et affiche le SCRIPT 2 uniquement ;\n2) Demande-moi : « Selon toi, qu'affiche ce script ? » et ATTENDS ma réponse écrite ;\n3) Écris ma prédiction dans docs/PYTHON-NOTES.md sous « Script 2 - prédiction » ;\n4) NE l'exécute pas encore.",
            "succes": "Ma prédiction du script 2 est écrite dans docs/PYTHON-NOTES.md"
          },
          {
            "label": "Exécuter et vérifier prédiction 2",
            "detail": "Exécution du script 2 puis comparaison avec ta prédiction. L'objectif n'est pas d'avoir juste, c'est de comprendre pourquoi.",
            "commande": "python docs/exemples-variables.py",
            "prompt": "1) Exécute le SCRIPT 2 seulement ;\n2) Montre la sortie réelle ;\n3) Compare avec ma prédiction et explique l'écart en 2 phrases simples ;\n4) Écris la sortie réelle dans docs/PYTHON-NOTES.md sous « Script 2 - sortie réelle » ;\n5) Explique-moi le rôle du texte entre guillemets dans le script.",
            "succes": "La sortie réelle du script 2 est notée à côté de ma prédiction"
          },
          {
            "label": "Prédire la sortie du script 3 par écrit",
            "detail": "Dernier exercice de prédiction de la série. Le script 3 remplace la valeur d'une variable : commence à écrire ce que tu crois que le programme affichera, ligne par ligne.",
            "commande": "aucune (papier ou docs/PYTHON-NOTES.md)",
            "prompt": "1) Affiche le SCRIPT 3 uniquement ;\n2) Demande-moi : « Selon toi, qu'affiche ce script ? » et ATTENDS ma réponse écrite ;\n3) Écris ma prédiction dans les notes sous « Script 3 - prédiction » ;\n4) NE l'exécute pas encore.",
            "succes": "Ma prédiction du script 3 est écrite dans docs/PYTHON-NOTES.md"
          },
          {
            "label": "Exécuter et vérifier prédiction 3",
            "detail": "La dernière comparaison. Ensuite, on écrira ensemble les 3 concepts clés appris : variable, affectation (=), print.",
            "commande": "python docs/exemples-variables.py",
            "prompt": "1) Exécute le SCRIPT 3 seulement ;\n2) Montre la sortie réelle ;\n3) Compare avec ma prédiction et explique l'écart en 2 phrases ;\n4) Écris la sortie réelle dans les notes sous « Script 3 - sortie réelle » ;\n5) Résume-moi en une phrase le rôle du signe = en Python.",
            "succes": "La sortie réelle du script 3 est notée à côté de ma prédiction"
          },
          {
            "label": "Noter les 3 concepts dans PYTHON-NOTES.md",
            "detail": "On rédige avec TES mots ce que tu as appris : variable, affectation (=), affichage (print). Écrire avec ses mots, c'est vraiment comprendre.",
            "commande": "aucune (rédaction guidée dans les notes)",
            "prompt": "1) Voici 3 concepts : variable, affectation (=), print ;\n2) Pose-moi la question une par une : « qu'as-tu compris de X ? » et écris MA réponse (mes mots) dans docs/PYTHON-NOTES.md ;\n3) Aligne : si un concept est faux ou flou, reformule-le avec moi ;\n4) Ajoute un mini-exemple de 2 lignes pour chaque concept ;\n5) Montre-moi le résultat final de la section.",
            "succes": "3 concepts (variable, affectation, print) rédigés de mes mots dans les notes"
          }
        ]
      },
      {
        "titre": "P3 - Explorer Ollama",
        "taches": [
          {
            "label": "Vérifier qu'Ollama tourne (ollama --version)",
            "detail": "Ollama est le serveur IA local qui héberge tes modèles. La commande ollama --version affiche la version installée ; si elle renvoie une erreur, Ollama n'est pas installé ou pas accessible depuis le terminal.",
            "commande": "ollama --version",
            "prompt": "1) Lance ollama --version ;\n2) Explique-moi ce qu'affiche la sortie ;\n3) Si la commande échoue, explique-moi pourquoi (pas installé ? pas dans le PATH ?) et donne-moi la commande de démarrage ou d'installation Arch SANS l'exécuter à ma place ;\n4) Demande-moi de confirmer que j'ai compris.",
            "succes": "ollama --version affiche une version (ex : ollama version 0.x.x)"
          },
          {
            "label": "Lister les modèles (ollama list)",
            "detail": "ollama list montre tous les modèles IA téléchargés sur ta machine : leur nom exact (celui à écrire dans le code), leur taille et la date. C'est ta liste d'inventaire.",
            "commande": "ollama list",
            "prompt": "1) Lance ollama list ;\n2) Explique-moi chaque colonne du tableau affiché (NAME, ID, SIZE, MODIFIED) ;\n3) Dis-moi si le modèle qwen2.5:7b-instruct-q4_k_m est présent ou non ;\n4) Si la liste est vide ou l'erreur, explique-moi ce que cela signifie.",
            "succes": "ollama list affiche le tableau des modèles (même vide), et je comprends les colonnes"
          },
          {
            "label": "Télécharger qwen2.5:7b-instruct-q4_k_m si absent",
            "detail": "Le modèle est le cerveau qui répond. Le télécharger = le copier sur ta machine avec ollama pull. La partie q4_k_m est une version compressée, plus légère et plus rapide pour une machine sans grosse carte graphique.",
            "commande": "ollama pull qwen2.5:7b-instruct-q4_k_m",
            "prompt": "1) Vérifie d'abord avec ollama list si le modèle est déjà présent ;\n2) S'il est absent, lance ollama pull qwen2.5:7b-instruct-q4_k_m ;\n3) Explique-moi ce qui se passe pendant le téléchargement (pourcentage, extraction) ;\n4) Si le nom exact échoue avec « 404 », essaie ollama pull qwen2.5 et explique-moi la différence de nom ;\n5) Re-vérifie avec ollama list que le modèle apparaît.",
            "succes": "ollama list affiche le modèle qwen2.5:7b-instruct-q4_k_m (ou qwen2.5)"
          },
          {
            "label": "Tester curl avec stream:false",
            "detail": "curl est un outil du terminal pour envoyer des requêtes aux serveurs, comme on appelle un distributeur automatique. Tu demandes à l'API d'Ollama une réponse COMPLÈTE (stream:false = d'un bloc, pas mot par mot).",
            "commande": "curl http://localhost:11434/api/generate -d '{\"model\":\"qwen2.5:7b-instruct-q4_k_m\",\"prompt\":\"Dis bonjour en français\",\"stream\":false}'",
            "prompt": "1) Vérifie qu'Ollama tourne avec ollama list ;\n2) Explique-moi chaque partie de la commande curl AVANT de la lancer : l'adresse http, l'option -d, et le contenu entre accolades ;\n3) Lance la commande curl avec stream:false ;\n4) Affiche le JSON reçu et explique-moi CHAQUE champ : model, created_at, response, done, done_reason, context ;\n5) Dis-moi lequel contient la réponse du modèle.",
            "succes": "Une réponse JSON s'affiche avec le champ response rempli"
          },
          {
            "label": "Copier la réponse dans docs/ollama-api-notes.md",
            "detail": "On garde une trace écrite de ce qu'on observe : la réponse va dans un fichier de notes docs/. C'est ta future référence quand tu écriras du code.",
            "commande": "aucune (le prompt écrit le fichier)",
            "prompt": "1) Crée le fichier docs/ollama-api-notes.md avec un titre ;\n2) Ajoute la section « Réponse stream:false » ;\n3) Colles-y la réponse JSON complète obtenue avec le curl en stream:false ;\n4) Ajoute une ligne pour chaque champ avec l'explication simple que tu m'as donnée ;\n5) Montre-moi le fichier final.",
            "succes": "docs/ollama-api-notes.md contient la réponse complète et l'explication des champs"
          },
          {
            "label": "Tester curl avec stream:true",
            "detail": "stream:true = la réponse arrive par petits morceaux, comme un robinet qui coule au lieu d'une bouteille qu'on remplit d'un coup. Chaque morceau est une ligne JSON séparée : c'est le streaming.",
            "commande": "curl http://localhost:11434/api/generate -d '{\"model\":\"qwen2.5:7b-instruct-q4_k_m\",\"prompt\":\"Raconte une blague courte\",\"stream\":true}'",
            "prompt": "1) Lance la commande curl avec stream:true ;\n2) Observe : plusieurs lignes JSON s'affichent à la suite ;\n3) Compare avec le mode stream:false et explique-moi si c'est un bloc ou un flux ;\n4) Repère le champ done : sur quelle ligne vaut-il true ? Que signifie ce champ ? ;\n5) Explique pourquoi on appelle ce format NDJSON (un JSON par ligne).",
            "succes": "Plusieurs lignes JSON arrivent à la suite : la réponse arrive en continu"
          },
          {
            "label": "Copier la réponse streaming dans notes",
            "detail": "On archive aussi l'exemple streaming avec les observations qui vont avec. Ta future fonction de streaming s'appuiera exactement sur ce que tu vois ici.",
            "commande": "aucune (le prompt écrit le fichier)",
            "prompt": "1) Relance le curl en stream:true ;\n2) Capte 4 ou 5 lignes du flux et colle-les dans docs/ollama-api-notes.md sous la section « Réponse stream:true » ;\n3) Asset un commentaire d'une phrase observant les champs qui changent entre les lignes (ex : response qui s'accumule, done qui passe de false à true) ;\n4) Montre-moi la section.",
            "succes": "docs/ollama-api-notes.md contient la section stream:true avec 4-5 lignes JSON"
          },
          {
            "label": "Noter la différence entre les deux modes",
            "detail": "Le point clé du jour : un bloc (stream:false) VS un flux de lignes (stream:true). Tu l'écris avec tes mots : c'est la trace qui prouve ta compréhension.",
            "commande": "aucune (papier ou docs/ollama-api-notes.md)",
            "prompt": "1) Pose-moi la question : « Qu'as-tu compris de la différence entre stream:false et stream:true ? » ;\n2) Écris MA réponse (mes mots) dans docs/ollama-api-notes.md sous « Différence entre les deux modes » ;\n3) Si ma réponse contient une confusion, corrige en douceur avec une analogie (bouteille vs robinet) ;\n4) Rédige la version finale dans le fichier.",
            "succes": "Une phrase comparant les deux modes est écrite de mes mots dans les notes"
          }
        ]
      },
      {
        "titre": "P4 - chat.py v1",
        "taches": [
          {
            "label": "Demander à opencode un script basique",
            "detail": "chat.py sera ton premier vrai programme : une question → envoyée à Ollama → réponse affichée. Ici tu demandes à opencode de l'écrire, mais on NE l'exécute PAS encore : lecture d'abord.",
            "commande": "aucune (le prompt écrit chat.py)",
            "prompt": "1) Écris dans le dossier courant le fichier chat.py avec ces spécifications EXACTES :\na) demander une question avec input() ;\nb) l'envoyer par requests.post vers http://localhost:11434/api/generate ;\nc) envoyer le JSON {\"model\": \"qwen2.5:7b-instruct-q4_k_m\", \"prompt\": question, \"stream\": false} ;\nd) afficher le champ \"response\" du JSON reçu ;\n2) Contraintes : chaque ligne commentée en français simple, 20 lignes maximum, PAS de fonction pour l'instant ;\n3) Avant d'écrire, explique-moi en 3 puces le chemin de la donnée : clavier, requête HTTP, JSON, écran ;\n4) Affiche le fichier complet ;\n5) N'exécute pas encore.",
            "succes": "chat.py existe, est commenté, et son contenu est affiché"
          },
          {
            "label": "Lire le code ligne par ligne (avant exécution)",
            "detail": "Surtout ne pas exécuter tout de suite : tu lis chaque ligne et opencode t'explique ce qu'elle fait. C'est l'étape qui transforme du code copié en code compris.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche chat.py ;\n2) Pour CHAQUE ligne, explique-la-moi en une phrase simple AVANT de passer à la suite (import, input, requests.post, .json(), print...) ;\n3) Termine par une question de vérification : « explique-moi avec tes mots ce que fait la ligne requests.post(...) » ;\n4) Ne lance PAS le programme.",
            "succes": "Je peux expliquer chaque ligne de chat.py avec mes mots"
          },
          {
            "label": "Écrire ce que le script devrait faire",
            "detail": "Avant l'exécution, tu écris en français le comportement attendu : le programme demande une question, l'envoie, affiche la réponse. Prédire avant de tester, c'est la méthode.",
            "commande": "aucune (notes ou papier)",
            "prompt": "1) Affiche chat.py ;\n2) Demande-moi : « En une phrase, selon toi que va faire ce script quand on le lancera ? » ;\n3) Corrige ou valide ma réponse ;\n4) Écris ma prédiction dans docs/PYTHON-NOTES.md sous « chat.py - prédiction du comportement » ;\n5) On n'exécute pas encore.",
            "succes": "Ma prédiction du comportement de chat.py est écrite dans les notes"
          },
          {
            "label": "Exécuter avec une question simple",
            "detail": "Le premier lancement ! Le programme va demander une question au clavier, l'envoyer à Ollama et afficher la réponse. Si une erreur s'affiche, ce n'est pas grave : on la lit ensemble.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Dis-moi que je dois saisir une question, propose-moi une question simple à taper ;\n3) Observe ensemble la sortie et compare-la avec ma prédiction écrite ;\n4) Corrige toi-même les erreurs éventuelles en m'expliquant chaque correction en une phrase ;\n5) Note le résultat dans docs/PYTHON-NOTES.md.",
            "succes": "Ma question tapée affiche une réponse du modèle"
          },
          {
            "label": "Vérifier si le comportement est correct",
            "detail": "On compare le comportement réel avec ta prédiction écrite à l'étape précédente. Pareil ? Il manque un champ ? On note l'écart : c'est là que tu apprends.",
            "commande": "aucune (comparaison guidée)",
            "prompt": "1) Récapitule ma prédiction écrite dans les notes et la sortie réelle obtenue ;\n2) Demande-moi : « Est-ce que le programme a fait ce que tu avais prédit ? » ;\n3) Explique-moi l'écart (ou l'égalité) en 2 phrases simples ;\n4) Écris le constat dans docs/PYTHON-NOTES.md ;\n5) Coche la tâche seulement quand le constat est écrit.",
            "succes": "Un constat comparant prédiction et réalité est noté dans les notes"
          },
          {
            "label": "Commenter chaque ligne de ta main",
            "detail": "Ajouter des commentaires SOI-MÊME force la compréhension. opencode peut proposer des commentaires, mais c'est TOI qui les réécris avec tes mots : la main écrit ce que la tête comprend.",
            "commande": "aucune (édition guidée de chat.py)",
            "prompt": "1) Affiche chat.py SANS ses commentaires au-dessus de chaque ligne ;\n2) Pour chaque ligne, explique-la-moi et demande-moi d'écrire MÊME un commentaire # en français simple ;\n3) Ne passe à la ligne suivante que quand j'ai écrit le commentaire ;\n4) Montre-moi le résultat final et vérifie que chaque ligne a son commentaire.",
            "succes": "Chaque ligne de chat.py est précédée d'un commentaire écrit de ma main"
          },
          {
            "label": "Tester avec une autre question",
            "detail": "Un programme se teste avec plusieurs cas. Une deuxième question = un deuxième test qui passe. Si ça casse, on apprend où.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Propose-moi une deuxième question (par exemple : « Qu'est-ce qu'une variable en Python ? ») ;\n3) Observe la réponse et corrige si besoin ;\n4) Explique-moi pourquoi tester plusieurs questions est important.",
            "succes": "Une 2e question obtient une réponse correcte"
          },
          {
            "label": "Commit: 'feat: add first local Ollama chat'",
            "detail": "On fige cette version dans l'historique Git avec un message normalisé : feat = une nouvelle fonctionnalité. Le message décrit ce que le commit apporte.",
            "commande": "git add chat.py && git commit -m \"feat: add first local Ollama chat\"",
            "prompt": "1) Lance git status et montre-moi les fichiers modifiés ;\n2) Explique-moi le rôle de git add ;\n3) Ajoute chat.py avec git add chat.py ;\n4) Fais le commit avec le message EXACT : feat: add first local Ollama chat ;\n5) Montre git log --oneline et explique-moi en une phrase ce que ce commit a enregistré.",
            "succes": "git log --oneline affiche « feat: add first local Ollama chat »"
          }
        ]
      },
      {
        "titre": "P5 - Consolidation",
        "taches": [
          {
            "label": "Relire PYTHON-NOTES.md",
            "detail": "Relecture complète des notes du jour : revoir ce qu'on a appris en 5 minutes. C'est la meilleure façon de s'en souvenir au réveil.",
            "commande": "cat docs/PYTHON-NOTES.md",
            "prompt": "1) Affiche docs/PYTHON-NOTES.md ;\n2) Lis-le à voix haute pour moi (ou demande-moi de le lire) ;\n3) Après la lecture, pose-moi une question sur n'importe quel concept ;\n4) Si je réponds faux, ré-explique en une phrase simple.",
            "succes": "J'ai lu/entendu l'intégralité de mes notes du jour"
          },
          {
            "label": "Ajouter 3 concepts appris aujourd'hui",
            "detail": "On enrichit les notes : un concept est une idée importante (venv, variable, streaming, commit...). Demande-toi quelles 3 idées tu gardes de cette journée.",
            "commande": "aucune (rédaction guidée dans les notes)",
            "prompt": "1) Pose-moi la question : « Quels 3 concepts importants as-tu appris aujourd'hui ? » ;\n2) Pour chacun, demande-moi une explication avec MES mots ;\n3) Écris mes réponses dans docs/PYTHON-NOTES.md sous « Concepts du jour - mercredi » ;\n4) Ajoute un mini-exemple de 2 lignes par concept si les notes n'en ont pas ;\n5) Montre-moi la section.",
            "succes": "3 concepts du jour sont rédigés de mes mots dans les notes"
          },
          {
            "label": "Mettre à jour Kanban (cartes dans Done)",
            "detail": "Le Kanban est un tableau à 3 colonnes : À faire / En cours / Fait. Aujourd'hui, presque toutes tes cartes devraient passer dans Fait. Déplacer ses cartes = voir sa progression.",
            "commande": "aucune (ou création de docs/KANBAN.md)",
            "prompt": "1) Vérifie si docs/KANBAN.md existe ;\n2) S'il n'existe pas, crée-le avec 3 colonnes : À faire / En cours / Fait ;\n3) Liste dans À faire les 5 pomodoros d'aujourd'hui ;\n4) Déplace toutes les cartes terminées dans Fait (coche les cases du tracker avec moi pour vérifier) ;\n5) Confirme les cartes restantes dans À faire ou En cours.",
            "succes": "docs/KANBAN.md (ou ton Kanban) affiche les cartes d'aujourd'hui dans Fait"
          },
          {
            "label": "Écrire débrief du jour (3 lignes)",
            "detail": "Le débrief = 3 phrases : ce que j'ai fait / ce qui m'a bloqué / ce que je fais demain. Le bouton violet 📝 du tracker permet de l'écrire, il est sauvegardé automatiquement.",
            "commande": "aucune (bouton 📝 Débrief du jour ou notes)",
            "prompt": "1) Pose-moi 3 questions UNE PAR UNE et attends ma réponse à chacune :\na) « Qu'as-tu accompli aujourd'hui ? » ;\nb) « Qu'est-ce qui t'a bloqué ? » (réponds « aucun blocage » si rien) ;\nc) « Quel est ton objectif pour demain ? » ;\n2) Écris mes réponses dans docs/DEBRIEFS.md sous la date du jour ;\n3) Rappelle-moi d'utiliser aussi le bouton 📝 Débrief du jour du tracker si je préfère.",
            "succes": "3 lignes de débrief (fait / bloqué / demain) sont écrites"
          },
          {
            "label": "Préparer plan du lendemain (2 min)",
            "detail": "On choisit à l'avance le PREMIER objectif de demain pour démarrer sans réfléchir le matin. Un point d'avance élimine la procrastination.",
            "commande": "aucune",
            "prompt": "1) Pose-moi la question : « Quel sera ton premier objectif demain matin ? » ;\n2) Fais-moi préciser une action concrète et observable (ex : relancer chat.py et tester une question) ;\n3) Écris la phrase dans docs/DEBRIEFS.md sous « Plan de jeudi » ;\n4) Valide que je peux la faire en moins de 10 minutes.",
            "succes": "Une ligne « plan demain » concrète est écrite"
          },
          {
            "label": "Quitter le terminal (pause réelle)",
            "detail": "Les pauses sont obligatoires : ton cerveau consolide les apprentissages pendant le repos. Fermer le terminal = une coupure nette entre le travail et la pause.",
            "commande": "exit (ou fermer la fenêtre du terminal)",
            "prompt": "1) Vérifie qu'aucun travail n'est perdu : lance git status et confirme que tout est commité ou sans importance ;\n2) Note le temps resté au terminal aujourd'hui (si tu veux) ;\n3) Demande-moi de taper exit ou de fermer le terminal ;\n4) Encourage-moi à m'éloigner au moins 10 minutes de l'ordinateur.",
            "succes": "Le terminal est fermé et je suis en pause réelle"
          }
        ]
      }
    ]
  },
  "jeudi10": {
    "date": "Jeudi 10 septembre",
    "objectif": "Lire du Python et transformer le script en fonction",
    "pomodoros": [
      {
        "titre": "P1 - Fonctions Python",
        "taches": [
          {
            "label": "Demander à opencode 3 exemples de fonctions",
            "detail": "Une fonction est une recette réutilisable : on lui donne des ingrédients (les paramètres, écrits entre parenthèses), elle fait un travail, elle renvoie un résultat (avec return). On l'écrit avec def nom(): ...",
            "commande": "aucune (le prompt génère et enregistre les exemples)",
            "prompt": "1) Génère 3 mini-fonctions différentes, chacune de 5 lignes maximum : une qui additionne deux nombres, une qui salue quelqu'un, une qui convertit une température de Celsius en Fahrenheit ;\n2) Commente chaque ligne en français simple ;\n3) Enregistre-les dans docs/exemples-fonctions.py séparées par (Fonction 1, Fonction 2, Fonction 3) ;\n4) Affiche le fichier complet ;\n5) Pour chacune, montre-moi le NOM, les paramètres entre parenthèses et le return ;\n6) N'exécute pas encore.",
            "succes": "docs/exemples-fonctions.py contient 3 fonctions définies et commentées"
          },
          {
            "label": "Lire le premier exemple ligne par ligne",
            "detail": "Lecture ligne par ligne : tu repères le nom de la fonction, ses paramètres, le corps, et le return. Lire en pointant les éléments = comprendre la structure.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche la FONCTION 1 de docs/exemples-fonctions.py ;\n2) Montre-moi et explique : la ligne def, les paramètres entre parenthèses, les lignes du corps, la ligne return ;\n3) Pose-moi une question : « Tu penses que cette fonction reçoit quoi, et renvoie quoi ? » ;\n4) Corrige ou valide ;\n5) Ne l'exécute pas encore.",
            "succes": "Je peux pointer le nom, les paramètres et le return de la fonction 1"
          },
          {
            "label": "Écrire ce que la fonction 1 fait (entrée/sortie)",
            "detail": "Toute fonction transforme une entrée en sortie. On l'écrit en français : « entrée : deux nombres → sortie : leur somme ». Écrire ce pont, c'est le début de l'abstraction.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Affiche la FONCTION 1 ;\n2) Demande-moi : « Quelle est l'entrée de cette fonction et quelle est sa sortie ? » ;\n3) Réécris ma réponse au format : entrée : ... → sortie : ... ;\n4) Écris-la dans docs/PYTHON-NOTES.md sous « Fonction 1 - entrée/sortie » ;\n5) Valide ma formulation.",
            "succes": "Une ligne « entrée → sortie » est écrite de mes mots pour la fonction 1"
          },
          {
            "label": "Tester la fonction 1 avec un exemple",
            "detail": "Donner des valeurs concrètes à la fonction pour vérifier qu'elle rend bien ce qu'on attend. Exemple : addition(2, 3) doit donner 5.",
            "commande": "aucune (le prompt exécute et montre)",
            "prompt": "1) Exécute la FONCTION 1 avec un appel d'exemple (ex : addition(2, 3)) ;\n2) Montre-moi le code de test et la sortie ;\n3) Fais-moi deviner la sortie AVANT de la montrer ;\n4) Vérifie ensemble que le résultat est correct ;\n5) Ajoute la sortie réelle dans docs/PYTHON-NOTES.md sous « Fonction 1 - test ».",
            "succes": "Le test de la fonction 1 (ex : 2 + 3 = 5) est affiché et compris"
          },
          {
            "label": "Lire le deuxième exemple",
            "detail": "Même exercice que pour la fonction 1, avec la fonction de salutation. Tu montes en confiance : repère nom, paramètres, return.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche la FONCTION 2 de docs/exemples-fonctions.py ;\n2) Fais-moi identifier tout seul : le nom, le paramètre, le return ;\n3) Corrige ou valide ;\n4) Ne l'exécute pas encore.",
            "succes": "J'ai identifié seul le nom, le paramètre et le return de la fonction 2"
          },
          {
            "label": "Écrire ce que la fonction 2 fait",
            "detail": "On écrit le pont entrée/sortie de la fonction de salutation. Entrée : un prénom → sortie : un message de bienvenue.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Affiche la FONCTION 2 ;\n2) Demande-moi : « Quelle est l'entrée et quelle est la sortie ? » ;\n3) Écris ma réponse au format entrée : ... → sortie : ... dans docs/PYTHON-NOTES.md sous « Fonction 2 - entrée/sortie » ;\n4) Corrige en douceur si besoin.",
            "succes": "La ligne « entrée → sortie » de la fonction 2 est écrite de mes mots"
          },
          {
            "label": "Tester la fonction 2 avec un exemple",
            "detail": "Appel d'exemple : donner un prénom et vérifier le message retourné. Tester, c'est prouver qu'on a compris.",
            "commande": "aucune (le prompt exécute et montre)",
            "prompt": "1) Exécute la FONCTION 2 avec un exemple (ex : saluer(\"Lina\")) ;\n2) Fais-moi deviner la sortie avant de la montrer ;\n3) Montre le code et la sortie, vérifie ensemble ;\n4) Écris le résultat dans docs/PYTHON-NOTES.md sous « Fonction 2 - test ».",
            "succes": "Le test de la fonction 2 est affiché et compris"
          },
          {
            "label": "Lire le troisième exemple",
            "detail": "La conversion Celsius → Fahrenheit : une fonction avec un vrai calcul. Elle ressemble aux deux premières, avec une formule en plus.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche la FONCTION 3 de docs/exemples-fonctions.py ;\n2) Fais-moi identifier tout seul : nom, paramètre, calcul, return ;\n3) Corrige ou valide ;\n4) Ne l'exécute pas encore.",
            "succes": "J'ai identifié seul le nom, le paramètre, le calcul et le return de la fonction 3"
          },
          {
            "label": "Écrire ce que la fonction 3 fait",
            "detail": "Pont entrée/sortie de la conversion : entrée : une température en Celsius → sortie : la même température en Fahrenheit.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Affiche la FONCTION 3 ;\n2) Demande-moi : « Quelle est l'entrée et quelle est la sortie ? » ;\n3) Écris ma réponse au format entrée : ... → sortie : ... dans docs/PYTHON-NOTES.md sous « Fonction 3 - entrée/sortie » ;\n4) Corrige en douceur si besoin.",
            "succes": "La ligne « entrée → sortie » de la fonction 3 est écrite de mes mots"
          },
          {
            "label": "Tester la fonction 3 avec un exemple",
            "detail": "Dernier test de la série : convertir 0 °C (eau qui gèle) qui doit donner 32 °F. Un cas connu permet de vérifier tout seul.",
            "commande": "aucune (le prompt exécute et montre)",
            "prompt": "1) Exécute la FONCTION 3 avec convertir(0) qui doit valoir 32 ;\n2) Fais-moi deviner avant de montrer ;\n3) Montre le code de test et la sortie, vérifie ensemble ;\n4) Écris le résultat dans docs/PYTHON-NOTES.md sous « Fonction 3 - test ».",
            "succes": "Le test de la fonction 3 (0 °C = 32 °F) est affiché et compris"
          }
        ]
      },
      {
        "titre": "P2 - Refactoriser chat.py",
        "taches": [
          {
            "label": "Ouvrir chat.py",
            "detail": "chat.py contient ton premier programme d'hier. L'ouvrir, c'est l'afficher à l'écran pour pouvoir le lire et le modifier. On travaille de nouveau dedans.",
            "commande": "aucune (le prompt affiche le fichier)",
            "prompt": "1) Affiche le contenu complet de chat.py ;\n2) Vérifie avec moi que c'est bien la version avec le premier dialogue Ollama ;\n3) Demande-moi de confirmer : « C'est bien chat.py, le fichier qu'on va améliorer ? » ;\n4) Ne le modifie pas encore.",
            "succes": "chat.py est affiché à l'écran et je le reconnais"
          },
          {
            "label": "Identifier la partie qui appelle Ollama",
            "detail": "Dans chat.py, il existe des lignes qui envoient la requête à Ollama (requests.post(...)). C'est le « cœur » du programme : c'est ce bloc-là qu'on va transformer en fonction.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche chat.py ;\n2) Encadre dans ta réponse les lignes qui parlent à Ollama : celles contenant requests.post et .json() ;\n3) Explique-moi pourquoi CE bloc-là est le plus important ;\n4) Demande-moi de pointer ces lignes dans ma tête et de te les nommer.",
            "succes": "Je peux identifier les lignes requests.post(...) de chat.py"
          },
          {
            "label": "Demander à opencode d'en faire une fonction",
            "detail": "Refactoriser = réorganiser le code SANS changer son comportement. On prend le bloc qui appelle Ollama et on l'enveloppe dans une fonction répétable. Le programme marche pareil, mais le code devient organisé.",
            "commande": "aucune (le prompt refactorise chat.py)",
            "prompt": "1) Dans chat.py, transforme le bloc qui appelle Ollama en fonction nommée demander_ollama(question) ;\n2) La fonction doit : envoyer la question à http://localhost:11434/api/generate avec stream:false et renvoyer le texte de la réponse (return) ;\n3) Contraintes : 15 lignes maximum pour la fonction, chaque ligne commentée en français simple, le comportement du programme ne doit pas changer ;\n4) Montre-moi l'ANCIEN code puis le NOUVEAU côte à côte ;\n5) Explique-moi en 2 phrases ce que la refactorisation change (rien pour l'utilisateur, tout pour le lecteur).",
            "succes": "chat.py contient une fonction demander_ollama qui encapsule l'appel Ollama"
          },
          {
            "label": "Lire la fonction générée",
            "detail": "On lit la fonction ligne par ligne : def, le paramètre question, le corps, le return. Si une ligne t'échappe, c'est le moment de demander.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche uniquement la fonction demander_ollama du fichier chat.py ;\n2) Explique chaque ligne en une phrase simple :\na) la ligne def demander_ollama(question): ;\nb) la construction du JSON ;\nc) requests.post ;\nd) .json() ;\ne) le return ;\n3) Pose-moi une question de vérification sur le paramètre question ;\n4) Ne l'exécute pas encore.",
            "succes": "Je peux expliquer chaque ligne de la fonction demander_ollama"
          },
          {
            "label": "Comprendre les paramètres (entrée)",
            "detail": "Le paramètre question est l'ENTRÉE de ta fonction : la valeur qu'on lui donne quand on l'appelle. Sans question, la fonction ne peut pas appeler Ollama.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Affiche la ligne def demander_ollama(question): ;\n2) Demande-moi : « Quelle est l'entrée de cette fonction ? » ;\n3) Explique avec une analogie : la fonction est un distributeur, la question est la pièce qu'on insère ;\n4) Écris ma définition dans docs/PYTHON-NOTES.md sous « Paramètre d'une fonction » ;\n5) Valide.",
            "succes": "Je nomme l'entrée de la fonction : le paramètre question"
          },
          {
            "label": "Comprendre le return (sortie)",
            "detail": "Le return est la SORTIE : ce que la fonction remet à celui qui l'appelle une fois son travail fait. Sans return, celui qui appelle ne reçoit rien.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Affiche la ligne return de la fonction demander_ollama (le return data[\"response\"] ou équivalent) ;\n2) Demande-moi : « Que renvoie cette fonction à celui qui l'appelle ? » ;\n3) Explique avec une analogie : le distributeur rend la canette (la sortie) après la pièce (l'entrée) ;\n4) Écris ma définition dans docs/PYTHON-NOTES.md sous « return d'une fonction » ;\n5) Valide.",
            "succes": "Je nomme la sortie de la fonction : le texte de la réponse du modèle"
          },
          {
            "label": "Tester la fonction isolément",
            "detail": "On appelle la fonction directement pour vérifier qu'elle marche seule, sans se soucier du reste du programme. Un test isolé isole les problèmes.",
            "commande": "python chat.py",
            "prompt": "1) Vérifie qu'Ollama tourne avec ollama list ;\n2) Lance python chat.py avec une question de test ;\n3) Ou, si tu préfères, ajoute temporairement un appel autonome comme print(demander_ollama(\"Bonjour\")) et exécute-le ;\n4) Observe que la réponse arrive via la fonction ;\n5) Remets le programme d'origine propre si tu avais ajouté le test temporaire.",
            "succes": "Une question testée via la fonction demander_ollama renvoie une réponse"
          },
          {
            "label": "Commenter la fonction de ta main",
            "detail": "Tu réécris les commentaires de la fonction avec TES mots : la main qui écrit = la tête qui comprend. opencode peut t'aider, mais c'est toi qui tapes.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Affiche la fonction demander_ollama SANS commentaires ;\n2) Pour chaque ligne, fais-moi écrire MÊME un commentaire # de mes mots ;\n3) Corrige-moi si mes commentaires sont faux, en me ré-expliquant une phrase ;\n4) Montre le résultat final et vérifie que chaque ligne a un commentaire.",
            "succes": "La fonction demander_ollama est commentée ligne par ligne de ma main"
          },
          {
            "label": "Commit: 'refactor: isolate Ollama request'",
            "detail": "On fige la refactorisation. Le préfixe refactor: signifie « réorganisation sans changement de comportement ». On a séparé l'appel Ollama du reste.",
            "commande": "git add chat.py && git commit -m \"refactor: isolate Ollama request\"",
            "prompt": "1) Lance git status et montre-moi les changements ;\n2) Lance git diff chat.py et demande-moi de repérer la nouvelle fonction ;\n3) Ajoute et commite avec le message EXACT : refactor: isolate Ollama request ;\n4) Montre git log --oneline : la nouvelle entrée doit précéder celle d'hier ;\n5) Explique-moi ce que \"refactor\" veut dire dans le message.",
            "succes": "git log --oneline affiche « refactor: isolate Ollama request »"
          }
        ]
      },
      {
        "titre": "P3 - Conditions et exceptions",
        "taches": [
          {
            "label": "Demander un exemple de try/except",
            "detail": "try/except est un filet de sécurité : « essaie ceci ; s'il y a une erreur, fais plutôt cela au lieu de planter ». Sans lui, le programme s'arrête brutalement au premier problème.",
            "commande": "aucune (le prompt génère les exemples)",
            "prompt": "1) Génère 2 mini-exemples de try/except différents (une division par zéro, un accès à un serveur qui ne répond pas) ;\n2) Chaque exemple : 6 lignes maximum, chaque ligne commentée en français simple ;\n3) Enregistre-les dans docs/exemples-exceptions.py ;\n4) Affiche-les et explique-moi où se déclenche l'erreur et ce que fait le except ;\n5) N'exécute pas encore.",
            "succes": "docs/exemples-exceptions.py contient 2 exemples try/except commentés"
          },
          {
            "label": "Lire et comprendre les exemples",
            "detail": "Lecture des exemples : le bloc try « essaie », le bloc except « attrape l'erreur ». Distinguer les deux, c'est tout comprendre.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche docs/exemples-exceptions.py ;\n2) Montre-moi dans l'exemple 1 : quelle ligne peut déclencher l'erreur, et quelle ligne la rattrape ;\n3) Fais la même chose pour l'exemple 2 ;\n4) Demande-moi : « Que fait le bloc try ? Que fait le bloc except ? » ;\n5) Corrige ou valide mes réponses.",
            "succes": "Je sais expliquer ce que font try et except avec mes mots"
          },
          {
            "label": "Ajouter try/except autour de l'appel Ollama",
            "detail": "On équipe chat.py du filet de sécurité : si l'appel à Ollama échoue (serveur éteint, coupure réseau...), le programme affichera un message au lieu de planter.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Ouvre chat.py ;\n2) Enveloppe l'appel à demander_ollama (ou le requests.post s'il reste) dans un bloc try/except ;\n3) Dans le except, affiche le message : « Problème avec Ollama : vérifie qu'il tourne » ;\n4) Commentaire chaque ligne en français simple ;\n5) Montre-moi le nouveau bloc et explique-moi le chemin : ligne qui peut échouer, ligne qui rattrape.",
            "succes": "chat.py contient un bloc try/except autour de l'appel Ollama, commenté"
          },
          {
            "label": "Tester avec Ollama arrêté",
            "detail": "Le test « négatif » : on coupe le serveur volontairement et on lance le programme. Le filet doit se déclencher. C'est le seul moyen de savoir si la protection marche.",
            "commande": "aucune (le prompt orchestre le scénario)",
            "prompt": "1) Demande-moi la permission d'arrêter Ollama, puis arrête-le avec systemctl --user stop ollama (ou pkill ollama) ;\n2) Explique-moi AVANT de lancer pourquoi ce test est important ;\n3) Lance python chat.py ;\n4) Observe ensemble : le programme ne doit PAS planter mais afficher un message propre ;\n5) Note le résultat dans docs/TESTS.md sous « Test : Ollama arrêté ».",
            "succes": "Avec Ollama éteint, chat.py affiche un message clair au lieu d'un traceback"
          },
          {
            "label": "Vérifier que l'erreur est gérée",
            "detail": "On vérifie le critère de réussite : pas de traceback (ces longues lignes rouges d'erreur), juste un message français. Un programme qui « tombe » proprement est déjà un bon programme.",
            "commande": "aucune (vérification guidée)",
            "prompt": "1) Relance python chat.py avec Ollama toujours arrêté ;\n2) Demande-moi : « Est-ce que le programme s'est arrêté brutalement ou a-t-il affiché un message ? » ;\n3) Explique la différence entre un traceback et un message géré par except ;\n4) Confirme que le try/except fait son travail et note-le dans docs/TESTS.md.",
            "succes": "Pas de traceback : le message propre s'affiche à chaque lancement avec Ollama éteint"
          },
          {
            "label": "Redémarrer Ollama",
            "detail": "On remet le serveur en marche pour continuer à tester. Ensuite seulement, on pourra refaire un test « normal ».",
            "commande": "systemctl --user start ollama",
            "prompt": "1) Redémarre Ollama avec systemctl --user start ollama (ou ollama serve selon ta config) ;\n2) Vérifie avec ollama list que le serveur répond ;\n3) Explique-moi en une phrase comment tu le sais.",
            "succes": "ollama list répond de nouveau sans erreur"
          },
          {
            "label": "Tester avec une question normale",
            "detail": "Le test « normal » : serveur allumé, question simple → réponse attendue. Un try/except ne doit pas casser le cas qui fonctionnait avant.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Tape une question normale ;\n3) Observe que la réponse arrive normalement malgré le try/except ;\n4) Valide ensemble : le succès du cas normal prouve que le try/except ne gêne rien ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "Une question normale obtient sa réponse malgré le nouveau try/except"
          },
          {
            "label": "Commenter les exceptions de ta main",
            "detail": "Les commentaires du bloc try/except doivent devenir TON texte. On les réécrit ensemble, avec tes mots, pour ancrer la compréhension.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Affiche le bloc try/except de chat.py SANS commentaires ;\n2) Pour chaque ligne du bloc, demande-moi d'écrire un commentaire # de mes mots ;\n3) Corrige-moi si besoin ;\n4) Montre le résultat final : chaque ligne commentée de ma main.",
            "succes": "Le bloc try/except de chat.py est commenté de ma main"
          }
        ]
      },
      {
        "titre": "P4 - Gestion d'erreur",
        "taches": [
          {
            "label": "Ajouter vérification si question vide",
            "detail": "Si on appuie sur Entrée sans taper de texte, la question est vide et Ollama ne sait pas quoi répondre. On ajoute une protection : « question vide → message + on redemande ».",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, avant d'appeler Ollama, ajoute une vérification de la question ;\n2) Si la question est vide (si question est vide si je tape juste Entrée), affiche : « Tu n'as rien demandé ! » et redemande une question ;\n3) Utilise une boucle pour redemander tant que la question est vide ;\n4) Contrainte : 8 lignes maximum, commentées en français simple ;\n5) Montre-moi le nouveau bloc et explique chaque ligne.",
            "succes": "Taper Entrée sans texte affiche « Tu n'as rien demandé ! » et redemande"
          },
          {
            "label": "Ajouter message si serveur injoignable",
            "detail": "Quand Ollama est éteint, requests lève une erreur de connexion. On veut un message français clair au lieu d'une erreur technique. On spécialise le except.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans le bloc except de chat.py, précise l'exception requests.exceptions.ConnectionError ;\n2) Pour cette erreur, affiche : « Impossible de joindre Ollama : est-il bien allumé ? » ;\n3) Garde un except général ensuite pour toute autre erreur avec son message ;\n4) Commente chaque ligne en français simple ;\n5) Montre-moi le bloc final : deux niveaux de except, un précis et un général.",
            "succes": "chat.py distingue « serveur injoignable » et les autres erreurs"
          },
          {
            "label": "Tester avec question vide",
            "detail": "Test du cas vide : appuyer sur Entrée sans texte et vérifier que le message s'affiche et que le programme redemande.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Demande-moi d'appuyer sur Entrée sans écrire de question ;\n3) Observe : le message « Tu n'as rien demandé ! » doit apparaître et une nouvelle question doit être demandée ;\n4) Tape ensuite une question normale pour confirmer la sortie du cas vide ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "Le cas « question vide » affiche le message et redemande une question"
          },
          {
            "label": "Tester avec Ollama arrêté",
            "detail": "Le test de panne : serveur coupé, question tapée → le message « Impossible de joindre Ollama » doit s'afficher.",
            "commande": "aucune (le prompt orchestre le scénario)",
            "prompt": "1) Arrête Ollama (systemctl --user stop ollama) avec mon accord ;\n2) Lance python chat.py et tape une question ;\n3) Observe : le message « Impossible de joindre Ollama : est-il bien allumé ? » doit s'afficher ;\n4) Confirme qu'il n'y a pas de traceback ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "Le message « Impossible de joindre Ollama » s'affiche sans crash"
          },
          {
            "label": "Tester avec cas normal",
            "detail": "Le cas nominal : Ollama allumé, question normale → réponse. Il faut toujours vérifier que les protections ne cassent pas le fonctionnement de base.",
            "commande": "aucune (le prompt orchestre le scénario)",
            "prompt": "1) Redémarre Ollama (systemctl --user start ollama) ;\n2) Lance python chat.py et tape une question normale ;\n3) Observe la réponse ;\n4) Résume les 3 cas testés (vide, serveur éteint, normal) et demande-moi lequel a échoué éventuellement ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "Le cas normal fonctionne encore après toutes les protections"
          },
          {
            "label": "Documenter les 3 cas testés",
            "detail": "On garde une trace écrite des 3 tests dans un tableau : ce qu'on a testé, ce qu'on attendait, ce qu'on a observé. C'est une vraie méthode d'ingénieur.",
            "commande": "aucune (le prompt écrit docs/TESTS.md)",
            "prompt": "1) Crée le fichier docs/TESTS.md avec un titre « Tests de chat.py » ;\n2) Ajoute un tableau à 3 lignes pour les 3 cas : question vide / Ollama arrêté / cas normal ;\n3) Colonnes : Cas testé, Résultat attendu, Résultat observé ;\n4) Remplis le tableau avec ce qu'on a réellement observé (avec moi, pas de mémoire) ;\n5) Montre-moi le fichier final.",
            "succes": "docs/TESTS.md contient le tableau des 3 cas testés, rempli"
          },
          {
            "label": "Commit: 'feat: add error handling'",
            "detail": "On fige la gestion d'erreur. Le préfixe feat: indique que c'est une nouvelle capacité du programme : il sait désormais gérer les erreurs proprement.",
            "commande": "git add chat.py && git commit -m \"feat: add error handling\"",
            "prompt": "1) Lance git status et montre-moi les fichiers modifiés ;\n2) Montre-moi git diff chat.py pour repérer les ajouts ;\n3) Ajoute et commite avec le message EXACT : feat: add error handling ;\n4) Montre git log --oneline et explique-moi ce que cet enregistrement ajoute au programme.",
            "succes": "git log --oneline affiche « feat: add error handling »"
          }
        ]
      },
      {
        "titre": "P5 - Documentation",
        "taches": [
          {
            "label": "Ajouter 2 concepts dans PYTHON-NOTES.md",
            "detail": "Aujourd'hui tu as découvert : la fonction (une recette) et le try/except (un filet de sécurité). On les écrit avec tes mots, avec un mini-exemple.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Pose-moi la question une par une : « Qu'as-tu compris de la fonction ? » puis « Qu'as-tu compris de try/except ? » ;\n2) Écris chacune de mes réponses dans docs/PYTHON-NOTES.md ;\n3) Ajoute un mini-exemple de 3 lignes, que tu m'expliques ;\n4) Corrige toute confusion en une phrase simple ;\n5) Montre la section.",
            "succes": "2 concepts (fonction, try/except) rédigés de mes mots avec exemples"
          },
          {
            "label": "Mettre à jour Kanban",
            "detail": "On déplace les cartes de jeudi dans Done sur ton tableau Kanban. Voir la colonne Fait se remplir, c'est motivant et ultra-rapide.",
            "commande": "aucune (ou mise à jour de docs/KANBAN.md)",
            "prompt": "1) Affiche docs/KANBAN.md (ou ton Kanban) ;\n2) Crée la colonne « Jeudi 10 » si elle n'existe pas et liste les 5 pomodoros du jour ;\n3) Déplace-les dans Fait (on coche le tracker ensemble) ;\n4) Confirme qu'il ne reste rien de jeudi en attente.",
            "succes": "Les cartes de jeudi sont dans Fait sur mon Kanban"
          },
          {
            "label": "Écrire débrief du jour",
            "detail": "le débrief : ce que j'ai fait / ce qui m'a bloqué / mon objectif demain. 3 phrases suffisent, ça prend 2 minutes.",
            "commande": "aucune (bouton 📝 Débrief du jour ou notes)",
            "prompt": "1) Pose-moi 3 questions UNE PAR UNE et attends mes réponses :\na) « Qu'as-tu accompli aujourd'hui ? » ;\nb) « Qu'est-ce qui t'a bloqué ? » (réponds « aucun blocage » si rien) ;\nc) « Quel est ton objectif pour demain ? » ;\n2) Écris mes réponses dans docs/DEBRIEFS.md sous la date du jeudi ;\n3) Rappelle-moi le bouton 📝 du tracker pour la version sauvegardée automatiquement.",
            "succes": "Les 3 lignes de débrief de jeudi sont écrites"
          },
          {
            "label": "Préparer plan du lendemain",
            "detail": "L'objectif de vendredi est déjà dans les pomodoros : le streaming. Note juste ton premier pas concret pour demain : rouvrir chat.py et échanger la réponse en bloc contre une réponse en flux.",
            "commande": "aucune",
            "prompt": "1) Pose-moi la question : « Quel sera ton premier geste demain matin, dans quel fichier ? » ;\n2) Aide-moi à formuler une action en moins de 10 minutes (ex : ouvrir chat.py et demander à opencode d'ajouter le streaming) ;\n3) Écris la phrase dans docs/DEBRIEFS.md sous « Plan de vendredi » ;\n4) Valide.",
            "succes": "Une ligne « plan vendredi » concrète est écrite"
          }
        ]
      }
    ]
  },
  "vendredi11": {
    "date": "Vendredi 11 septembre",
    "objectif": "Streaming et structures de données",
    "pomodoros": [
      {
        "titre": "P1 - Listes et dictionnaires",
        "taches": [
          {
            "label": "Demander 3 exemples de listes",
            "detail": "Une liste est une suite ordonnée de valeurs entre crochets : [1, 2, 3]. On accède à un élément par sa position (l'index), sachant que la première case porte le numéro 0.",
            "commande": "aucune (le prompt génère et enregistre les exemples)",
            "prompt": "1) Génère 3 exemples de listes : une liste de nombres, une liste de mots, une liste mixte ;\n2) Pour chaque liste, montre comment :\na) lire le premier élément (index 0) ;\nb) lire le dernier élément (index -1) ;\nc) compter les éléments avec len() ;\n3) Commente chaque ligne en français simple ;\n4) Enregistre dans docs/exemples-listes.py ;\n5) Affiche le fichier et n'exécute pas encore.",
            "succes": "docs/exemples-listes.py contient 3 listes avec lecture et len"
          },
          {
            "label": "Tester et comprendre les listes",
            "detail": "On exécute les exemples et tu repères : la position 0 du premier élément, l'ordre, la longueur. Le concept d'index est partout en programmation.",
            "commande": "aucune (le prompt exécute et explique)",
            "prompt": "1) Exécute docs/exemples-listes.py ;\n2) Montre chaque sortie et lie-la à la ligne qui la produit ;\n3) Pose-moi une question : « Dans la liste des mots, quelle position occupe le deuxième mot ? » ;\n4) Corrige ou valide ;\n5) Explique-moi pourquoi on commence à compter à 0 et pas à 1.",
            "succes": "Je comprends que le premier élément d'une liste est à l'index 0"
          },
          {
            "label": "Demander 3 exemples de dictionnaires",
            "detail": "Un dictionnaire est une collection de paires clé → valeur entre accolades : {'nom': 'Lina', 'age': 30}. La clé est une étiquette, la valeur est le contenu de l'étiquette. Les réponses JSON d'Ollama sont des dictionnaires.",
            "commande": "aucune (le prompt génère et enregistre les exemples)",
            "prompt": "1) Génère 3 exemples de dictionnaires : une personne, un produit, une réponse minimale de type Ollama (avec les clés model, response) ;\n2) Pour chacun, montre comment lire une valeur par sa clé (dico[\"clé\"]) et avec .get(\"clé\") ;\n3) Commente chaque ligne en français simple ;\n4) Enregistre dans docs/exemples-dicts.py ;\n5) Affiche le fichier et n'exécute pas encore.",
            "succes": "docs/exemples-dicts.py contient 3 dictionnaires commentés"
          },
          {
            "label": "Tester et comprendre les dictionnaires",
            "detail": "On exécute et tu analyses : lire une valeur par sa clé. Si la clé n'existe pas, dico['clé'] plante alors que .get() renvoie None : c'est une différence cruciale.",
            "commande": "aucune (le prompt exécute et explique)",
            "prompt": "1) Exécute docs/exemples-dicts.py ;\n2) Relie chaque sortie à sa ligne ;\n3) Montre-moi la différence entre dico[\"clé\"] et dico.get(\"clé\") quand la clé n'existe pas ;\n4) Demande-moi : « Comment lit-on la valeur de la clé response ? » ;\n5) Corrige ou valide.",
            "succes": "Je sais lire une valeur d'un dictionnaire par sa clé et expliquer .get()"
          },
          {
            "label": "Dans la réponse Ollama, repérer les clés",
            "detail": "La réponse JSON d'Ollama est un dictionnaire avec des clés bien précises (model, response, done...). Les repérer te permet de savoir QUEL champ afficher dans ton code.",
            "commande": "aucune (le prompt lance la requête)",
            "prompt": "1) Vérifie qu'Ollama tourne avec ollama list ;\n2) Lance une petite requête : curl http://localhost:11434/api/generate -d \"{\"model\":\"qwen2.5:7b-instruct-q4_k_m\",\"prompt\":\"Bonjour en deux mots\",\"stream\":false}\" ;\n3) Montre-moi la réponse et ENTOURE toutes les clés (les mots à gauche des deux-points) :\nmodel, created_at, response, done, done_reason, context, total_duration, load_duration, prompt_eval_count, eval_count, eval_duration ;\n4) Explique-moi à quoi servent les trois plus utiles pour toi : response, done, model.",
            "succes": "J'ai vu les clés de la réponse JSON et je sais où est la réponse du modèle"
          },
          {
            "label": "Lister toutes les clés dans notes",
            "detail": "On archive la liste exacte des clés dans les notes : c'est ta carte du terrain. Quand tu coderas, tu sauras quoi chercher.",
            "commande": "aucune (le prompt écrit les notes)",
            "prompt": "1) Relance la requête curl ci-dessus pour avoir la réponse complète ;\n2) Liste TOUTES les clés du JSON dans docs/PYTHON-NOTES.md sous « Clés d'une réponse Ollama » ;\n3) Ajoute pour chaque clé une explication de 4 mots maximum ;\n4) Montre la section finale.",
            "succes": "Les clés de la réponse Ollama sont listées et expliquées dans les notes"
          },
          {
            "label": "Comprendre model, response, done",
            "detail": "Les 3 clés utiles : model = le nom du modèle qui a répondu ; response = le texte produit ; done = un vrai/faux qui dit si la réponse est finie (true = fini).",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Affiche la réponse JSON précédente ;\n2) Pointe les trois clés model, response, done ;\n3) Pose-moi une question pour chacune :\na) « Que contient la clé model ? » ;\nb) « Que contient la clé response ? » ;\nc) « Si done vaut true, qu'est-ce que cela signifie ? » ;\n4) Corrige ou valide chaque réponse ;\n5) Écris mes définitions dans les notes.",
            "succes": "Je peux expliquer model, response et done avec mes mots"
          }
        ]
      },
      {
        "titre": "P2 - NDJSON et streaming",
        "taches": [
          {
            "label": "Demander un exemple de iter_lines()",
            "detail": "response.iter_lines() est un outil de la bibliothèque requests pour lire une réponse ligne par ligne. Il est fait pour les flux NDJSON, où chaque ligne est un mini-JSON.",
            "commande": "aucune (le prompt génère et exécute)",
            "prompt": "1) Explique-moi ce que fait cette boucle avant de l'exécuter :\nfor ligne in reponse.iter_lines():\n    print(ligne)\n2) Génère un mini-script de 7 lignes qui appelle Ollama en stream:true et affiche chaque ligne avec iter_lines() ;\n3) Commente chaque ligne en français simple ;\n4) Exécute-le avec une question courte ;\n5) Montre-moi la structure : chaque ligne affichée = un morceau de la réponse.",
            "succes": "Un exemple iter_lines() exécuté : je vois la réponse ligne par ligne"
          },
          {
            "label": "Lire et comprendre iter_lines()",
            "detail": "Lecture active : la boucle for avance ligne par ligne dans la réponse. Pour chaque ligne, on fait une action (ici, l'afficher). C'est le même principe qu'une liste qu'on parcourt.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche le mini-script iter_lines() ;\n2) Explique-moi ligne par ligne en insistant sur la boucle for ligne in reponse.iter_lines() ;\n3) Pose-moi une question : « Combien de fois le print va-t-il s'exécuter ? » ;\n4) Corrige ou valide ;\n5) Ne le relance pas sans besoin.",
            "succes": "Je peux expliquer la boucle for ligne in reponse.iter_lines()"
          },
          {
            "label": "Ajouter streaming à chat.py",
            "detail": "On change le mode d'appel : stream passe de false à true. Le serveur ne renverra plus un seul bloc mais un flux de lignes.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Ouvre chat.py et localise le JSON envoyé à Ollama dans demander_ollama ;\n2) Change stream de false à true ;\n3) Commente la ligne pour expliquer le changement en français simple ;\n4) Vérifie ensemble avec un git diff chat.py que seul ce changement est fait ;\n5) Ne lance pas encore : l'adaptation de lecture vient après.",
            "succes": "chat.py envoie maintenant stream:true"
          },
          {
            "label": "Utiliser response.iter_lines()",
            "detail": "On remplace la lecture d'un bloc unique par la lecture ligne par ligne : au lieu d'un seul .json(), une boucle qui défile les lignes du flux.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, remplace la lecture d'un seul bloc par une boucle for ligne in reponse.iter_lines() dans demander_ollama ;\n2) Commente chaque ligne en français simple ;\n3) Explique-moi ce qui change : avant la requête renvoyait un dictionnaire entier, maintenant elle renvoie un flux de lignes ;\n4) Montre-moi la nouvelle version de la fonction ;\n5) Attention : ne code pas encore le décodage JSON, ce sera la prochaine étape.",
            "succes": "La boucle iter_lines() est en place dans chat.py"
          },
          {
            "label": "Décoder chaque ligne JSON",
            "detail": "Chaque ligne du flux est un mini-JSON (texte brut). Puisqu'on est en ligne, on utilise json.loads(ligne) (lecture ligne) pour la transformer en dictionnaire utilisable.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans la boucle iter_lines() de chat.py, ajoute : data = json.loads(ligne) ;\n2) Assure-toi que import json est présent en haut du fichier ;\n3) Gère le cas où une ligne ne contient pas de JSON correct (vide) avec un try/except si nécessaire ;\n4) Commente chaque ligne en français simple ;\n5) Explique-moi ce que fait json.loads en une phrase simple.",
            "succes": "Chaque ligne du flux est décodée en dictionnaire via json.loads"
          },
          {
            "label": "Extraire le champ response",
            "detail": "Une fois la ligne décodée en dictionnaire, on récupère la valeur de la clé response (le morceau de texte généré) et on l'affiche ou on la garde.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans la boucle, après data = json.loads(ligne), ajoute l'extraction du champ response ;\n2) Affiche-le avec print(data.get(\"response\", \"\"), end=\"\") pour ne pas sauter de ligne entre les morceaux ;\n3) Commente chaque ligne en français simple ;\n4) Montre-moi le résultat de la boucle complète ;\n5) Explique-moi pourquoi on accumule les morceaux au lieu de tout afficher d'un bloc.",
            "succes": "Le champ response est extrait ligne à ligne dans chat.py"
          },
          {
            "label": "Afficher progressivement",
            "detail": "Afficher « progressivement » = chaque morceau arrive à l'écran dès qu'il est reçu, comme un message en cours d'écriture. C'est l'expérience utilisateur du streaming.",
            "commande": "python chat.py",
            "prompt": "1) Vérifie le code : print(data.get(\"response\", \"\"), end=\"\") et ajoute flush=True si l'affichage ne sort pas immédiatement ;\n2) Lance python chat.py avec une question qui génère plusieurs phrases ;\n3) Observe : la réponse doit arriver petit à petit, pas d'un bloc ;\n4) Si elle arrive d'un bloc, corrige le code avec moi (flush) ;\n5) Note l'observation dans docs/TESTS.md.",
            "succes": "La réponse du modèle s'affiche en continu, morceau par morceau"
          },
          {
            "label": "Tester avec une question",
            "detail": "Test de contrôle : une vraie question et la vérification que la progression est visible. Si ça saute tout d'un coup, on déboguera ensemble.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Tape une question qui demande une réponse longue (ex : « Explique le streaming en 5 phrases ») ;\n3) Observe la progression de l'affichage ;\n4) Demande-moi : « As-tu vu la réponse arriver progressivement ? » ;\n5) Si oui, on garde ; si non, corrige ensemble et note dans docs/TESTS.md.",
            "succes": "Avec une question longue, la réponse s'affiche visuellement en continu"
          }
        ]
      },
      {
        "titre": "P3 - chat.py v2",
        "taches": [
          {
            "label": "Nettoyer l'affichage streaming",
            "detail": "En streaming, l'affichage peut être brut : pas de saut de ligne propre, mélange question/réponse. Nettoyer = rendre l'échange lisible : question claire, réponse propre, retour à la ligne.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Nettoie l'affichage de chat.py :\na) affiche la question de l'utilisateur avec un style clair ;\nb) après la réponse streaming, ajoute des retours à la ligne propres ;\nc) termine par une ligne séparatrice avant la prochaine question ;\n2) Contrainte : ne change pas la logique du streaming ;\n3) Commente chaque ligne modifiée en français simple ;\n4) Lance python chat.py pour vérifier la lisibilité ;\n5) Montre-moi l'échange tel qu'il s'affiche.",
            "succes": "L'échange question/réponse est lisible dans le terminal"
          },
          {
            "label": "Gérer les lignes vides",
            "detail": "Certains flux envoient des lignes vides (ou des lignes de fin de connexion). Les ignorer évite des erreurs comme json.loads('') qui plante. On teste le contenu AVANT de décoder.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans la boucle iter_lines() de chat.py, ajoute une garde avant le décodage :\nsi la ligne est vide, ignore-la et passe à la suivante ;\n2) Commente cette garde en français simple ;\n3) Lance python chat.py et vérifie qu'aucune erreur de ligne vide n'apparaît ;\n4) Note le cas testé dans docs/TESTS.md ;\n5) Montre-moi le bloc modifié.",
            "succes": "Aucune erreur de ligne vide pendant le streaming"
          },
          {
            "label": "Tester avec plusieurs questions",
            "detail": "On répète : 3 questions d'affilée, chacune doit streamer correctement. La stabilité se teste en répétant.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Pose 3 questions différentes l'une après l'autre (une très courte, une moyenne, une longue) ;\n3) Observe chaque réponse streamer progressivement ;\n4) Demande-moi de cocher la tâche seulement si les 3 ont réussi ;\n5) Note toute défaillance dans docs/TESTS.md.",
            "succes": "3 questions d'affilée streament correctement"
          },
          {
            "label": "Vérifier que c'est progressif",
            "detail": "La preuve de progressivité : pendant la réponse, le texte apparaît avant la fin de la génération. On vérifie avec une question longue et un œil attentive.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Pose une question longue (demande un paragraphe de 10 phrases) ;\n3) PENDANT la génération, observe si le début du texte est déjà visible alors que la génération continue ;\n4) Demande-moi : « Est-ce que le début de la réponse apparaissait avant la fin de la génération ? » ;\n5) Selon la réponse, explique pourquoi c'est (ou ce n'est pas) du streaming.",
            "succes": "Le début de la réponse apparaît avant la fin de la génération"
          },
          {
            "label": "Commenter le code",
            "detail": "Toute la partie streaming doit être commentée de ta main : chaque ligne, avec tes mots. Un code qu'on sait commenter est un code qu'on comprend.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Affiche chat.py et reprends toutes les fonctions du streaming ;\n2) Pour CHAQUE ligne, fais-moi écrire MÊME un commentaire # de mes mots (sinon aide-moi à formuler) ;\n3) Corrige-moi si un commentaire est faux ;\n4) Montre le fichier final et vérifie qu'aucune ligne de logique n'est sans commentaire.",
            "succes": "Toutes les lignes de la partie streaming sont commentées de ma main"
          },
          {
            "label": "Commit: 'feat: stream Ollama responses'",
            "detail": "Version v2 : chat.py sait maintenant streamer. On fige cette fonctionnalité avec le message exact, puis on regarde git log pour voir le projet grandir.",
            "commande": "git add chat.py && git commit -m \"feat: stream Ollama responses\"",
            "prompt": "1) Lance git status ;\n2) Ajoute et commite chat.py avec le message EXACT : feat: stream Ollama responses ;\n3) Montre git log --oneline : on doit voir la lignée du projet (skeleton, first chat, refactor, error handling, streaming) ;\n4) Explique-moi en une phrase ce que ce commit apporte de visible pour l'utilisateur.",
            "succes": "git log --oneline affiche « feat: stream Ollama responses »"
          }
        ]
      },
      {
        "titre": "P4 - Boucle de conversation",
        "taches": [
          {
            "label": "Ajouter une boucle while True",
            "detail": "while True: met le programme dans une boucle infinie : il redemande une question après chaque réponse. Sans moyen d'en sortir, il tournerait pour toujours : c'est là qu'intervient break.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, enveloppe la partie question/réponse dans une boucle while True: ;\n2) Décalle correctement l'indentation de tout le bloc (attention : Python est exigeant sur l'indentation) ;\n3) Commente la boucle en français simple ;\n4) Explique-moi pourquoi while True tourne « pour toujours » en théorie ;\n5) Ne lance pas encore : il faut d'abord ajouter la sortie.",
            "succes": "chat.py contient une boucle while True autour de l'échange"
          },
          {
            "label": "Ajouter commande 'exit' ou 'quit'",
            "detail": "On donne une porte de sortie : si l'utilisateur tape exit (ou quit), la boucle se casse avec break. Sans ce geste, impossible de quitter proprement.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, après la saisie de la question, ajoute :\nsi la question est \"exit\" ou \"quit\", affiche « Au revoir ! » et ce sera break ;\n2) Place cette vérification AVANT l'appel à Ollama ;\n3) Commente chaque ligne en français simple ;\n4) Explique-moi comment on sort d'une boucle while True en Python ;\n5) Montre-moi le bloc modifié.",
            "succes": "Taper exit ou quit quitte proprement chat.py"
          },
          {
            "label": "Tester 2 tours de conversation",
            "detail": "Deux tours = poser une question, recevoir la réponse, poser une deuxième question, recevoir la deuxième réponse, SANS relancer le programme. C'est la preuve que la boucle fonctionne.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Pose une première question, attend la réponse ;\n3) Pose une deuxième question (DIFFÉRENTE) sans relancer le programme ;\n4) Observe que la deuxième réponse arrive dans la même session ;\n5) Demande-moi de confirmer que 2 tours complets ont eu lieu ; note dans docs/PYTHON-NOTES.md ce qu'est un « tour de conversation ».",
            "succes": "2 questions posées et 2 réponses reçues dans la même session"
          },
          {
            "label": "Tester la sortie propre",
            "detail": "Une sortie « propre » = taper exit et que le programme se termine calmement, sans erreur, avec un message. On vérifie aussi que ça ne laisse rien en suspens.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Tape exit ;\n3) Observe : le message « Au revoir ! » s'affiche et le programme se termine sans erreur ;\n4) Réessaie avec quit pour vérifier les deux commandes ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "exit et quit terminent le programme dans le calme, sans erreur"
          },
          {
            "label": "Commit: 'feat: add conversation loop'",
            "detail": "On fige la boucle de conversation. git log va montrer une nouvelle capacité : discuter en continu sans relancer.",
            "commande": "git add chat.py && git commit -m \"feat: add conversation loop\"",
            "prompt": "1) Lance git status ;\n2) Ajoute et commite chat.py avec le message EXACT : feat: add conversation loop ;\n3) Montre git log --oneline ;\n4) Pose-moi une question : « Que peut-on faire maintenant avec chat.py qu'on ne pouvait pas avant ? » ;\n5) Valide ma réponse.",
            "succes": "git log --oneline affiche « feat: add conversation loop »"
          }
        ]
      },
      {
        "titre": "P5 - Relecture",
        "taches": [
          {
            "label": "Relire tout chat.py à voix haute",
            "detail": "Lire le code à voix haute permet de repérer les phrases qui butent (et donc les concepts non maîtrisés). Si tu butes sur un mot, c'est qu'il faut s'y arrêter.",
            "commande": "cat chat.py",
            "prompt": "1) Affiche chat.py en entier ;\n2) Demande-moi de le lire à voix haute (ou lis-le-moi si je préfère) ;\n3) À chaque ligne incomprise, arrête-toi et explique-la-moi en une phrase ;\n4) Note les lignes incomprises pour les revoir ensemble ;\n5) Valide la lecture complète.",
            "succes": "Je peux lire chat.py et nommer les lignes que je ne comprends pas"
          },
          {
            "label": "Corriger commentaires inexacts",
            "detail": "Au fil de la lecture, certains commentaires peuvent être faux ou incomplets : on les corrige. Un commentaire faux est pire que pas de commentaire.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Passe en revue chaque commentaire de chat.py avec moi ;\n2) Pour chacun, demande-moi : « Est-ce que ce commentaire décrit bien la ligne qu'il précède ? » ;\n3) Corrige les commentaires faux ou flous ENSEMBLE, avec mes mots ;\n4) Montre-moi le diff des corrections ;\n5) Explique-moi pourquoi un commentaire faux est dangereux pour la suite.",
            "succes": "Tous les commentaires de chat.py sont exacts et écrits de mes mots"
          },
          {
            "label": "Ajouter 2 concepts dans notes",
            "detail": "Les deux idées fortes du vendredi : le streaming (réponse en flux) et la boucle while True (répéter jusqu'à la sortie). On les ajoute avec tes mots.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Pose-moi la question une par une : « Qu'est-ce que le streaming ? » puis « Qu'est-ce qu'une boucle while True ? » ;\n2) Écris mes réponses dans docs/PYTHON-NOTES.md ;\n3) Ajoute un mini-exemple de 3 lignes pour chacun ;\n4) Corrige toute méprise en une phrase simple ;\n5) Montre la section finale.",
            "succes": "2 concepts (streaming, boucle while) ajoutés de mes mots dans les notes"
          },
          {
            "label": "Mettre à jour Kanban",
            "detail": "Les cartes du vendredi passent dans Fait. La colonne Fait grossit : c'est ta semaine qui avance visuellement.",
            "commande": "aucune (ou mise à jour de docs/KANBAN.md)",
            "prompt": "1) Affiche docs/KANBAN.md (ou ton Kanban) ;\n2) Crée la colonne « Vendredi 11 » et liste les 5 pomodoros du jour ;\n3) Déplace-les dans Fait (on coche les cases du tracker ensemble) ;\n4) Confirme qu'il ne reste rien de vendredi en attente.",
            "succes": "Les cartes de vendredi sont dans Fait sur mon Kanban"
          },
          {
            "label": "Écrire débrief du jour",
            "detail": "3 phrases pour clôturer vendredi : fait / bloqué / demain. La semaine est à moitié faite, le débrief prend encore plus de sens.",
            "commande": "aucune (bouton 📝 Débrief du jour ou notes)",
            "prompt": "1) Pose-moi les 3 questions UNE PAR UNE et attends mes réponses :\na) « Qu'as-tu accompli aujourd'hui ? » ;\nb) « Qu'est-ce qui t'a bloqué ? » ;\nc) « Quel est ton objectif pour demain ? » ;\n2) Écris mes réponses dans docs/DEBRIEFS.md sous la date du vendredi ;\n3) Rappelle-moi le bouton 📝 du tracker.",
            "succes": "Les 3 lignes de débrief de vendredi sont écrites"
          }
        ]
      }
    ]
  },
  "samedi12": {
    "date": "Samedi 12 septembre",
    "objectif": "Historique multi-tours et fichiers JSON",
    "pomodoros": [
      {
        "titre": "P1 - JSON",
        "taches": [
          {
            "label": "Demander exemples de json.dumps()",
            "detail": "json.dumps() transforme un dictionnaire Python en texte JSON (le format universel d'échange). dumps = « to string » : on sérialise pour envoyer/stocker. C'est l'inverse de json.loads().",
            "commande": "aucune (le prompt génère et exécute)",
            "prompt": "1) Génère 3 mini-exemples de json.dumps() : un dictionnaire simple, un dictionnaire imbriqué, un dictionnaire avec l'option indent=2 pour rendre le texte lisible ;\n2) Montre le dictionnaire Python AVANT et le texte JSON APRÈS ;\n3) Commente chaque ligne en français simple ;\n4) Exécute-les et montre le résultat ;\n5) Explique-moi pourquoi on ajoute indent=2.",
            "succes": "Je vois la transformation dictionnaire → texte JSON avec indent"
          },
          {
            "label": "Tester et comprendre json.dumps()",
            "detail": "On vérifie ta compréhension : tu repères écriture dict → texte entre guillemets doubles, et l'indentation qui aère tout.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Affiche l'exemple json.dumps() avec indent=2 ;\n2) Demande-moi : « Que fait indent=2 à la sortie ? » ;\n3) Corrige ou valide ;\n4) Fais-moi deviner : « Quel est le type de la sortie de json.dumps ? » (texte) ;\n5) Écris ma définition dans docs/PYTHON-NOTES.md.",
            "succes": "Je peux expliquer que json.dumps() transforme un dict en texte"
          },
          {
            "label": "Demander exemples de json.loads()",
            "detail": "json.loads() fait l'inverse : il transforme un texte JSON en dictionnaire Python utilisable. loads = « load string ». Texte → dictionnaire, c'est le sens inverse.",
            "commande": "aucune (le prompt génère et exécute)",
            "prompt": "1) Génère 2 mini-exemples de json.loads() : un texte JSON simple et un texte JSON avec un message de type Ollama ;\n2) Montre le texte AVANT et le dictionnaire APRÈS ;\n3) Commente chaque ligne en français simple ;\n4) Exécute :\na) affiche le dictionnaire ;\nb) affiche la valeur d'une clé précise ;\n5) Explique-moi comment lire une valeur dans le dictionnaire résultat.",
            "succes": "Je vois la transformation texte JSON → dictionnaire"
          },
          {
            "label": "Tester et comprendre json.loads()",
            "detail": "Vérification : après json.loads(), le résultat est un vrai dictionnaire Python. On peut compter ses clés et lire leurs valeurs.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Reprends l'exemple json.loads() du message de type Ollama ;\n2) Demande-moi : « Une fois chargé, que peut-on faire avec ce résultat ? » (lire les clés, leurs valeurs) ;\n3) Montre un accès à la clé response et explique ;\n4) Corrige ou valide ;\n5) Écris ma définition dans docs/PYTHON-NOTES.md.",
            "succes": "Je comprends que json.loads() transforme un texte en dictionnaire utilisable"
          },
          {
            "label": "Demander exemples de lecture fichier",
            "detail": "Pour lire un fichier JSON depuis le disque, on combine open() (ouvrir le fichier) et json.load() (lire et transformer le contenu). La lecture fichier se fait aussi avec une boucle for ligne in fichier.",
            "commande": "aucune (le prompt génère et explique)",
            "prompt": "1) Explique-moi la différence entre json.load() et json.loads() ;\n2) Génère un mini-script de 8 lignes : avec open() lisant un fichier nommé données.json, puis json.load() pour le transformer en dictionnaire ;\n3) Commente chaque ligne en français simple ;\n4) N'exécute pas encore s'il manque le fichier de test (l'étape suivante le crée) ;\n5) Montre le script et explique avec open(fichier) comme : with open(\"fichier\", \"r\") as f: .",
            "succes": "Je comprends : open() ouvre, json.load() transforme le contenu"
          },
          {
            "label": "Créer un fichier JSON test",
            "detail": "On pose un petit fichier de test sur le disque pour le lire ensuite. Format : {'nom': 'test', 'valeur': 1}. Plus tard, tu créeras le vrai fichier d'historique de conversation.",
            "commande": "echo '{\"nom\":\"test\",\"valeur\":1}' > docs/test.json",
            "prompt": "1) Explique-moi ce que fait echo 'texte' > fichier ;\n2) Crée le fichier docs/test.json avec le contenu exact : {\"nom\": \"test\", \"valeur\": 1} ;\n3) Affiche-le avec cat docs/test.json pour vérifier le JSON ;\n4) Explique-moi les deux clés de ce fichier (nom, valeur) et leurs types (texte, nombre) ;\n5) Vérifie avec moi que c'est un JSON valide (accolades équilibrées).",
            "succes": "docs/test.json existe avec du JSON valide"
          },
          {
            "label": "Le lire depuis Python",
            "detail": "On lit le fichier créé avec un petit script Python : open() pour ouvrir, json.load() pour transformer, affichage du contenu.",
            "commande": "python -c \"import json; with open('docs/test.json') as f: print(json.load(f))\"",
            "prompt": "1) Explique-moi la commande python -c avant de la lancer : elle exécute un code Python court sans fichier ;\n2) Lance la commande de lecture du fichier docs/test.json ;\n3) Montre-moi la sortie : le dictionnaire doit s'afficher ;\n4) Demande-moi : « Que voit-on dans la sortie ? Est-ce un dictionnaire ? » ;\n5) Corrige ou valide et explique le rôle de json.load().",
            "succes": "Python affiche le contenu de docs/test.json sous forme de dictionnaire"
          }
        ]
      },
      {
        "titre": "P2 - Structure historique",
        "taches": [
          {
            "label": "Choisir structure: liste de dicts",
            "detail": "L'historique d'une conversation se représente comme une LISTE de messages. Chaque message est un DICTIONNAIRE avec une clé role (qui parle) et une clé content (le texte). Liste de dictionnaires = plusieurs messages à la suite.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Explique-moi pourquoi une liste de dictionnaires est idéale pour une conversation : les tours s'ajoutent à la suite ;\n2) Montre-moi un exemple visuel :\nhistorique = [\n  {\"role\": \"user\", \"content\": \"Bonjour\"},\n  {\"role\": \"assistant\", \"content\": \"Salut !\"}\n] ;\n3) Demande-moi : « Pourquoi doit-on garder TOUS les messages, pas seulement le tout dernier ? » ;\n4) Corrige ou valide ;\n5) Écris cet exemple dans docs/PYTHON-NOTES.md sous « Structure de l'historique ».",
            "succes": "Je peux expliquer l'historique comme une liste de dictionnaires"
          },
          {
            "label": "Définir format: role et content",
            "detail": "Pour chaque message : role = user (si c'est toi) ou assistant (si c'est le modèle) ; content = le texte exact. Ollama (via /api/chat) exige ce format précis.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Montre-moi le format exact d'un message : {\"role\": \"user\", \"content\": \"ta question\"} ;\n2) Demande-moi : « Quelle valeur va dans role quand tu poses une question ? Et quand le modèle répond ? » ;\n3) Corrige ou valide ;\n4) Écris le format dans docs/PYTHON-NOTES.md ;\n5) Vérifie que je connais les deux valeurs possibles de role : user et assistant.",
            "succes": "Je sais quel role mettre pour mes questions et pour les réponses"
          },
          {
            "label": "Créer liste vide au début du script",
            "detail": "Le programme commence avec une liste vide : historique = []. À chaque tour, on y ajoutera un message. Une liste vide = un début de conversation sans mémoire.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, ajoute au début : historique = [] ;\n2) Commente la ligne en français simple ;\n3) Explique-moi pourquoi la liste doit être créée AVANT la boucle while True (sinon elle serait réinitialisée à chaque tour) ;\n4) Montre-moi où exactement la placer ;\n5) Ne continue pas : les ajouts de messages sont les étapes suivantes.",
            "succes": "chat.py initialise historique = [] avant la boucle"
          },
          {
            "label": "Ajouter chaque question à la liste",
            "detail": "Après que tu poses une question, on enregistre : historique.append({'role': 'user', 'content': question}). La question devient un message mémorisé.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Après la vérification de la question non vide dans chat.py, ajoute :\nhistorique.append({\"role\": \"user\", \"content\": question}) ;\n2) Commente la ligne en français simple ;\n3) Explique-moi ce que fait append() : ajouter un élément à la fin d'une liste ;\n4) Montre-moi où précisément placer ce append (avant l'appel à Ollama) ;\n5) Ne continue pas encore.",
            "succes": "Chaque question tapée est ajoutée à la liste historique"
          },
          {
            "label": "Ajouter chaque réponse à la liste",
            "detail": "Après réception de la réponse du modèle, on l'ajoute aussi : historique.append({'role': 'assistant', 'content': reponse}). Comme ça, la mémoire contient les deux côtés de l'échange.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Après l'affichage de la réponse du modèle dans chat.py, ajoute :\nhistorique.append({\"role\": \"assistant\", \"content\": reponse}) ;\n2) Commente la ligne en français simple (la réponse complète construite pendant le streaming) ;\n3) Explique-moi pourquoi il faut garder la réponse en mémoire même si on l'a affichée ;\n4) Montre-moi où précisément placer ce append ;\n5) Ne passe pas à l'étape suivante avant validation.",
            "succes": "Chaque réponse du modèle est ajoutée à la liste historique"
          },
          {
            "label": "Afficher l'historique pour debug",
            "detail": "On ajoute un affichage de contrôle : après chaque tour, on voit la liste complète des messages. C'est du debug : on regarde ce qu'il y a en mémoire pour vérifier qu'elle grossit bien.",
            "commande": "python chat.py",
            "prompt": "1) Ajoute temporairement dans chat.py un affichage de l'historique à la fin de chaque tour : print(\"Historique :\", historique) ;\n2) Commente ce print « pour debug » ;\n3) Lance python chat.py, fais 2 tours de conversation ;\n4) Observe : la liste doit grossir de 2 messages à chaque tour ;\n5) Une fois validé, garde l'affichage ou retire-le avec mon accord, et note l'observation dans les notes.",
            "succes": "J'ai vu la liste historique grossir à chaque tour de conversation"
          }
        ]
      },
      {
        "titre": "P3 - Historique dans chat.py",
        "taches": [
          {
            "label": "Modifier appel Ollama pour envoyer historique",
            "detail": "Ollama a une seconde API : /api/chat qui accepte une liste de messages (messages=[...]) au lieu d'un seul prompt. C'est cette API qui comprend la conversation complète.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Dans chat.py, change l'appel Ollama : utilise http://localhost:11434/api/chat au lieu de /api/generate ;\n2) Envoie le JSON : {\"model\": \"qwen2.5:7b-instruct-q4_k_m\", \"messages\": historique, \"stream\": true} ;\n3) Le serveur reçoit AVANT la question, les tours précédents : la conversation a de la mémoire ;\n4) Commente chaque ligne en français simple ;\n5) Explique-moi la différence entre /api/generate (une prompt) et /api/chat (une liste de messages).",
            "succes": "chat.py appelle /api/chat avec messages=historique"
          },
          {
            "label": "Tester avec 2 tours",
            "detail": "On teste la mémoire : poser une question, puis une question qui s'appuie sur la réponse précédente. Les deux tours doivent se connecter.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Tour 1 : demande « Dis-moi que tu t'appelles Nova » et note la réponse ;\n3) Tour 2 : demande « Comment t'appelles-tu ? » ;\n4) Observe : le modèle doit se souvenir de son nom au tour 2 ;\n5) Note le résultat dans docs/TESTS.md sous « Test mémoire 2 tours ».",
            "succes": "Le modèle se souvient d'une information donnée au tour 1"
          },
          {
            "label": "Vérifier que question 2 dépend de réponse 1",
            "detail": "La preuve de la mémoire = la deuxième question ne pourrait pas être répondue sans la première réponse. Le contexte compte : c'est ton programme qui l'envoie.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Reprends le test précédent (Nova) ;\n2) Demande-moi : « La réponse au tour 2 était-elle possible sans la réponse au tour 1 ? » ;\n3) Explique-moi que c'est l'historique envoyé qui rend cette mémoire possible ;\n4) Fais-moi écrire cette conclusion de mes mots dans docs/PYTHON-NOTES.md sous « Mémoire multi-tours » ;\n5) Valide la formulation.",
            "succes": "Je comprends et j'explique : c'est l'historique envoyé qui donne la mémoire"
          },
          {
            "label": "Commenter le code",
            "detail": "Toute la partie historique/chat doit être commentée de ta main. La mémoire d'une conversation devient simple si chaque ligne est expliquée.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Affiche chat.py et passe en revue la partie historique (initialisation, append, envoi messages) ;\n2) Pour chaque ligne, fais-moi écrire MÊME un commentaire # de mes mots (aide-moi si besoin) ;\n3) Corrige tous les commentaires faux ;\n4) Montre le fichier final.",
            "succes": "La partie historique de chat.py est commentée de ma main"
          },
          {
            "label": "Commit: 'feat: add conversation history'",
            "detail": "Version avec mémoire : chat.py se souvient de la conversation. feat: une nouvelle capacité. On fige et on admire git log.",
            "commande": "git add chat.py && git commit -m \"feat: add conversation history\"",
            "prompt": "1) Lance git status ;\n2) Ajoute et commite chat.py avec le message EXACT : feat: add conversation history ;\n3) Montre git log --oneline et explique le fil du projet jusqu'ici ;\n4) Pose-moi une question : « Quelle est la dernière capacité ajoutée ? » ;\n5) Valide ma réponse.",
            "succes": "git log --oneline affiche « feat: add conversation history »"
          }
        ]
      },
      {
        "titre": "P4 - Sauvegarde session (optionnel)",
        "taches": [
          {
            "label": "Ajouter fonction save_history()",
            "detail": "Sauvegarder la conversation = écrire la liste historique dans un fichier JSON avec json.dump(). Si on quitte le programme, les échanges restent sur le disque.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Ajoute dans chat.py une fonction save_history() :\na) ouvre le fichier session.json en écriture ;\nb) écrit historique avec json.dump et indent=2 ;\n2) Contrainte : 5 lignes maximum pour la fonction, chaque ligne commentée en français simple ;\n3) Montre-moi la fonction et explique le rôle de json.dump (l'homologue fichier de json.dumps) ;\n4) Ne l'appelle pas encore.",
            "succes": "La fonction save_history() existe dans chat.py, prête à l'emploi"
          },
          {
            "label": "Sauvegarder dans session.json",
            "detail": "On branche la sauvegarde : à chaque tour (ou à la sortie), on appelle save_history(). Le fichier session.json se remplit au fil de la conversation.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Appelle save_history() à la fin de chaque tour dans la boucle de chat.py ;\n2) Commente chaque ligne en français simple ;\n3) Lance python chat.py, fais 2 tours, quitte avec exit ;\n4) Affiche le fichier session.json créé (cat session.json) ;\n5) Explique-moi pourquoi sauvegarder à CHAQUE tour est plus sûr que seulement à la sortie.",
            "succes": "session.json existe et contient les messages des tours effectués"
          },
          {
            "label": "Tester la sauvegarde",
            "detail": "On vérifie la sauvegarde de bout en bout : lancer, parler, quitter, relire le fichier. Le fichier doit contenir TOUT l'échange au format JSON.",
            "commande": "python chat.py",
            "prompt": "1) Relance python chat.py et fais 2 tours de conversation variés ;\n2) Fais-moi deviner ce que contiendra session.json AVANT de l'ouvrir ;\n3) Ouvre session.json et compare avec ma prédiction ;\n4) Vérifie avec json.loads que le fichier est un JSON valide (par exemple avec python -c) ;\n5) Note le résultat dans docs/TESTS.md.",
            "succes": "session.json relu est un JSON valide contenant toute la conversation"
          },
          {
            "label": "Ajouter fonction load_history()",
            "detail": "Charger un historique = lire session.json au démarrage avec json.load(). Si le fichier existe, la mémoire reprend là où elle s'est arrêtée.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Ajoute dans chat.py une fonction load_history() :\na) si le fichier session.json existe : charge-le avec json.load et renvoie la liste ;\nb) sinon : renvoie une liste vide ;\n2) Commente chaque ligne en français simple ;\n3) Au démarrage du programme, remplace historique = [] par historique = load_history() ;\n4) Montre-moi le code et explique-moi le si le fichier existe ;\n5) Ne lance pas encore.",
            "succes": "load_history() existe et est utilisée au démarrage de chat.py"
          },
          {
            "label": "Tester le chargement",
            "detail": "Le test qui boucle la boucle : une session sauvegardée doit être rechargée au redémarrage, et le modèle doit se souvenir d'éléments de la session précédente.",
            "commande": "python chat.py",
            "prompt": "1) Nettoie la session si besoin (supprime session.json avec mon accord pour repartir propre) ;\n2) Lance python chat.py, donne l'information « mon animal préféré est le chat », quitte ;\n3) Relance python chat.py et demande « quel est mon animal préféré ? » ;\n4) Observe que la mémoire a survécu au redémarrage grâce à session.json ;\n5) Note le résultat dans docs/TESTS.md sous « Test chargement session ».",
            "succes": "Après redémarrage, le modèle se souvient de la session précédente"
          }
        ]
      },
      {
        "titre": "P5 - Sécurité",
        "taches": [
          {
            "label": "Vérifier git status",
            "detail": "git status est le « tableau de bord » de Git : il montre les fichiers modifiés, ajoutés, ou pas encore suivis. On le lit toujours AVANT un commit ou à la fin de la journée.",
            "commande": "git status",
            "prompt": "1) Lance git status ;\n2) Explique-moi les sections affichées : « modifiés », « non suivis » ;\n3) Demande-moi : « Qu'est-ce qui est modifié à la fin de la journée ? » ;\n4) Vérifie ensemble que rien d'inattendu n'apparaît ;\n5) Résume en une phrase ce que git status « voit ».",
            "succes": "git status affiche les changements et je sais les interpréter"
          },
          {
            "label": "Vérifier absence de secrets",
            "detail": "Un secret = une clé d'API, un mot de passe, une donnée personnelle. On vérifie qu'aucun fichier suivi par Git n'en contient, car l'historique Git est difficile à nettoyer.",
            "commande": "git grep -iE '(password|passwd|secret|token|api[_-]?key)' || echo 'Aucun secret détecté'",
            "prompt": "1) Explique-moi ce que sont les secrets en programmation, avec un exemple ;\n2) Lance la commande de recherche de secrets dans les fichiers ;\n3) Interprète le résultat ensemble : la sortie est vide = pas de secret ;\n4) Vérifie aussi .gitignore : cat .gitignore (on doit y voir .venv) ;\n5) Confirme : rien de privé dans le dépôt, et explique-moi pourquoi c'est crucial avec git.",
            "succes": "Pas de secret dans les fichiers suivis, .gitignore est correct"
          },
          {
            "label": "Vérifier .gitignore correct",
            "detail": ".gitignore doit contenir .venv/ (et éventuellement session.json si tu ne veux pas commiter tes conversations). Vérifier = cat .gitignore et comparer.",
            "commande": "cat .gitignore",
            "prompt": "1) Affiche .gitignore (cat .gitignore) ;\n2) Vérifie qu'il contient au moins .venv/ ;\n3) Demande-moi : « Pourquoi ne doit-on pas commiter le dossier .venv ? » ;\n4) Ajoute une ligne session.json si on veut ignorer les sauvegardes de session ;\n5) Montre le fichier final.",
            "succes": ".gitignore contient .venv/ (et session.json si décidé)"
          },
          {
            "label": "Mettre à jour Kanban",
            "detail": "Déplacer les cartes du samedi dans Fait. En même temps, on vérifie qu'aucune tâche du samedi ne reste en attente.",
            "commande": "aucune (ou mise à jour de docs/KANBAN.md)",
            "prompt": "1) Affiche docs/KANBAN.md (ou ton Kanban) ;\n2) Crée la colonne « Samedi 12 » et liste les 5 pomodoros ;\n3) Déplace-les dans Fait (on coche le tracker ensemble) ;\n4) Repère les cartes optionnelles (sauvegarde session) : dis-moi si tu les as faites et déplace-les en conséquence.",
            "succes": "Les cartes de samedi sont dans Fait (ou marquées optionnelles)"
          },
          {
            "label": "Écrire débrief du jour",
            "detail": "Le débrief de samedi : la mémoire multi-tours a été LE sujet du jour. Trois phrases et c'est bouclé.",
            "commande": "aucune (bouton 📝 Débrief du jour ou notes)",
            "prompt": "1) Pose-moi les 3 questions UNE PAR UNE et attends mes réponses :\na) « Qu'as-tu accompli aujourd'hui ? » ;\nb) « Qu'est-ce qui t'a bloqué ? » ;\nc) « Quel est ton objectif pour demain ? » ;\n2) Écris mes réponses dans docs/DEBRIEFS.md sous la date du samedi ;\n3) Rappelle-moi le bouton 📝 du tracker.",
            "succes": "Les 3 lignes de débrief de samedi sont écrites"
          }
        ]
      }
    ]
  },
  "dimanche13": {
    "date": "Dimanche 13 septembre",
    "objectif": "Consolidation et documentation",
    "pomodoros": [
      {
        "titre": "P1 - Relecture complète",
        "taches": [
          {
            "label": "Ouvrir chat.py",
            "detail": "Dernière grande lecture du programme. On va le relire dans son ensemble et en reconstruire la carte des fonctions : c'est l'exercice de consolidation du dimanche.",
            "commande": "cat chat.py",
            "prompt": "1) Affiche chat.py en entier ;\n2) Avec moi, liste TOUTES les fonctions qu'il contient (demander_ollama, save_history, load_history...) ;\n3) Demande-moi de citer chaque fonction sans regarder le fichier ;\n4) Corrige ou valide ;\n5) Garde ce contenu à l'écran pour la tâche suivante.",
            "succes": "chat.py est affiché et j'ai nommé ses fonctions"
          },
          {
            "label": "Pour chaque fonction: écrire son rôle (1 phrase)",
            "detail": "Pour chaque fonction de chat.py, on écrit en UNE phrase ce qu'elle fait. Un bon résumé en une phrase = une compréhension solide.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Liste les fonctions de chat.py ;\n2) Pour CHACUNE, demande-moi : « Quel est son rôle en une phrase ? » ;\n3) Écris ma réponse dans docs/TABLEAU-FONCTIONS.md, ligne par ligne ;\n4) Corrige ma formulation si elle est fausse ou trop vague ;\n5) Montre le tableau en cours de construction.",
            "succes": "1 rôle en 1 phrase est écrit pour chaque fonction de chat.py"
          },
          {
            "label": "Pour chaque fonction: lister entrées",
            "detail": "Chaque fonction a des entrées : les paramètres qu'on lui donne (par exemple question). On les liste dans le tableau : c'est le « ce dont elle a besoin pour travailler ».",
            "commande": "aucune (rédaction guidée dans docs/TABLEAU-FONCTIONS.md)",
            "prompt": "1) Pour chaque fonction listée dans docs/TABLEAU-FONCTIONS.md, demande-moi : « Quelles sont ses entrées (paramètres) ? » ;\n2) Écris mes réponses dans la colonne « Entrées » du tableau ;\n3) Pour une fonction qui n'a pas de paramètre, écris « aucune » ;\n4) Corrige si besoin (un paramètre se lit entre parenthèses après le nom) ;\n5) Montre le tableau.",
            "succes": "La colonne Entrées du tableau est remplie pour chaque fonction"
          },
          {
            "label": "Pour chaque fonction: lister sorties",
            "detail": "Chaque fonction a aussi une sortie : ce qu'elle renvoie avec return. La sortie, c'est le résultat que celui qui appelle reçoit.",
            "commande": "aucune (rédaction guidée dans docs/TABLEAU-FONCTIONS.md)",
            "prompt": "1) Dans docs/TABLEAU-FONCTIONS.md, pour chaque fonction demande-moi : « Que renvoie-t-elle ? (sa sortie) » ;\n2) Écris mes réponses dans la colonne « Sorties » ;\n3) Pour une fonction sans return, écris « rien (None) » ;\n4) Corrige si besoin ;\n5) Montre le tableau complet.",
            "succes": "La colonne Sorties du tableau est remplie pour chaque fonction"
          },
          {
            "label": "Créer tableau fonction/rôle/entrée/sortie",
            "detail": "On finalise la table de lecture du programme : une ligne par fonction avec 4 colonnes (fonction, rôle, entrée, sortie). C'est ta feuille d'examen pour mardi.",
            "commande": "aucune (le prompt crée docs/TABLEAU-FONCTIONS.md)",
            "prompt": "1) Crée le fichier docs/TABLEAU-FONCTIONS.md avec un tableau à 4 colonnes : Fonction | Rôle | Entrées | Sorties ;\n2) Remplis-le avec ce qu'on a écrit ensemble aux étapes précédentes ;\n3) Trace une ligne de séparation lisible par fonction ;\n4) Relis-le avec moi ligne par ligne ;\n5) Valide que je peux expliquer chaque ligne sans regarder chat.py.",
            "succes": "docs/TABLEAU-FONCTIONS.md est complet et je peux l'expliquer"
          }
        ]
      },
      {
        "titre": "P2 - Configuration OLLAMA_HOST",
        "taches": [
          {
            "label": "Ajouter lecture de OLLAMA_HOST",
            "detail": "Une variable d'environnement est un réglage stocké par le système (genre un interrupteur externe). OLLAMA_HOST contient l'adresse du serveur Ollama. On va la lire si elle existe, sinon utiliser l'adresse par défaut.",
            "commande": "aucune (le prompt modifie chat.py)",
            "prompt": "1) Explique-moi ce qu'est une variable d'environnement avec une analogie (interrupteur réglé AVANT de lancer le programme) ;\n2) Dans chat.py, ajoute : import os en haut si nécessaire ;\n3) Ajoute une ligne du type : host = os.environ.get(\"OLLAMA_HOST\", \"localhost:11434\") ;\n4) Utilise ce host dans l'URL d'appel à Ollama ;\n5) Commente chaque ligne en français simple et montre-moi les changements.",
            "succes": "L'adresse d'Ollama se lit désormais dans la variable OLLAMA_HOST"
          },
          {
            "label": "Valeur par défaut: localhost:11434",
            "detail": "localhost:11434 est l'adresse locale par défaut d'Ollama : ton propre ordinateur (localhost) sur le port 11434. os.environ.get('OLLAMA_HOST', 'localhost:11434') renvoie la variable SI elle existe, sinon la valeur par défaut.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Affiche la ligne host = os.environ.get(...) de chat.py ;\n2) Demande-moi : « Que renvoie cette ligne si la variable OLLAMA_HOST n'existe pas ? » ;\n3) Explique-moi les deux arguments de .get : la clé cherchée et la valeur de secours ;\n4) Corrige ou valide ;\n5) Écris l'explication dans docs/PYTHON-NOTES.md sous « Variable d'environnement ».",
            "succes": "Je peux expliquer le rôle de localhost:11434 et de la valeur par défaut"
          },
          {
            "label": "Tester avec variable définie",
            "detail": "On teste le cas « réglage personnalisé » : on définit OLLAMA_HOST avant de lancer et on vérifie que chat.py l'utilise.",
            "commande": "OLLAMA_HOST=127.0.0.1:11434 python chat.py",
            "prompt": "1) Explique-moi la syntaxe OLLAMA_HOST=... python chat.py (la variable est définie uniquement pour cette commande) ;\n2) Lance la commande avec cette variable définie, puis tape exit pour sortir ;\n3) Observe que le programme démarre sans erreur (il utilise 127.0.0.1:11434) ;\n4) Demande-moi : « Comment le programme sait-il utiliser cette adresse ? » ;\n5) Note le test dans docs/TESTS.md.",
            "succes": "chat.py démarre avec OLLAMA_HOST défini, sans erreur"
          },
          {
            "label": "Tester sans variable (défaut)",
            "detail": "Le test de secours : sans définir la variable, chat.py doit quand même démarrer en utilisant localhost:11434. La valeur par défaut rattrape l'absence de réglage.",
            "commande": "python chat.py",
            "prompt": "1) Vérifie que la variable n'est pas définie dans ta session (echo $OLLAMA_HOST affiche une ligne vide) ;\n2) Lance simplement python chat.py ;\n3) Tape une question puis exit ;\n4) Observe que ça fonctionne grâce à la valeur par défaut ;\n5) Note le test dans docs/TESTS.md et explique-moi ce qui a servi d'adresse.",
            "succes": "chat.py démarre sans OLLAMA_HOST défini et utilise localhost:11434"
          },
          {
            "label": "Commenter le code",
            "detail": "La partie configuration d'OLLAMA_HOST reçoit ses commentaires de ta main : la variable d'environnement est un concept clé qui mérite d'être fixé en écrivant.",
            "commande": "aucune (édition guidée)",
            "prompt": "1) Affiche la partie configuration OLLAMA_HOST de chat.py ;\n2) Pour chaque ligne, fais-moi écrire MÊME un commentaire # de mes mots ;\n3) Corrige tout commentaire faux ;\n4) Explique-moi pourquoi cette configuration est utile (pouvoir changer d'adresse sans toucher au code) ;\n5) Montre le fichier final.",
            "succes": "La configuration OLLAMA_HOST est commentée de ma main"
          }
        ]
      },
      {
        "titre": "P3 - Test de pannes",
        "taches": [
          {
            "label": "Arrêter Ollama volontairement",
            "detail": "Pour tester la panne, il faut LA CRÉER : on arrête volontairement Ollama. C'est le principe des tests de panne : simuler une situation pour vérifier que le programme réagit proprement.",
            "commande": "systemctl --user stop ollama",
            "prompt": "1) Explique-moi pourquoi on crée volontairement une panne pour tester ;\n2) Demande-moi la permission d'arrêter Ollama ;\n3) Arrête-le avec la commande exacte : systemctl --user stop ollama (ou pkill ollama si pas de systemd) ;\n4) Vérifie qu'il est bien arrêté : lance ollama list et montre-moi l'erreur ;\n5) Interprète l'erreur ensemble.",
            "succes": "Ollama est arrêté et la commande ollama list montre une erreur de connexion"
          },
          {
            "label": "Lancer chat.py",
            "detail": "Serveur coupé + programme lancé = le moment de vérité pour ta gestion d'erreur. On observe, on ne panique pas si ça dit un message.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Tape une question (ex : « bonjour ») ;\n3) Observe ensemble ce qui se passe : message propre ou traceback ? ;\n4) Ne corrige RIEN pour l'instant : on observe d'abord ;\n5) Note la sortie brute dans docs/TESTS.md.",
            "succes": "J'ai lancé chat.py avec Ollama éteint et observé son comportement"
          },
          {
            "label": "Vérifier message d'erreur clair",
            "detail": "Le critère : le programme affiche un message LISIBLE en français (ex : « Impossible de joindre Ollama... ») au lieu d'un traceback technique. Une bonne gestion d'erreur rend le programme utilisable par un humain.",
            "commande": "aucune (vérification guidée)",
            "prompt": "1) Relance python chat.py avec Ollama éteint et pose une question ;\n2) Demande-moi : « Est-ce que le message affiché s'adresse à un humain et explique ce qu'il faut faire ? » ;\n3) Compare avec ce qu'on attendait (message de connexion) ;\n4) Si le message n'est pas clair, améliore-le ENSEMBLE dans le except ;\n5) Note la conclusion dans docs/TESTS.md.",
            "succes": "Le message affiché est clair et dit quoi faire (vérifier Ollama)"
          },
          {
            "label": "Redémarrer Ollama",
            "detail": "La panne est testée : on remet le serveur en route. Le cycle panne → observation → remise en route est le cœur du test de panne.",
            "commande": "systemctl --user start ollama",
            "prompt": "1) Redémarre Ollama avec la commande exacte : systemctl --user start ollama (ou ollama serve) ;\n2) Vérifie avec ollama list que le serveur répond ;\n3) Lance une petite commande curl pour confirmer ;\n4) Explique-moi l'état : le système est revenu à la normale ;\n5) Note la remise en route dans docs/TESTS.md.",
            "succes": "ollama list répond de nouveau, le serveur est opérationnel"
          },
          {
            "label": "Tester avec modèle inexistant",
            "detail": "Deuxième panne : demander à Ollama un modèle qui n'existe pas. L'API renvoie une erreur 404 (objet introuvable). Le programme doit la gérer sans planter.",
            "commande": "aucune (le prompt orchestre le scénario)",
            "prompt": "1) Dans chat.py, change TEMPORAIREMENT le nom du modèle en un modèle qui n'existe pas (ex : \"modele-qui-n-existe-pas\") ;\n2) Lance python chat.py et pose une question ;\n3) Observe : le serveur renvoie une erreur 404 ou « model not found » ;\n4) Vérifie que chat.py affiche un message clair et ne plante pas ;\n5) Remets ensuite le bon nom de modèle avec moi ; note la panne dans docs/TESTS.md.",
            "succes": "Le modèle inexistant déclenche une erreur gérée sans crash, puis le bon modèle est remis"
          },
          {
            "label": "Vérifier gestion d'erreur",
            "detail": "On vérifie la couverture : les 3 pannes (serveur éteint, modèle inconnu, question vide) doivent toutes être gérées proprement. Une panne non testée = une panne future non couverte.",
            "commande": "aucune (vérification guidée)",
            "prompt": "1) Reprends le code de gestion d'erreur de chat.py avec moi ;\n2) Liste les protections en place : except ConnectionError, except général, question vide, modèle inconnu ;\n3) Vérifie avec moi que chaque protection a été testée dans docs/TESTS.md ;\n4) Signale les trous éventuels et comblons-les ;\n5) Fais-moi confirmer : « qu'arrive-t-il si on coupe Ollama ? » de mémoire.",
            "succes": "Les 3 pannes sont couvertes et documentées dans docs/TESTS.md"
          },
          {
            "label": "Documenter les 3 pannes testées",
            "detail": "On archive les 3 tests de panne dans docs/TESTS.md : serveur éteint, modèle inconnu, question vide. Ce tableau devient l'historique de ce qu'on sait déjà gérer.",
            "commande": "aucune (le prompt écrit docs/TESTS.md)",
            "prompt": "1) Ouvre docs/TESTS.md ;\n2) Ajoute une section « Tests de pannes - dimanche » ;\n3) Écris un tableau : Panne simulée | Résultat attendu | Résultat observé ;\n4) Remplis-le avec moi : serveur éteint, modèle inexistant, question vide ;\n5) Montre le fichier final et demande-moi de vérifier chaque ligne.",
            "succes": "Le tableau des 3 pannes est rempli dans docs/TESTS.md"
          }
        ]
      },
      {
        "titre": "P4 - README final",
        "taches": [
          {
            "label": "Écrire prérequis (Python, Ollama, modèle)",
            "detail": "Le README commence par la liste de ce qu'il faut INSTALLER avant : Python, Ollama, et le modèle téléchargé. Une personne qui lit ces 3 lignes peut se préparer.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Ouvre README.md ;\n2) Pose-moi la question : « Que faut-il installer pour faire tourner ce projet ? » ;\n3) Rédige MES réponses dans README.md sous une section « Prérequis » : Python 3, Ollama installé et lancé, modèle qwen2.5 téléchargé (ollama pull ...) ;\n4) Valide ma liste avec des commandes exactes ;\n5) Montre la section.",
            "succes": "La section Prérequis de README.md liste Python, Ollama et le modèle"
          },
          {
            "label": "Écrire installation (clone, venv, pip)",
            "detail": "La section Installation décrit les étapes pour partir de zéro : cloner le dépôt, créer le venv, installer requests. Chaque étape avec sa commande exacte.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Pose-moi la question : « Quelles sont les étapes pour installer le projet ? » ;\n2) Récapitule avec moi : git clone (adresse du dépôt), python -m venv .venv, source .venv/bin/activate, pip install requests ;\n3) Rédige MES étapes dans README.md sous « Installation », avec chaque commande sur sa propre ligne et son explication d'1 phrase ;\n4) Vérifie que les commandes sont exactes en les relisant ;\n5) Montre la section.",
            "succes": "La section Installation de README.md contient clone, venv, activation et pip"
          },
          {
            "label": "Écrire activation venv",
            "detail": "On précise dans le README que le chef qui OUBLIE d'activer le venv utilisera le Python du système : chacune de ses commandes pip doit se faire dans le venv actif.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Pose-moi la question : « À quoi sert l'étape d'activation du venv ? » ;\n2) Ajoute dans README.md, dans la section Installation, la phrase : après source .venv/bin/activate, l'invite affiche (.venv) ;\n3) Ajoute une astuce : toujours vérifier which python (doit montrer .venv) ;\n4) Relis la section avec moi ;\n5) Montre le fichier.",
            "succes": "README.md explique comment reconnaître le venv actif"
          },
          {
            "label": "Écrire lancement (python chat.py)",
            "detail": "La section Lancement dit ce qu'il faut taper pour démarrer et à quoi s'attendre : python chat.py, puis poser une question, puis exit pour quitter.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Pose-moi la question : « Comment lance-t-on le programme ? » ;\n2) Rédige dans README.md sous « Lancement » : python chat.py ;\n3) Ajoute l'explication : le programme demande une question, affiche la réponse en streaming, et on tape exit pour arrêter ;\n4) Fais-moi simuler le lancement de mémoire ;\n5) Montre la section.",
            "succes": "La section Lancement de README.md contient python chat.py et l'explication"
          },
          {
            "label": "Écrire arrêt (exit/quit)",
            "detail": "On documente comment QUITTER proprement : taper exit ou quit. Un utilisateur qui ne sait pas sortir ferme le terminal par la force brute au lieu d'un arrêt propre.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Demande-moi : « Comment arrête-t-on chat.py proprement ? » ;\n2) Ajoute dans README.md : taper exit ou quit, le programme affiche « Au revoir ! » et se ferme ;\n3) Mentionne la possibilité Ctrl+C en cas de blocage ;\n4) Relis la section Lancement/Arrêt avec moi ;\n5) Montre le fichier.",
            "succes": "README.md explique l'arrêt par exit/quit (et Ctrl+C)"
          },
          {
            "label": "Écrire dépannage (erreurs courantes)",
            "detail": "Une section Dépannage recense les erreurs qu'on a rencontrées et leur solution : serveur injoignable, modèle introuvable, venv non activé. C'est la connaissance qu'on a accumulée en testant.",
            "commande": "aucune (le prompt rédige dans README.md)",
            "prompt": "1) Demande-moi de RÉSUMER les erreurs qu'on a vues cette semaine ;\n2) Aide-moi à en lister 3 : « Impossible de joindre Ollama » (redémarrer ou start ollama), « model not found » (vérifier ollama list), module requests absent (pip install requests) ;\n3) Écris chaque erreur dans README.md avec : le message, la cause en une phrase, la solution exacte ;\n4) Relis chaque entrée avec moi ;\n5) Montre la section.",
            "succes": "README.md contient 3 entrées de dépannage (symptôme, cause, solution)"
          },
          {
            "label": "Relire README: une autre personne pourrait-elle suivre?",
            "detail": "Test final du document : le lire comme si on ne connaissait rien au projet. Si une étape manque ou prête à confusion, on la corrige. Un README qui guide un inconnu est un README abouti.",
            "commande": "cat README.md",
            "prompt": "1) Affiche README.md en entier ;\n2) Lis-le-moi comme si tu le découvrais ;\n3) Demande-moi : « Est-ce que quelqu'un qui n'a jamais vu ce projet pourrait l'installer et l'utiliser sans aide ? » ;\n4) Repère avec moi les trous (commande manquante, étape floue) et corrige-les ENSEMBLE ;\n5) Confirme : le README est autonome et clair.",
            "succes": "J'ai relu README.md « avec les yeux d'un inconnu » et aucune étape ne bloque"
          }
        ]
      },
      {
        "titre": "P5 - PYTHON-NOTES final",
        "taches": [
          {
            "label": "Lister les 10 concepts",
            "detail": "Dernière étape des notes : regrouper les 10 concepts les plus importants de la semaine. C'est ta table des matières : variables, fonctions, try/except, listes, dictionnaires, JSON, streaming, boucles, git, venv.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Pose-moi la question : « Cite les 10 concepts que tu as appris cette semaine » ;\n2) Compose ma liste avec moi en complétant ce qui manque : variable, fonction, try/except, liste, dictionnaire, JSON, streaming, while True, git/commit, venv ;\n3) Écris la liste dans docs/PYTHON-NOTES.md sous « Les 10 concepts de la semaine » ;\n4) Vérifie qu'il y en a bien 10 ;\n5) Demande-moi de les relire à voix haute.",
            "succes": "Les 10 concepts de la semaine sont listés dans les notes"
          },
          {
            "label": "Écrire explication avec tes mots (concept 1)",
            "detail": "Pour chacun des 10 concepts, une explication AVEC TES MOTS puis un mini-exemple. On commence par le premier concept de la semaine : la variable.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Reprends le concept 1 (variable) ;\n2) Pose-moi la question : « Qu'est-ce qu'une variable, avec tes mots ? » ;\n3) Écris MA réponse dans docs/PYTHON-NOTES.md ;\n4) Si ma définition est incomplète, complète-la avec moi SANS me la dicter entièrement ;\n5) Valide que la définition est correcte et simple.",
            "succes": "Le concept 1 (variable) est expliqué avec mes mots dans les notes"
          },
          {
            "label": "Ajouter exemple minimal (concept 1)",
            "detail": "Un exemple minimal = 2 ou 3 lignes qui montrent le concept en action. Pour la variable : créer une boîte, y mettre une valeur, l'afficher.",
            "commande": "aucune (rédaction guidée)",
            "prompt": "1) Demande-moi d'écrire le mini-exemple du concept 1 : une variable, une affectation, un print ;\n2) Corrige mon exemple s'il ne marche pas (teste-le) ;\n3) Écris-le dans docs/PYTHON-NOTES.md sous l'explication du concept 1 ;\n4) Montre le résultat et demande-moi de l'expliquer en une phrase ;\n5) Ne passe au concept 2 que quand celui-ci est clair.",
            "succes": "Un mini-exemple fonctionnel accompagne la définition du concept 1"
          },
          {
            "label": "Répéter pour concepts 2-10",
            "detail": "On déroule maintenant les 9 concepts restants : pour chacun, une explication avec tes mots ET un exemple minimal. C'est long mais c'est le travail qui te prépare au mardi.",
            "commande": "aucune (rédaction guidée en boucle)",
            "prompt": "1) Reprends les concepts 2 à 10 dans l'ordre de la table des matières (fonction, try/except, liste, dictionnaire, JSON, streaming, while True, git, venv) ;\n2) Pour CHAQUE concept, fais-moi :\na) donner une explication avec MES mots ;\nb) écrire un exemple minimal de 2-3 lignes ;\n3) Teste chaque exemple et corrige-le avec moi ;\n4) Écris le tout dans docs/PYTHON-NOTES.md, un sous-titre par concept ;\n5) Fais une pause à chaque concept si j'en ai besoin.",
            "succes": "Les concepts 2 à 10 ont chacun leur explication de mes mots et un exemple"
          },
          {
            "label": "Relire à voix haute",
            "detail": "Lecture finale : relire toute la section des 10 concepts à voix haute. Ce qui bute en cours de route sera revu par écrit une dernière fois.",
            "commande": "cat docs/PYTHON-NOTES.md",
            "prompt": "1) Affiche la section « Les 10 concepts de la semaine » de docs/PYTHON-NOTES.md ;\n2) Demande-moi de la lire à voix haute ;\n3) À chaque hésitation ou erreur de lecture, reprends le concept et pose-moi une question de vérification ;\n4) Note toute zone floue et corrige-la dans le fichier avec moi ;\n5) Valide la lecture complète et fais-moi cocher la tâche.",
            "succes": "J'ai lu les 10 concepts à voix haute sans rester bloqué"
          }
        ]
      }
    ]
  },
  "lundi14": {
    "date": "Lundi 14 septembre",
    "objectif": "Répétition du jalon et correction ciblée",
    "pomodoros": [
      {
        "titre": "P1 - Test à blanc",
        "taches": [
          {
            "label": "Fermer tous les terminaux",
            "detail": "Le test à blanc reproduit les conditions de l'examen : partir de zéro, comme une machine neuve. Fermer tous les terminaux garantit qu'aucune mémoire cachée (venv actif, variable...) ne t'aide artificiellement.",
            "commande": "exit (dans chaque terminal) ou fermer les fenêtres",
            "prompt": "1) Demande-moi de fermer tous les terminaux ouverts ;\n2) Explique-moi pourquoi : on doit repartir de zéro comme au jour 1, sans venv actif ni réglage qui traîne ;\n3) Vérifie qu'il ne reste aucun terminal ouvert ;\n4) Rappelle-moi : rien ne sera perdu, tout est dans git et le disque ;\n5) Passe à l'étape suivante quand tout est fermé.",
            "succes": "Tous les terminaux sont fermés (ouverts pour le test seulement)"
          },
          {
            "label": "Ouvrir nouveau terminal",
            "detail": "Un terminal tout neuf, comme à l'examen : la session démarre sans le venv actif. C'est le point de départ exact de demain.",
            "commande": "aucune (ouvrir une fenêtre de terminal)",
            "prompt": "1) Demande-moi d'ouvrir un nouveau terminal ;\n2) Vérifie l'état de départ avec pwd (chemin personnel) ;\n3) Confirme qu'aucun venv n'est actif (l'invite ne doit pas montrer (.venv)) ;\n4) Demande-moi de me rendre dans le dossier du projet : cd /home/chelmooz/Projects/tuteur-scolastique ;\n5) Montre-moi comment vérifier avec pwd.",
            "succes": "Un nouveau terminal est ouvert, dans le dossier du projet, sans venv actif"
          },
          {
            "label": "Activer venv",
            "detail": "La première vraie commande du test : activer l'environnement virtuel. Si tu oublies cette étape, le programme pourrait utiliser le Python du système et rater les bibliothèques (requests).",
            "commande": "source .venv/bin/activate",
            "prompt": "1) Demande-moi de taper : source .venv/bin/activate ;\n2) Vérifie l'invite : elle doit afficher (.venv) ;\n3) Vérifie que requests est bien là avec pip list | grep requests ;\n4) Explique-moi ce qui se passerait si le venv n'était pas actif (import requests échouerait) ;\n5) Note ce test comme première étape réussie.",
            "succes": "L'invite affiche (.venv) et requests est présent"
          },
          {
            "label": "Vérifier Ollama",
            "detail": "Deuxième pierre du test : le serveur IA doit être allumé et le modèle présent. Cette vérification évite de découvrir le problème à l'exécution.",
            "commande": "ollama list",
            "prompt": "1) Demande-moi de lancer ollama list ;\n2) Observe ensemble que le serveur répond et que le modèle qwen2.5:7b-instruct-q4_k_m (ou qwen2.5) est présent ;\n3) Si Ollama est éteint, donne-moi la commande de démarrage (systemctl --user start ollama ou ollama serve) ;\n4) Explique-moi pourquoi cette vérification se fait AVANT de lancer le programme ;\n5) Note le résultat.",
            "succes": "ollama list répond et le modèle est présent"
          },
          {
            "label": "Lancer chat.py",
            "detail": "Le moment du test à blanc : lancer le programme et observer qu'il répond. On ne pose qu'une question simple : la mécanique doit fonctionner.",
            "commande": "python chat.py",
            "prompt": "1) Demande-moi de lancer python chat.py ;\n2) Pose la question simple : « Bonjour, comment vas-tu ? » ;\n3) Observe la réponse en streaming ;\n4) Vérifie qu'on peut sortir proprement avec exit ;\n5) Note : tout a fonctionné du premier coup, ou repère l'étape qui a échoué.",
            "succes": "chat.py se lance, répond et se ferme proprement"
          },
          {
            "label": "Chronométrer le temps total",
            "detail": "Mesurer c'est savoir : on chronomètre la durée entre l'ouverture du terminal et la première réponse du modèle. Demain (examen), tu viseras ce temps de référence.",
            "commande": "aucune (chronomètre)",
            "prompt": "1) Demande-moi de relancer la procédure complète en chronométrant : ouverture terminal → cd → activation venv → vérif Ollama → lancement → première réponse ;\n2) Note le temps total dans docs/TESTS.md sous « Test à blanc lundi » ;\n3) Commente avec moi : étape la plus longue, étape à réviser ;\n4) Écris l'analyse du chrono dans docs/PYTHON-NOTES.md ;\n5) Ne poursuis pas tant que le rendu n'est pas clair.",
            "succes": "Le temps de la procédure complète est mesuré et analysé dans les notes"
          }
        ]
      },
      {
        "titre": "P2 - Revue ligne par ligne",
        "taches": [
          {
            "label": "Ouvrir chat.py",
            "detail": "On lance la relecture systématique du programme : chaque ligne, une par une. Le but n'est plus de le faire marcher mais de le comprendre à 100 %.",
            "commande": "cat chat.py",
            "prompt": "1) Affiche chat.py en entier ;\n2) Rappelle-moi la longueur totale (nombre de lignes) ;\n3) Demande-moi de prévoir : « Combien de temps penses-tu mettre pour lire 1 ligne ? » ;\n4) Garde le fichier à l'écran.",
            "succes": "chat.py est affiché, prêt pour la lecture ligne à ligne"
          },
          {
            "label": "Lire chaque ligne",
            "detail": "On descend le fichier ligne par ligne. Pour chacune, tu dois pouvoir dire ce qu'elle fait. Si une ligne est nouvelle ou floue, elle sera marquée 'à revoir'.",
            "commande": "aucune (lecture guidée ligne à ligne)",
            "prompt": "1) Utilise docs/TABLEAU-FONCTIONS.md et affiche chat.py ;\n2) Parcours le fichier LIGNE par ligne (pas par blocs) ;\n3) Pour chaque ligne, demande-moi : « Que fait cette ligne ? » ;\n4) Marque comme « compris » ou « à revoir » chaque ligne selon ma réponse ;\n5) Ne corrige rien maintenant : on liste seulement.",
            "succes": "Chaque ligne de chat.py est relue et classée compris ou à revoir"
          },
          {
            "label": "Marquer lignes incomprises (carte Kanban)",
            "detail": "Les lignes marquées « à revoir » deviennent des cartes Kanban : une carte par ligne incomprise. Demain, ces cartes SAURONT exactement sur quoi réviser jusqu'à la résolution.",
            "commande": "aucune (les lignes à revoir sont listées dans docs/KANBAN.md)",
            "prompt": "1) Reprends la liste des lignes « à revoir » de la lecture précédente ;\n2) Crée une entrée docs/KANBAN.md (ou section) : « Lignes à revoir - lundi » ;\n3) Écris UNE ligne par carte Kanban, avec la ligne exacte collée et son numéro ;\n4) Classe : À faire pour mardi ;\n5) Montre-moi la liste et demande-moi de vérifier qu'elle est exacte.",
            "succes": "Chaque ligne incomprise a sa carte dans le Kanban"
          },
          {
            "label": "Pour chaque ligne marquée: demander explication",
            "detail": "On résout maintenant les cartes : pour chaque ligne à revoir, on demande à opencode une explication claire, puis on la re-rédige avec ses mots.",
            "commande": "aucune (dialogue guidé)",
            "prompt": "1) Prends la PREMIÈRE carte « ligne à revoir » du Kanban ;\n2) Explique-moi cette ligne en une phrase simple, avec une analogie si possible ;\n3) Demande-moi de la résumer avec MES mots ;\n4) Écris ma reformulation dans docs/PYTHON-NOTES.md, puis déplace la carte dans Fait ;\n5) Passe à la carte suivante : répète jusqu'à épuisement, fais une pause si ça bloque.",
            "succes": "Chaque ligne « à revoir » a reçu une explication et sa carte est dans Fait"
          },
          {
            "label": "Comprendre avant de continuer",
            "detail": "La règle d'or : pas de nouvelle ligne tant que la précédente n'est pas comprise. Lire vite pour « finir » ne sert à rien, comprendre lentement prépare l'examen.",
            "commande": "aucune (règle de méthode)",
            "prompt": "1) Vérifie avec moi qu'il ne reste PLUS aucune ligne « à revoir » ;\n2) Question de contrôle : reprends 3 lignes au hasard dans chat.py et demande-moi de les expliquer ;\n3) Si je bloque, ré-explique AVANT de continuer ;\n4) Confirme : « Le programme entier te semble-t-il compréhensible ligne à ligne ? » ;\n5) Note cet état conclu dans docs/PYTHON-NOTES.md.",
            "succes": "Je peux expliquer des lignes au hasard de chat.py sans hésiter"
          }
        ]
      },
      {
        "titre": "P3 - Simulation bugs",
        "taches": [
          {
            "label": "Introduire bug: mauvaise URL",
            "detail": "Pour apprendre à diagnostiquer, on crée volontairement une panne : changer l'adresse d'Ollama en une adresse invalide. La règle : TU diagnostiques, opencode ne donne pas la solution tout de suite.",
            "commande": "aucune (le prompt introduit le bug)",
            "prompt": "1) Dans chat.py, modifie TEMPORAIREMENT l'adresse d'Ollama en une adresse invalide (par exemple 192.0.2.1:9999) ;\n2) Ne m'explique PAS quoi exactement tu as changé : juste « il y a un bug, trouve-le » ;\n3) Lance-moi le chrono de 5 minutes : je dois diagnostiquer sans ton aide ;\n4) Reste patient, donne seulement des indices si je te le demande (mais pas la solution) ;\n5) Note que le bug est présent.",
            "succes": "Le bug (mauvaise URL) est introduit et je dois le trouver"
          },
          {
            "label": "Diagnostiquer sans IA",
            "detail": "Phase de recherche : je lis chat.py, je repère la ligne suspecte et je formule mon hypothèse. opencode ne donne PAS la solution : il confirme ou infirme mes pistes.",
            "commande": "aucune (recherche autonome guidée)",
            "prompt": "1) Garde-toi de donner la réponse : laisse-moi chercher ;\n2) Réponds à mes questions seulement par oui ou non, ou par un indice maigre (pas la ligne exacte) ;\n3) Après 5 minutes (ou si je dis abandonner), demande-moi : « Quelle ligne est suspecte à ton avis ? » ;\n4) Écris mon hypothèse dans docs/TESTS.md AVANT de me dire la vérité ;\n5) Seulement là, révèle la ligne modifiée et compare avec mon hypothèse.",
            "succes": "J'ai émis une hypothèse écrite avant de connaître la vraie ligne"
          },
          {
            "label": "Corriger le bug URL",
            "detail": "Après diagnostic, on répare : remettre la bonne URL et vérifier que le programme fonctionne. Corriger en comprenant, c'est apprendre.",
            "commande": "aucune (le prompt corrige après mon hypothèse)",
            "prompt": "1) Compare mon hypothèse avec la vraie ligne modifiée ;\n2) Demande-moi de proposer la correction ;\n3) Applique-la (corrige la bonne adresse localhost:11434) ;\n4) Lance python chat.py et vérifie qu'une question obtient une réponse ;\n5) Note le résumé de cet exercice dans docs/TESTS.md : bug introduit, mon hypothèse, correction.",
            "succes": "La bonne URL est remise et chat.py fonctionne de nouveau"
          },
          {
            "label": "Introduire bug: mauvaise clé JSON",
            "detail": "Deuxième panne simulée : une clé JSON erronée (ex : response modifié en reponse). Le programme ne plantera pas forcément : il affichera peut-être rien, un piège plus sournois.",
            "commande": "aucune (le prompt introduit le bug)",
            "prompt": "1) Dans chat.py, remplace TEMPORAIREMENT une clé JSON lue (ex : data.get(\"response\") devient data.get(\"reponse\")) ;\n2) Ne me dis pas quoi exactement tu as changé : juste « il y a un autre bug, trouve-le » ;\n3) Lance le chrono de 5 minutes ;\n4) Ne corrige pas sans que j'aie émis mon hypothèse ;\n5) Note le bug présent.",
            "succes": "Le bug (mauvaise clé JSON) est introduit et je dois le trouver"
          },
          {
            "label": "Diagnostiquer sans IA",
            "detail": "Même règle que pour le premier bug : recherche autonome, hypothèse écrite, pas de solution dévoilée trop tôt. Ce bug est subtil : le programme ne plante pas, il affiche du vide.",
            "commande": "aucune (recherche autonome guidée)",
            "prompt": "1) Laisse-moi chercher : réponses oui/non ou indices maigres seulement ;\n2) Après 5 minutes ou abandon, demande mon hypothèse PAR ÉCRIT ;\n3) Écris-la dans docs/TESTS.md AVANT de révéler ;\n4) Révèle la clé et explique pourquoi ce bug est « silencieux » : la clé manquante donne une valeur vide ou None ;\n5) Corrige avec moi SEULEMENT après cette analyse.",
            "succes": "J'ai émis une hypothèse écrite sur la clé fautive avant la correction"
          },
          {
            "label": "Corriger le bug clé JSON",
            "detail": "Réparation : remettre la clé correcte et VERIFIER que la réponse s'affiche de nouveau. Un bug silencieux se traque en relisant les clés exactes de l'API.",
            "commande": "aucune (le prompt corrige après mon hypothèse)",
            "prompt": "1) Applique ma correction (rétablir data.get(\"response\")) ;\n2) Lance python chat.py et vérifie que la réponse s'affiche ;\n3) Compare : que s'affichait-il avec la mauvaise clé ? (rien ou vide) ;\n4) Explique-moi pourquoi vérifier les noms exacts des clés est crucial avec une API ;\n5) Note le résumé complet dans docs/TESTS.md.",
            "succes": "La bonne clé est remise et la réponse s'affiche correctement"
          },
          {
            "label": "Introduire bug: erreur indentation",
            "detail": "Troisième panne, typiquement Python : une indentation fausse (décalage de tabulations/espaces). Python est exigeant : la moindre indentation erronée casse le programme ou change le sens.",
            "commande": "aucune (le prompt introduit le bug)",
            "prompt": "1) Dans chat.py, déplace TEMPORAIREMENT une ligne dans l'indentation (par exemple sors une ligne de la boucle ou du if) ;\n2) Ne me dis pas quoi : « il y a un troisième bug » ;\n3) Lance le chrono de 5 minutes ;\n4) Si le programme ne se lance même plus, dis-le-moi (c'est souvent le cas) ;\n5) Note le bug introduit.",
            "succes": "Le bug d'indentation est introduit et je dois le trouver"
          },
          {
            "label": "Diagnostiquer sans IA",
            "detail": "Le bug d'indentation se traque par la lecture, pas par l'exécution (le programme refuse souvent de démarrer). L'hypothèse écrite reste obligatoire avant toute correction.",
            "commande": "aucune (recherche autonome guidée)",
            "prompt": "1) Laisse-moi chercher, réponses oui/non uniquement ;\n2) Si je lance le programme, laisse-le rater : montre-moi l'erreur IndentationError en lecture ;\n3) Après 5 minutes ou abandon, récupère MON HYPOTHÈSE par écrit dans docs/TESTS.md ;\n4) Révèle la ligne concernée ;\n5) Pose une question de méthode : comment éviter ce bug ? (attention à l'alignement et à l'homogénéité des tabulations).",
            "succes": "J'ai une hypothèse écrite avant la révélation du bug d'indentation"
          },
          {
            "label": "Corriger le bug indentation",
            "detail": "Réparation finale : remettre l'indentation correcte et relancer. Après les 3 corrections, on revalide toute la suite de tests.",
            "commande": "aucune (le prompt corrige après mon hypothèse)",
            "prompt": "1) Applique ma correction (remettre l'indentation exacte) ;\n2) Lance python chat.py : le programme doit démarrer sans IndentationError ;\n3) Fais un tour de conversation complet (question, réponse, exit) ;\n4) Rejoue les 3 pannes simulées (URL, clé, indentation) pour confirmer qu'elles sont réparées ;\n5) Note le résultat des 3 exercices dans docs/TESTS.md.",
            "succes": "chat.py démarre, dialogue normalement, et les 3 bugs ont été corrigés et revalidés"
          }
        ]
      },
      {
        "titre": "P4 - Nettoyage",
        "taches": [
          {
            "label": "Vérifier git log --oneline",
            "detail": "On regarde l'historique du projet : git log --oneline montre la filiation des commits du premier au dernier. Une semaine de travail devrait former une belle échelle.",
            "commande": "git log --oneline",
            "prompt": "1) Lance git log --oneline ;\n2) Lis-moi les messages du plus récent au plus ancien : ils racontent l'histoire du projet (skeleton, first chat, refactor, errors, streaming, loop, history...) ;\n3) Demande-moi : « Combien de commits comptes-tu ? » ;\n4) Valide que chaque commit correspond à une étape que tu reconnais ;\n5) Explique-moi pourquoi cet historique « propre » aide en cas de bug.",
            "succes": "Je lis l'historique et je reconnais chaque étape de la semaine"
          },
          {
            "label": "Vérifier git status (propre)",
            "detail": "Un dépôt propre = git status ne montre aucun changement en attente. Vérifier l'état AVANT la fin de journée évite de perdre du travail.",
            "commande": "git status",
            "prompt": "1) Lance git status ;\n2) Interprète ensemble les sections : « rien à valider » (propre) ou des fichiers modifiés ;\n3) Liste ce qui n'est pas commité s'il y en a ;\n4) Décide avec moi : soit committer (étape suivante), soit ranger le fichier ;\n5) Note l'état final dans docs/PYTHON-NOTES.md.",
            "succes": "Je sais interpréter git status et l'état du dépôt est clair"
          },
          {
            "label": "Supprimer fichiers temporaires",
            "detail": "Les fichiers de brouillon (test.json, session.json de test, scripts de debug) n'ont plus leur place. Les supprimer nettoie le dépôt avant l'examen. session.json reste si tu veux garder tes conversations.",
            "commande": "rm -f session.json docs/test.json",
            "prompt": "1) Liste avec moi les fichiers temporaires créés cette semaine (docs/test.json, session.json, etc.) ;\n2) Demande-moi de confirmer chacun avant suppression ;\n3) Supprime-les avec rm -f si je suis d'accord ;\n4) Relance git status : le dépôt doit être plus propre ;\n5) Explique-moi pourquoi nettoyer avant un examen est important.",
            "succes": "Les fichiers temporaires sont supprimés et git status est propre (ou justifié)"
          },
          {
            "label": "Dernier commit si nécessaire",
            "detail": "Si des fichiers légitimes restent non commités (notes du lundi, tableau des fonctions...), on les fige avec un dernier commit de nettoyage avant l'examen.",
            "commande": "git add docs && git commit -m \"chore: review notes before checkpoint\"",
            "prompt": "1) Lance git status et identifie les fichiers légitimes non commités ;\n2) Explique-moi pourquoi committer les notes avant l'examen (rien à perdre) ;\n3) Ajoute les fichiers concernés (git add docs) et commite avec le message EXACT : chore: review notes before checkpoint ;\n4) Montre git log --oneline et git status (propre) ;\n5) Confirme ensemble : tout est sauvegardé.",
            "succes": "git status est propre et le dernier commit est visible dans git log"
          }
        ]
      },
      {
        "titre": "P5 - Préparation test",
        "taches": [
          {
            "label": "Relire PYTHON-NOTES.md",
            "detail": "Dernière relecture des notes avant le grand jour. Tu dois parcourir l'ensemble : variables, fonctions, streaming, historique, git. C'est ta bibliothèque avant l'examen.",
            "commande": "cat docs/PYTHON-NOTES.md",
            "prompt": "1) Affiche docs/PYTHON-NOTES.md en entier ;\n2) Lis-le à voix haute (ou demande-moi de le lire) ;\n3) Note les concepts qui me semblent fragiles pendant la lecture ;\n4) Propose 3 questions de contrôle sur ces points faibles et corrige avec moi ;\n5) Termine par un résumé : quels points revoir en priorité demain ?",
            "succes": "J'ai relu toutes les notes et je connais mes points fragiles"
          },
          {
            "label": "Revoir tableau fonctions",
            "detail": "Le tableau des fonctions est une « feuille de route » du programme : rôle + entrée + sortie de chaque fonction. Le revoir = réviser l'architecture de chat.py en 5 minutes.",
            "commande": "cat docs/TABLEAU-FONCTIONS.md",
            "prompt": "1) Affiche docs/TABLEAU-FONCTIONS.md ;\n2) Cache le tableau et demande-moi de réciter : nom de chaque fonction, son rôle, son entrée, sa sortie ;\n3) Compare avec le tableau réel et corrige mes erreurs une par une ;\n4) Pose 2 questions de contrôle sur des fonctions précises (demander_ollama, save_history) ;\n5) Écris une note « Bien révisé le lundi » en bas du tableau si tout est juste.",
            "succes": "Je peux réciter le rôle de chaque fonction sans regarder le tableau"
          },
          {
            "label": "Préparer explications orales",
            "detail": "Demain, tu devras EXPLIQUER de vive voix. On prépare : chaque concept devient une explication de 2 phrases que tu peux dire. Si tu peux l'expliquer, tu le sais.",
            "commande": "aucune (entraînement oral guidé)",
            "prompt": "1) Reprends les concepts du tableau des fonctions et de PYTHON-NOTES.md ;\n2) Pour CHAQUE concept, demande-moi de l'expliquer en 2 phrases AVANT de continuer ;\n3) Enregistre mes explications (enregistre-toi ou écris-les) ;\n4) Interroge-moi dans un ordre aléatoire (comme l'oral de demain) ;\n5) Note les 3 explications les plus fragiles et refais-les avec moi.",
            "succes": "J'ai expliqué oralement chaque concept clé en 2 phrases, sans notes"
          },
          {
            "label": "Dormir tôt ce soir",
            "detail": "Dernière préparation : le sommeil consolide la mémoire. Une nuit complète fait plus pour un examen qu'une heure de révision de plus. On arrête tôt, c'est une consigne stratégique.",
            "commande": "aucune (choix de vie)",
            "prompt": "1) Fais le point avec moi : révision faite, notes en ordre, dépôt propre ;\n2) Rappelle-moi que la mémorisation se consolide pendant le sommeil (avec une référence simple) ;\n3) Fixe ensemble une heure d'arrêt raisonnable ;\n4) Propose une petite routine de détente (10 min) avant le coucher ;\n5) Termine sur une note positive : le travail est bien fait, demain c'est l'examen.",
            "succes": "J'ai décidé d'arrêter de bonne heure et de me coucher tôt"
          }
        ]
      }
    ]
  },
  "mardi15": {
    "date": "Mardi 15 septembre",
    "objectif": "CHECKPOINT JALON 1",
    "pomodoros": [
      {
        "titre": "P1 - Révision",
        "taches": [
          {
            "label": "Relire notes rapidement",
            "detail": "Le grand jour : on fait un survol de révision AVANT l'examen. 10 minutes de lecture guidée des notes pour réactiver la mémoire, pas pour apprendre du neuf.",
            "commande": "cat docs/PYTHON-NOTES.md",
            "prompt": "1) Affiche docs/PYTHON-NOTES.md en entier ;\n2) Fais un survol rapide avec moi SANS t'arrêter : on ne révise pas, on réactive ;\n3) Vérifie ensemble qu'aucune section importante ne manque ;\n4) Pose une seule question de contrôle sur les 3 concepts les plus marquants ;\n5) Passe à la suite.",
            "succes": "Mes notes sont relues en survol, mémoire réactivée"
          },
          {
            "label": "Relancer chat.py (procédure complète)",
            "detail": "On répète la procédure exacte de l'examen : venv, Ollama, lancement, question, sortie. Le geste devient automatique, plus besoin de réfléchir pour le démarrage.",
            "commande": "source .venv/bin/activate && python chat.py",
            "prompt": "1) Guide-moi à travers la procédure complète :\na) cd /home/chelmooz/Projects/tuteur-scolastique ;\nb) source .venv/bin/activate ;\nc) ollama list (vérification) ;\nd) python chat.py ;\n2) Pose une question, reçois la réponse, tape exit ;\n3) Interview : « Sans réfléchir, nomme les 4 étapes de la procédure » ;\n4) Corrige ou valide ;\n5) Note dans docs/TESTS.md : procédure maîtrisée.",
            "succes": "Je lance chat.py de A à Z sans aide et je quitte proprement"
          },
          {
            "label": "Vérifier que tout fonctionne",
            "detail": "Dernier tour de contrôle complet : questions des 3 cas (normale, vide, Ollama éteint ?) pour valider l'état final avant l'examen.",
            "commande": "python chat.py",
            "prompt": "1) Lance python chat.py ;\n2) Teste avec moi :\na) une question normale (réponse attendue) ;\nb) une question vide (message « Tu n'as rien demandé ! ») ;\nc) tape exit (sortie propre) ;\n3) Vérifie ensemble les messages d'erreur des pannes déjà testées (docs/TESTS.md) sans forcément les rejouer ;\n4) Confirme : l'état du programme est prêt pour l'examen ;\n5) Note l'état final dans docs/TESTS.md.",
            "succes": "Les 3 cas fonctionnent et le programme est prêt pour l'examen"
          }
        ]
      },
      {
        "titre": "P2 - Test de passage",
        "taches": [
          {
            "label": "Recevoir script à 3 bugs",
            "detail": "Le test pratique de l'examen : on reçoit un script contenant volontairement 3 bugs cachés. La consigne va être de les trouver, les comprendre et les corriger, sans panic.",
            "commande": "aucune (le prompt prépare le script)",
            "prompt": "1) Prépare un script de test en Python de 15 lignes maximum, ressemblant à ce qu'on a vu cette semaine (input + requête à une API OU un petit calcul) ;\n2) Introduis EXACTEMENT 3 bugs dans ce script : 1 de URL/endpoint, 1 de clé JSON, 1 d'indentation ;\n3) Enregistre-le dans /tmp/opencode/tests/examen.py (ou le chemin que je choisis) ;\n4) Affiche le script SANS les bugs dans une liste à part pour que je puisse comparer après ;\n5) Ne corrige rien avec moi avant la fin du chrono.",
            "succes": "Le script à 3 bugs est prêt dans son fichier, je vais le corriger"
          },
          {
            "label": "Lire le script",
            "detail": "Première arme du chasseur de bugs : lire le script AVANT de l'exécuter. Repérer mentalement les endroits sensibles : URL, accès aux clés, indentation.",
            "commande": "aucune (lecture guidée)",
            "prompt": "1) Affiche le script de test (examen.py) ;\n2) Demande-moi de repérer 3 zones sensibles : l'URL/appel réseau, les accès aux clés JSON, l'indentation ;\n3) Fais-moi dire quelle erreur je soupçonne dans chaque zone (sans obligation d'avoir juste) ;\n4) Note mes suspicions dans docs/TESTS.md ;\n5) Lance ensuite le chronomètre du test : le temps officiel démarre.",
            "succes": "J'ai lu le script et émis 3 suspicions écrites"
          },
          {
            "label": "Identifier bug 1",
            "detail": "Le premier bug attend généralement d'être repéré par comparaison avec ce qu'on sait : ici une URL faussée. Identifier = nommer le bug sans le corriger encore.",
            "commande": "aucune (recherche guidée)",
            "prompt": "1) Fais-moi comparer la zone URL/appel du script de test avec ce que je sais de la bonne adresse (localhost:11434) ;\n2) Attends que je nomme le bug 1 (endpoint/URL faussé) ;\n3) Réponds seulement oui/non à mes hypothèses tant que je n'ai pas trouvé ;\n4) Une fois identifié, écris-le dans docs/TESTS.md sous « Bug 1 identifié » ;\n5) Ne corrige pas encore : la correction est l'étape suivante.",
            "succes": "J'ai nommé le bug 1 (URL/endpoint erroné) par écrit"
          },
          {
            "label": "Corriger bug 1",
            "detail": "Une fois identifié, on corrige : remettre la bonne URL. Corriger, c'est appliquer la connaissance ; identifier, c'est là que se joue la compétence.",
            "commande": "aucune (le prompt applique ma correction)",
            "prompt": "1) Applique ma correction du bug 1 (rétablir l'adresse correcte) ;\n2) Montre le changement ; demande-moi si c'est bien ce que je voulais ;\n3) Garde la trace : docs/TESTS.md « Bug 1 corrigé » ;\n4) Passe au bug 2 sans lancer encore le programme.",
            "succes": "Le bug 1 est corrigé et tracé dans les notes de test"
          },
          {
            "label": "Identifier bug 2",
            "detail": "Deuxième bug : une clé JSON mal orthographiée. La méthode : relire les clés utilisées et les comparer à celles de la réponse (response, done...).",
            "commande": "aucune (recherche guidée)",
            "prompt": "1) Fais-moi relire les accès aux clés JSON dans le script de test ;\n2) Montre la liste des clés réelles de l'API si besoin (champ response avant tout) ;\n3) Attends que je nomme le bug 2 (clé mal orthographiée) ;\n4) Réponds oui/non jusqu'à la bonne identification ;\n5) Écris « Bug 2 identifié » dans docs/TESTS.md.",
            "succes": "J'ai nommé le bug 2 (clé JSON erronée) par écrit"
          },
          {
            "label": "Corriger bug 2",
            "detail": "Correction du bug 2 : rétablir la clé exacte. On vérifie qu'avec la bonne clé, le champ s'affiche correctement.",
            "commande": "aucune (le prompt applique ma correction)",
            "prompt": "1) Applique ma correction du bug 2 (rétablir la clé exacte) ;\n2) Montre le changement et fais-moi vérifier le nom exact ;\n3) Trace « Bug 2 corrigé » dans docs/TESTS.md ;\n4) Passe au bug 3.",
            "succes": "Le bug 2 est corrigé et tracé dans les notes de test"
          },
          {
            "label": "Identifier bug 3",
            "detail": "Dernier bug : l'indentation. Il se traque à la lecture : une ligne décalée qui sort d'un bloc, ou le programme ne démarre même pas (IndentationError).",
            "commande": "aucune (recherche guidée)",
            "prompt": "1) Fais-moi examiner l'indentation de chaque bloc du script de test ;\n2) Si le script refuse de démarrer, montrons l'erreur ensemble et cherchons la ligne fautive ;\n3) Attends que je nomme le bug 3 (indentation incorrecte) ;\n4) Réponds oui/non à mes hypothèses ;\n5) Écris « Bug 3 identifié » dans docs/TESTS.md.",
            "succes": "J'ai nommé le bug 3 (mauvaise indentation) par écrit"
          },
          {
            "label": "Corriger bug 3",
            "detail": "Correction du dernier bug : rétablir l'indentation. C'est souvent la ligne qui change tout le sens du bloc (dans la boucle vs hors de la boucle).",
            "commande": "aucune (le prompt applique ma correction)",
            "prompt": "1) Applique ma correction du bug 3 (rétablir l'indentation) ;\n2) Montre le changement et explique son effet SI on ne l'avait pas corrigé ;\n3) Trace « Bug 3 corrigé » dans docs/TESTS.md ;\n4) Prépare le test complet (étape suivante).",
            "succes": "Le bug 3 est corrigé et tracé dans les notes de test"
          },
          {
            "label": "Tester script corrigé",
            "detail": "Après les 3 corrections, on exécute le script corrigé : il doit se lancer et répondre correctement. Le test final prouve que les 3 bugs étaient bien réparés.",
            "commande": "python /tmp/opencode/tests/examen.py",
            "prompt": "1) Lance le script corrigé ;\n2) Observe : démarrage sans erreur ? réponse correcte ? ;\n3) Compare le comportement avec la liste des bugs que j'ai identifiés ;\n4) Fais-moi résumer : les 3 bugs sont-ils réparés et prouvés ? ;\n5) Écris le résultat final dans docs/TESTS.md.",
            "succes": "Le script corrigé se lance et donne la bonne réponse"
          },
          {
            "label": "Chronométrer temps total",
            "detail": "Mesure finale : le temps mis entre la lecture du script et la réussite du script corrigé. C'est la « vitesse de correction » qui sera comparée à la référence le jour J ou en P2 semaine 2.",
            "commande": "aucune (chronomètre)",
            "prompt": "1) Note le chronomètre : le test du script à 3 bugs a duré X minutes ;\n2) Écris la durée dans docs/RETRO.md (à créer si absent) ;\n3) Compare avec l'estimation que j'aurai faite : étais-je plus rapide que prévu ? ;\n4) Analyse avec moi : quel bug a pris le plus de temps et pourquoi ;\n5) Termine sur un point positif : le script est corrigé et tout est tracé.",
            "succes": "Le temps total de correction est mesuré et analysé dans docs/RETRO.md"
          }
        ]
      },
      {
        "titre": "P3 - Explication orale",
        "taches": [
          {
            "label": "Préparer explication variables",
            "detail": "Expliquer « variables » de vive voix, c'est transformer le concept en 2 phrases claires. On prépare la formulation maintenant pour la dire sans notes.",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer les VARIABLES en 2 phrases, sans notes ;\n2) Écoute et note : est-ce clair ? Est-ce exact ?\n3) Si flou, pose une question de guidage : « Une variable, c'est comme quoi ? » ;\n4) Fais-moi reformuler jusqu'à une version simple et juste ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique les variables en 2 phrases claires, de mes mots"
          },
          {
            "label": "Préparer explication fonctions",
            "detail": "Expliquer les FONCTIONS de vive voix : la recette, l'entrée, la sortie. L'explication orale use l'analogie pour devenir mémorable.",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer les FONCTIONS en 2 phrases, sans notes ;\n2) Écoute la compréhension : paramètres + return présents ?\n3) Guide si besoin : « Une fonction reçoit quoi, elle renvoie quoi ? » ;\n4) Fais-moi reformuler jusqu'à la version claire ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique les fonctions en citant l'entrée et la sortie"
          },
          {
            "label": "Préparer explication dictionnaires",
            "detail": "Expliquer les DICTIONNAIRES : des paires d'étiquette (clé) et de contenu (valeur), comme les réponses JSON. La clé réponse contient le texte du modèle.",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer les DICTIONNAIRES en 2 phrases ;\n2) Vérifie les notions : clé, valeur, lecture dico['cle'] ;\n3) Relie au JSON d'Ollama : le champ response est un exemple de valeur ;\n4) Fais-moi reformuler si nécessaire ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique les dictionnaires avec l'idée clé/valeur"
          },
          {
            "label": "Préparer explication try/except",
            "detail": "Expliquer TRY/EXCEPT : le filet de sécurité qui attrape les erreurs pour que le programme ne plante pas. On l'a vu avec Ollama éteint.",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer TRY/EXCEPT en 2 phrases ;\n2) Vérifie : try essaie, except rattrape l'erreur, le programme continue ;\n3) Relie à un exemple vécu (Ollama éteint : message clair au lieu de crash) ;\n4) Fais-moi reformuler si besoin ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique try/except en disant qu'il empêche le programme de planter"
          },
          {
            "label": "Préparer explication JSON",
            "detail": "Expliquer JSON : le format universel d'échange, une sorte de fiche à étiquettes avec des guillemets. On en voit partout cette semaine (réponses Ollama, session.json).",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer le JSON en 2 phrases ;\n2) Vérifie les notions : clé, valeur, guillemets, indentation, sérialisation ;\n3) Relie au concret : la réponse d'Ollama et le fichier session.json ;\n4) Distingue dumps (vers texte) et loads (vers dict) si je peux ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique le JSON comme un format d'échange de données"
          },
          {
            "label": "Préparer explication streaming",
            "detail": "Expliquer le STREAMING : la réponse arrive en continu par morceaux au lieu d'un bloc, comme un robinet. C'est la touche « expérience utilisateur » du programme.",
            "commande": "aucune (entraînement oral)",
            "prompt": "1) Demande-moi d'expliquer le STREAMING en 2 phrases ;\n2) Vérifie les notions : morceaux successifs, affichage progressif, NDJSON ;\n3) Relie au visuel : on voit la réponse s'écrire petit à petit ;\n4) Fais-moi reformuler si besoin ;\n5) Enregistre la version finale dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "J'explique le streaming comme une réponse qui arrive en continu"
          },
          {
            "label": "S'enregistrer ou expliquer à voix haute",
            "detail": "La répétition finale : s'enregistrer (ou expliquer à quelqu'un) les 6 explications préparées. L'entendre déroule l'évaluation de demain : SOI à l'oral.",
            "commande": "aucune (enregistrement ou oral)",
            "prompt": "1) Propose-moi de m'enregistrer avec un outil simple (auditeur du téléphone, arecord, etc.) ;\n2) Demande-moi de dérouler les 6 explications ORALES dans l'ordre (variables, fonctions, dictionnaires, try/except, JSON, streaming) ;\n3) Écoute l'enregistrement avec moi, repère les hésitations ;\n4) Refais les 1-2 explications les plus fragiles après correction ;\n5) Note « Oral préparé et répété » dans docs/EXPLICATIONS-ORALES.md.",
            "succes": "Je me suis enregistré ou j'ai expliqué les 6 sujets à voix haute"
          }
        ]
      },
      {
        "titre": "P4 - Vérification finale",
        "taches": [
          {
            "label": "Checklist: README présent",
            "detail": "Première case de la checklist d'examen : le fichier README.md doit exister à la racine du projet et être rempli (prérequis, installation, lancement, dépannage).",
            "commande": "ls README.md && cat README.md",
            "prompt": "1) Vérifie que README.md existe : ls README.md ;\n2) Affiche-le et vérifie avec moi les sections : Prérequis, Installation, Lancement, Arrêt, Dépannage ;\n3) Marque « README présent » dans docs/CHECKLIST.md (à créer si absent) ;\n4) Corrige toute section absente avec moi si besoin ;\n5) Confirme la case cochée.",
            "succes": "README.md existe et contient les sections attendues"
          },
          {
            "label": "Checklist: chat.py fonctionnel",
            "detail": "La preuve par l'exécution : le programme SE LANCE et RÉPOND. Pas de doute possible : on teste sous vos yeux.",
            "commande": "source .venv/bin/activate && python chat.py",
            "prompt": "1) Lance python chat.py avec le venv actif ;\n2) Pose une question, attends la réponse en streaming ;\n3) Quitte proprement avec exit ;\n4) Marque « chat.py fonctionnel » dans docs/CHECKLIST.md ;\n5) Fais-moi confirmer la case.",
            "succes": "chat.py se lance, répond en streaming et se ferme proprement"
          },
          {
            "label": "Checklist: PYTHON-NOTES.md complet",
            "detail": "La bibliothèque de notes doit contenir les 10 concepts de la semaine, chacun avec un exemple. Vérifier l'intégralité = vérifier l'examen.",
            "commande": "cat docs/PYTHON-NOTES.md",
            "prompt": "1) Affiche docs/PYTHON-NOTES.md ;\n2) Compte avec moi les sections : les 10 concepts doivent y être, avec exemples ;\n3) Marque « PYTHON-NOTES.md complet » dans docs/CHECKLIST.md ;\n4) Repère toute section vide et remplis-la avec moi ;\n5) Confirme.",
            "succes": "PYTHON-NOTES.md contient les 10 concepts avec exemples"
          },
          {
            "label": "Checklist: historique Git propre",
            "detail": "L'historique Git doit raconter une semaine propre : des commits clairs, pas de modifications en suspens, un dépôt rangé.",
            "commande": "git log --oneline && git status",
            "prompt": "1) Lance git log --oneline et git status ;\n2) Relis les messages ensemble : chaque étape reconnaissable ;\n3) Vérifie : rien en attente (propre) ;\n4) Marque « historique Git propre » dans docs/CHECKLIST.md ;\n5) S'il reste du non commité légitime, commite-le avec moi.",
            "succes": "Git log est lisible et git status est propre"
          },
          {
            "label": "Checklist: aucun secret",
            "detail": "Dernière vérification d'hygiène : aucun secret (clé API, mot de passe) dans les fichiers suivis par Git. On l'a déjà vérifié, on revalide.",
            "commande": "git grep -iE '(password|secret|token|api[_-]?key)' || echo 'Aucun secret détecté'",
            "prompt": "1) Lance la recherche de secrets ;\n2) Interprète le résultat : pas d'alerte = pas de secret ;\n3) Vérifie aussi .gitignore (cat .gitignore, doit contenir .venv) ;\n4) Marque « aucun secret » dans docs/CHECKLIST.md ;\n5) Explique en une phrase pourquoi c'est important pour un dépôt.",
            "succes": "Aucun secret détecté et .gitignore est correct"
          }
        ]
      },
      {
        "titre": "P5 - Rétrospective",
        "taches": [
          {
            "label": "Écrire: Jalon VALIDÉ ou NON VALIDÉ",
            "detail": "Le verdict honnête de la semaine : le jalon 1 est-il validé ? Réponds par oui ou non en t'appuyant sur les preuves (checklist remplie, programme qui tourne, explications orales tenues).",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Affiche docs/CHECKLIST.md avec moi ;\n2) Demande-moi : « Au regard de la checklist, le jalon 1 est-il VALIDÉ ou NON VALIDÉ ? » ;\n3) Écris MA réponse (une ligne) dans docs/RETRO.md sous « Verdict » ;\n4) Si NON : liste les cases manquantes avec moi pour la semaine 2 ;\n5) Reste honnête : le verdict est une donnée de travail, pas une note scolaire.",
            "succes": "Le verdict VALIDÉ ou NON VALIDÉ est écrit avec justification"
          },
          {
            "label": "Écrire: Temps de correction (min)",
            "detail": "Le temps de correction du script à 3 bugs (P2 du jour) : c'est la donnée chiffrée qui montre ta vitesse de débogage. Elle servira de référence pour la semaine 2.",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Récupère le chrono de la correction des 3 bugs (P2 - Tester) ;\n2) Écris « Temps de correction : X minutes » dans docs/RETRO.md ;\n3) Fais-moi comparer avec l'estimation du matin ;\n4) Note une phrase d'analyse : qu'est-ce qui a pris du temps ? ;\n5) Valide la saisie.",
            "succes": "Le temps de correction (en minutes) est écrit dans docs/RETRO.md"
          },
          {
            "label": "Écrire: Ce que je sais expliquer",
            "detail": "Fais l'inventaire de ce que tu peux EXPLIQUER de vive voix : variables, fonctions, dictionnaires, try/except, JSON, streaming... C'est ta force réelle, au-delà des cases cochées.",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Demande-moi : « Quels sujets peux-tu expliquer de vive voix, sans notes ? » ;\n2) Écris MA liste dans docs/RETRO.md sous « Ce que je sais expliquer » ;\n3) Compare avec les 6 sujets préparés (P3) et complète ;\n4) Coche les sujets validés dans docs/EXPLICATIONS-ORALES.md ;\n5) Formule une phrase de fierté honnête.",
            "succes": "Ma liste des sujets que je sais expliquer est écrite"
          },
          {
            "label": "Écrire: Ce qui reste incompris",
            "detail": "La partie constructive : lister ce qui reste flou (une fonction, un concept, une commande...). Un point flou nommé est un point flou déjà à moitié résolu.",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Demande-moi : « Qu'est-ce qui te reste encore un peu flou, même léger ? » ;\n2) Écris MA liste dans docs/RETRO.md sous « Ce qui reste incompris » ;\n3) Ne juge pas : toute liste est une bonne liste ;\n4) Pour chaque point, note une idée de comment le débloquer (relire, demander un exemple...) ;\n5) Transforme ces points en cartes Kanban pour la semaine 2 avec moi.",
            "succes": "Ma liste de points flous est écrite, avec une piste de déblocage"
          },
          {
            "label": "Écrire: Blocage principal",
            "detail": "Peut-être qu'un blocage t'a freiné cette semaine (concentration, pomodoro, terminal, vocabulaire...). Le nommer permet de l'anticiper la semaine prochaine.",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Demande-moi : « Quel a été ton principal blocage cette semaine ? » ;\n2) Écris MA réponse dans docs/RETRO.md sous « Blocage principal » ;\n3) Propose 1 (!) seule stratégie concrète et testable pour la semaine 2 (ex : un pomodoro de plus si le premier traîne) ;\n4) Écris cette stratégie comme prochaine action ;\n5) Valide.",
            "succes": "Le blocage principal est nommé avec une stratégie simple pour la suite"
          },
          {
            "label": "Écrire: Décision pour Semaine 2",
            "detail": "La conclusion stratégique : vu le verdict, part-on en semaine 2 telle quelle, avec révisions, ou en demi-train ? Une décision claire évite l'ambiguïté lundi prochain.",
            "commande": "aucune (rédaction guidée dans docs/RETRO.md)",
            "prompt": "1) Résume le verdict (VALIDÉ ou NON) et le blocage principal ;\n2) Demande-moi : « Quelle est ta décision pour la semaine 2 ? » en proposant 3 options : enchaîner, réviser un jour d'abord, ou refaire la partie NON validée ;\n3) Écris ma décision dans docs/RETRO.md sous « Décision Semaine 2 » ;\n4) Reformule-la en une action à faire lundi ;\n5) Valide la formulation.",
            "succes": "La décision pour la semaine 2 est écrite et formulée en action"
          },
          {
            "label": "Célébrer la fin de Semaine 1!",
            "detail": "Une semaine complète, 225 micro-tâches, un vrai programme qui parle à une IA locale : c'est énorme. On célèbre parce que la motivation est un muscle qu'il faut nourrir.",
            "commande": "aucune (moment de fierté)",
            "prompt": "1) Fais le bilan chiffré avec moi : combien de tâches cochées (via le tracker), combien de commits dans git log --oneline ;\n2) Fais-moi nommer 3 réussites concrètes de la semaine ;\n3) Propose une célébration simple et immédiate (pause, goûter, balade) sans l'exécuter à ma place ;\n4) Écris « Semaine 1 terminée » en bas de docs/RETRO.md ;\n5) Termine sur un encouragement sincère.",
            "succes": "Je clique la case de cette tâche : la semaine 1 est terminée, bien joué"
          }
        ]
      }
    ]
  }
};

export const DOCUMENTS_CATALOG: DocumentItem[] = [
  {
    "filename": "10competencesia.jpeg",
    "category": "RAG & Pipeline",
    "title": "10competencesia",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 10competencesia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "10data_foundation.jpeg",
    "category": "RAG & Pipeline",
    "title": "10data foundation",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 10data foundation. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "20250221-WP-Developers_Guide_to_RAG.pdf",
    "category": "RAG & Pipeline",
    "title": "20250221 wp developers guide to rag",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 20250221 wp developers guide to rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "4couches.jpeg",
    "category": "Architecture & Production",
    "title": "4couches",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : 4couches. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "5 niveaux de projets.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Les 5 Niveaux de l’AI Engineering | API, RAG, Agents, Enterprise, Self-Improving",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Les 5 Niveaux de l’AI Engineering | API, RAG, Agents, Enterprise, Self-Improving. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "5top_archi.jpeg",
    "category": "RAG & Pipeline",
    "title": "5top archi",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 5top archi. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "7-couches-du-genie-des-systemes-ia.jpg",
    "category": "Architecture & Production",
    "title": "7 couches du genie des systemes ia",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : 7 couches du genie des systemes ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "7couches.jpeg",
    "category": "Architecture & Production",
    "title": "7couches",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : 7couches. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "8-bases-de-donnees-sql.html",
    "category": "RAG & Pipeline",
    "title": "8 bases de données SQL à explorer",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 8 bases de données SQL à explorer. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "8_architectures_rag_interactives (1).html",
    "category": "RAG & Pipeline",
    "title": "8 Architectures RAG (Retrieval-Augmented Generation) - Interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 8 Architectures RAG (Retrieval-Augmented Generation) - Interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "8rag.html",
    "category": "RAG & Pipeline",
    "title": "8 Architectures RAG Interactives",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 8 Architectures RAG Interactives. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "9 Techniques Clés — Maîtriser l’IA Moderne.pdf",
    "category": "RAG & Pipeline",
    "title": "9 techniques clés — maîtriser l’ia moderne",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 9 techniques clés — maîtriser l’ia moderne. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "9_Techniques_Cles_IA_Moderne.pptx",
    "category": "RAG & Pipeline",
    "title": "9 techniques cles ia moderne",
    "format": "PPTX",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 9 techniques cles ia moderne. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "AI Engineering Blueprint — 10 compétences.pdf",
    "category": "Agents & Orchestration",
    "title": "Ai engineering blueprint — 10 compétences",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Ai engineering blueprint — 10 compétences. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "AI_Engineering_Blueprint.pptx",
    "category": "Agents & Orchestration",
    "title": "Ai engineering blueprint",
    "format": "PPTX",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Ai engineering blueprint. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Agents IA locaux .html",
    "category": "Agents & Orchestration",
    "title": "Masterclass Premium : Local AI Agents | OpenClaw, Claude Cowork, Anatomie, Safety, Demos",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Masterclass Premium : Local AI Agents | OpenClaw, Claude Cowork, Anatomie, Safety, Demos. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Agents Spécifiques1.html",
    "category": "Agents & Orchestration",
    "title": "L'Ère des Agents Spécifiques et des Systèmes Multi-Agents",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : L'Ère des Agents Spécifiques et des Systèmes Multi-Agents. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Apprendre à une machine.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Multimodalité & Contrastive Representation Learning | Embeddings, CLIP, MNIST, PCA/UMAP",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Multimodalité & Contrastive Representation Learning | Embeddings, CLIP, MNIST, PCA/UMAP. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Architecture Backend Moderne - Du Débutant au Professionnel.pdf",
    "category": "Architecture & Production",
    "title": "Architecture backend moderne   du débutant au professionnel",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Architecture backend moderne   du débutant au professionnel. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "Architecture IA à 0 euro — stack évolutif.jpg",
    "category": "Fondations LLM",
    "title": "Architecture ia à 0 euro — stack évolutif",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Architecture ia à 0 euro — stack évolutif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Architecture RAG Agentique - De la récupération statique à l agent autonome.pdf",
    "category": "RAG & Pipeline",
    "title": "Architecture rag agentique   de la récupération statique à l agent autonome",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Architecture rag agentique   de la récupération statique à l agent autonome. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Architecture d'un agent IA .html",
    "category": "Agents & Orchestration",
    "title": "Architecture d'un agent IA (Copy) - Claude",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Architecture d'un agent IA (Copy) - Claude. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "COURS_LLM_ROADMAP_MLABONNE.html",
    "category": "Fondations LLM",
    "title": "Cours LLM — roadmap interactif (d'après mlabonne/llm-course)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours LLM — roadmap interactif (d'après mlabonne/llm-course). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "COURS_MEMOIRE_AGENTS_MEM0.html",
    "category": "RAG & Pipeline",
    "title": "La mémoire des agents IA — architecture Mem0",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : La mémoire des agents IA — architecture Mem0. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Comprendre l Architecture Transformer - Le Moteur des IA Modernes.pdf",
    "category": "Fondations LLM",
    "title": "Comprendre l architecture transformer   le moteur des ia modernes",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Comprendre l architecture transformer   le moteur des ia modernes. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Comprendre le RAG Multimodal - Embeddings dédiés vs Multi-Vector Retriever.pdf",
    "category": "RAG & Pipeline",
    "title": "Comprendre le rag multimodal   embeddings dédiés vs multi vector retriever",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Comprendre le rag multimodal   embeddings dédiés vs multi vector retriever. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Comprendre vraiment l IA .html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Fondamentaux IA | Réseaux de Neurones, Tokens, Embeddings, Attention, Transformers, LLMs",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Fondamentaux IA | Réseaux de Neurones, Tokens, Embeddings, Attention, Transformers, LLMs. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Comprendre vraiment les agents IA.html",
    "category": "Agents & Orchestration",
    "title": "Masterclass Premium : Agents IA | Boucle ReAct, Skills, Context Engineering, Evals",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Masterclass Premium : Agents IA | Boucle ReAct, Skills, Context Engineering, Evals. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Construire des logiciels avec l’IA.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Vibe Coding avec AI | Birthday Card, Prompting, Ping Pong, Projet Pratique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Vibe Coding avec AI | Birthday Card, Prompting, Ping Pong, Projet Pratique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Construire et Entraîner des LLMs.html",
    "category": "Fondations LLM",
    "title": "Architecture et Entraînement des LLMs",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Architecture et Entraînement des LLMs. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Context Engineering.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Context Engineering | Write, Select, Compress, Isolate, Failure Modes, KV Cache, Multi-Agents",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Context Engineering | Write, Select, Compress, Isolate, Failure Modes, KV Cache, Multi-Agents. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "ConversableAgent.html",
    "category": "Agents & Orchestration",
    "title": "Masterclass : AutoGen ConversableAgent | Multi-Agent Chat, Termination, Summary, État",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Masterclass : AutoGen ConversableAgent | Multi-Agent Chat, Termination, Summary, État. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Cours Complet - The $0 AI Architecture Stack (2026).pdf",
    "category": "Fondations LLM",
    "title": "Cours complet   the $0 ai architecture stack",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours complet   the $0 ai architecture stack. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Cours Débutant _ Construire un Agent IA de Recherche Approfondie avec LangGraph.pdf",
    "category": "Agents & Orchestration",
    "title": "Cours débutant   construire un agent ia de recherche approfondie avec langgraph",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours débutant   construire un agent ia de recherche approfondie avec langgraph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Cours Grand Débutant - Architecture Transformer.pdf",
    "category": "Fondations LLM",
    "title": "Cours grand débutant   architecture transformer",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours grand débutant   architecture transformer. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Cours Grand Débutant - Le CRAG Corrective Retrieval-Augmented Generation.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours grand débutant   le crag corrective retrieval augmented generation",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours grand débutant   le crag corrective retrieval augmented generation. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Cours Illustré _ Architecture et Plomberie MCP.pdf",
    "category": "Agents & Orchestration",
    "title": "Cours illustré   architecture et plomberie mcp",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours illustré   architecture et plomberie mcp. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Cours N°2 — Les Trois Âges du RAG.md",
    "category": "RAG & Pipeline",
    "title": "Cours n°2 — les trois âges du rag",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours n°2 — les trois âges du rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Cours RAG Multimodal_ Distinction des Architectures et Cas d'Usage.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours rag multimodal  distinction des architectures et cas d'usage",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours rag multimodal  distinction des architectures et cas d'usage. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Cours illustré v5 - Les 5 familles d architectures RAG.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours illustré v5   les 5 familles d architectures rag",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours illustré v5   les 5 familles d architectures rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Cours_Architecture_RAG_Agentique.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours architecture rag agentique",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours architecture rag agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Cours_Architecture_et_Feuille_de_Route_Agentique.pdf",
    "category": "Agents & Orchestration",
    "title": "Cours architecture et feuille de route agentique",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours architecture et feuille de route agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Cours_Connaissance_Persistante.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours connaissance persistante",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours connaissance persistante. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "De Zéro à l'Architecture IA Complète.html",
    "category": "Architecture & Production",
    "title": "Masterclass : L'Écosystème IA Complet | LLM, RAG, LangChain, LangGraph, MCP",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Masterclass : L'Écosystème IA Complet | LLM, RAG, LangChain, LangGraph, MCP. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "Devenir_AI_Engineer_Feuille_de_Route.pdf",
    "category": "Fondations LLM",
    "title": "Devenir ai engineer feuille de route",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Devenir ai engineer feuille de route. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Feuille de Route IA.pdf",
    "category": "RAG & Pipeline",
    "title": "Feuille de route ia",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Feuille de route ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Feuille de Route de Formation - Devenir AI Engineer.pdf",
    "category": "Fondations LLM",
    "title": "Feuille de route de formation   devenir ai engineer",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Feuille de route de formation   devenir ai engineer. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Feuille de Route — Devenir Ingénieur IA (2026).md",
    "category": "Fondations LLM",
    "title": "Feuille de route — devenir ingénieur ia",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Feuille de route — devenir ingénieur ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Guide Complet - Implémenter l'IA Agentique en 7 Étapes.pdf",
    "category": "Agents & Orchestration",
    "title": "Guide complet   implémenter l'ia agentique en 7 étapes",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Guide complet   implémenter l'ia agentique en 7 étapes. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Guide Complet pour Débutant - Construire un Agent IA de Recherche Approfondie avec LangGraph.pdf",
    "category": "Agents & Orchestration",
    "title": "Guide complet pour débutant   construire un agent ia de recherche approfondie avec langgraph",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Guide complet pour débutant   construire un agent ia de recherche approfondie avec langgraph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Guide des concepts de systèmes d IA.jpg",
    "category": "RAG & Pipeline",
    "title": "Guide des concepts de systèmes d ia",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Guide des concepts de systèmes d ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Harnais d'Agent - Plan de Contrôle d'Exécution.pdf",
    "category": "Agents & Orchestration",
    "title": "Harnais d'agent   plan de contrôle d'exécution",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Harnais d'agent   plan de contrôle d'exécution. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Harness Engineering .html",
    "category": "Agents & Orchestration",
    "title": "Masterclass Premium : Harness Engineering | Prompt, Context, Loops, Agents",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Masterclass Premium : Harness Engineering | Prompt, Context, Loops, Agents. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "La Connaissance Persistante - Architecture de la mémoire des systèmes IA.pdf",
    "category": "RAG & Pipeline",
    "title": "La connaissance persistante   architecture de la mémoire des systèmes ia",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : La connaissance persistante   architecture de la mémoire des systèmes ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Le Graphe de Connaissances de l IA Agentique - Manuel Technique.pdf",
    "category": "RAG & Pipeline",
    "title": "Le graphe de connaissances de l ia agentique   manuel technique",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Le graphe de connaissances de l ia agentique   manuel technique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Le Graphe de Connaissances de l'IA Agentique.pdf",
    "category": "RAG & Pipeline",
    "title": "Le graphe de connaissances de l'ia agentique",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Le graphe de connaissances de l'ia agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Le Guide Ultime du Prompting.html",
    "category": "Fondations LLM",
    "title": "Guide Ultime du Prompting en 2025",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Guide Ultime du Prompting en 2025. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Le Schéma en 7 Étapes pour Implémenter l IA Agentique.pdf",
    "category": "Agents & Orchestration",
    "title": "Le schéma en 7 étapes pour implémenter l ia agentique",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Le schéma en 7 étapes pour implémenter l ia agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Les fondamentaux du logiciel.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Les fondamentaux du logiciel à l'ère IA | Specs-to-code, grill-me, TDD, modules profonds",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Les fondamentaux du logiciel à l'ère IA | Specs-to-code, grill-me, TDD, modules profonds. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Maîtriser l Ingénierie IA - Chip Huyen.txt",
    "category": "RAG & Pipeline",
    "title": "Maîtriser l ingénierie ia   chip huyen",
    "format": "TXT",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Maîtriser l ingénierie ia   chip huyen. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Mother of AI — Curator arXiv — Architecture & Feuille de Route Agentique.md",
    "category": "Agents & Orchestration",
    "title": "Mother of ai — curator arxiv — architecture & feuille de route agentique",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Mother of ai — curator arxiv — architecture & feuille de route agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Optimisation_Inference_LLM.html",
    "category": "Fondations LLM",
    "title": "Optimisation de l'inférence LLM — Fiche technique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Optimisation de l'inférence LLM — Fiche technique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Parcours personnalisé — Tuteur scolastique IA — 6 semaines.txt",
    "category": "RAG & Pipeline",
    "title": "Parcours personnalisé — tuteur scolastique ia — 6 semaines",
    "format": "TXT",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Parcours personnalisé — tuteur scolastique ia — 6 semaines. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Personas Synthétiques.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif : Personas synthétiques – Prédire les humains comme la météo",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif : Personas synthétiques – Prédire les humains comme la météo. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Prompt Engineering Full Course.html",
    "category": "Fondations LLM",
    "title": "🎯 Cours de Prompt Engineering — Maîtrisez l'IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : 🎯 Cours de Prompt Engineering — Maîtrisez l'IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "RAG Multimodal — Deux architectures.pdf",
    "category": "RAG & Pipeline",
    "title": "Rag multimodal — deux architectures",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Rag multimodal — deux architectures. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "RAG from Scratch .html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : RAG from Scratch | Indexing, Retrieval, Generation, CRAG, LangGraph",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : RAG from Scratch | Indexing, Retrieval, Generation, CRAG, LangGraph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "RAG_Multimodal_Deux_Architectures.pptx",
    "category": "RAG & Pipeline",
    "title": "Rag multimodal deux architectures",
    "format": "PPTX",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Rag multimodal deux architectures. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "README.md",
    "category": "RAG & Pipeline",
    "title": "Readme",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Readme. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "Slim_Attention_Explique_Simplement.pptx",
    "category": "Fondations LLM",
    "title": "Slim attention explique simplement",
    "format": "PPTX",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Slim attention explique simplement. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "Stack de l agent IA.jpg",
    "category": "Agents & Orchestration",
    "title": "Stack de l agent ia",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Stack de l agent ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "Sécurité des systèmes IA.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Sécurité des Systèmes IA | Prompt Injection, Blast Radius, Lethal Trifecta",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Sécurité des Systèmes IA | Prompt Injection, Blast Radius, Lethal Trifecta. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "agent-ia-blueprint.html",
    "category": "Agents & Orchestration",
    "title": "Comment construire un agent d'IA — schéma interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Comment construire un agent d'IA — schéma interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "ai_agentics.jpeg",
    "category": "Agents & Orchestration",
    "title": "Ai agentics",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Ai agentics. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "ai_master.html",
    "category": "RAG & Pipeline",
    "title": "AI Power User Masterclass — Cours interactif animé",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : AI Power User Masterclass — Cours interactif animé. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "aiarchi.jpg",
    "category": "RAG & Pipeline",
    "title": "Aiarchi",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Aiarchi. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "aiarchi_master.jpeg",
    "category": "RAG & Pipeline",
    "title": "Aiarchi master",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Aiarchi master. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "aifactory.jpg",
    "category": "RAG & Pipeline",
    "title": "Aifactory",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Aifactory. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "amnésie du LLM.html",
    "category": "Fondations LLM",
    "title": "Masterclass : Mémoire des Agents IA | SQLite, Vector DB, mem0, Zep, LangMem",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Masterclass : Mémoire des Agents IA | SQLite, Vector DB, mem0, Zep, LangMem. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "apercu_rag.jpeg",
    "category": "RAG & Pipeline",
    "title": "Apercu rag",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Apercu rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "archi_des_agents_ia.jpg",
    "category": "Agents & Orchestration",
    "title": "Archi des agents ia",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Archi des agents ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "architecture-rag-production (1).html",
    "category": "RAG & Pipeline",
    "title": "Architecture RAG de Qualité Production",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Architecture RAG de Qualité Production. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "architecture_7_couches.html",
    "category": "Architecture & Production",
    "title": "Les 7 Couches du Génie des Systèmes d'IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Les 7 Couches du Génie des Systèmes d'IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "architecture_des_agents_ia.html",
    "category": "Agents & Orchestration",
    "title": "Architecture des Agents IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Architecture des Agents IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "architecture_ia_agentique.html",
    "category": "Agents & Orchestration",
    "title": "Architecture de l'IA : Agentique vs Non-Agentique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Architecture de l'IA : Agentique vs Non-Agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "architecture_ia_en_production.html",
    "category": "Architecture & Production",
    "title": "Architecture de l'IA en production",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Architecture de l'IA en production. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "architecture_rag_interactive_et_dynamique.html",
    "category": "RAG & Pipeline",
    "title": "Architecture RAG Efficace — Schéma interactif & Simulation en direct",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Architecture RAG Efficace — Schéma interactif & Simulation en direct. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "base_de_donnéesçvectorielles.jpeg",
    "category": "RAG & Pipeline",
    "title": "Base de donnéesçvectorielles",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Base de donnéesçvectorielles. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "bases-vectorielles.html",
    "category": "RAG & Pipeline",
    "title": "Bases de données vectorielles — cours en 9 modules",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Bases de données vectorielles — cours en 9 modules. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "blueprint.jpg",
    "category": "Agents & Orchestration",
    "title": "Blueprint",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Blueprint. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "chat-Ingénierie AI en production.txt",
    "category": "Architecture & Production",
    "title": "Chat ingénierie ai en production",
    "format": "TXT",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Chat ingénierie ai en production. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "chat-Ingénierie AI en production2.txt",
    "category": "Architecture & Production",
    "title": "Chat ingénierie ai en production2",
    "format": "TXT",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Chat ingénierie ai en production2. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "choix ai agent.html",
    "category": "Agents & Orchestration",
    "title": "Les Design Patterns des Agents IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Les Design Patterns des Agents IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "coding agent from scratch.html",
    "category": "Agents & Orchestration",
    "title": "Masterclass : Coding Agent from Scratch | Harness, Tools, Skills, Sandbox, Compaction, Subagents",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Masterclass : Coding Agent from Scratch | Harness, Tools, Skills, Sandbox, Compaction, Subagents. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "comment l ia apprend.jpeg",
    "category": "RAG & Pipeline",
    "title": "Comment l ia apprend",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Comment l ia apprend. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "connaissance_persiatante.html",
    "category": "RAG & Pipeline",
    "title": "Cours — La Connaissance Persistante (v2 enrichie)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours — La Connaissance Persistante (v2 enrichie). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "construire un agent de recherche.html",
    "category": "Agents & Orchestration",
    "title": "Atelier Premium : Agent de Recherche LangGraph | State, Nodes, Edges, Human-in-the-loop, Send API",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Atelier Premium : Agent de Recherche LangGraph | State, Nodes, Edges, Human-in-the-loop, Send API. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "construire_son_agent_en_10mins.jpeg",
    "category": "Agents & Orchestration",
    "title": "Construire son agent en 10mins",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Construire son agent en 10mins. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "controles-securite-agent-ia.html",
    "category": "Agents & Orchestration",
    "title": "12 contrôles de sécurité pour agents IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : 12 contrôles de sécurité pour agents IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "contrôle_de$secu.jpeg",
    "category": "RAG & Pipeline",
    "title": "Contrôle de$secu",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Contrôle de$secu. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours en accès libre .pdf",
    "category": "RAG & Pipeline",
    "title": "Cours en accès libre",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours en accès libre. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-agent-harness-engineering.html",
    "category": "Agents & Orchestration",
    "title": "Cours Interactif : Agent Harness Engineering",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours Interactif : Agent Harness Engineering. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours-ai-engineer.html",
    "category": "RAG & Pipeline",
    "title": "Devenir Ingénieur IA — Cours interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Devenir Ingénieur IA — Cours interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-architectures-rag-v2.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours architectures rag v2",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours architectures rag v2. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-5-familles-rag.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — Les 5 familles d’architectures RAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — Les 5 familles d’architectures RAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-7-couches-genie-ia.html",
    "category": "Architecture & Production",
    "title": "Les 7 couches du génie des systèmes d’IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Les 7 couches du génie des systèmes d’IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "cours-interactif-7-etapes-ia-agentique.html",
    "category": "Agents & Orchestration",
    "title": "Les 7 étapes pour implémenter l’IA agentique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Les 7 étapes pour implémenter l’IA agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours-interactif-9-techniques-ia-moderne.html",
    "category": "RAG & Pipeline",
    "title": "9 techniques clés pour maîtriser l’IA moderne",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : 9 techniques clés pour maîtriser l’IA moderne. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-ai-engineering-blueprint.html",
    "category": "Agents & Orchestration",
    "title": "L’ingénierie de l’IA en 10 compétences",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : L’ingénierie de l’IA en 10 compétences. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours-interactif-architecture-ia-zero-cost.html",
    "category": "Architecture & Production",
    "title": "Architecture IA à coût initial nul",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Architecture IA à coût initial nul. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "cours-interactif-architecture-rag-agentique.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — Architecture RAG Agentique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — Architecture RAG Agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-architecture-transformer.html",
    "category": "Fondations LLM",
    "title": "Cours interactif — Architecture Transformer",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours interactif — Architecture Transformer. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours-interactif-connaissance-persistante.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — La Connaissance Persistante",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — La Connaissance Persistante. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-crag-debutant.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — Le CRAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — Le CRAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-deep-research-langgraph.html",
    "category": "Agents & Orchestration",
    "title": "Cours interactif — Deep Research avec LangGraph",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours interactif — Deep Research avec LangGraph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours-interactif-devenir-ai-engineer.html",
    "category": "Fondations LLM",
    "title": "Cours interactif — Devenir AI Engineer",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours interactif — Devenir AI Engineer. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours-interactif-graphe-ia-agentique.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — Le Graphe de Connaissances de l’IA Agentique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — Le Graphe de Connaissances de l’IA Agentique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-guide-concepts-systemes-ia.html",
    "category": "RAG & Pipeline",
    "title": "Guide des concepts de systèmes d’IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Guide des concepts de systèmes d’IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-maitriser-ingenierie-ia.html",
    "category": "RAG & Pipeline",
    "title": "Maîtriser l'Ingénierie IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Maîtriser l'Ingénierie IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-mother-ai-curator (1).html",
    "category": "Fondations LLM",
    "title": "Mother of AI — Curator arXiv",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Mother of AI — Curator arXiv. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours-interactif-parcours-tuteur-6-semaines.html",
    "category": "RAG & Pipeline",
    "title": "Parcours personnalisé — Tuteur scolastique IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Parcours personnalisé — Tuteur scolastique IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-pile-usine-ia.html",
    "category": "Architecture & Production",
    "title": "La pile de l’usine d’IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : La pile de l’usine d’IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "cours-interactif-rag-data-streaming.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — RAG temps réel avec Data Streaming",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — RAG temps réel avec Data Streaming. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-rag-multimodal-deux-architectures.html",
    "category": "RAG & Pipeline",
    "title": "RAG Multimodal — Deux architectures",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : RAG Multimodal — Deux architectures. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-rag-multimodal.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif — RAG Multimodal",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif — RAG Multimodal. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-roadmap-ai-engineer-2026 (2).html",
    "category": "Fondations LLM",
    "title": "Roadmap AI Engineer 2026",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Roadmap AI Engineer 2026. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours-interactif-stack-agent-ia.html",
    "category": "Agents & Orchestration",
    "title": "Stack de l’agent IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Stack de l’agent IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours-interactif-trois-ages-rag.html",
    "category": "RAG & Pipeline",
    "title": "Les Trois Âges du RAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Les Trois Âges du RAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-interactif-zero-ai-stack.html",
    "category": "Fondations LLM",
    "title": "Cours interactif — The $0 AI Architecture Stack",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours interactif — The $0 AI Architecture Stack. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours-rag-agentique.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Maîtriser le RAG Agentique (n8n + Supabase)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Maîtriser le RAG Agentique (n8n + Supabase). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours-rag-production-avancee.md",
    "category": "RAG & Pipeline",
    "title": "Cours rag production avancee",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours rag production avancee. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours_agent_harness.html",
    "category": "Agents & Orchestration",
    "title": "Conception et Évaluation d'un Harnais d'Agent",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Conception et Évaluation d'un Harnais d'Agent. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours_ai_factory_stack.pdf",
    "category": "Fondations LLM",
    "title": "Cours ai factory stack",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Cours ai factory stack. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours_architecture_ia_0euro.pdf",
    "category": "Architecture & Production",
    "title": "Cours architecture ia 0euro",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Cours architecture ia 0euro. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "cours_induction_competences_agents.pdf",
    "category": "Agents & Orchestration",
    "title": "Cours induction competences agents",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours induction competences agents. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours_interactif_ing_nierie_du_contexte.html",
    "category": "RAG & Pipeline",
    "title": "Cours Interactif : L'Ingénierie du Contexte (Context Engineering)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours Interactif : L'Ingénierie du Contexte (Context Engineering). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours_interactif_rag_vs_hyde.html",
    "category": "RAG & Pipeline",
    "title": "Comprendre RAG vs HyDE - Cours Interactif & Simulateur Vectoriel",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Comprendre RAG vs HyDE - Cours Interactif & Simulateur Vectoriel. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours_karpathy.html",
    "category": "Fondations LLM",
    "title": "Software 1.0 → 2.0 → 3.0 — L'ascension des Transformers",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Software 1.0 → 2.0 → 3.0 — L'ascension des Transformers. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "cours_loops.html",
    "category": "Agents & Orchestration",
    "title": "Cours : Maîtriser les Loops (Boucles d'Agents Autonomes)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Cours : Maîtriser les Loops (Boucles d'Agents Autonomes). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "cours_rag_trois_ages.md",
    "category": "RAG & Pipeline",
    "title": "Cours rag trois ages",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours rag trois ages. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "cours_rag_trois_ages.pdf",
    "category": "RAG & Pipeline",
    "title": "Cours rag trois ages",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours rag trois ages. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "creer_une_api_rag_local.jpg",
    "category": "RAG & Pipeline",
    "title": "Creer une api rag local",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Creer une api rag local. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "de A à Z.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Fondamentaux de l'IA | ML, Deep Learning, Neurones, Transformers, GenAI",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Fondamentaux de l'IA | ML, Deep Learning, Neurones, Transformers, GenAI. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "de_ crabd _au rag.html",
    "category": "RAG & Pipeline",
    "title": "De Crab D aux graphes — Mémoire des agents IA et GraphRAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : De Crab D aux graphes — Mémoire des agents IA et GraphRAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "debloquer_les_halus.jpeg",
    "category": "RAG & Pipeline",
    "title": "Debloquer les halus",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Debloquer les halus. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "dev_rag.jpg",
    "category": "RAG & Pipeline",
    "title": "Dev rag",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Dev rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "differents_rag.jpeg",
    "category": "RAG & Pipeline",
    "title": "Differents rag",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Differents rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "docker vs vm.jpeg",
    "category": "RAG & Pipeline",
    "title": "Docker vs vm",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Docker vs vm. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "du prototype au système fiable.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : AI Agents Complets | ReAct, Tools, Planning, Multi-Agents, Evals, Production, Sécurité",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : AI Agents Complets | ReAct, Tools, Planning, Multi-Agents, Evals, Production, Sécurité. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "extraction.jpeg",
    "category": "RAG & Pipeline",
    "title": "Extraction",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Extraction. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "feuill_de_route_pour_ai.jpeg",
    "category": "RAG & Pipeline",
    "title": "Feuill de route pour ai",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Feuill de route pour ai. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "feuille-de-route-ai-engineer-2026.md",
    "category": "RAG & Pipeline",
    "title": "Feuille de route ai engineer 2026",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Feuille de route ai engineer 2026. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "feuille_de_route_pour_ai.jpg",
    "category": "RAG & Pipeline",
    "title": "Feuille de route pour ai",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Feuille de route pour ai. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "finetuning local.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass : Fine-Tuning LLM Local avec Unsloth Studio",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass : Fine-Tuning LLM Local avec Unsloth Studio. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "finetuning.jpeg",
    "category": "RAG & Pipeline",
    "title": "Finetuning",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Finetuning. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "gens apprennent Python mal.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Apprendre Python pour l’IA | Fondations, Projets, IA Collaborative, Jugement",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Apprendre Python pour l’IA | Fondations, Projets, IA Collaborative, Jugement. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "graph_engeneering.html",
    "category": "RAG & Pipeline",
    "title": "Graph Engineering · Concevoir des workflows IA fiables",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Graph Engineering · Concevoir des workflows IA fiables. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "graphe-ia-agenti.jpeg",
    "category": "RAG & Pipeline",
    "title": "Graphe ia agenti",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Graphe ia agenti. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "graphrag-cours.html",
    "category": "RAG & Pipeline",
    "title": "GraphRAG en Python — Cours interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : GraphRAG en Python — Cours interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "guide_des_concepts_de_systemes_ia.jpg",
    "category": "RAG & Pipeline",
    "title": "Guide des concepts de systemes ia",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Guide des concepts de systemes ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "guide_rag_architectures.pdf",
    "category": "RAG & Pipeline",
    "title": "Guide rag architectures",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Guide rag architectures. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "ingenieurerie de contexte.html",
    "category": "RAG & Pipeline",
    "title": "L'ingénierie de contexte expliquée",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : L'ingénierie de contexte expliquée. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "interactive_knowledge_graph (1).html",
    "category": "RAG & Pipeline",
    "title": "Architecture Agent IA - Graphe de Connaissances",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Architecture Agent IA - Graphe de Connaissances. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "intro au prompt engeneering.html",
    "category": "Fondations LLM",
    "title": "🎯 Cours Magistral & Interactif — Prompt Engineering",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : 🎯 Cours Magistral & Interactif — Prompt Engineering. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "knowledge graph.jpg",
    "category": "RAG & Pipeline",
    "title": "Knowledge graph",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Knowledge graph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "langgraph-agent (1).html",
    "category": "Agents & Orchestration",
    "title": "Construire un Agent d'IA de Recherche Approfondie avec LangGraph",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Construire un Agent d'IA de Recherche Approfondie avec LangGraph. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "llm_tool_use_training (1).html",
    "category": "Fondations LLM",
    "title": "Entraîner un LLM à utiliser des outils — Schéma interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Entraîner un LLM à utiliser des outils — Schéma interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "loop_engeneering.html",
    "category": "Agents & Orchestration",
    "title": "Le Loop Engineering · Cours Interactif Illustré",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Le Loop Engineering · Cours Interactif Illustré. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "loop_enger.jpg",
    "category": "Agents & Orchestration",
    "title": "Loop enger",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Loop enger. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "maitriser_ai_agent.jpeg",
    "category": "Agents & Orchestration",
    "title": "Maitriser ai agent",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Maitriser ai agent. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "mcp.jpeg",
    "category": "Agents & Orchestration",
    "title": "Mcp",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Mcp. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "mcp2.jpeg",
    "category": "Agents & Orchestration",
    "title": "Mcp2",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Mcp2. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "metrique d eval rag.jpeg",
    "category": "RAG & Pipeline",
    "title": "Metrique d eval rag",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Metrique d eval rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "mother-of-ai-architecture.md",
    "category": "Architecture & Production",
    "title": "Mother of ai architecture",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Mother of ai architecture. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "mother_of_ai_project.pdf",
    "category": "RAG & Pipeline",
    "title": "Mother of ai project",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Mother of ai project. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "mozilla.pdf",
    "category": "RAG & Pipeline",
    "title": "Mozilla",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Mozilla. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "opti.jpeg",
    "category": "Architecture & Production",
    "title": "Opti",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Opti. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "opti_inference.html",
    "category": "Architecture & Production",
    "title": "Optimiser l'inférence des LLM — Fiche technique interactive",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Optimiser l'inférence des LLM — Fiche technique interactive. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "output.pdf",
    "category": "RAG & Pipeline",
    "title": "Output",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Output. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "panorama-frameworks-agentiques.html",
    "category": "Agents & Orchestration",
    "title": "Panorama des frameworks agentiques",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Panorama des frameworks agentiques. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "patterns_agentiques_cours.pdf",
    "category": "Agents & Orchestration",
    "title": "Patterns agentiques cours",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Patterns agentiques cours. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "pensee-systemique (1).html",
    "category": "RAG & Pipeline",
    "title": "Voir le système avant d'agir — Cours de pensée systémique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Voir le système avant d'agir — Cours de pensée systémique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "penser_harness.html",
    "category": "Agents & Orchestration",
    "title": "Harness Engineering & Programmation Stratégique · Cours Interactif",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Harness Engineering & Programmation Stratégique · Cours Interactif. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "pile-ingenierie-ia.html",
    "category": "Architecture & Production",
    "title": "La pile d'ingénierie IA — cours en 10 modules",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : La pile d'ingénierie IA — cours en 10 modules. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "pile_archi_ia.jpeg",
    "category": "Architecture & Production",
    "title": "Pile archi ia",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Architecture & Production : Pile archi ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par couche d'architecture / composant de production (400-700 tokens)."
  },
  {
    "filename": "pile_systeme_rag.jpg",
    "category": "RAG & Pipeline",
    "title": "Pile systeme rag",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Pile systeme rag. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "pipeline_complet.jpeg",
    "category": "RAG & Pipeline",
    "title": "Pipeline complet",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Pipeline complet. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "pipeline_llm.jpeg",
    "category": "Fondations LLM",
    "title": "Pipeline llm",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Pipeline llm. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "plan-semaine-1-tuteur-ia.md",
    "category": "RAG & Pipeline",
    "title": "Plan semaine 1 tuteur ia",
    "format": "MD",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Plan semaine 1 tuteur ia. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "projet_ia_generative_parfait.pdf",
    "category": "RAG & Pipeline",
    "title": "Projet ia generative parfait",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Projet ia generative parfait. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag-archi-fr.html",
    "category": "RAG & Pipeline",
    "title": "Le RAG n'est pas une seule architecture",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Le RAG n'est pas une seule architecture. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag-metrics.html",
    "category": "RAG & Pipeline",
    "title": "Métriques d'Évaluation de RAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Métriques d'Évaluation de RAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag-pipeline-refondu.html",
    "category": "RAG & Pipeline",
    "title": "RAG Blueprint — Architecture Python",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : RAG Blueprint — Architecture Python. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag-recuperation-avancee.html",
    "category": "RAG & Pipeline",
    "title": "Récupération RAG avancée",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Récupération RAG avancée. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag-vs-search.html",
    "category": "RAG & Pipeline",
    "title": "Recherche Traditionnelle → RAG",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Recherche Traditionnelle → RAG. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "rag_syst.html",
    "category": "RAG & Pipeline",
    "title": "Cours illustré v5 : les 5 familles d'architectures RAG — fil rouge Léa",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours illustré v5 : les 5 familles d'architectures RAG — fil rouge Léa. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "ragnaiveetadvanced.jpeg",
    "category": "RAG & Pipeline",
    "title": "Ragnaiveetadvanced",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Ragnaiveetadvanced. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "ragvsfinetuning.jpg",
    "category": "RAG & Pipeline",
    "title": "Ragvsfinetuning",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Ragvsfinetuning. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "s41598-025-97652-6.pdf",
    "category": "RAG & Pipeline",
    "title": "S41598 025 97652 6",
    "format": "PDF",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : S41598 025 97652 6. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "second_brain.html",
    "category": "RAG & Pipeline",
    "title": "Cours interactif : Construire un Second Brain avec Obsidian + IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Cours interactif : Construire un Second Brain avec Obsidian + IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "securité des ia et prompt.jpeg",
    "category": "Fondations LLM",
    "title": "Securité des ia et prompt",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Securité des ia et prompt. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "solutions IA locales.html",
    "category": "RAG & Pipeline",
    "title": "Masterclass Premium : Ollama | LLMs Locaux, RAG & Agents IA",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Masterclass Premium : Ollama | LLMs Locaux, RAG & Agents IA. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "sonnaissancve_persistante.jpeg",
    "category": "RAG & Pipeline",
    "title": "Sonnaissancve persistante",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Sonnaissancve persistante. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "strat_chunking.jpeg",
    "category": "RAG & Pipeline",
    "title": "Strat chunking",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Strat chunking. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "strategies_chunkage.jpeg",
    "category": "RAG & Pipeline",
    "title": "Strategies chunkage",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Strategies chunkage. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "support_de_cours_ia_complet.html",
    "category": "RAG & Pipeline",
    "title": "Support de Cours — Ingénierie de l'IA | Les 10 compétences (v2)",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document RAG & Pipeline : Support de Cours — Ingénierie de l'IA | Les 10 compétences (v2). Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking sémantique par étape de pipeline (300-600 tokens), découpe aux sous-titres."
  },
  {
    "filename": "teckstack ia opensources.jpeg",
    "category": "Fondations LLM",
    "title": "Teckstack ia opensources",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Teckstack ia opensources. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "transformer_universael.jpeg",
    "category": "Fondations LLM",
    "title": "Transformer universael",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Fondations LLM : Transformer universael. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par concept (architecture, attention, tokenisation) avec schémas (400-600 tokens)."
  },
  {
    "filename": "workflow-agent-corrige.html",
    "category": "Agents & Orchestration",
    "title": "Workflow d'Agent IA — Plan technique",
    "format": "HTML",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Workflow d'Agent IA — Plan technique. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "workflow.jpg",
    "category": "Agents & Orchestration",
    "title": "Workflow",
    "format": "JPG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Workflow. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  },
  {
    "filename": "workflow_agent.jpeg",
    "category": "Agents & Orchestration",
    "title": "Workflow agent",
    "format": "JPEG",
    "importance": "Moyenne",
    "description": "Document Agents & Orchestration : Workflow agent. Source pour chunking sémantique et indexation vectorielle (ChromaDB).",
    "chunkingStrategy": "Chunking par nœud de graphe / pattern agentique (400-800 tokens)."
  }
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    "terme": "Terminal / Console",
    "definition": "Fenêtre en mode texte où tu tapes des ordres directement au système d'exploitation."
  },
  {
    "terme": "Dossier / Répertoire",
    "definition": "Boîte virtuelle sur ton disque dur permettant d'organiser et de ranger des fichiers."
  },
  {
    "terme": "Chemin absolu vs relatif",
    "definition": "Chemin absolu part de la racine (/), relatif part de l'endroit où tu te trouves actuellement."
  },
  {
    "terme": "Git",
    "definition": "Logiciel de gestion de version qui enregistre des photos (commits) de tes fichiers au fil du temps."
  },
  {
    "terme": "Commit",
    "definition": "Enregistrement daté et décrit d'un ensemble de modifications dans Git."
  },
  {
    "terme": "Dépôt (Repository)",
    "definition": "Dossier contenant le projet et son historique Git complet (dossier caché .git)."
  },
  {
    "terme": "Environnement Virtuel (venv)",
    "definition": "Bulle isolée contenant sa propre version de Python et ses bibliothèques sans toucher au système."
  },
  {
    "terme": "Pip",
    "definition": "Gestionnaire de paquets officiel de Python permettant d'installer des bibliothèques externes."
  },
  {
    "terme": "Variable",
    "definition": "Boîte étiquetée en mémoire qui stocke une valeur (chiffre, texte, liste)."
  },
  {
    "terme": "Fonction",
    "definition": "Bloc de code réutilisable effectuant une tâche précise avec des entrées (arguments) et une sortie (return)."
  },
  {
    "terme": "API (Interface de Programmation)",
    "definition": "Passerelle permettant à deux programmes (ex: ton script et Ollama) de communiquer via requêtes HTTP."
  },
  {
    "terme": "LLM (Large Language Model)",
    "definition": "Modèle d'intelligence artificielle entraîné à prédire et générer du texte fluide."
  },
  {
    "terme": "Ollama",
    "definition": "Outil permettant de télécharger et d'exécuter des modèles de langage localement sur ta machine."
  },
  {
    "terme": "Streaming",
    "definition": "Réception progressive du texte généré mot par mot, au lieu d'attendre la réponse entière."
  },
  {
    "terme": "RAG (Retrieval-Augmented Generation)",
    "definition": "Technique reliant un LLM à une base de données de documents pour lui fournir des faits récents et exacts."
  }
];

export const SEMAINE_2_PLAN = [
  {
    day: "Jour 1",
    title: "Environnement Vectoriel & Modèle d'Embeddings",
    goal: "Installer le store vectoriel local et télécharger le modèle d'embedding dans Ollama",
    tasks: [
      "Installer chromadb ou qdrant-client dans le venv : pip install chromadb",
      "Télécharger le modèle d'embedding local : ollama pull nomic-embed-text (ou bge-m3)",
      "Créer le script test_embedding.py pour générer et vérifier les dimensions vectorielles (ex: 768 dims)"
    ]
  },
  {
    day: "Jour 2",
    title: "Ingestion & Chunker Sémantique (chunker.py)",
    goal: "Parser les 31 documents (HTML, PDF, TXT) et découper en chunks homogènes avec métadonnées",
    tasks: [
      "Installer BeautifulSoup4 et pypdf : pip install beautifulsoup4 pypdf",
      "Écrire chunker.py avec taille cible de 600 tokens et 100 tokens de chevauchement (overlap)",
      "Attacher les métadonnées (titre, catégorie, type de document, mots-clés) à chaque chunk"
    ]
  },
  {
    day: "Jour 3",
    title: "Indexation & Base Vectorielle Locale",
    goal: "Vectoriser l'intégralité du corpus et alimenter la collection vectorielle",
    tasks: [
      "Créer la collection Chroma 'tuteur_knowledge'",
      "Batcher les embeddings via l'API Ollama (http://localhost:11434/api/embeddings)",
      "Sauvegarder la base de données persistante dans le dossier ./chroma_db"
    ]
  },
  {
    day: "Jour 4",
    title: "Recherche Sémantique & Évaluation du Recall",
    goal: "Tester les requêtes similaires et vérifier la pertinence des chunks remontés (Top-k = 3)",
    tasks: [
      "Créer test_query.py avec calcul de distance cosinus",
      "Benchmarker les résultats sur 5 questions types de cours",
      "Régler la pondération des métadonnées (priorité Haute pour les 8 fiches maîtresses)"
    ]
  },
  {
    day: "Jour 5",
    title: "Prompt Hybride & Intégration CLI (tuteur_rag.py)",
    goal: "Injecter dynamiquement le contexte documentaire dans le prompt envoyé à DeepSeek-R1",
    tasks: [
      "Implémenter la fonction assemble_rag_prompt(query, retrieved_chunks)",
      "Forcer la citation des sources exactes avec numéro de page ou nom de fichier",
      "Gérer le cas 'Je ne trouve pas l'information dans mon corpus scolaire' sans hallucination"
    ]
  }
];

export const PROJECT_OVERVIEW = {
  name: "Tuteur Scolastique IA",
  authorPath: "./tuteur-scolastique",
  osTarget: "Environnement Local / Cloud (Python & Docker)",
  coreRuntime: "Python 3 + venv + Ollama (Modèle local)",
  driveFolderId: "1vNyVTbzCxTNp2mFX-nT_2HZJDMbmikfN",
  driveFolderAdvancedId: "11gH0UjbJD3FiCrHX6INF39t-GiT3jQs0",
  driveFolderFoundationsId: "1vNyVTbzCxTNp2mFX-nT_2HZJDMbmikfN",
  currentMilestone: "Jalon 1 - Socle Local & Terminal (Semaine 1)",
  nextMilestone: "Jalon 2 - Découpage (Chunking) & Indexation RAG (Corpus Complet)",
  finalMilestone: "Jalon 3 - Tuteur Scolastique Agentique & Interface Pédagogique",
  stats: {
    totalDaysSemaine1: 7,
    totalPomodoros: 35,
    totalCommands: 225,
    totalDocumentsToChunk: 36,
    foundationsDocsCount: 31,
    advancedDocsCount: 5,
    glossaryTerms: 15
  }
};
