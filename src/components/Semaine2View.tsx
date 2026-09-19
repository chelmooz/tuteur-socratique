/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Terminal, 
  Database, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Cpu,
  Sparkles
} from 'lucide-react';

export const Semaine2View: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const daysPlan = [
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
      title: "Module de Retrieval & Recherche Sémantique (retriever.py)",
      goal: "Interroger la base vectorielle à partir de la question de l'élève et récupérer le Top-K",
      tasks: [
        "Écrire la fonction chercher_contexte(question, top_k=3)",
        "Appliquer un seuil de score de similarité cosinus (minimum 0.70)",
        "Tester la récupération sur 5 questions types du programme scolaire"
      ]
    },
    {
      day: "Jour 5",
      title: "Connexion du RAG à chat.py v2",
      goal: "Injecter dynamiquement les chunks récupérés dans le prompt système du Tuteur",
      tasks: [
        "Modifier chat.py pour appeler le retriever avant l'envoi à Ollama",
        "Concevoir le prompt d'augmentation : 'Voici les extraits de cours officiels : [...] Réponds à l'élève en te basant exclusivement sur ces faits.'",
        "Tester la disparition des hallucinations"
      ]
    },
    {
      day: "Jour 6",
      title: "Garde-fous & Corrective RAG (CRAG)",
      goal: "Vérifier la pertinence des chunks avant génération et bloquer les réponses hors-sujet",
      tasks: [
        "Intégrer le concept du document 'Cours Grand Débutant _ Le CRAG'",
        "Si pertinence insuffisante, demander à l'élève de reformuler plutôt que d'inventer",
        "Filtrer les tentatives d'injection de prompt ou de triche"
      ]
    },
    {
      day: "Jour 7",
      title: "Validation Jalon 2 & Rétrospective",
      goal: "Audit complet, benchmark de latence et documentation finale",
      tasks: [
        "Mesurer le temps de réponse moyen (Embedding + Retrieval + LLM Generation)",
        "Tester la persistance de la base vectorielle après redémarrage du service",
        "Documenter l'architecture dans docs/RAG-ARCHITECTURE.md et commiter dans Git"
      ]
    }
  ];

  const sampleChunkerCode = `# chunker.py - Exemple de pipeline de découpage pour le Jalon 2
from bs4 import BeautifulSoup
from pypdf import PdfReader
import json
import os

def decouper_texte(texte: str, taille_chunk: int = 600, overlap: int = 100):
    mots = texte.split()
    chunks = []
    i = 0
    while i < len(mots):
        chunk = " ".join(mots[i:i + taille_chunk])
        chunks.append(chunk)
        i += (taille_chunk - overlap)
    return chunks

def extraire_contenu_html(chemin: str) -> str:
    with open(chemin, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        # Retirer les balises non textuelles
        for s in soup(['script', 'style', 'nav']):
            s.decompose()
        return soup.get_text(separator=' ')
`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Feuille de Route</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Semaine 2 • Jalon 2
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Plan d'Action : Pipeline RAG & Découpage des 31 Documents
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Comment passer du socle local (chat.py) à un véritable Tuteur Scolastique augmenté par vos documents.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Days Plan for Jalon 2 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Programme Jour par Jour de la Semaine 2</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daysPlan.map((d, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    {d.day}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">5 Pomodoros</span>
                </div>
                <h4 className="text-sm font-bold text-white">{d.title}</h4>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Objectif : {d.goal}
                </p>

                <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800">
                  {d.tasks.map((t, tIdx) => (
                    <div key={tIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Starter Kit for Jalon 2 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Starter Script : Squelette chunker.py</h3>
          </div>
          <button
            onClick={() => handleCopy(sampleChunkerCode, 'chunker-code')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            {copiedKey === 'chunker-code' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le code</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          {sampleChunkerCode}
        </pre>
      </div>
    </div>
  );
};
