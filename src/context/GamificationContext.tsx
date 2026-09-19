/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { sounds } from '../utils/soundEffects';
import { fireTaskConfetti, fireLevelUpConfetti, fireQuizSuccessConfetti } from '../utils/confettiUtils';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'code' | 'rag' | 'agents' | 'discipline';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  detail: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  levelBadgeColor: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  streak: number;
  lastActiveDate: string;
  soundEnabled: boolean;
  unlockedBadgeIds: string[];
  recentXpEvent: { amount: number; reason: string; id: number } | null;
  isLevelUpModalOpen: boolean;
  newLevelInfo: { level: number; title: string } | null;
  isTrophyModalOpen: boolean;
}

export interface GamificationContextType extends GamificationState {
  addXp: (amount: number, reason: string, triggerEffect?: 'task' | 'quiz' | 'none') => void;
  toggleSound: () => void;
  unlockBadge: (badgeId: string) => void;
  updateQuestProgress: (questId: string, increment?: number) => void;
  closeLevelUpModal: () => void;
  setIsTrophyModalOpen: (open: boolean) => void;
  badges: Badge[];
  quests: DailyQuest[];
  // Premium features
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
  getStats: () => { totalXp: number; level: number; badgesUnlocked: number; questsCompleted: number; streak: number };
}

const LEVELS = [
  { level: 1, title: 'Initié Python & Shell', minXp: 0, maxXp: 250, color: 'from-slate-500 to-slate-400 border-slate-400' },
  { level: 2, title: 'Bâtisseur de CLI ($0)', minXp: 250, maxXp: 600, color: 'from-cyan-500 to-blue-500 border-cyan-400' },
  { level: 3, title: 'Alchimiste RAG & ChromaDB', minXp: 600, maxXp: 1200, color: 'from-emerald-500 to-teal-400 border-emerald-400' },
  { level: 4, title: 'Maître des Graphes LangGraph', minXp: 1200, maxXp: 2000, color: 'from-indigo-500 to-purple-500 border-indigo-400' },
  { level: 5, title: 'Architecte Multi-Agents P0', minXp: 2000, maxXp: 3200, color: 'from-amber-500 to-orange-500 border-amber-400' },
  { level: 6, title: 'Lead AI Engineer & Systèmes LLM', minXp: 3200, maxXp: 5000, color: 'from-rose-500 via-purple-500 to-indigo-500 border-rose-400' },
];

const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_task',
    title: 'Premier Pas dans le Terminal',
    description: 'Valider votre première tâche Pomodoro dans la Roadmap.',
    icon: '🚀',
    category: 'discipline',
    xpReward: 50,
    unlocked: false,
    requirement: '1 tâche terminée'
  },
  {
    id: 'pomodoro_streak_3',
    title: 'Triomphe Pomodoro',
    description: 'Compléter 3 tâches consécutives sans distraction.',
    icon: '⏱️',
    category: 'discipline',
    xpReward: 100,
    unlocked: false,
    requirement: '3 tâches validées'
  },
  {
    id: 'first_socratic_prompt',
    title: 'Dialogue Socratique',
    description: 'Poser une première question au Tuteur Scolastique IA.',
    icon: '🏛️',
    category: 'code',
    xpReward: 75,
    unlocked: false,
    requirement: '1 échange avec le Tuteur'
  },
  {
    id: 'quiz_master',
    title: 'Incollable sur le RAG',
    description: 'Répondre juste à un quiz de validation dans le Corpus.',
    icon: '🎯',
    category: 'rag',
    xpReward: 100,
    unlocked: false,
    requirement: '1 quiz réussi'
  },
  {
    id: 'blueprint_explorer',
    title: 'Cartographe des 7 Couches',
    description: 'Inspecter les couches d\'architecture et les 8 flux RAG.',
    icon: '🗺️',
    category: 'agents',
    xpReward: 80,
    unlocked: false,
    requirement: 'Explorer les Blueprints'
  },
  {
    id: 'source_curator',
    title: 'Conservateur de Connaissances',
    description: 'Importer une source personnelle dans le dossier data/corpus.',
    icon: '📚',
    category: 'rag',
    xpReward: 120,
    unlocked: false,
    requirement: '1 source ajoutée'
  },
  {
    id: 'master_multiagents',
    title: 'Chef d\'Orchestre Multi-Agents',
    description: 'Consulter le module d\'orchestration LangGraph déterministe.',
    icon: '🤖',
    category: 'agents',
    xpReward: 150,
    unlocked: false,
    requirement: 'Consulter le module Avancé'
  },
  {
    id: 'zero_dollar_master',
    title: 'Héros de la Stack $0',
    description: 'Assimiler les piliers d\'architecture souveraine à coût zéro.',
    icon: '💎',
    category: 'code',
    xpReward: 200,
    unlocked: false,
    requirement: 'Maîtrise de la Stack $0'
  }
];

const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest_tasks',
    title: 'Discipline du Codeur',
    detail: 'Compléter 2 tâches Pomodoro dans la Roadmap',
    xpReward: 100,
    progress: 0,
    maxProgress: 2,
    completed: false,
    icon: '⚡'
  },
  {
    id: 'quest_tutor',
    title: 'Entraînement Socratique',
    detail: 'Poser 1 question guidée au Tuteur Scolastique',
    xpReward: 80,
    progress: 0,
    maxProgress: 1,
    completed: false,
    icon: '💡'
  },
  {
    id: 'quest_quiz',
    title: 'Défi de Connaissance',
    detail: 'Valider 1 réponse de quiz dans le Corpus documentaire',
    xpReward: 90,
    progress: 0,
    maxProgress: 1,
    completed: false,
    icon: '🧠'
  }
];

const GAMIFICATION_STORAGE_KEY = 'ai_engineer_gamification_state_v1';

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.xp === 'number' ? parsed.xp : 80;
      }
    } catch {}
    return 80; // Starting bonus for learner encouragement
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.streak === 'number' ? parsed.streak : 1;
      }
    } catch {}
    return 1;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.soundEnabled !== false;
      }
    } catch {}
    return true;
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.unlockedBadgeIds) ? parsed.unlockedBadgeIds : [];
      }
    } catch {}
    return [];
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.quests) && parsed.quests.length > 0) {
          return parsed.quests;
        }
      }
    } catch {}
    return INITIAL_QUESTS;
  });

  const [recentXpEvent, setRecentXpEvent] = useState<{ amount: number; reason: string; id: number } | null>(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [newLevelInfo, setNewLevelInfo] = useState<{ level: number; title: string } | null>(null);
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);

  // Derive level info from XP
  const currentLevelData = LEVELS.reduce((acc, lvl) => {
    if (xp >= lvl.minXp) return lvl;
    return acc;
  }, LEVELS[0]);

  const nextLevelData = LEVELS.find(l => l.level === currentLevelData.level + 1) || currentLevelData;
  const xpForCurrentLevel = currentLevelData.minXp;
  const xpForNextLevel = nextLevelData.minXp;
  const levelDiff = Math.max(1, xpForNextLevel - xpForCurrentLevel);
  const currentLevelProgress = Math.min(levelDiff, Math.max(0, xp - xpForCurrentLevel));
  const progressPercent = currentLevelData.level === 6 && xp >= 3200 
    ? 100 
    : Math.round((currentLevelProgress / levelDiff) * 100);

  // Sync sound manager
  useEffect(() => {
    sounds.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify({
        xp,
        streak,
        soundEnabled,
        unlockedBadgeIds,
        quests,
        lastActiveDate: new Date().toISOString().split('T')[0]
      }));
    } catch {}
  }, [xp, streak, soundEnabled, unlockedBadgeIds, quests]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setUnlockedBadgeIds(prev => {
      if (prev.includes(badgeId)) return prev;
      const targetBadge = INITIAL_BADGES.find(b => b.id === badgeId);
      if (targetBadge) {
        sounds.playLevelUp();
        fireTaskConfetti();
        // Add badge reward
        setXp(cur => cur + targetBadge.xpReward);
        setRecentXpEvent({
          amount: targetBadge.xpReward,
          reason: `Succès débloqué : ${targetBadge.title}`,
          id: Date.now()
        });
      }
      return [...prev, badgeId];
    });
  }, []);

  const addXp = useCallback((amount: number, reason: string, triggerEffect: 'task' | 'quiz' | 'none' = 'none') => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      
      // Check for level up
      const oldLvl = LEVELS.reduce((acc, lvl) => (prevXp >= lvl.minXp ? lvl.level : acc), 1);
      const newLvl = LEVELS.reduce((acc, lvl) => (newXp >= lvl.minXp ? lvl.level : acc), 1);

      if (newLvl > oldLvl) {
        const lvlObj = LEVELS.find(l => l.level === newLvl)!;
        setNewLevelInfo({ level: lvlObj.level, title: lvlObj.title });
        setIsLevelUpModalOpen(true);
        sounds.playLevelUp();
        fireLevelUpConfetti();
      } else {
        if (triggerEffect === 'task') {
          sounds.playTaskComplete();
          fireTaskConfetti();
        } else if (triggerEffect === 'quiz') {
          sounds.playCorrectQuiz();
          fireQuizSuccessConfetti();
        } else {
          sounds.playXpGain();
        }
      }

      return newXp;
    });

    setRecentXpEvent({ amount, reason, id: Date.now() });

    // Clear recent XP banner after 3 seconds
    setTimeout(() => {
      setRecentXpEvent(cur => (cur && Date.now() - cur.id >= 2800 ? null : cur));
    }, 3000);
  }, []);

  const updateQuestProgress = useCallback((questId: string, increment: number = 1) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        const newProg = Math.min(q.maxProgress, q.progress + increment);
        const justFinished = newProg >= q.maxProgress;
        if (justFinished) {
          addXp(q.xpReward, `Quête accomplie : ${q.title}`, 'task');
        }
        return {
          ...q,
          progress: newProg,
          completed: justFinished
        };
      }
      return q;
    }));
  }, [addXp]);

  const exportProgress = useCallback(() => {
    const data = {
      xp,
      level: currentLevelData.level,
      streak,
      unlockedBadgeIds,
      quests,
      badges: INITIAL_BADGES.map(b => ({ ...b, unlocked: unlockedBadgeIds.includes(b.id) })),
      timestamp: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(data, null, 2);
  }, [xp, streak, unlockedBadgeIds, quests]);

  const importProgress = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (!data.version || !data.xp) return false;
      
      setXp(data.xp || 0);
      setStreak(data.streak || 1);
      setUnlockedBadgeIds(data.unlockedBadgeIds || []);
      if (data.quests) setQuests(data.quests);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getStats = useCallback(() => ({
    totalXp: xp,
    level: currentLevelData.level,
    badgesUnlocked: unlockedBadgeIds.length,
    questsCompleted: quests.filter(q => q.completed).length,
    streak,
  }), [xp, currentLevelData.level, unlockedBadgeIds, quests]);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelUpModalOpen(false);
  }, []);

  const badgesWithStatus: Badge[] = INITIAL_BADGES.map(b => ({
    ...b,
    unlocked: unlockedBadgeIds.includes(b.id)
  }));

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level: currentLevelData.level,
        levelTitle: currentLevelData.title,
        levelBadgeColor: currentLevelData.color,
        xpForCurrentLevel,
        xpForNextLevel,
        progressPercent,
        streak,
        lastActiveDate: new Date().toISOString().split('T')[0],
        soundEnabled,
        unlockedBadgeIds,
        recentXpEvent,
        isLevelUpModalOpen,
        newLevelInfo,
        isTrophyModalOpen,
        addXp,
        toggleSound,
        unlockBadge,
        updateQuestProgress,
        closeLevelUpModal,
        setIsTrophyModalOpen,
        badges: badgesWithStatus,
        quests,
        exportProgress,
        importProgress,
        getStats
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
