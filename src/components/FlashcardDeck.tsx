/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock, 
  Star, 
  Settings,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Download,
  Upload,
  FileText
} from 'lucide-react';
import type { Flashcard, FlashcardDeck as FlashcardDeckType } from '../types';
import { useGamification } from '../context/GamificationContext';

interface FlashcardDeckProps {
  deck?: FlashcardDeckType;
  documentTitle?: string;
  onClose?: () => void;
  autoGenerateFromDocument?: { title: string; content: string; concepts: Array<{ name: string; explanation: string }> };
}

const STORAGE_KEY = 'ai_flashcard_decks';

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const NEW_CARD_INTERVAL = 1;
const AGAIN_INTERVAL = 1;

const getDifficultyClass = (difficulty: 'easy' | 'medium' | 'hard'): { className: string; label: string } => {
  switch (difficulty) {
    case 'easy':
      return { className: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20', label: 'Facile' };
    case 'hard':
      return { className: 'bg-rose-500/15 text-rose-300 border border-rose-500/20', label: 'Difficile' };
    default:
      return { className: 'bg-amber-500/15 text-amber-300 border border-amber-500/20', label: 'Moyen' };
  }
};

interface ReviewState {
  currentIndex: number;
  showBack: boolean;
  sessionStats: { correct: number; incorrect: number; reviewed: number };
  deck: FlashcardDeckType;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ 
  deck: initialDeck, 
  documentTitle,
  onClose,
  autoGenerateFromDocument 
}) => {
  const { addXp, unlockBadge } = useGamification();
  
  const [decks, setDecks] = useState<FlashcardDeckType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeDeckId, setActiveDeckId] = useState<string | null>(initialDeck?.id || null);
  const [reviewState, setReviewState] = useState<ReviewState | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '', tags: [] as string[], difficulty: 'medium' as 'easy' | 'medium' | 'hard' });
  const [settings, setSettings] = useState({
    showTimer: true,
    autoFlip: false,
    shuffleCards: false,
    newCardsFirst: true,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    } catch (e) {
      console.error('Failed to save decks:', e);
    }
  }, [decks]);

  const activeDeck = useMemo(() => {
    if (activeDeckId) {
      return decks.find(d => d.id === activeDeckId);
    }
    return decks[0] || null;
  }, [decks, activeDeckId]);

  const startReviewSession = useCallback((deckToReview: FlashcardDeckType) => {
    let cardsToReview = [...deckToReview.cards];
    const now = Date.now();
    cardsToReview.sort((a, b) => {
      const aDue = a.nextReview ?? 0;
      const bDue = b.nextReview ?? 0;
      const aIsDue = aDue <= now;
      const bIsDue = bDue <= now;
      if (aIsDue && !bIsDue) return -1;
      if (!aIsDue && bIsDue) return 1;
      return aDue - bDue;
    });

    const sessionCards = cardsToReview.slice(0, 20);
    if (sessionCards.length === 0) {
      alert('Aucune carte à réviser pour le moment !');
      return;
    }

    setReviewState({
      currentIndex: 0,
      showBack: false,
      sessionStats: { correct: 0, incorrect: 0, reviewed: 0 },
      deck: { ...deckToReview, cards: sessionCards }
    });
  }, []);

  const handleReviewAction = useCallback((quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!reviewState) return;

    const { currentIndex, sessionStats, deck } = reviewState;
    const card = deck.cards[currentIndex];
    const now = Date.now();

    let { interval, easeFactor, reviewCount } = card;
    
    if (quality >= 3) {
      if (reviewCount === 0) {
        interval = NEW_CARD_INTERVAL;
      } else if (reviewCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      reviewCount++;
    } else {
      interval = AGAIN_INTERVAL / 1440;
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
      reviewCount = 0;
    }

    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    const nextReview = now + interval * 24 * 60 * 60 * 1000;

    const updatedCard: Flashcard = {
      ...card,
      interval,
      easeFactor,
      reviewCount,
      nextReview,
    };

    const updatedDeckCards = deck.cards.map(c => c.id === card.id ? updatedCard : c);
    const updatedDeck: FlashcardDeckType = {
      ...deck,
      cards: updatedDeckCards,
      lastReviewed: now,
    };

    setDecks(prev => prev.map(d => d.id === deck.id ? updatedDeck : d));

    const isLastCard = currentIndex >= deck.cards.length - 1;
    const newStats = {
      correct: sessionStats.correct + (quality >= 3 ? 1 : 0),
      incorrect: sessionStats.incorrect + (quality < 3 ? 1 : 0),
      reviewed: sessionStats.reviewed + 1,
    };

    if (isLastCard) {
      setReviewState(null);
      alert('Session terminée ! ✓ ' + newStats.correct + ' correctes, ✗ ' + newStats.incorrect + ' incorrectes.');
    } else {
      setReviewState({
        currentIndex: currentIndex + 1,
        showBack: false,
        sessionStats: newStats,
        deck: updatedDeck,
      });
    }
  }, [reviewState]);

  const handleCreateDeck = (title: string, description: string) => {
    const newDeck: FlashcardDeckType = {
      id: 'deck_' + Date.now(),
      title,
      description,
      cards: [],
      createdAt: Date.now(),
    };
    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
    setShowCreateModal(false);
  };

  const handleAddCard = (card: Omit<Flashcard, 'id' | 'interval' | 'easeFactor' | 'reviewCount' | 'nextReview'>) => {
    if (!activeDeck) return;
    
    const newCard: Flashcard = {
      ...card,
      id: 'card_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
      interval: 0,
      easeFactor: INITIAL_EASE_FACTOR,
      reviewCount: 0,
      nextReview: Date.now(),
    };

    const updatedDeck = {
      ...activeDeck!,
      cards: [...activeDeck!.cards, newCard],
    };

    setDecks(prev => prev.map(d => d.id === activeDeck!.id ? updatedDeck : d));
    setEditingCard(null);
setNewCard({ front: '', back: '', hint: '', tags: [], difficulty: 'medium' });
  };

  const handleEditCard = (card: Flashcard) => {
    if (!activeDeck) return;
    
    const updatedDeck = {
      ...activeDeck!,
      cards: activeDeck!.cards.map(c => c.id === card.id ? card : c),
    };
    
    setDecks(prev => prev.map(d => d.id === activeDeck!.id ? updatedDeck : d));
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!activeDeck) return;
    
    const updatedDeck = {
      ...activeDeck!,
      cards: activeDeck!.cards.filter(c => c.id !== cardId),
    };
    
    setDecks(prev => prev.map(d => d.id === activeDeck!.id ? updatedDeck : d));
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (activeDeckId === deckId) {
      setActiveDeckId(decks.find(d => d.id !== deckId)?.id || null);
    }
  };

  const handleImportExport = (action: 'import' | 'export', deckId?: string) => {
    if (action === 'export') {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) return;
      const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flashcards_' + deck.title.replace(/\s+/g, '_') + '.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (action === 'import') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            if (imported.id && imported.cards) {
              setDecks(prev => [...prev, { ...imported, id: 'deck_' + Date.now() }]);
            }
          } catch (e) {
            alert('Fichier invalide');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.cards) {
          setDecks(prev => [...prev, { ...imported, id: 'deck_' + Date.now() }]);
          setShowImportModal(false);
        }
      } catch {
        alert('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  const handleImportInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImportFile(file);
    }
  };

  const generateFromDocument = useCallback(async () => {
    if (!autoGenerateFromDocument) return;
    
    const { title, content, concepts } = autoGenerateFromDocument;
    const cards: Omit<Flashcard, 'id' | 'interval' | 'easeFactor' | 'reviewCount' | 'nextReview'>[] = concepts.map(c => ({
      front: c.name,
      back: c.explanation,
      hint: 'Concept extrait de: ' + title,
      tags: [title.replace(/\s+/g, '_').toLowerCase()],
      difficulty: 'medium' as const,
    }));

    const newDeck: FlashcardDeckType = {
      id: 'deck_' + Date.now(),
      title: 'Flashcards: ' + title,
      description: 'Généré automatiquement depuis "' + title + '" (' + concepts.length + ' concepts)',
      cards: cards.map(c => ({
        ...c,
        id: 'card_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
        interval: 0,
        easeFactor: INITIAL_EASE_FACTOR,
        reviewCount: 0,
        nextReview: Date.now(),
      })),
      createdAt: Date.now(),
    };

    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
    alert('Deck créé avec ' + cards.length + ' flashcards !');
  }, [autoGenerateFromDocument]);

  const renderDeckSelector = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map(d => {
          const deckClass = 'bg-slate-900/90 border rounded-2xl p-5 transition cursor-pointer ' + (activeDeckId === d.id ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-indigo-500/50');
          return (
            <div key={d.id} className={deckClass}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white">{d.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); handleImportExport('export', d.id); }} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800" title="Exporter"><Download className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); setActiveDeckId(d.id === activeDeckId ? null : d.id); }} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800" title={activeDeckId === d.id ? 'Désélectionner' : 'Sélectionner'}>
                  {activeDeckId === d.id ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Star className="w-4 h-4 text-slate-500" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteDeck(d.id); }} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3">
              <span><Brain className="w-3 h-3 mr-1" /> {d.cards.length} cartes</span>
              <span><Clock className="w-3 h-3 mr-1" /> {d.cards.filter(c => (c.nextReview ?? 0) <= Date.now()).length} dues</span>
              <span><Star className="w-3 h-3 mr-1" /> {d.cards.filter(c => c.reviewCount > 0).length} revues</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => { startReviewSession(d); }} className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer">
                <Zap className="w-3.5 h-3.5" />
                <span>Réviser ({d.cards.filter(c => (c.nextReview ?? 0) <= Date.now()).length})</span>
              </button>
              <button onClick={() => { setActiveDeckId(d.id); setEditingCard(null); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
        })}

        <button onClick={() => setShowCreateModal(true)} className="bg-slate-900/90 border border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 transition cursor-pointer flex flex-col items-center justify-center space-y-3">
          <Plus className="w-10 h-10 text-slate-500 hover:text-indigo-400 transition" />
          <span className="text-slate-400">Créer un nouveau deck</span>
          <span className="text-xs text-slate-500">ou importez un fichier .json</span>
        </button>
      </div>

      {activeDeck && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{activeDeck.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">{activeDeck.cards.length} cartes</span>
              <button onClick={() => startReviewSession(activeDeck!)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition">
                <Zap className="w-3.5 h-3.5" />
                <span>Réviser maintenant</span>
              </button>
              <button onClick={() => handleImportExport('export', activeDeck.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition">
                <Download className="w-3.5 h-3.5" />
                <span>Exporter</span>
              </button>
              <button onClick={() => setShowImportModal(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Importer</span>
              </button>
              <button onClick={() => setActiveDeckId(null)} className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800" title="Retour"><ArrowLeft className="w-4 h-4" /></button>
            </div>
          </div>

          {editingCard ? (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-white mb-3">Éditer la carte</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Question (Face A)</label>
                  <textarea rows={3} value={editingCard.front} onChange={e => setEditingCard({ ...editingCard, front: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Question / Concept" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Réponse (Face B)</label>
                  <textarea rows={3} value={editingCard.back} onChange={e => setEditingCard({ ...editingCard, back: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Réponse / Explication" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Indice (optionnel)</label>
                    <input value={editingCard.hint || ''} onChange={e => setEditingCard({ ...editingCard, hint: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Indice ou aide mnémotechnique" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (séparés par des virgules)</label>
                    <input value={editingCard.tags.join(', ')} onChange={e => setEditingCard({ ...editingCard, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="rag, chunking, vectorisation" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select value={editingCard.difficulty} onChange={e => setEditingCard({ ...editingCard, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button onClick={() => setEditingCard(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">Annuler</button>
                  <button onClick={() => handleEditCard(editingCard!)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Sauvegarder</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-white mb-3">Ajouter une nouvelle carte</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Question (Face A) *</label>
                  <textarea rows={2} value={newCard.front} onChange={e => setNewCard({ ...newCard, front: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Question / Concept à mémoriser" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Réponse (Face B) *</label>
                  <textarea rows={2} value={newCard.back} onChange={e => setNewCard({ ...newCard, back: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Réponse / Explication détaillée" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Indice (optionnel)</label>
                    <input value={newCard.hint} onChange={e => setNewCard({ ...newCard, hint: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Indice ou aide mnémotechnique" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (séparés par des virgules)</label>
                    <input value={newCard.tags.join(', ')} onChange={e => setNewCard({ ...newCard, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="rag, chunking, vectorisation" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select value={newCard.difficulty} onChange={e => setNewCard({ ...newCard, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => handleAddCard(newCard)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter la carte</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">{activeDeck.cards.length} cartes</h4>
              <div className="flex items-center space-x-2">
                {autoGenerateFromDocument && (
                  <button onClick={generateFromDocument} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Générer depuis le document</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              {activeDeck.cards.map((card, idx) => (
                <div key={card.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white line-clamp-1">{card.front}</div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{card.back}</p>
                      <div className="flex flex-wrap items-center space-x-2 mt-2">
                        {card.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>
                        ))}
                        {(() => {
                          const { className: diffClass, label: diffLabel } = getDifficultyClass(card.difficulty);
                          return (
                            <span key="diff" className={`px-2 py-0.5 rounded text-[10px] font-semibold ${diffClass}`}>
                              {diffLabel}
                            </span>
                          );
                        })()}
                        <span className="text-[10px] text-slate-500">Révision dans {card.nextReview ? Math.max(0, Math.ceil((card.nextReview - Date.now()) / 86400000)) : 0}j</span>
                        <span className="text-[10px] text-slate-500">×{card.reviewCount} revues</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <button onClick={() => setEditingCard(card)} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800" title="Éditer"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteCard(card.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Créer un nouveau deck</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Titre *</label>
              <input type="text" placeholder="Ex: Vocabulaire RAG Avancé" onChange={e => setNewCard({ ...newCard, front: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea rows={2} placeholder="Description du deck..." value={newCard.back} onChange={e => setNewCard({ ...newCard, back: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">Annuler</button>
              <button onClick={() => { handleCreateDeck(newCard.front, newCard.back); setNewCard({ front: '', back: '', hint: '', tags: [], difficulty: 'medium' }); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Créer</button>
            </div>
          </div>
        </div>
      ) : null}

      {showImportModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Importer un deck</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400 mb-4">Glissez-déposez un fichier .json ou cliquez pour sélectionner</p>
              <input type="file" accept=".json" className="hidden" id="import-file" onChange={handleImportInputChange} />
              <button onClick={() => document.getElementById('import-file-input')?.click()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Sélectionner un fichier</button>
              <input type="file" id="import-file-input" accept=".json" className="hidden" onChange={handleImportInputChange} />
            </div>
            <button onClick={() => setShowImportModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">Annuler</button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderReviewSession = () => {
    if (!reviewState) return null;
    return (
      <div className="animate-slideIn">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{reviewState.deck.title}</h3>
              <p className="text-xs text-slate-400">Carte {reviewState.currentIndex + 1} / {reviewState.deck.cards.length} • Score: {reviewState.sessionStats.correct}✓ / {reviewState.sessionStats.incorrect}✗</p>
            </div>
            <button onClick={() => setReviewState(null)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl">Quitter</button>
          </div>

        <div className="perspective-1000">
<div
            className={`relative w-full max-w-2xl mx-auto aspect-[4/3] cursor-pointer ${reviewState.showBack ? 'rotate-y-180' : ''}`}
            onClick={() => setReviewState(s => ({ ...s!, showBack: !s!.showBack }))}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <div className="absolute w-full h-full inset-0 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden" style={{ transform: 'rotateY(0deg)' }}>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Brain className="w-8 h-8 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Question</span>
                </div>
                <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">{reviewState.deck.cards[reviewState.currentIndex]?.front}</p>
                {reviewState.deck.cards[reviewState.currentIndex]?.hint && (
                  <div className="mt-4 p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl">
                    <span className="text-xs text-amber-300 flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>Indice: {reviewState.deck.cards[reviewState.currentIndex].hint}</span>
                    </span>
                  </div>
                )}
                <div className="mt-6 text-xs text-slate-500">Cliquez pour révéler la réponse</div>
              </div>
            </div>

            <div className="absolute w-full h-full inset-0 bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Réponse</span>
                </div>
                <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">{reviewState.deck.cards[reviewState.currentIndex]?.back}</p>
{reviewState.deck.cards[reviewState.currentIndex]?.tags.length ? (
                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {reviewState.deck.cards[reviewState.currentIndex].tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-6 text-xs text-slate-500">Notez votre rappel :</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { q: 0, label: 'Effacé', color: 'bg-rose-600 hover:bg-rose-500' },
              { q: 1, label: 'Difficile', color: 'bg-rose-500 hover:bg-rose-400' },
              { q: 2, label: 'Passable', color: 'bg-amber-500 hover:bg-amber-400' },
              { q: 3, label: 'Correct', color: 'bg-emerald-500 hover:bg-emerald-400' },
            ].map(({ q, label, color }) => {
              const quality = q as 0 | 1 | 2 | 3 | 4 | 5;
              return (
                <button
                  key={q}
                  onClick={() => handleReviewAction(quality)}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold transition ${color} text-white`}
                  disabled={!reviewState}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progression: {reviewState.currentIndex + 1} / {reviewState.deck.cards.length}</span>
              <span>✓ {reviewState.sessionStats.correct}  ✗ {reviewState.sessionStats.incorrect}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300" style={{ width: (((reviewState.currentIndex + 1) / reviewState.deck.cards.length) * 100) + '%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            <span>Flashcards & Répétition Espacée</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Algorithme SM-2 • Révision espacée adaptative • Génération auto depuis documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setSettings(s => ({ ...s, shuffleCards: !s.shuffleCards }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${settings.shuffleCards ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
            {settings.shuffleCards ? <Zap className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-slate-500" />}
            <span className="ml-1">Mélanger</span>
          </button>
          <button onClick={() => setShowCreateModal(true)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Deck</span>
          </button>
          <button onClick={() => { const deck = activeDeck || decks[0]; if (deck) handleImportExport('export', deck.id); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
          <button onClick={() => setShowImportModal(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Importer</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer">
              Fermer
            </button>
          )}
        </div>
      </div>

      {reviewState ? renderReviewSession() : renderDeckSelector()}
    </div>
  );
};

export default FlashcardDeck;