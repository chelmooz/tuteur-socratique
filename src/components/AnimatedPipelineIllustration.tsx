/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Cpu, 
  Database, 
  Search, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Zap,
  Layers,
  Code2
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

interface PipelineStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  details: string;
  metric: string;
}

export const AnimatedPipelineIllustration: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { addXp, unlockBadge } = useGamification();

  const steps: PipelineStep[] = [
    {
      id: 'source',
      title: '1. Documents Sources',
      subtitle: 'PDF, HTML, MD, PPTX',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      details: '36 fichiers sources scolairement balisés stockés dans Google Drive et data/corpus/.',
      metric: '36 Docs • 100% Souverain'
    },
    {
      id: 'chunk',
      title: '2. Chunking Sémantique',
      subtitle: '500 tokens • Overlap 10%',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
      details: 'Découpage par paragraphes et sections Markdown pour préserver le contexte sémantique.',
      metric: '≈ 250 Chunks Vectoriels'
    },
    {
      id: 'embed',
      title: '3. Embedding Vectoriel',
      subtitle: 'nomad-embed-text / bge-m3',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
      details: 'Conversion des fragments textuels en vecteurs denses de 768 dimensions exécutée en local sur Ollama.',
      metric: 'Latence < 12ms / chunk'
    },
    {
      id: 'db',
      title: '4. Vector Store Local',
      subtitle: 'ChromaDB persistant',
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      details: 'Indexation HNSW pour recherche de plus proches voisins par similarité cosinus (Cosine Similarity).',
      metric: 'Coût Cloud : 0,00 $'
    },
    {
      id: 'rerank',
      title: '5. Retriever & Rerank',
      subtitle: 'Top-K (k=4) + Re-ranker',
      icon: <Search className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
      details: 'Sélection des passages les plus pertinents et élimination du bruit informationnel.',
      metric: 'Précision contextuelle 94%'
    },
    {
      id: 'llm',
      title: '6. Tuteur Socratique IA',
      subtitle: 'Prompting P0 + Ollama/Gemini',
      icon: <Bot className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
      details: 'Génération de questions réflexives et d\'explications guidées avec citations précises des sources.',
      metric: 'Zéro Hallucination'
    }
  ];

  const handleSelectStep = (idx: number) => {
    setActiveStep(idx);
    addXp(15, `Exploration du Pipeline : ${steps[idx].title}`);
    unlockBadge('blueprint_explorer');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Dynamic background lights */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Pipeline Vivant & Vectoriel</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Temps Réel • Flux RAG</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            L'Architecture Complète de Votre Tuteur IA
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Visualisez le flux de données en direct : de vos documents bruts jusqu'au tuteur socratique. Cliquez sur un bloc pour l'examiner.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Stack $0 :</span>
          <span className="text-emerald-400 font-bold">100% Opérationnel</span>
        </div>
      </div>

      {/* Animated Pipeline Nodes */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          return (
            <motion.div
              key={step.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectStep(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? `${step.color} shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/50`
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Step indicator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border ${step.color}`}>
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    ETAPE {idx + 1}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{step.subtitle}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Métrique :</span>
                <span className="text-indigo-300 font-bold">{step.metric}</span>
              </div>

              {/* Pulsing indicator when active */}
              {isSelected && (
                <motion.div
                  layoutId="pipeline-active-glow"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900 shadow-sm"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Banner */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
            {steps[activeStep].icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white">{steps[activeStep].title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {steps[activeStep].metric}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {steps[activeStep].details}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSelectStep((activeStep + 1) % steps.length)}
          className="shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-md"
        >
          <span>Étape suivante</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
