/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DiagnosticView } from './components/DiagnosticView';
import { RoadmapView } from './components/RoadmapView';
import { CorpusView } from './components/CorpusView';
import { SurvivalKitView } from './components/SurvivalKitView';
import { AILabView } from './components/AILabView';
import { Semaine2View } from './components/Semaine2View';
import { DriveExportView } from './components/DriveExportView';
import { ScholasticTutorView } from './components/ScholasticTutorView';
import { ParcoursAIEngineer } from './components/ParcoursAIEngineer';
import { InteractiveBlueprintsView } from './components/InteractiveBlueprintsView';
import { ActiveTab } from './types';
import { SEMAINE_1_DATA, PROJECT_OVERVIEW } from './data/projectData';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, GraduationCap, ShieldCheck, Cpu } from 'lucide-react';
import { GamificationProvider, useGamification } from './context/GamificationContext';
import { GamificationHUD } from './components/GamificationHUD';

const STORAGE_KEY = 'tuteur_scolastique_completed_tasks';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tuteur');
  const [selectedDocForTutor, setSelectedDocForTutor] = useState<string>('');
  const { addXp, unlockBadge, updateQuestProgress } = useGamification();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const willBeCompleted = !prev[taskId];
      if (willBeCompleted) {
        addXp(50, 'Tâche Pomodoro accomplie !', 'task');
        unlockBadge('first_task');
        updateQuestProgress('quest_tasks', 1);
      }
      return {
        ...prev,
        [taskId]: willBeCompleted,
      };
    });
  };

  // Calculate total and completed tasks
  const { totalTasksCount, completedTasksCount } = useMemo(() => {
    let total = 0;
    let completed = 0;

    Object.keys(SEMAINE_1_DATA).forEach((dayKey) => {
      const day = SEMAINE_1_DATA[dayKey];
      day.pomodoros.forEach((p, pIdx) => {
        p.taches.forEach((t, tIdx) => {
          total++;
          const id = `${dayKey}-${pIdx}-${tIdx}`;
          if (completedTasks[id]) {
            completed++;
          }
        });
      });
    });

    return { totalTasksCount: total, completedTasksCount: completed };
  }, [completedTasks]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Gamification Floating HUD & Modals */}
      <GamificationHUD />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'tuteur' && (
              <ScholasticTutorView
                initialDocument={selectedDocForTutor}
                onNavigateToDoc={(fname) => {
                  setSelectedDocForTutor(fname);
                  setActiveTab('corpus');
                }}
              />
            )}
            {activeTab === 'parcours' && (
              <ParcoursAIEngineer
                onSelectDoc={(fname) => {
                  setSelectedDocForTutor(fname);
                  setActiveTab('corpus');
                }}
                onStartTutorWithTopic={(topic) => {
                  setActiveTab('tuteur');
                }}
              />
            )}
            {activeTab === 'blueprints' && (
              <InteractiveBlueprintsView />
            )}
            {activeTab === 'corpus' && (
              <CorpusView
                onOpenTutorWithDoc={(fname) => {
                  setSelectedDocForTutor(fname);
                  setActiveTab('tuteur');
                }}
              />
            )}
            {activeTab === 'diagnostic' && (
              <DiagnosticView onNavigate={(tab: ActiveTab) => setActiveTab(tab)} />
            )}
            {activeTab === 'roadmap' && (
              <RoadmapView
                completedTasks={completedTasks}
                onToggleTask={toggleTask}
              />
            )}
            {activeTab === 'survival' && <SurvivalKitView />}
            {activeTab === 'lab' && <AILabView />}
            {activeTab === 'semaine2' && <Semaine2View />}
            {activeTab === 'drive' && <DriveExportView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Tuteur Scolastique IA</span>
            <span>•</span>
            <span className="font-mono text-slate-500">Cursus AI Engineer • Architecture RAG • Multi-Agents • Stack $0</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500">
              Corpus RAG : <span className="text-amber-400 font-mono">30 Docs Socle</span> + <span className="text-indigo-400 font-mono">5 Modules Avancés</span>
            </span>
            <a
              href={`https://drive.google.com/drive/folders/${PROJECT_OVERVIEW.driveFolderAdvancedId}?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1"
            >
              <span>Drive Avancé</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://drive.google.com/drive/folders/${PROJECT_OVERVIEW.driveFolderFoundationsId}?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center space-x-1"
            >
              <span>Drive Socle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GamificationProvider>
      <AppContent />
    </GamificationProvider>
  );
}
