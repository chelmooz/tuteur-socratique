/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Search, 
  Filter, 
  FileText, 
  Layers, 
  FileCode, 
  SlidersHorizontal,
  ExternalLink,
  BookOpen,
  Sparkles,
  Tag,
  Scissors,
  GraduationCap,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  Plus,
  Upload,
  FileUp,
  Folder,
  X,
  Trash2,
  UploadCloud,
  Brain,
  Zap,
  Target,
  Lightbulb,
  Layers as LayersIcon
} from 'lucide-react';
import { DOCUMENTS_CATALOG, PROJECT_OVERVIEW } from '../data/projectData';
import { getDocumentDetail } from '../data/documentsDetailData';
import { DocumentMeta, DocumentDetail } from '../types';
import { useGamification } from '../context/GamificationContext';
import FlashcardDeck from './FlashcardDeck';
import { PipelineSchema, CompareSchema, StackSchema } from './PremiumSchemas';

interface CorpusViewProps {
  onOpenTutorWithDoc?: (filename: string) => void;
}

export const CorpusView: React.FC<CorpusViewProps> = ({ onOpenTutorWithDoc }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedFormat, setSelectedFormat] = useState<string>('Tous');
  const [selectedDriveScope, setSelectedDriveScope] = useState<'all' | 'foundations' | 'advanced'>('all');
  const [activeModalDoc, setActiveModalDoc] = useState<DocumentDetail | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'quiz' | 'code' | 'flashcards' | 'schema'>('overview');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [activeSchema, setActiveSchema] = useState<string | null>(null);
  const { addXp, unlockBadge, updateQuestProgress, getStats } = useGamification();

  // Premium: Schema configurations for each document
  const [activeSchemaConfig, setActiveSchemaConfig] = useState<any>(null);

  // Custom User Documents state stored in localStorage
  const [customDocs, setCustomDocs] = useState<DocumentMeta[]>(() => {
    try {
      const saved = localStorage.getItem('ai_custom_sources');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Add Source Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentMeta['category']>('RAG & Pipeline');
  const [newFormat, setNewFormat] = useState<DocumentMeta['format']>('PDF');
  const [newImportance, setNewImportance] = useState<DocumentMeta['importance']>('Haute');
  const [newDescription, setNewDescription] = useState('');
  const [newChunking, setNewChunking] = useState('');
  const [newContentSnippet, setNewContentSnippet] = useState('');

  const allDocs = useMemo(() => {
    return [...DOCUMENTS_CATALOG, ...customDocs];
  }, [customDocs]);

  const customFilenames = useMemo(() => {
    return new Set(customDocs.map(d => d.filename));
  }, [customDocs]);

  const advancedFilenames = useMemo(() => new Set([
    "Advanced_MultiAgent_Orchestration.md",
    "GraphRAG_Knowledge_Triple_Extraction.md",
    "CRAG_Self_RAG_Adaptive_Retrieval.md",
    "Multimodal_PDF_Parsing_Vision_LLMs.md",
    "Ragas_Automated_Benchmarking_Evaluation.md"
  ]), []);

  const categories = useMemo(() => {
    const cats = new Set(allDocs.map((d) => d.category));
    return ['Tous', ...Array.from(cats)];
  }, [allDocs]);

  const formats = useMemo(() => {
    const fmts = new Set(allDocs.map((d) => d.format));
    return ['Tous', ...Array.from(fmts)];
  }, [allDocs]);

  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      const isAdvanced = advancedFilenames.has(doc.filename);
      if (selectedDriveScope === 'advanced' && !isAdvanced) return false;
      if (selectedDriveScope === 'foundations' && isAdvanced) return false;

      const matchCat = selectedCategory === 'Tous' || doc.category === selectedCategory;
      const matchFmt = selectedFormat === 'Tous' || doc.format === selectedFormat;
      const matchSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.chunkingStrategy?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchFmt && matchSearch;
    });
  }, [allDocs, selectedCategory, selectedFormat, searchQuery, selectedDriveScope, advancedFilenames]);

  const handleOpenDoc = (filename: string) => {
    let detail = getDocumentDetail(filename);
    const customMatch = customDocs.find(d => d.filename === filename);
    if (customMatch) {
      detail = {
        ...customMatch,
        fullOverview: customMatch.description,
        aiEngineerTakeaways: [
          `Document personnalisé importé par l'apprenant : ${customMatch.filename}`,
          `Format source : ${customMatch.format} • Priorité : ${customMatch.importance}`,
          `Stratégie RAG appliquée : ${customMatch.chunkingStrategy || 'Non spécifiée'}`
        ],
        keyConcepts: [
          { name: "Source Apprenant", explanation: "Fichier ajouté directement au corpus de travail." },
          { name: "Stratégie de découpage", explanation: customMatch.chunkingStrategy || 'Non spécifiée' }
        ],
        diagramSummary: {
          type: 'pipeline',
          steps: [
            { label: "Document Source", detail: customMatch.filename },
            { label: "Ingestion Vectorielle", detail: customMatch.chunkingStrategy || 'Non spécifiée' },
            { label: "Interrogation RAG", detail: "Prêt pour indexation dans ChromaDB." }
          ]
        },
        quiz: [
          {
            question: `Quelle stratégie de chunking vectoriel est recommandée pour ${customMatch.title} ?`,
            options: [
              customMatch.chunkingStrategy || 'Non spécifiée',
              "Aucun chunking (document brut non vectorisé)",
              "Découpage fixe de 10 mots sans recouvrement"
            ],
            correctIndex: 0,
            explanation: `La stratégie enregistrée est : ${customMatch.chunkingStrategy || 'Non spécifiée'}`
          }
        ]
      };
    }
    setActiveModalDoc(detail);
    setModalTab('overview');
    setSelectedAnswers({});
    setShowResults({});
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    const isAlreadyAnswered = showResults[qIndex];
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    setShowResults(prev => ({ ...prev, [qIndex]: true }));

    if (!isAlreadyAnswered && activeModalDoc?.quiz && activeModalDoc.quiz[qIndex]) {
      const isCorrect = activeModalDoc.quiz[qIndex].correctIndex === optIndex;
      if (isCorrect) {
        addXp(40, `Quiz validé : ${activeModalDoc.title.slice(0, 30)}... (+40 XP)`, 'quiz');
        unlockBadge('quiz_master');
        updateQuestProgress('quest_quiz', 1);
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const processSelectedFile = (file: File) => {
    setNewFilename(file.name);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'TXT';
    let fmt: DocumentMeta['format'] = 'TXT';
    if (ext === 'PDF') fmt = 'PDF';
    else if (ext === 'HTML' || ext === 'HTM') fmt = 'HTML';
    else if (ext === 'PPTX' || ext === 'PPT') fmt = 'PPTX';
    setNewFormat(fmt);

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    setNewTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    setNewChunking(`Découpage sémantique adapté pour ${file.name} (500 tokens, 10% overlap).`);
    setNewDescription(`Source ajoutée par l'apprenant : ${file.name} (${Math.round(file.size / 1024) || 1} Ko).`);

    if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.html') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setNewContentSnippet(text.slice(0, 400));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveCustomDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFilename.trim()) return;

    const newDoc: DocumentMeta = {
      filename: newFilename.trim(),
      title: newTitle.trim(),
      category: newCategory,
      format: newFormat,
      importance: newImportance,
      description: newDescription.trim() || `Document ${newFilename}`,
      chunkingStrategy: newChunking.trim() || 'Chunking sémantique standard (500 tokens).'
    };

    const updated = [newDoc, ...customDocs];
    setCustomDocs(updated);
    try {
      localStorage.setItem('ai_custom_sources', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Award XP
    addXp(120, `Nouvelle source RAG indexée : ${newDoc.title} (+120 XP)`, 'task');
    unlockBadge('source_curator');

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewFilename('');
    setNewDescription('');
    setNewChunking('');
    setNewContentSnippet('');
  };

  const handleDeleteCustomDoc = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    const updated = customDocs.filter(d => d.filename !== filename);
    setCustomDocs(updated);
    try {
      localStorage.setItem('ai_custom_sources', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const importanceBadge = (imp: DocumentMeta['importance']) => {
    switch (imp) {
      case 'Très Haute':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Priorité P0</span>;
      case 'Haute':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Priorité P1</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/60 text-slate-300 border border-slate-600">Priorité P2</span>;
    }
  };

  const formatIcon = (fmt: DocumentMeta['format']) => {
    switch (fmt) {
      case 'PDF':
        return <span className="text-rose-400 font-bold text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">PDF</span>;
      case 'HTML':
        return <span className="text-cyan-400 font-bold text-xs bg-cyan-500/10 px-1.5 py-0.5 rounded">HTML</span>;
      case 'PPTX':
        return <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">PPTX</span>;
      default:
        return <span className="text-slate-300 font-bold text-xs bg-slate-700/60 px-1.5 py-0.5 rounded">TXT</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Corpus Google Drive • Multi-Dossiers Intégrés
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {DOCUMENTS_CATALOG.length} Fichiers Sources
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" title="Chaque document génère 6 à 10 chunks de 500 tokens pour ChromaDB">
                ≈ 250 Chunks Vectoriels RAG
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Corpus de Connaissances & Hub Google Drive
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Consultez vos 2 dossiers Google Drive synchronisés : le <strong>socle documentaire scolaire</strong> (31 docs) et le <strong>parcours avancé AI Engineer</strong> (5 modules d'ingénierie supérieure). Cliquez sur une carte pour voir sa fiche complète.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Ajouter ou importer une nouvelle source documentaire"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Source</span>
            </button>

            <a
              href="https://drive.google.com/drive/folders/11gH0UjbJD3FiCrHX6INF39t-GiT3jQs0?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 text-xs font-semibold rounded-xl border border-indigo-700/50 transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Dossier Avancé Google Drive"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Drive Avancé</span>
              <ExternalLink className="w-3 h-3 text-indigo-300" />
            </a>

            <a
              href="https://drive.google.com/drive/folders/1vNyVTbzCxTNp2mFX-nT_2HZJDMbmikfN?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Dossier Socle Google Drive"
            >
              <FolderGit2 className="w-4 h-4 text-amber-400" />
              <span>Drive Socle</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Drive Scope Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Filtrer par dossier Drive :</span>
          
          <button
            onClick={() => setSelectedDriveScope('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedDriveScope === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            Tous les documents ({allDocs.length})
          </button>

          <button
            onClick={() => setSelectedDriveScope('advanced')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedDriveScope === 'advanced'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-800/40'
            }`}
          >
            <span>🚀 Dossier Avancé ({advancedFilenames.size} modules)</span>
          </button>

          <button
            onClick={() => setSelectedDriveScope('foundations')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedDriveScope === 'foundations'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-950/30 hover:bg-amber-900/30 text-amber-300 border border-amber-800/40'
            }`}
          >
            <span>📂 Dossier Socle (30 docs)</span>
          </button>

          {customDocs.length > 0 && (
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span>🌱</span>
              <span>{customDocs.length} source{customDocs.length > 1 ? 's' : ''} perso</span>
            </span>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, mot-clé, stratégie ou fichier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Catégorie:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {formats.map((f) => (
                  <option key={f} value={f} className="bg-slate-900 text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenDoc(doc.filename)}
            className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/10"
          >
            <div>
              {/* Header badges */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  {formatIcon(doc.format)}
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">{doc.category}</span>
                </div>
                {importanceBadge(doc.importance)}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                {doc.title}
              </h3>

              {/* Folder origin tag */}
              <div className="mt-2 flex items-center justify-between">
                {customFilenames.has(doc.filename) ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span>🌱 Source Perso</span>
                    <span className="text-emerald-400 text-[9px]">(data/corpus)</span>
                  </span>
                ) : advancedFilenames.has(doc.filename) ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    <span>🚀 Dossier Avancé</span>
                    <span className="text-indigo-400 text-[9px]">(11gH...)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/60">
                    <span>📂 Dossier Socle</span>
                    <span className="text-slate-500 text-[9px]">(1vNy...)</span>
                  </span>
                )}

                {customFilenames.has(doc.filename) && (
                  <button
                    onClick={(e) => handleDeleteCustomDoc(e, doc.filename)}
                    title="Supprimer cette source du catalogue local"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {doc.description}
              </p>
            </div>

            {/* Chunking strategy snippet */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-start space-x-1.5 text-[11px] text-indigo-300">
                <Scissors className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-400" />
                <span className="line-clamp-2 italic text-slate-400">
                  <strong className="text-indigo-300 not-italic">Chunking : </strong>
                  {doc.chunkingStrategy}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-sm">Aucun document ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Tous'); setSelectedFormat('Tous'); }}
              className="mt-3 px-3 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Deep Dive Document Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {formatIcon(activeModalDoc.format)}
                  <span className="text-xs font-semibold text-slate-400">{activeModalDoc.category}</span>
                  {importanceBadge(activeModalDoc.importance)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{activeModalDoc.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1 select-all bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                  {activeModalDoc.filename}
                </p>
              </div>
              <button
                onClick={() => setActiveModalDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setModalTab('overview')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  modalTab === 'overview'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Vue d'Ensemble & Enseignements</span>
              </button>

              <button
                onClick={() => setModalTab('quiz')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  modalTab === 'quiz'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz d'Auto-Évaluation ({activeModalDoc.quiz?.length || 0})</span>
              </button>

              <button
                onClick={() => setModalTab('flashcards')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  modalTab === 'flashcards'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Flashcards & Répétition</span>
              </button>

              <button
                onClick={() => setModalTab('schema')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  modalTab === 'schema'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayersIcon className="w-3.5 h-3.5" />
                <span>Schéma Interactif</span>
              </button>

              {activeModalDoc.practicalCodeSnippet && (
                <button
                  onClick={() => setModalTab('code')}
                  className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                    modalTab === 'code'
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code d'Ingestion Python</span>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm flex-1">
              {modalTab === 'overview' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-2">
                      Analyse Pédagogique
                    </h4>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {activeModalDoc.fullOverview}
                    </p>
                  </div>

                  {activeModalDoc.aiEngineerTakeaways && activeModalDoc.aiEngineerTakeaways.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-2">
                        Ce que doit retenir l'AI Engineer
                      </h4>
                      <div className="space-y-1.5">
                        {activeModalDoc.aiEngineerTakeaways.map((takeaway, idx) => (
                          <div key={idx} className="flex items-start space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="text-slate-300">{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModalDoc.keyConcepts && activeModalDoc.keyConcepts.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-2">
                        Concepts Fondamentaux
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeModalDoc.keyConcepts.map((concept, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                            <div className="font-bold text-indigo-400">{concept.name}</div>
                            <p className="text-slate-400 text-xs mt-1">{concept.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl">
                    <span className="font-bold text-indigo-300 block mb-1 flex items-center space-x-1.5">
                      <Scissors className="w-4 h-4 text-indigo-400" />
                      <span>Stratégie de Chunking Recommandée :</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed">{activeModalDoc.chunkingStrategy}</p>
                  </div>
                </>
              )}

              {modalTab === 'quiz' && activeModalDoc.quiz && (
                <div className="space-y-6">
                  {activeModalDoc.quiz.map((q, qIdx) => {
                    const answered = showResults[qIdx];
                    const selected = selectedAnswers[qIdx];
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div key={qIdx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                        <div className="font-bold text-sm text-white flex items-start space-x-2">
                          <span className="text-indigo-400">Q{qIdx + 1}.</span>
                          <span>{q.question}</span>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            let optionClass = "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800";
                            if (answered) {
                              if (oIdx === q.correctIndex) {
                                optionClass = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold";
                              } else if (selected === oIdx) {
                                optionClass = "bg-rose-950/60 border-rose-500 text-rose-300 line-through";
                              } else {
                                optionClass = "bg-slate-900/40 opacity-50 border-slate-900";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={answered}
                                onClick={() => handleSelectAnswer(qIdx, oIdx)}
                                className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer ${optionClass}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {answered && (
                          <div className={`p-3 rounded-lg text-xs border ${
                            isCorrect 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}>
                            <div className="font-bold mb-1">
                              {isCorrect ? '✓ Exact !' : '✗ Pas tout à fait...'}
                            </div>
                            <p className="leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {modalTab === 'code' && activeModalDoc.practicalCodeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-300">
                      {activeModalDoc.practicalCodeSnippet.title}
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeModalDoc.practicalCodeSnippet?.code || '')}
                      className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                    <code>{activeModalDoc.practicalCodeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {modalTab === 'flashcards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-200 flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      <span>Flashcards & Répétition Espacée (SM-2)</span>
                    </h4>
                    <span className="text-xs text-slate-400">Algorithme SM-2 • Révision espacée adaptative</span>
                  </div>
                  <FlashcardDeck 
                    autoGenerateFromDocument={{
                      title: activeModalDoc.title,
                      content: activeModalDoc.fullOverview,
                      concepts: activeModalDoc.keyConcepts.map(c => ({ name: c.name, explanation: c.explanation }))
                    }}
                  />
                </div>
              )}

              {modalTab === 'schema' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-200 flex items-center space-x-2">
                      <LayersIcon className="w-4 h-4 text-indigo-400" />
                      <span>Schéma Interactif & Visualisation</span>
                    </h4>
                    <span className="text-xs text-slate-400">Pipeline RAG • Architecture • Comparaison</span>
                  </div>
                  <div className="space-y-4">
                    <PipelineSchema
                      title={`Pipeline RAG : ${activeModalDoc.title}`}
                      steps={[
                        { label: 'Documents Sources', detail: 'PDF, HTML, MD, PPTX', badge: 'Sources', color: 'amber' },
                        { label: 'Chunking Sémantique', detail: '500 tokens • Overlap 10%', badge: 'Chunking', color: 'cyan' },
                        { label: 'Embedding Vectoriel', detail: 'nomad-embed-text / bge-m3', badge: 'Embedding', color: 'indigo' },
                        { label: 'Vector Store', detail: 'ChromaDB persistant', badge: 'Stockage', color: 'emerald' },
                        { label: 'Retriever & Rerank', detail: 'Top-K + Re-ranker', badge: 'Recherche', color: 'purple' },
                        { label: 'Tuteur Socratique', detail: 'Prompting P0 + Ollama/Gemini', badge: 'Tuteur', color: 'rose' },
                      ]}
                    />
                    <CompareSchema
                      title="Approches : Classique vs Avancée"
                      left={{
                        label: 'Chunking Brut',
                        detail: 'Découpage fixe sans sémantique',
                        items: ['Perte de contexte', 'Frontières brisées', 'RAG peu précis']
                      }}
                      right={{
                        label: 'Chunking Sémantique',
                        detail: 'Découpage par sections H1/H2/H3',
                        items: ['Contexte préservé', 'Frontières respectées', 'RAG précis']
                      }}
                    />
                    <PipelineSchema
                      title={`Architecture : ${activeModalDoc.category}`}
                      steps={[
                        { label: 'Document Source', detail: activeModalDoc.format, badge: 'Source', color: 'amber' },
                        { label: 'Chunking', detail: activeModalDoc.chunkingStrategy, badge: 'Chunking', color: 'cyan' },
                        { label: 'Embedding', detail: 'Vectorisation', badge: 'Vectoriel', color: 'indigo' },
                        { label: 'Indexation', detail: 'ChromaDB HNSW', badge: 'Index', color: 'emerald' },
                        { label: 'Requêtage', detail: 'RAG + Rerank', badge: 'RAG', color: 'purple' },
                        { label: 'Génération', detail: 'Tuteur + Citations', badge: 'Tuteur', color: 'rose' },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Fiche indexée dans le système RAG local
              </div>

              <div className="flex items-center space-x-2">
                {onOpenTutorWithDoc && (
                  <button
                    onClick={() => {
                      const docName = activeModalDoc.filename;
                      setActiveModalDoc(null);
                      onOpenTutorWithDoc(docName);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Poser une question au Tuteur sur ce doc</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveModalDoc(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ajouter une Nouvelle Source Documentaire</h3>
                  <p className="text-xs text-slate-400">Enrichissez votre corpus RAG local et votre Tuteur Socratique</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomDoc} className="p-6 space-y-4">
              {/* Info banner about data/corpus/ */}
              <div className="bg-indigo-950/40 border border-indigo-700/40 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center space-x-2 text-indigo-300 font-semibold">
                  <Folder className="w-4 h-4 text-indigo-400" />
                  <span>Dossier dédié dans le projet : <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">data/corpus/</code></span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  Vous pouvez glisser-déposer votre fichier ci-dessous pour l'indexer immédiatement, ou déposer vos fichiers directement dans <strong className="text-slate-200">data/corpus/</strong> via l'explorateur de fichiers de gauche.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
                }`}
                onClick={() => document.getElementById('source-file-input')?.click()}
              >
                <input
                  id="source-file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.md,.html,.htm,.txt,.json,.pptx"
                />
                <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-200">
                  Glissez-déposez un fichier ici, ou <span className="text-emerald-400 underline">cliquez pour sélectionner</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supporte .pdf, .md, .html, .txt, .pptx, .json
                </p>
                {newFilename && (
                  <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{newFilename}</span>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Titre du document *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Architecture Cache RAG Sémantique"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom de fichier *</label>
                  <input
                    type="text"
                    required
                    value={newFilename}
                    onChange={(e) => setNewFilename(e.target.value)}
                    placeholder="Ex: semantic_cache_rag.md"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentMeta['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="RAG & Pipeline">RAG & Pipeline</option>
                    <option value="Fondations LLM">Fondations LLM</option>
                    <option value="Agents & Protocoles">Agents & Protocoles</option>
                    <option value="Données & Persistance">Données & Persistance</option>
                    <option value="Architecture & Production">Architecture & Production</option>
                    <option value="Sécurité & Contrôle">Sécurité & Contrôle</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as DocumentMeta['format'])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="PDF">PDF</option>
                      <option value="HTML">HTML</option>
                      <option value="TXT">TXT / MD</option>
                      <option value="PPTX">PPTX</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Priorité</label>
                    <select
                      value={newImportance}
                      onChange={(e) => setNewImportance(e.target.value as DocumentMeta['importance'])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Très Haute">P0 (Très Haute)</option>
                      <option value="Haute">P1 (Haute)</option>
                      <option value="Moyenne">P2 (Moyenne)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Résumé</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Résumé des concepts clés abordés dans cette source..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stratégie de Chunking RAG</label>
                <input
                  type="text"
                  value={newChunking}
                  onChange={(e) => setNewChunking(e.target.value)}
                  placeholder="Ex: Découpage par section de code (400 tokens, 50 tokens overlap)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer dans le Catalogue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
