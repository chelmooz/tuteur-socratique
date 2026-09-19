/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Lock, 
  Award,
  ChevronRight,
  Target
} from 'lucide-react';

export const GamificationHUD: React.FC = () => {
  const {
    xp,
    level,
    levelTitle,
    progressPercent,
    xpForCurrentLevel,
    xpForNextLevel,
    streak,
    soundEnabled,
    toggleSound,
    recentXpEvent,
    isLevelUpModalOpen,
    newLevelInfo,
    closeLevelUpModal,
    isTrophyModalOpen,
    setIsTrophyModalOpen,
    badges,
    quests
  } = useGamification();

  const completedQuestsCount = quests.filter(q => q.completed).length;

  return (
    <>
      {/* Floating XP Notification Toast */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end space-y-2">
        <AnimatePresence>
          {recentXpEvent && (
            <motion.div
              key={recentXpEvent.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-indigo-950/90 border border-indigo-500/40 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-amber-300 font-mono text-sm">+{recentXpEvent.amount} XP</span>
                  <span className="text-[11px] text-indigo-200">• Bravo !</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{recentXpEvent.reason}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level Up Fanfare Modal */}
      <AnimatePresence>
        {isLevelUpModalOpen && newLevelInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
            >
              {/* Animated glow rays */}
              <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 text-3xl font-extrabold"
              >
                🏆
              </motion.div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                LEVEL UP !
              </span>

              <h3 className="text-2xl font-black text-white tracking-tight">
                Niveau {newLevelInfo.level} Débloqué !
              </h3>
              <p className="text-sm font-semibold text-indigo-300 mt-1">
                « {newLevelInfo.title} »
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
                <div className="text-slate-400 font-medium">Récompenses & Avantages obtenus :</div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nouveau titre de prestige sur votre profil</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Accès aux défis avancés LangGraph & Multi-Agents</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Bonus de réactivité du Tuteur Socratique IA</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={closeLevelUpModal}
                className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/25 transition cursor-pointer text-sm"
              >
                Continuer l'Ascension ⚡
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Trophy & Quests Modal Dialog */}
      <AnimatePresence>
        {isTrophyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[88vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                      <span>Salle des Trophées & Quêtes AI Engineer</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                        Nv. {level}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Progressez vers le rang de Lead AI Engineer en validant quêtes et jalons
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleSound}
                    title={soundEnabled ? 'Désactiver les effets sonores' : 'Activer les sons'}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  </button>
                  <button
                    onClick={() => setIsTrophyModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Level status card */}
                <div className="bg-gradient-to-r from-slate-950 to-indigo-950/50 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs uppercase font-mono tracking-wider text-slate-400">RANG ACTUEL :</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          NIVEAU {level}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-0.5">{levelTitle}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Objectif prochain palier : <span className="font-mono text-indigo-300 font-bold">{xpForNextLevel} XP</span> (encore {Math.max(0, xpForNextLevel - xp)} XP)
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-400 font-mono">{xp} XP</div>
                        <div className="text-[11px] text-slate-400">Total Accumulé</div>
                      </div>
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                        <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                        <span className="text-xs font-bold">{streak}j Streak</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                      <span>Progression du palier</span>
                      <span className="text-indigo-300 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quêtes Quotidiennes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>Missions & Quêtes Actives ({completedQuestsCount}/{quests.length})</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Gain direct en XP</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {quests.map((q) => (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-2xl border transition ${
                          q.completed
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xl">{q.icon}</span>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                            q.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                          }`}>
                            +{q.xpReward} XP
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white mt-2">{q.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{q.detail}</p>
                        
                        <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-500">{q.progress}/{q.maxProgress}</span>
                          {q.completed ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Validé</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">En cours</span>
                          )}
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full transition-all duration-300 ${q.completed ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.round((q.progress / q.maxProgress) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8 Badges / Trophies Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Collection de Trophées ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {badges.map((b) => (
                      <motion.div
                        key={b.id}
                        whileHover={{ y: -3 }}
                        className={`p-4 rounded-2xl border transition relative overflow-hidden ${
                          b.unlocked
                            ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-amber-500/40 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{b.icon}</span>
                          {b.unlocked ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Débloqué
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>

                        <h5 className="text-xs font-bold text-white mt-2 leading-snug">{b.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{b.description}</p>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{b.requirement}</span>
                          <span className="text-amber-400 font-bold">+{b.xpReward} XP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Astuce : chaque tâche cochée dans la Roadmap rapporte <strong className="text-amber-300 font-mono">+50 XP</strong> !
                </span>
                <button
                  onClick={() => setIsTrophyModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
