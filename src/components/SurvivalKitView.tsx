/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  BookOpen, 
  Terminal, 
  Check, 
  Copy, 
  AlertCircle, 
  RefreshCw, 
  GitBranch, 
  Cpu, 
  Folder
} from 'lucide-react';
import { GLOSSARY_ITEMS } from '../data/projectData';

export const SurvivalKitView: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [glossarySearch, setGlossarySearch] = useState('');

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const emergencySections = [
    {
      title: "Dépannage Ollama (Modèle Local)",
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      color: "border-cyan-500/30 bg-cyan-950/10",
      commands: [
        { label: "Vérifier si Ollama tourne", cmd: "curl http://localhost:11434/api/tags" },
        { label: "Vérifier le statut du service systemd", cmd: "systemctl status ollama" },
        { label: "Redémarrer le serveur Ollama", cmd: "sudo systemctl restart ollama" },
        { label: "Lister les modèles téléchargés", cmd: "ollama list" },
        { label: "Tester manuellement un prompt dans le terminal", cmd: "ollama run mistral 'Bonjour, es-tu prêt ?'" },
        { label: "Vérifier si le port 11434 est bloqué", cmd: "ss -tulpn | grep 11434" }
      ]
    },
    {
      title: "Dépannage Python & venv",
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/30 bg-emerald-950/10",
      commands: [
        { label: "Activer l'environnement virtuel", cmd: "source .venv/bin/activate" },
        { label: "Vérifier quel Python est exécuté", cmd: "which python" },
        { label: "Vérifier la version de Python", cmd: "python --version" },
        { label: "Lister les paquets installés", cmd: "pip list" },
        { label: "Installer ou mettre à jour requests", cmd: "pip install requests" },
        { label: "Recréer le venv de zéro si corrompu", cmd: "rm -rf .venv && python -m venv .venv && source .venv/bin/activate" }
      ]
    },
    {
      title: "Commandes de Secours Git",
      icon: <GitBranch className="w-4 h-4 text-amber-400" />,
      color: "border-amber-500/30 bg-amber-950/10",
      commands: [
        { label: "Voir l'état des fichiers modifiés", cmd: "git status" },
        { label: "Voir l'historique compact", cmd: "git log --oneline -n 10" },
        { label: "Annuler les modifications non commitées d'un fichier", cmd: "git restore <nom_fichier>" },
        { label: "Vérifier les différences exactes", cmd: "git diff" },
        { label: "Créer un commit propre", cmd: "git add . && git commit -m 'feat: progression jalon 1'" }
      ]
    }
  ];

  const filteredGlossary = GLOSSARY_ITEMS.filter(
    (item) =>
      item.terme.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Boîte à Outils Terminal & Glossaire de l'Ingénieur IA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Commandes essentielles pour maîtriser l'environnement d'exécution local (Ollama, Python venv, Git) et le glossaire des concepts IA.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Commands Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {emergencySections.map((sec, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 space-y-4 bg-slate-900 ${sec.color}`}
          >
            <div className="flex items-center space-x-2">
              {sec.icon}
              <h3 className="font-bold text-sm text-white tracking-wide">{sec.title}</h3>
            </div>

            <div className="space-y-3">
              {sec.commands.map((c, cIdx) => (
                <div key={cIdx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium mb-1.5">{c.label}</div>
                  <div className="flex items-center justify-between font-mono text-xs text-slate-200 bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800/80">
                    <span className="select-all truncate mr-2">{c.cmd}</span>
                    <button
                      onClick={() => handleCopy(c.cmd)}
                      className="text-slate-400 hover:text-white shrink-0 p-1 rounded hover:bg-slate-800 transition-colors"
                      title="Copier la commande"
                    >
                      {copiedCmd === c.cmd ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Glossary Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Glossaire du Projet (15 Concepts Pédagogiques)</h3>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Rechercher un terme (ex: RAG, venv, LLM)..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.map((g, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-indigo-500/30 transition-all"
            >
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold text-xs border border-indigo-500/20">
                {g.terme}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {g.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
