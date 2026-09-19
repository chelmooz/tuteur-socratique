/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, RefreshCw, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const MOTIVATIONAL_TIPS = [
  "Règle $0 : Toujours tester le prompt en local sur Ollama avant de consommer des tokens cloud !",
  "Un RAG réussi dépend à 80% de la qualité du chunking et du filtre de métadonnées.",
  "LangGraph apporte du déterminisme et des cycles d'auto-correction aux agents.",
  "Dans le Terminal, 'uv' et 'venv' sont tes meilleurs amis pour isoler tes projets IA.",
  "Chaque minute passée sur la théorie du Transformer te fera gagner 3 jours de debug !",
  "Besoin d'un boost ? Coche 2 tâches Pomodoro dans la Roadmap pour débloquer +100 XP !",
  "Le MCP (Model Context Protocol) est la clé pour connecter tes modèles à tes outils locaux."
];

interface AnimatedMascotProps {
  mood?: 'idle' | 'thinking' | 'celebrating';
  onInteraction?: () => void;
  compact?: boolean;
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  mood = 'idle',
  onInteraction,
  compact = false
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const handleClickMascot = () => {
    setIsJumping(true);
    sounds.playXpGain();
    setTipIndex((prev) => (prev + 1) % MOTIVATIONAL_TIPS.length);
    setIsBubbleOpen(true);
    if (onInteraction) onInteraction();
    setTimeout(() => setIsJumping(false), 600);
  };

  if (compact) {
    return (
      <div className="relative inline-flex items-center">
        <motion.button
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClickMascot}
          className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 cursor-pointer flex items-center justify-center text-white"
          title="Cliquez pour un conseil de votre Tuteur IA"
        >
          {/* Cyber robot eyes SVG */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="4" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
            <circle cx="8.5" cy="12" r="2" fill="#22d3ee" className="animate-pulse" />
            <circle cx="15.5" cy="12" r="2" fill="#22d3ee" className="animate-pulse" />
            <path d="M12 2V5" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="2" r="1.5" fill="#f59e0b" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Animated Robot SVG */}
      <div className="relative shrink-0">
        <motion.div
          animate={isJumping ? { y: [-15, 0], rotate: [0, 8, -8, 0], scale: [1, 1.15, 1] } : { y: [0, -6, 0] }}
          transition={isJumping ? { duration: 0.5 } : { repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          onClick={handleClickMascot}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-400/40 p-2 shadow-xl shadow-indigo-500/20 cursor-pointer group flex items-center justify-center select-none"
        >
          {/* Antenna with pulse */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 animate-bounce" />
            <span className="w-0.5 h-2 bg-indigo-400" />
          </div>

          {/* Robot Screen Face */}
          <div className="w-full h-full rounded-xl bg-slate-950 border border-slate-800 p-1.5 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

            {/* Glowing Eyes */}
            <div className="flex items-center space-x-3 mb-1">
              <motion.div
                animate={mood === 'thinking' ? { scaleY: [1, 0.2, 1] } : { scaleY: [1, 1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: mood === 'thinking' ? 0.8 : 3.5, times: [0, 0.9, 0.95, 1] }}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80 flex items-center justify-center"
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </motion.div>

              <motion.div
                animate={mood === 'thinking' ? { scaleY: [1, 0.2, 1] } : { scaleY: [1, 1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: mood === 'thinking' ? 0.8 : 3.5, times: [0, 0.9, 0.95, 1] }}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80 flex items-center justify-center"
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </motion.div>
            </div>

            {/* Smiling / Digital mouth */}
            <div className="w-5 h-1 rounded-full bg-indigo-400/80" />
          </div>

          {/* Orbital Synapse Particle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-[-6px] rounded-full border border-dashed border-indigo-400/30 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/80 absolute top-0 left-1/2 -translate-x-1/2" />
          </motion.div>
        </motion.div>

        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold font-mono">
          IA ACTIF
        </span>
      </div>

      {/* Speech / Advice Box */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Aria • Votre Compagnon IA d'Entraînement</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">(Cliquez sur Aria pour un conseil)</span>
        </div>

        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs sm:text-sm text-slate-200 mt-1 font-medium leading-relaxed italic"
        >
          « {MOTIVATIONAL_TIPS[tipIndex]} »
        </motion.p>

        <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <button
            onClick={handleClickMascot}
            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-900/40 hover:bg-indigo-800/60 px-2.5 py-1 rounded-lg border border-indigo-700/50 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Autre conseil IA</span>
          </button>
          
          <span className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
            💡 Astuce du jour
          </span>
        </div>
      </div>
    </div>
  );
};
