/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Cpu, 
  Layers, 
  Bot, 
  Database, 
  Network, 
  ShieldCheck, 
  Trophy,
  ExternalLink
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/documentsDetailData';
import { CurriculumModule } from '../types';

interface ParcoursAIEngineerProps {
  onSelectDoc: (filename: string) => void;
  onStartTutorWithTopic: (topic: string) => void;
}

export const ParcoursAIEngineer: React.FC<ParcoursAIEngineerProps> = ({
  onSelectDoc,
  onStartTutorWithTopic
}) => {
  const [completedTracks, setCompletedTracks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ai_engineer_completed_tracks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedModule, setSelectedModule] = useState<CurriculumModule>(CURRICULUM_MODULES[0]);

  const toggleTrack = (id: string) => {
    setCompletedTracks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('ai_engineer_completed_tracks', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const totalCompleted = Object.values(completedTracks).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / CURRICULUM_MODULES.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-purple-400" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Network': return <Network className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Cursus Certifiant AI Engineer</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                36 Documents • Corpus Socle + Avancé
              </span>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">Progression : </span>
                <strong className="text-white">{totalCompleted} / {CURRICULUM_MODULES.length} Pistes ({progressPercent}%)</strong>
              </div>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Parcours Pédagogique : Devenir AI Engineer
          </h1>
          <p className="text-slate-300 max-w-3xl text-sm sm:text-base mt-2 leading-relaxed">
            Vos documents ont été organisés en <strong>7 pistes de maîtrise</strong> progressives, combinant les fondations scolaires et la spécialisation avancée (systèmes multi-agents, GraphRAG, métriques Ragas) adossée à votre dossier Google Drive.
          </p>
        </div>
      </div>

      {/* Main Grid: Track List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Tracks List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
            Les 7 Pistes du Cursus
          </h2>

          {CURRICULUM_MODULES.map((module) => {
            const isSelected = selectedModule.id === module.id;
            const isDone = Boolean(completedTracks[module.id]);

            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className={`p-4 rounded-xl border transition cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 mt-0.5">
                      {getIcon(module.icon)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm text-white">{module.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{module.subtitle}</p>
                      
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          ~{module.estimatedHours}h
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {module.docFilenames.length} documents
                        </span>
                        <span className="text-indigo-400 font-medium">
                          Niveau {module.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrack(module.id);
                    }}
                    className="p-1 text-slate-500 hover:text-white transition cursor-pointer"
                    title={isDone ? "Marquer comme à revoir" : "Valider la piste"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Track Deep Dive */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedModule.level}
                </span>
                <span className="text-xs text-slate-400">Durée estimée : ~{selectedModule.estimatedHours} heures</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">{selectedModule.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{selectedModule.subtitle}</p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {selectedModule.id === 'track-advanced-drive' && (
                <a
                  href="https://drive.google.com/drive/folders/11gH0UjbJD3FiCrHX6INF39t-GiT3jQs0?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 transition border border-indigo-700/40 shadow cursor-pointer whitespace-nowrap"
                  title="Ouvrir le dossier Google Drive source"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dossier Drive (11gH...)</span>
                </a>
              )}

              <button
                onClick={() => onStartTutorWithTopic(selectedModule.title)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>S'entraîner avec le Tuteur</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Objectif Pédagogique
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedModule.description}
            </p>
          </div>

          {/* Skills Acquired */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Compétences Clés Acquises
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedModule.skillsGained.map((skill, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents to study in this track */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Documents du Corpus Associés ({selectedModule.docFilenames.length})
            </h4>
            <div className="space-y-1.5">
              {selectedModule.docFilenames.map((fname, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectDoc(fname)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/70 border border-slate-800 text-xs transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-200 group-hover:text-white truncate font-medium">{fname}</span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-semibold flex items-center space-x-1 shrink-0 ml-2">
                    <span>Ouvrir</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scholastic Challenge Box */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 mb-1.5">
              <Trophy className="w-4 h-4" />
              <span>Défi de Validation Scholastique</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedModule.scholasticChallenge}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
