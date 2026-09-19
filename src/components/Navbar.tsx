/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  CalendarDays, 
  FolderGit2, 
  LifeBuoy, 
  Sparkles, 
  Layers, 
  ExternalLink,
  Cpu,
  CheckCircle2,
  CloudUpload,
  GraduationCap,
  Network,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Download
} from 'lucide-react';
import { ActiveTab } from '../types';
import { PROJECT_OVERVIEW } from '../data/projectData';
import { useGamification } from '../context/GamificationContext';
import { AnimatedMascot } from './AnimatedMascot';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  completedTasksCount,
  totalTasksCount,
}) => {
  const percent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const { 
    xp, 
    level, 
    levelTitle, 
    streak, 
    progressPercent, 
    soundEnabled, 
    toggleSound, 
    setIsTrophyModalOpen,
    badges,
    quests
  } = useGamification();

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'tuteur', label: 'Tuteur Scolastique IA', icon: <GraduationCap className="w-4 h-4 text-indigo-400" />, badge: 'Gemini 3.8' },
    { id: 'parcours', label: 'Parcours AI Engineer', icon: <BookOpen className="w-4 h-4 text-cyan-400" />, badge: '6 Pistes' },
    { id: 'blueprints', label: 'Architectures & PPTX', icon: <Network className="w-4 h-4 text-amber-400" />, badge: 'Interactif' },
    { id: 'corpus', label: 'Corpus (31 Docs)', icon: <FolderGit2 className="w-4 h-4" />, badge: '31' },
    { id: 'roadmap', label: 'Roadmap Jalon 1', icon: <CalendarDays className="w-4 h-4" />, badge: `${percent}%` },
    { id: 'semaine2', label: 'Plan Jalon 2 (RAG)', icon: <Layers className="w-4 h-4" /> },
    { id: 'diagnostic', label: 'Diagnostic', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'lab', label: 'Lab Prompts', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'survival', label: 'Boîte à Outils Terminal', icon: <LifeBuoy className="w-4 h-4" /> },
    { id: 'drive', label: 'Google Drive', icon: <CloudUpload className="w-4 h-4" />, badge: 'Pack' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div 
            onClick={() => setActiveTab('tuteur')}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight">Tuteur Scolastique</span>
                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Engineer Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                36 Documents Intégrés • Ollama • RAG • Multi-Agents
              </p>
            </div>
          </div>

          {/* Quick Metrics, Gamification & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Level & XP Pill */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsTrophyModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 hover:border-amber-500/50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-500/30 text-xs transition cursor-pointer shadow-sm group"
              title="Ouvrir la salle des trophées et quêtes"
            >
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                ⚡
              </div>
              <div className="text-left hidden xs:block">
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-white text-xs">Nv.{level}</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">({xp} XP)</span>
                </div>
                <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </motion.button>

            {/* Streak Flame */}
            <div 
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold"
              title={`${streak} jour(s) d'apprentissage consécutifs`}
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-sm"
              >
                🔥
              </motion.span>
              <span className="font-mono">{streak}j</span>
            </div>

            {/* Trophies Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTrophyModalOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-500/40 transition cursor-pointer"
              title="Salle des Trophées & Quêtes"
            >
              <Trophy className="w-4 h-4" />
              {unlockedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center font-mono">
                  {unlockedCount}
                </span>
              )}
            </motion.button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer hidden sm:flex items-center justify-center"
              title={soundEnabled ? "Désactiver les effets sonores" : "Activer les effets sonores"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Direct ZIP Download Button */}
            <a
              href="/api/download-zip"
              download="tuteur-scolastique-ai-engineer.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs border border-indigo-400/40 shadow-sm transition shadow-indigo-600/20"
              title="Télécharger tout le projet sous forme d'archive .ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Télécharger ZIP</span>
            </a>

            {/* Mascot Quick Tip */}
            <AnimatedMascot compact onInteraction={() => setIsTrophyModalOpen(true)} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/25 text-white border border-indigo-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
