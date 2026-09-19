# Principes extraits du guide « création de cours à partir de transcript »

Le guide recommande de transformer un transcript brut en expérience d’apprentissage active, visuelle, interactive, mémorisable et applicable, plutôt qu’en simple résumé.

## Entrées
Le transcript est obligatoire. Sont optionnels : langue, public cible, niveau, ton, durée cible, objectif pédagogique, style visuel, contraintes techniques et éléments à mettre en avant.

## Sortie attendue
Un fichier HTML autonome, idéalement hors ligne, responsive, accessible et sans dépendance externe obligatoire. Il doit comporter au minimum : accueil, modules progressifs, navigation claire, illustrations SVG animées, quiz interactifs, templates/prompts copiables, barre de progression, score global et évaluation finale.

## Philosophie pédagogique
Chaque module doit répondre à : « Qu’est-ce que je dois comprendre ? », « À quoi cela ressemble-t-il visuellement ? » et « Comment l’utiliser concrètement ? ». Le flux visé est : information passive -> compréhension active -> pratique -> vérification -> application.

## Workflow explicite
1. Analyser le transcript : sujet central, promesse, problème, concepts, exemples, erreurs, workflows, actions et occasions de visualisation/interactivité.
2. Définir un objectif pédagogique formulé « À la fin de ce cours, l’apprenant sera capable de… ».
3. Structurer des modules progressifs : accueil/promesse, problème/contexte, concepts fondamentaux, workflow, erreurs, cas d’usage, atelier, évaluation finale, ressources/checklist/action.
4. Créer une illustration mentale par module : flux, boucle, comparaison, pipeline, hiérarchie, balance, timeline, carte mentale, architecture ou avant/après ; elle doit être simple, légèrement animée et porteuse de sens.
5. Ajouter l’interactivité : choix multiples avec feedback immédiat, navigation, progression, score, copie de prompts, templates réutilisables, checklist dynamique et générateur de prompts/atelier.
6. Ancrer chaque module dans la source : exemples, formulations, cas, erreurs, workflows et promesses du transcript ; ne pas inventer un cours générique.
7. Générer le HTML autonome.

## Application au guide RAG Confluent
Le PDF source est un document technique de 22 pages, structuré autour de l’introduction au RAG, des quatre étapes Stream/Connect/Process/Govern, de l’augmentation des données, de l’inférence, des workflows, du post-traitement et de trois architectures de référence. La fiche ajoutée au catalogue doit donc rester ancrée dans ces sections, proposer une progression conceptuelle vers la mise en œuvre et inclure des interactions de vérification.
