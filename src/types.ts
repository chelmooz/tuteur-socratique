/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'diagnostic' | 'tuteur' | 'parcours' | 'blueprints' | 'corpus' | 'roadmap' | 'survival' | 'lab' | 'semaine2' | 'drive';

export interface DocumentQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SourceGrounding {
  transcriptExcerpt: string;
  transcriptRef?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface DocumentDetail extends DocumentMeta {
  fullOverview: string;
  aiEngineerTakeaways: string[];
  keyConcepts: Array<{ name: string; explanation: string; sourceGrounding?: SourceGrounding }>;
  practicalCodeSnippet?: { language: string; title: string; code: string };
  diagramSummary?: {
    type: 'pipeline' | 'layers' | 'decision_tree' | 'comparison' | 'cycle' | 'flow' | 'loop' | 'balance' | 'stack' | 'timeline' | 'architecture';
    steps: Array<{ label: string; detail: string; badge?: string }>;
  };
  quiz?: DocumentQuizQuestion[];
  sourceGrounding?: SourceGrounding;
  flashcards?: Flashcard[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview?: number;
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  lastReviewed?: number;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
  weights?: Record<string, number>;
}

export interface DiagnosticResult {
  recommendedPath: 'express' | 'standard' | 'deep';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  focusAreas: string[];
  timeAvailable: number;
  recommendedModules: string[];
}

export interface CurriculumModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  estimatedHours: number;
  docFilenames: string[];
  skillsGained: string[];
  scholasticChallenge: string;
}

export interface DriveExportFile {
  name: string;
  mimeType: string;
  description: string;
  sizeEstimate?: string;
  getContent: () => string;
}

export interface DriveExportProgress {
  step: 'idle' | 'confirming' | 'creating_folder' | 'uploading_files' | 'complete' | 'error';
  currentFileName?: string;
  completedFiles: number;
  totalFiles: number;
  folderId?: string;
  folderUrl?: string;
  uploadedFiles: Array<{ id: string; name: string; webViewLink?: string }>;
  error?: string;
}

export interface TaskItem {
  label: string;
  detail: string;
  commande: string;
  prompt: string;
  succes: string;
}

export interface PomodoroBlock {
  titre: string;
  taches: TaskItem[];
}

export interface DaySchedule {
  date: string;
  objectif: string;
  pomodoros: PomodoroBlock[];
}

export interface DocumentMeta {
  filename: string;
  category: 'RAG & Pipeline' | 'Fondations LLM' | 'Agents & Protocoles' | 'Agents & Orchestration' | 'Données & Persistance' | 'Architecture & Production' | 'Sécurité & Contrôle';
  title: string;
  format: 'PDF' | 'HTML' | 'PPTX' | 'TXT' | 'JPEG' | 'JPG' | 'MD';
  importance: 'Très Haute' | 'Haute' | 'Moyenne';
  description: string;
  chunkingStrategy?: string;
}

export interface TermDefinition {
  terme: string;
  definition: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

import { Request } from "express";

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content?: string; text?: string }>;
  mode?: 'tuteur_eleve' | 'expert_rag';
}

export interface QuizRequest {
  topic?: string;
  difficulty?: string;
}

export interface TestPromptRequest {
  userQuery: string;
  withCtx?: boolean;
  withCot?: boolean;
  withRtoc?: boolean;
  withPed?: boolean;
}

export interface AuthenticatedRequest extends Request {
  requestId?: string;
  user?: { id: string; apiKey: string };
  studentSession?: {
    sessionId: string;
    studentId: string;
    currentFrustration: number;
    messageCount: number;
    pedagogicalStep: string;
  };
  sessionId?: string;
}
