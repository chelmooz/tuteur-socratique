/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Sliders, 
  CheckCircle2, 
  Code2, 
  GraduationCap, 
  Bot, 
  User, 
  Loader2,
  Terminal,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/projectData';

export const AILabView: React.FC = () => {
  // Prompt Tester State
  const [userQuery, setUserQuery] = useState(
    'Je veux écrire une fonction Python qui lit un fichier JSON contenant les sessions du tuteur et affiche les 3 derniers messages.'
  );
  const [withCtx, setWithCtx] = useState(true);
  const [withCot, setWithCot] = useState(true);
  const [withRtoc, setWithRtoc] = useState(true);
  const [withPed, setWithPed] = useState(true);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptResult, setPromptResult] = useState<string | null>(null);

  // Chat Simulator State
  const [chatMode, setChatMode] = useState<'copilote_dev' | 'tuteur_eleve' | 'expert_rag'>('copilote_dev');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Bonjour ! Je suis le copilote du projet Tuteur Scolastique. Tu peux me poser des questions sur le code Python de chat.py, le dépannage d\'Ollama sous Linux, ou le découpage des 31 documents du corpus RAG.'
    }
  ]);

  const handleTestPrompt = async () => {
    setPromptLoading(true);
    setPromptResult(null);

    try {
      const res = await fetch('/api/ai/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery, withCtx, withCot, withRtoc, withPed })
      });
      const data = await res.json();
      if (res.ok) {
        setPromptResult(data.result);
      } else {
        // Intelligent fallback
        setPromptResult(
          `[Mode Démonstration - Activez GEMINI_API_KEY dans les paramètres pour la génération directe]\n\n` +
          `# 1) But :\nCréer une fonction réutilisable 'charger_derniers_messages(chemin_fichier, n=3)' pour extraire l'historique.\n\n` +
          `# 2) Étapes prévues :\n- Importer json\n- Ouvrir le fichier en mode lecture avec encodage utf-8\n- Récupérer la liste des messages et faire un slice [-n:]\n\n` +
          `# 3) Code Python expliqué pas-à-pas :\n` +
          `import json\n\n` +
          `def charger_derniers_messages(chemin_fichier: str, n: int = 3):\n` +
          `    # On ouvre le fichier de session en toute sécurité avec un bloc with\n` +
          `    try:\n` +
          `        with open(chemin_fichier, 'r', encoding='utf-8') as f:\n` +
          `            donnees = json.load(f)\n` +
          `            # On récupère la liste des messages (ou liste vide si absent)\n` +
          `            messages = donnees.get('messages', [])\n` +
          `            # Le slice [-n:] extrait les n derniers éléments de la liste\n` +
          `            return messages[-n:]\n` +
          `    except FileNotFoundError:\n` +
          `        print(f"Fichier {chemin_fichier} non trouvé.")\n` +
          `        return []\n`
        );
      }
    } catch (err) {
      setPromptResult("Erreur de connexion au serveur. Vérifiez votre connexion.");
    } finally {
      setPromptLoading(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    if (!customText) setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(-6).map((m) => ({ role: m.role, content: m.text })),
          mode: chatMode
        })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setMessages([...newMessages, { role: 'assistant', text: data.text }]);
      } else {
        // Contextual fallback response
        let fallback = "";
        if (chatMode === 'tuteur_eleve') {
          fallback = `Très bonne question ! Avant que je ne te donne la réponse directe, essayons de décomposer ensemble : d'après toi, quelle est la première chose que l'on doit vérifier lorsqu'on manipule une équation ou une liste en programmation ?`;
        } else if (chatMode === 'expert_rag') {
          fallback = `Pour ce document du corpus, je recommande un chunking sémantique de 600 tokens avec 100 tokens d'overlap. Les métadonnées clés à indexer sont : titre du module, niveau d'importance (CRAG/MCP) et balises concepts.`;
        } else {
          fallback = `Excellente approche. Dans le cadre de Jalon 1, assure-toi d'abord que le venv est actif avec 'which python' (doit pointer vers .venv/bin/python). Ensuite, utilise requests.post sur http://localhost:11434/api/generate avec stream=True.`;
        }
        setMessages([...newMessages, { role: 'assistant', text: fallback }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', text: "Erreur de communication avec le serveur." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const sampleQuestions = [
    "Comment configurer le streaming dans chat.py avec requests ?",
    "Quelle est la différence entre CRAG et RAG classique ?",
    "Explique-moi les 7 couches de l'architecture IA.",
    "Comment structurer le fichier sessions.json ?"
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Laboratoire IA : Testeur de Prompts & Simulateur Tuteur
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Expérimentez en direct le framework de prompt du projet (CTX + CoT + RTOC + PED) et échangez avec l'agent d'assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Module 1: Prompt Framework Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Testeur du Framework de Prompt (Les 4 Piliers)</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Activez/Désactivez les briques pour mesurer leur impact
          </span>
        </div>

        {/* 4 Pillars Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
            withCtx ? 'bg-indigo-950/20 border-indigo-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={withCtx}
              onChange={(e) => setWithCtx(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-0"
            />
            <div>
              <span className="text-xs font-bold block text-indigo-300">1. PROMPT_CTX</span>
              <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                Contexte débutant + dossier Linux exact
              </span>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
            withCot ? 'bg-cyan-950/20 border-cyan-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={withCot}
              onChange={(e) => setWithCot(e.target.checked)}
              className="mt-0.5 rounded text-cyan-600 focus:ring-0"
            />
            <div>
              <span className="text-xs font-bold block text-cyan-300">2. PROMPT_COT</span>
              <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                Raisonnement pas-à-pas (But, Étapes, Code)
              </span>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
            withRtoc ? 'bg-amber-950/20 border-amber-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={withRtoc}
              onChange={(e) => setWithRtoc(e.target.checked)}
              className="mt-0.5 rounded text-amber-600 focus:ring-0"
            />
            <div>
              <span className="text-xs font-bold block text-amber-300">3. PROMPT_RTOC</span>
              <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                Exécution unitaire, une commande à la fois
              </span>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
            withPed ? 'bg-emerald-950/20 border-emerald-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={withPed}
              onChange={(e) => setWithPed(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-0"
            />
            <div>
              <span className="text-xs font-bold block text-emerald-300">4. PROMPT_PED</span>
              <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                Explication en commentaire français simple
              </span>
            </div>
          </label>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-medium block">
            Votre consigne ou question au modèle :
          </label>
          <div className="flex gap-2">
            <textarea
              rows={3}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleTestPrompt}
              disabled={promptLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow"
            >
              {promptLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{promptLoading ? 'Génération en cours...' : 'Tester le prompt assemblé'}</span>
            </button>
          </div>
        </div>

        {/* Prompt Output */}
        {promptResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2 animate-fadeIn">
            <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Résultat produit par le modèle :</span>
            </span>
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {promptResult}
            </pre>
          </div>
        )}
      </div>

      {/* Module 2: Interactive Chat Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Simulateur Tuteur & Copilote Technique</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Discutez avec l'IA selon la posture désirée
            </p>
          </div>

          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setChatMode('copilote_dev')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                chatMode === 'copilote_dev' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Copilote Python / Linux
            </button>
            <button
              onClick={() => setChatMode('tuteur_eleve')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                chatMode === 'tuteur_eleve' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tuteur Scolaire (Socratique)
            </button>
            <button
              onClick={() => setChatMode('expert_rag')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                chatMode === 'expert_rag' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecte RAG
            </button>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Le tuteur réfléchit...</span>
            </div>
          )}
        </div>

        {/* Input field */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Posez une question technique ou pédagogique..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={chatLoading || !chatInput.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
