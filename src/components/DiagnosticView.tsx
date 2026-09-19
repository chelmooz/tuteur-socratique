/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Layers, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { PROJECT_OVERVIEW } from '../data/projectData';
import type { ActiveTab } from '../types';

interface DiagnosticViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

interface DiagnosticQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: { value: string; label: string; weight?: Record<string, number> }[];
  category: string;
  weight: number;
}

interface DiagnosticResult {
  recommendedPath: 'express' | 'standard' | 'deep';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  focusAreas: string[];
  timeAvailable: number;
  recommendedModules: string[];
  score: number;
  strengths: string[];
  gaps: string[];
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'level',
    question: "Quel est ton niveau actuel en IA / ML ?",
    type: 'single',
    category: 'level',
    weight: 20,
    options: [
      { value: 'beginner', label: 'Débutant (pas de code ML, découvre les LLM)', weight: { beginner: 30 } },
      { value: 'coder', label: 'Développeur (code Python, connaît Git/API)', weight: { intermediate: 20, advanced: 10 } },
      { value: 'practitioner', label: 'Praticien ML (entraîne des modèles, RAG, fine-tuning)', weight: { advanced: 30, expert: 10 } },
      { value: 'expert', label: 'Expert (recherche, production, architectures complexes)', weight: { expert: 30 } },
    ],
  },
  {
    id: 'goal',
    question: "Quel est ton objectif principal avec ce tuteur ?",
    type: 'single',
    category: 'goal',
    weight: 25,
    options: [
      { value: 'learn', label: 'Apprendre les bases (RAG, LLM, agents)', weight: { beginner: 25, intermediate: 10 } },
      { value: 'build', label: 'Construire un projet concret (RAG, agent, tuteur)', weight: { intermediate: 25, advanced: 20 } },
      { value: 'master', label: "Maîtriser l'architecture avancée (multi-agents, CRAG, MCP)", weight: { advanced: 25, expert: 25 } },
      { value: 'teach', label: "Former d'autres / créer du contenu pédagogique", weight: { expert: 20, intermediate: 15 } },
    ],
  },
  {
    id: 'time',
    question: "Combien de temps peux-tu consacrer par semaine ?",
    type: 'single',
    category: 'time',
    weight: 15,
    options: [
      { value: 'low', label: '< 3h / semaine (express)', weight: { express: 30 } },
      { value: 'medium', label: '3-8h / semaine (standard)', weight: { standard: 25 } },
      { value: 'high', label: '8-15h / semaine (intensif)', weight: { deep: 25 } },
      { value: 'full', label: '> 15h / semaine (immersion)', weight: { deep: 30 } },
    ],
  },
  {
    id: 'stack',
    question: "Quelle stack technique maîtrises-tu déjà ?",
    type: 'multiple',
    category: 'stack',
    weight: 15,
    options: [
      { value: 'python', label: 'Python (avancé)', weight: { intermediate: 10, advanced: 10 } },
      { value: 'llm', label: 'LLM / Prompting / RAG', weight: { intermediate: 15, advanced: 15 } },
      { value: 'docker', label: 'Docker / Linux / CLI', weight: { intermediate: 10 } },
      { value: 'mlops', label: 'MLOps / Vector DB / Fine-tuning', weight: { advanced: 20, expert: 15 } },
      { value: 'none', label: "Rien de tout ça (débutant total)", weight: { beginner: 30 } },
    ],
  },
  {
    id: 'focus',
    question: "Quels domaines t'intéressent le plus ? (choisis 2 max)",
    type: 'multiple',
    category: 'focus',
    weight: 20,
    options: [
      { value: 'rag', label: 'RAG & Pipeline (chunking, embedding, rerank)', weight: { rag: 20 } },
      { value: 'agents', label: 'Agents & LangGraph (MCP, ReAct, boucles)', weight: { agents: 20 } },
      { value: 'llm_fundamentals', label: 'Fondations LLM (transformers, attention, fine-tuning)', weight: { llm: 20 } },
      { value: 'architecture', label: "Architecture & Production (7 couches, stack $0)", weight: { arch: 20 } },
      { value: 'data', label: 'Données & Vector DB (Chroma, Qdrant, HNSW)', weight: { data: 20 } },
      { value: 'security', label: 'Sécurité & Guardrails (eval, benchmarks)', weight: { security: 20 } },
    ],
  },
  {
    id: 'style',
    question: "Comment préfères-tu apprendre ?",
    type: 'single',
    category: 'style',
    weight: 10,
    options: [
      { value: 'guided', label: 'Guidé pas-à-pas (tuteur socratique)', weight: { beginner: 15 } },
      { value: 'project', label: 'Par projet concret (build & learn)', weight: { intermediate: 15, advanced: 10 } },
      { value: 'deep', label: 'Approfondi théorique + pratique', weight: { advanced: 15, expert: 15 } },
      { value: 'autonomous', label: 'Totalement autonome (docs + expérimentation)', weight: { expert: 20 } },
    ],
  },
];

interface AnswerWeights {
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
  express: number;
  standard: number;
  deep: number;
  rag: number;
  agents: number;
  llm: number;
  arch: number;
  data: number;
  security: number;
}

const calculateResult = (answers: Record<string, string | string[]>): DiagnosticResult => {
  const weights: AnswerWeights = {
    beginner: 0, intermediate: 0, advanced: 0, expert: 0,
    express: 0, standard: 0, deep: 0,
    rag: 0, agents: 0, llm: 0, arch: 0, data: 0, security: 0,
  };

  DIAGNOSTIC_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    if (!answer) return;
    
    const values = Array.isArray(answer) ? answer : [answer];
    values.forEach(v => {
      const option = q.options?.find(o => o.value === v);
      if (option?.weight) {
        Object.entries(option.weight).forEach(([key, val]) => {
          if (key in weights) {
            (weights as any)[key] += val * (q.weight / 100);
          }
        });
      }
    });
  });

  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const levelScores = levels.map(l => weights[l as keyof AnswerWeights]);
  const maxLevel = levels[levelScores.indexOf(Math.max(...levelScores))];
  const levelMap: Record<string, DiagnosticResult['level']> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
  };

  const paths = ['express', 'standard', 'deep'];
  const pathScores = paths.map(p => weights[p as keyof AnswerWeights]);
  const maxPath = paths[pathScores.indexOf(Math.max(...pathScores))] as DiagnosticResult['recommendedPath'];

  const focusKeys = ['rag', 'agents', 'llm', 'arch', 'data', 'security'];
  const focusScores = focusKeys.map(f => weights[f as keyof AnswerWeights]);
  const focusLabels: Record<string, string> = {
    rag: 'RAG & Pipeline',
    agents: 'Agents & LangGraph',
    llm: 'Fondations LLM',
    arch: 'Architecture & Production',
    data: 'Données & Vector DB',
    security: 'Sécurité & Guardrails',
  };
  const sortedFocus = focusKeys
    .map(k => ({ key: k, score: weights[k as keyof AnswerWeights] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(f => focusLabels[f.key]);

  const moduleMap: Record<string, string[]> = {
    rag: ['track-rag', 'track-data'],
    agents: ['track-agents', 'track-data'],
    llm: ['track-foundations', 'track-rag'],
    arch: ['track-foundations', 'track-arch'],
    data: ['track-data', 'track-rag'],
    security: ['track-security', 'track-arch'],
  };

  const recommendedModules = focusKeys
    .filter(f => weights[f as keyof AnswerWeights] > 0)
    .flatMap(f => moduleMap[f] || [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 4);

  const totalWeight = DIAGNOSTIC_QUESTIONS.reduce((sum, q) => sum + q.weight, 0);
  const earnedWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const score = Math.min(100, Math.round((earnedWeight / (totalWeight * 2)) * 100));

  const strengths = levels
    .filter(l => weights[l as keyof AnswerWeights] > 10)
    .map(l => l.charAt(0).toUpperCase() + l.slice(1));
  
  const gaps = levels
    .filter(l => weights[l as keyof AnswerWeights] < 5)
    .map(l => l.charAt(0).toUpperCase() + l.slice(1));

  return {
    recommendedPath: maxPath,
    level: levelMap[maxLevel],
    focusAreas: sortedFocus,
    timeAvailable: 0,
    recommendedModules,
    score,
    strengths,
    gaps,
  };
};

export const DiagnosticView: React.FC<{ onNavigate: (tab: ActiveTab) => void }> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultiSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => {
      const current = (prev[currentQuestion.id] as string[]) || [];
      const newValues = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [currentQuestion.id]: newValues };
    });
  };

  const handleNext = () => {
    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      const result = calculateResult(answers);
      setResult(result);
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
    setResult(null);
  };

  const handleNavigate = (moduleId: string) => {
    const moduleMap: Record<string, string> = {
      'track-foundations': 'parcours',
      'track-rag': 'corpus',
      'track-agents': 'lab',
      'track-data': 'corpus',
      'track-arch': 'blueprints',
      'track-security': 'survival',
    };
    const tab = moduleMap[moduleId] || 'corpus';
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab } }));
  };

  if (!showResult) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Diagnostic IA Engineer</h1>
          <p className="text-slate-400">Réponds à 7 questions pour obtenir ton parcours personnalisé</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Question {currentStep + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: progress + '%' }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">{currentQuestion?.question}</h2>
          
          <div className="space-y-4">
            {currentQuestion?.options?.map((opt, i) => (
              <label 
                key={opt.value}
                className="flex items-center space-x-3 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition bg-slate-900/50"
              >
                <input
                  type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                  name={currentQuestion.id}
                  value={opt.value}
                  checked={Array.isArray(answers[currentQuestion.id]) 
                    ? answers[currentQuestion.id].includes(opt.value)
                    : answers[currentQuestion.id] === opt.value}
                  onChange={(e) => {
                    if (currentQuestion.type === 'multiple') {
                      handleMultiSelect(opt.value);
                    } else {
                      handleAnswer(opt.value);
                    }
                  }}
                  className="w-5 h-5 text-indigo-500 border-slate-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-white text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button 
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id || '']}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Voir mon parcours' : 'Suivant'}
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const pathLabels = {
    express: 'Express (2-3h/sem)',
    standard: 'Standard (5-8h/sem)',
    deep: 'Immersion (10h+/sem)',
  };

  const pathLabelsFull = {
    express: 'Parcours Express (2-3h/sem) - Modules essentiels uniquement',
    standard: 'Parcours Standard (5-8h/sem) - Complet avec ateliers',
    deep: 'Immersion Totale (10h+/sem) - Masterclass complète + ateliers + projet',
  };

  const levelColors: Record<string, string> = {
    'Débutant': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Intermédiaire': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Avancé': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    'Expert': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  const pathColors: Record<string, string> = {
    express: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    standard: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    deep: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  const moduleInfoMap: Record<string, { title: string; desc: string; icon: string; color: string; tab: ActiveTab }> = {
    'track-foundations': { title: 'Fondations LLM & Entraînement', desc: 'Architecture Transformer, tokenisation, fine-tuning', icon: '🧠', color: 'indigo', tab: 'parcours' },
    'track-rag': { title: 'RAG Avancé & Architectures', desc: 'CRAG, GraphRAG, multimodal, production', icon: '📚', color: 'emerald', tab: 'corpus' },
    'track-agents': { title: 'Agents Autonomes & LangGraph', desc: 'MCP, ReAct, graphes d\'états, outillage', icon: '🤖', color: 'indigo', tab: 'lab' },
    'track-data': { title: 'Données & Bases Vectorielles', desc: 'Chroma, Qdrant, HNSW, persistance hybride', icon: '🗄️', color: 'cyan', tab: 'corpus' },
    'track-arch': { title: 'Architecture & Production', desc: '7 couches, stack $0, déploiement', icon: '🏗️', color: 'amber', tab: 'blueprints' },
    'track-security': { title: 'Sécurité & Guardrails', desc: 'Eval, benchmarks, Ragas, safety', icon: '🛡️', color: 'rose', tab: 'survival' },
  };

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    rose: 'bg-rose-500/20 border-rose-500/30 text-rose-300',
    slate: 'bg-slate-700/50 border-slate-600 text-slate-300',
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              {pathLabelsFull[result.recommendedPath]}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              Niveau : {result.level}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Score : {result.score}/100
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            Diagnostic IA Engineer — Ton Parcours Personnalisé
          </h1>
          <p className="text-slate-300 leading-relaxed max-w-4xl text-sm sm:text-base">
            Basé sur tes réponses, voici ton parcours optimal pour devenir <strong className="text-white">AI Engineer</strong> avec le <strong className="text-cyan-400">Tuteur Scolastique</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-medium">Parcours Recommandé</div>
              <div className="text-xl font-bold text-white mt-1">{pathLabelsFull[result.recommendedPath]}</div>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-medium">Niveau Detecté</div>
              <div className="text-2xl font-bold text-white mt-1">{result.level}</div>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-medium">Score Global</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{result.score}/100</div>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-medium">Modules Prioritaires</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">{result.recommendedModules.length}</div>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-medium">Score Global</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{result.score}/100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            {pathLabelsFull[result.recommendedPath]}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            Niveau : {result.level}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            Score : {result.score}/100
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Ton Parcours Recommandé : {pathLabels[result.recommendedPath]}</span>
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            {pathLabelsFull[result.recommendedPath].split(' - ')[1] || pathLabelsFull[result.recommendedPath]}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-2 flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Modules Prioritaires</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.recommendedModules.length === 0 ? (
                  <li className="text-slate-500">Tous les modules de base recommandés</li>
                ) : (
                  result.recommendedModules.map((m, i) => {
                    const displayName = m.replace('track-', '').replace('-', ' ');
                    return (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span className="text-slate-300 capitalize">{displayName}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-2 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Domaine de Focus</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.focusAreas.slice(0, 3).map((f, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Tes Forces</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {result.strengths.length > 0 ? 
                result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5 font-bold text-xs">{i + 1}</span>
                    <div><strong className="text-white block font-medium">{s}</strong> - Base solide pour progresser rapidement.</div>
                  </li>
                )) :
                <li className="text-slate-500">Continue à explorer pour identifier tes forces.</li>
              }
            </ul>
          </div>
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Points à Renforcer</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {result.gaps.length > 0 ? 
                result.gaps.map((g, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-400 mt-0.5 font-bold text-xs">{i + 1}</span>
                    <div>
                      <strong className="text-white block font-medium">{g}</strong> - À travailler en priorité dans ton parcours.
                    </div>
                  </li>
                )) :
                <li className="text-slate-500">Aucun gap majeur détecté !</li>
              }
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Modules Recommandés à Suivre</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.recommendedModules.map((moduleId, i) => {
              const info = moduleInfoMap[moduleId] || { title: moduleId, desc: '', icon: '📦', color: 'slate', tab: 'corpus' };
              const moduleCardClass = 'p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg text-left ' + (colorMap[info.color] || colorMap.slate);
              return (
                <button
                  key={moduleId}
                  onClick={() => onNavigate(moduleInfoMap[moduleId]?.tab || 'corpus')}
                  className={moduleCardClass}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{info.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{info.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{info.desc}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white">Commencer →</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Prochaines Étapes Immédiates</span>
          </h3>
          <ol className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <strong className="text-white">Commence par le module recommandé #1</strong>
                <p className="text-xs text-slate-400 mt-0.5">Clique sur le module prioritaire ci-dessus pour commencer.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <strong className="text-white">Fais le premier quiz du module</strong>
                <p className="text-xs text-slate-400 mt-0.5">Valide ta compréhension avant de passer à la suite.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <strong className="text-white">Génère tes flashcards</strong>
                <p className="text-xs text-slate-400 mt-0.5">Utilise l'onglet "Flashcards" dans le Corpus pour la répétition espacée.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <strong className="text-white">Planifie tes sessions Pomodoro</strong>
                <p className="text-xs text-slate-400 mt-0.5">Roadmap → Tracker pour bloquer tes créneaux hebdomadaires.</p>
              </div>
            </li>
          </ol>
          <button
            onClick={handleRestart}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition shadow-md"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refaire le Diagnostic</span>
          </button>
        </div>
      </div>
    </div>
  );
};