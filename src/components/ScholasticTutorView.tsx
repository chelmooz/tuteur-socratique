/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Send, 
  Sparkles, 
  Terminal, 
  BookOpen, 
  RotateCcw, 
  Copy, 
  Check, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Code2,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { DOCUMENTS_CATALOG, PROMPT_TEMPLATES } from '../data/projectData';
import { useGamification } from '../context/GamificationContext';
import { AnimatedMascot } from './AnimatedMascot';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundedDoc?: string;
}

interface ScholasticTutorViewProps {
  initialDocument?: string;
  onNavigateToDoc?: (filename: string) => void;
}

export const ScholasticTutorView: React.FC<ScholasticTutorViewProps> = ({ 
  initialDocument,
  onNavigateToDoc 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bienvenue dans votre **Tuteur Scolastique IA** ! 🎓

Je suis votre mentor pour vous former au métier d'**AI Engineer** à travers votre projet de tuteur et vos **36 documents de référence** (Corpus Socle + Spécialisation Avancée).

### Comment souhaitez-vous travailler aujourd'hui ?
- **Méthode Socratique** : Je ne vous donne pas la solution toute faite, je vous guide par le questionnement progressif pour vous aider à raisonner par vous-même.
- **Atelier de Code & Terminal** : Nous écrivons ensemble vos scripts (\`tuteur.py\`, \`chunker.py\`, \`test_embedding.py\`) avec la rigueur **RTOC** (Run, Test, Observe, Commit).
- **Interrogation du Corpus** : Posez-moi n'importe quelle question sur vos architectures (CRAG, GraphRAG, Multi-Agents, MCP, 7 couches, bases vectorielles, Ragas).

*Par quoi voulez-vous commencer ? Vous pouvez choisir une question suggérée ci-dessous ou poser directement la vôtre.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'tuteur_eleve' | 'expert_rag' | 'socratique' | 'code_review'>('socratique');
  const [selectedDoc, setSelectedDoc] = useState<string>(initialDocument || '');
  const [withCot, setWithCot] = useState(true);
  const [withRtoc, setWithRtoc] = useState(false);
  const [withPed, setWithPed] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addXp, unlockBadge, updateQuestProgress } = useGamification();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialDocument) {
      setSelectedDoc(initialDocument);
      setInput(`Peux-tu m'expliquer les concepts fondamentaux du document « ${initialDocument} » et comment les appliquer pour devenir AI Engineer ?`);
    }
  }, [initialDocument]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedDoc: selectedDoc || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build context enriched with guidelines and selected doc
      let contextualPrompt = query;
      if (selectedDoc) {
        contextualPrompt = `[DOCUMENT DU CORPUS SÉLECTIONNÉ : ${selectedDoc}]\n${contextualPrompt}`;
      }
      if (withCot) {
        contextualPrompt += `\n[Consigne CoT : raisonne étape par étape de manière socratique]`;
      }
      if (withRtoc) {
        contextualPrompt += `\n[Consigne RTOC : formule une commande bash ou test unitaire simple]`;
      }
      if (withPed) {
        contextualPrompt += `\n[Consigne Pédagogique : posture socratique bienveillante, ne donne pas la réponse finale, pose 1 question guidée]`;
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextualPrompt,
          mode: mode,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur serveur HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || "Désolé, aucune réponse n'a été retournée par le modèle.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedDoc: selectedDoc || undefined
      };

      setMessages(prev => [...prev, botMessage]);
      // Gamification rewards
      addXp(30, 'Échange Socratique validé (+30 XP)', 'quiz');
      unlockBadge('first_socratic_prompt');
      updateQuestProgress('quest_tutor', 1);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Erreur de communication avec le Tuteur IA** : ${error.message}\n\n*Assurez-vous que la clé GEMINI_API_KEY est configurée dans les paramètres de l'environnement.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: `Session réinitialisée. Prêt pour un nouveau sujet d'ingénierie IA ! Que voulez-vous explorer ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const suggestedQuestions = [
    {
      title: "🚀 Graphe de Connaissances (GraphRAG)",
      prompt: "Comment implémenter un pipeline GraphRAG pour relier des concepts scolaires éloignés et éviter les angles morts du RAG vectoriel pur ?",
      doc: "GraphRAG_Knowledge_Triple_Extraction.md"
    },
    {
      title: "🚀 Orchestration Multi-Agents (LangGraph)",
      prompt: "Comment structurer un système multi-agents déterministe avec LangGraph et des transitions conditionnelles pour un tuteur scolaire ?",
      doc: "Advanced_MultiAgent_Orchestration.md"
    },
    {
      title: "🚀 Benchmarking Ragas & Evals",
      prompt: "Quelles sont les métriques mathématiques exactes de Ragas (Faithfulness, Answer Relevance) pour tester automatiquement mon tuteur local ?",
      doc: "Ragas_Automated_Benchmarking_Evaluation.md"
    },
    {
      title: "Architecture 7 Couches",
      prompt: "Explique-moi l'Architecture en 7 couches d'une application IA et dis-moi où se placent Ollama et ChromaDB.",
      doc: "architecture_7_couches.html"
    },
    {
      title: "RAG : Sentence-Window",
      prompt: "Pourquoi la technique Sentence-Window est-elle supérieure au RAG naïf pour un tuteur scolaire ?",
      doc: "8_architectures_rag_interactives (1).html"
    },
    {
      title: "Protocole MCP d'Anthropic",
      prompt: "Comment fonctionne le protocole MCP (Model Context Protocol) et comment créer un outil 'calculer_moyenne' en Python ?",
      doc: "Cours Illustré _ Architecture et Plomberie MCP.pdf"
    },
    {
      title: "Éviter les Hallucinations (CRAG)",
      prompt: "Comment le CRAG (Corrective RAG) empêche le tuteur scolaire d'inventer des fausses réponses d'histoire ou de sciences ?",
      doc: "Cours Grand Débutant _ Le CRAG (Corrective Retrieval-Augmented Generation).pdf"
    },
    {
      title: "Environnement Python & venv (PEP 668)",
      prompt: "J'ai l'erreur PEP 668 'error: externally-managed-environment' quand je tape pip install. Comment configurer proprement un venv Python isolé pour mon projet IA ?",
      doc: "Cours Complet - The $0 AI Architecture Stack (2026).pdf"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Animated AI Mascot Companion */}
      <AnimatedMascot mood={isLoading ? 'thinking' : 'idle'} />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mt-1">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Tuteur Scolastique Interactif (AI Engineer)</h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Votre copilote pédagogique personnalisé, entraîné sur les <strong>31 documents</strong> de votre projet pour vous hisser au niveau d'<strong>AI Engineer</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nouveau sujet</span>
            </button>
          </div>
        </div>

        {/* Controls Bar: Mode & Document Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800">
          {/* Mode Selector */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Posture du Tuteur :</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setMode('socratique')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition text-left cursor-pointer ${
                  mode === 'socratique' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Socratique (Pas-à-pas)
              </button>
              <button
                onClick={() => setMode('expert_rag')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition text-left cursor-pointer ${
                  mode === 'expert_rag' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Architecte RAG & MLOps
              </button>
            </div>
          </div>

          {/* Document Grounding Selector */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Document de Référence Lié :</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">-- Aucun (Corpus Global / 36 documents) --</option>
              <optgroup label="🚀 Spécialisation Avancée (Drive 11gH0UjbJD3FiCrHX6INF39t-GiT3jQs0)">
                {DOCUMENTS_CATALOG.filter(d => [
                  "Advanced_MultiAgent_Orchestration.md",
                  "GraphRAG_Knowledge_Triple_Extraction.md",
                  "CRAG_Self_RAG_Adaptive_Retrieval.md",
                  "Multimodal_PDF_Parsing_Vision_LLMs.md",
                  "Ragas_Automated_Benchmarking_Evaluation.md"
                ].includes(d.filename)).map((doc, idx) => (
                  <option key={`adv-${idx}`} value={doc.filename}>
                    ★ {doc.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="📂 Socle Scolaire & Plomberie (Drive 1vNyVTbzCxTNp2mFX-nT_2HZJDMbmikfN)">
                {DOCUMENTS_CATALOG.filter(d => ![
                  "Advanced_MultiAgent_Orchestration.md",
                  "GraphRAG_Knowledge_Triple_Extraction.md",
                  "CRAG_Self_RAG_Adaptive_Retrieval.md",
                  "Multimodal_PDF_Parsing_Vision_LLMs.md",
                  "Ragas_Automated_Benchmarking_Evaluation.md"
                ].includes(d.filename)).map((doc, idx) => (
                  <option key={`base-${idx}`} value={doc.filename}>
                    {doc.title} ({doc.format})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Directives Toggles */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Directives Pédagogiques Actives :</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setWithPed(!withPed)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  withPed 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                ✓ Pédagogique
              </button>
              <button
                onClick={() => setWithCot(!withCot)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  withCot 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                ✓ CoT (Raisonnement)
              </button>
              <button
                onClick={() => setWithRtoc(!withRtoc)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  withRtoc 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                ✓ RTOC (Tests Bash)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
          Suggestions AI Engineer :
        </span>
        {suggestedQuestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedDoc(s.doc);
              handleSend(s.prompt);
            }}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition whitespace-nowrap cursor-pointer"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[480px] max-h-[640px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 sm:p-5 relative group ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 text-xs mb-2 opacity-80">
                <span className="font-semibold flex items-center space-x-1.5">
                  {m.role === 'user' ? (
                    <span>Vous (Apprenant AI Engineer)</span>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 text-indigo-400 inline" />
                      <span className="text-indigo-300">Tuteur Scolastique IA</span>
                    </>
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  {m.groundedDoc && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 truncate max-w-[140px]">
                      📄 {m.groundedDoc}
                    </span>
                  )}
                  <span>{m.timestamp}</span>
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="p-1 hover:text-white transition cursor-pointer"
                    title="Copier le texte"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-bl-none p-4 max-w-[80%] flex items-center space-x-3 text-slate-400 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span>Le tuteur réfléchit et consulte vos documents techniques...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-lg flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedDoc 
              ? `Posez une question ciblée sur « ${selectedDoc} »...` 
              : "Posez votre question d'ingénierie IA, de code Python ou de terminal..."
          }
          disabled={isLoading}
          className="flex-1 bg-transparent px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-sm flex items-center space-x-2 transition shadow cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Envoyer</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
