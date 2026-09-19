/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  HelpCircle,
  Zap,
  Trophy,
  Flame,
  Award
} from 'lucide-react';
import { SEMAINE_1_DATA, PROMPT_TEMPLATES } from '../data/projectData';
import { DaySchedule, TaskItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RoadmapViewProps {
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  completedTasks,
  onToggleTask,
}) => {
  const dayKeys = Object.keys(SEMAINE_1_DATA);
  const [selectedDayKey, setSelectedDayKey] = useState<string>(dayKeys[0] || 'mercredi9');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('work');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerMode]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(timerMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const currentDayData: DaySchedule = SEMAINE_1_DATA[selectedDayKey] || {
    date: '',
    objectif: '',
    pomodoros: [],
  };

  // Calculate day progress
  let dayTotalTasks = 0;
  let dayCompletedTasks = 0;
  currentDayData.pomodoros.forEach((p, pIdx) => {
    p.taches.forEach((t, tIdx) => {
      dayTotalTasks++;
      const taskId = `${selectedDayKey}-${pIdx}-${tIdx}`;
      if (completedTasks[taskId]) dayCompletedTasks++;
    });
  });
  const dayPercent = dayTotalTasks > 0 ? Math.round((dayCompletedTasks / dayTotalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner with Day Navigation & Pomodoro Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Day Selector Header */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Jalon 1 • Semaine 1
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentDayData.date}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Objectif : <span className="text-slate-200 font-medium">{currentDayData.objectif}</span>
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Progression Jour</div>
                <div className="text-sm font-bold text-emerald-400">
                  {dayCompletedTasks} / {dayTotalTasks} ({dayPercent}%)
                </div>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-900 border-2 border-emerald-500 text-xs font-bold text-emerald-400">
                {dayPercent}%
              </div>
            </div>
          </div>

          {/* Day 100% Completed Gamified Banner */}
          {dayPercent === 100 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-gradient-to-r from-emerald-950/60 via-teal-900/40 to-slate-900 border border-emerald-500/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300 shadow-md"
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="font-bold">Journée 100% complétée ! Bravo, vous avez respecté tous vos cycles Pomodoro !</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 font-mono font-bold text-emerald-300 border border-emerald-500/30">
                Jalon Validé 🎉
              </span>
            </motion.div>
          )}

          {/* Days Tabs Bar */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {dayKeys.map((k) => {
              const day = SEMAINE_1_DATA[k];
              const isSelected = selectedDayKey === k;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedDayKey(k)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-start border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <span>{day.date.split(' ')[0]} {day.date.split(' ')[1]}</span>
                  <span className={`text-[10px] truncate max-w-[120px] font-normal ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {day.objectif.split(' ')[0]} {day.objectif.split(' ')[1] || ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pomodoro Timer Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chronomètre Pomodoro</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              timerMode === 'work' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {timerMode === 'work' ? '25m Focus' : '5m Pause'}
            </span>
          </div>

          <div className="my-3 text-center">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
              {formatTime(timerSeconds)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {timerMode === 'work' ? 'Travaille sur le bloc actuel' : 'Prends une pause café / étire-toi'}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors ${
                timerActive 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timerActive ? 'Pause' : 'Démarrer'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Réinitialiser le chronomètre"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Pomodoros and Tasks List */}
      <div className="space-y-6">
        {currentDayData.pomodoros.map((pomodoro, pIdx) => {
          return (
            <div 
              key={pIdx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Pomodoro Block Header */}
              <div className="bg-slate-800/60 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    P{pIdx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {pomodoro.titre}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {pomodoro.taches.length} tâche(s)
                </span>
              </div>

              {/* Tasks in this Pomodoro */}
              <div className="divide-y divide-slate-800/80">
                {pomodoro.taches.map((tache, tIdx) => {
                  const taskId = `${selectedDayKey}-${pIdx}-${tIdx}`;
                  const isDone = Boolean(completedTasks[taskId]);
                  const isExpanded = Boolean(expandedTasks[taskId]);

                  return (
                    <div 
                      key={tIdx}
                      className={`p-4 sm:p-5 transition-colors ${
                        isDone ? 'bg-slate-900/40 opacity-80' : 'hover:bg-slate-800/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox & Task Title */}
                        <div className="flex items-start space-x-3 flex-1">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => onToggleTask(taskId)}
                            className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                              isDone
                                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'border-slate-600 hover:border-indigo-400 bg-slate-800/90'
                            }`}
                            title={isDone ? 'Marquer à faire' : 'Marquer comme fait (+50 XP !)'}
                          >
                            {isDone ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono font-bold">+</span>
                            )}
                          </motion.button>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                {tache.label}
                              </h4>
                              {isDone ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                                  +50 XP ✓
                                </span>
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20 font-mono font-medium">
                                  +50 XP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {tache.detail}
                            </p>
                          </div>
                        </div>

                        {/* Expand Details Button */}
                        <button
                          onClick={() => toggleExpand(taskId)}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title={isExpanded ? 'Réduire' : 'Détails & Prompt'}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Command Block (if exists) */}
                      {tache.commande && tache.commande !== 'aucune' && (
                        <div className="mt-3.5 pl-8">
                          <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="text-cyan-300 select-all">{tache.commande}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(tache.commande, `cmd-${taskId}`)}
                              className="ml-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-sans flex items-center space-x-1 shrink-0 transition-colors"
                            >
                              {copiedIndex === `cmd-${taskId}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expanded Section: Prompt & Success Criteria */}
                      {isExpanded && (
                        <div className="mt-4 pl-8 space-y-3 pt-3 border-t border-slate-800/60 animate-fadeIn">
                          {/* Success Criteria */}
                          {tache.succes && (
                            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <span className="font-bold text-emerald-300 block mb-0.5">Critère de réussite :</span>
                                <span className="text-slate-300">{tache.succes}</span>
                              </div>
                            </div>
                          )}

                          {/* Pedagogical Prompt */}
                          {tache.prompt && (
                            <div className="p-3.5 bg-slate-950 border border-indigo-500/20 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Prompt IA Associé (Règles CTX + CoT + RTOC + Pédagogie) :</span>
                                </span>
                                <button
                                  onClick={() => handleCopy(tache.prompt, `prompt-${taskId}`)}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] flex items-center space-x-1 transition-colors"
                                >
                                  {copiedIndex === `prompt-${taskId}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copié</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copier le prompt</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed overflow-x-auto">
                                {tache.prompt}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
