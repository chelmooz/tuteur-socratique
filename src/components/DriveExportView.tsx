/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken,
  getCurrentUser
} from '../services/authService';
import { createDriveFolder, uploadDriveFile } from '../services/driveService';
import { 
  generateReadmeMarkdown, 
  generateDiagnosticMarkdown, 
  generateRoadmapMarkdown, 
  generateSurvivalKitMarkdown, 
  generateCorpusMarkdown, 
  generateAILabMarkdown, 
  generateAutomatedBashScript 
} from '../utils/documentationGenerator';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';
import { DriveExportFile, DriveExportProgress } from '../types';
import { 
  CloudUpload, 
  FolderPlus, 
  FileCode, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Eye, 
  Lock, 
  RefreshCw, 
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Check,
  FolderGit2
} from 'lucide-react';

export const DriveExportView: React.FC = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<DriveExportFile | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [exportProgress, setExportProgress] = useState<DriveExportProgress>({
    step: 'idle',
    completedFiles: 0,
    totalFiles: 0,
    uploadedFiles: [],
  });

  // Prepare file list
  const exportFiles: DriveExportFile[] = [
    {
      name: 'site-complet-tuteur-scolastique.html',
      mimeType: 'text/html',
      description: 'Site web complet autonome avec interface interactive (Roadmap, Corpus 31 Docs, Kit Survie, Lab IA)',
      sizeEstimate: '~45 Ko',
      getContent: generateStandaloneHtml,
    },
    {
      name: 'README-GUIDE-COMPLET.md',
      mimeType: 'text/markdown',
      description: 'Notice maîtresse du projet Tuteur Scolastique IA & Architecture RAG',
      sizeEstimate: '~6 Ko',
      getContent: generateReadmeMarkdown,
    },
    {
      name: '01-DIAGNOSTIC-ET-CADRAGE.md',
      mimeType: 'text/markdown',
      description: 'Matrice de diagnostic technique, environnement Python et prérequis',
      sizeEstimate: '~4 Ko',
      getContent: generateDiagnosticMarkdown,
    },
    {
      name: '02-ROADMAP-JALON-1-ET-2.md',
      mimeType: 'text/markdown',
      description: 'Détail exhaustif des tâches Pomodoro Semaine 1 et planning Semaine 2',
      sizeEstimate: '~18 Ko',
      getContent: generateRoadmapMarkdown,
    },
    {
      name: '03-BOITE-A-OUTILS-TERMINAL-ET-GLOSSAIRE.md',
      mimeType: 'text/markdown',
      description: 'Commandes terminales essentielles (Python, Ollama, Git) et glossaire IA',
      sizeEstimate: '~7 Ko',
      getContent: generateSurvivalKitMarkdown,
    },
    {
      name: '04-CATALOGUE-31-SOURCES-RAG.md',
      mimeType: 'text/markdown',
      description: 'Inventaire des 31 sources documentaires, classification et stratégies de chunking',
      sizeEstimate: '~14 Ko',
      getContent: generateCorpusMarkdown,
    },
    {
      name: '05-LAB-IA-ET-CONFIG-OLLAMA.md',
      mimeType: 'text/markdown',
      description: 'Configuration Ollama systemd, code source CLI tuteur.py et templates de prompts CoT/RTOC',
      sizeEstimate: '~8 Ko',
      getContent: generateAILabMarkdown,
    },
    {
      name: '06-SCRIPTS-AUTOMATISATION-ARCH.sh',
      mimeType: 'text/x-shellscript',
      description: 'Script Bash exécutable pour configurer l’arborescence et valider l’environnement local',
      sizeEstimate: '~3 Ko',
      getContent: generateAutomatedBashScript,
    },
  ];

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion Google :', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  const downloadFileLocally = (file: DriveExportFile) => {
    const content = file.getContent();
    const blob = new Blob([content], { type: `${file.mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllLocally = () => {
    exportFiles.forEach((file) => {
      downloadFileLocally(file);
    });
  };

  // Execution after user confirmation in modal
  const handleExecuteDriveExport = async () => {
    if (!token) {
      alert("Veuillez vous connecter avec votre compte Google au préalable.");
      return;
    }

    setShowConfirmModal(false);

    setExportProgress({
      step: 'creating_folder',
      completedFiles: 0,
      totalFiles: exportFiles.length,
      uploadedFiles: [],
    });

    try {
      // 1. Create Folder
      const timestamp = new Date().toISOString().slice(0, 10);
      const folderName = `Tuteur Scolastique IA - Pack AI Engineer (${timestamp})`;
      const folder = await createDriveFolder(token, folderName);

      const uploadedFilesList: Array<{ id: string; name: string; webViewLink?: string }> = [];

      // 2. Upload files sequentially
      setExportProgress((prev) => ({
        ...prev,
        step: 'uploading_files',
        folderId: folder.id,
        folderUrl: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
      }));

      for (let i = 0; i < exportFiles.length; i++) {
        const file = exportFiles[i];
        setExportProgress((prev) => ({
          ...prev,
          currentFileName: file.name,
          completedFiles: i,
        }));

        const content = file.getContent();
        const uploaded = await uploadDriveFile(
          token,
          file.name,
          content,
          file.mimeType,
          folder.id
        );

        uploadedFilesList.push({
          id: uploaded.id,
          name: file.name,
          webViewLink: uploaded.webViewLink,
        });
      }

      // 3. Complete
      setExportProgress({
        step: 'complete',
        completedFiles: exportFiles.length,
        totalFiles: exportFiles.length,
        folderId: folder.id,
        folderUrl: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
        uploadedFiles: uploadedFilesList,
      });
    } catch (err: any) {
      console.error("Erreur d'exportation vers Drive :", err);
      setExportProgress((prev) => ({
        ...prev,
        step: 'error',
        error: err.message || "Une erreur est survenue lors de l'exportation sur Google Drive.",
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <CloudUpload className="w-3.5 h-3.5" />
              <span>Exportation Cloud & Pack Hors-Ligne</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Déposer le Site Complet & les Fiches sur votre Google Drive
            </h2>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Générez le site complet interactif autonome ainsi que l'ensemble des fiches techniques issues des 36 sources documentaires (socle et spécialisation avancée), et enregistrez-les directement dans un nouveau dossier dédié sur votre Google Drive.
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 min-w-[280px]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Utilisateur'}
                      className="w-10 h-10 rounded-full border border-indigo-500/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.displayName || 'Compte Google'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-emerald-400 flex items-center space-x-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Google Drive Connecté</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-400">
                  Connectez votre compte Google pour créer le dossier et déposer les fichiers sur votre Drive.
                </p>

                {/* Standard Google Sign In Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs px-4 py-2.5 rounded-lg shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Scope minimal sécurisé : accès uniquement aux fichiers créés par cette application</span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/api/download-zip"
              download="tuteur-scolastique-ai-engineer.zip"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Code (.ZIP)</span>
            </a>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!user || exportProgress.step === 'creating_folder' || exportProgress.step === 'uploading_files'}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <CloudUpload className="w-4 h-4 text-indigo-400" />
              <span>Déposer sur Google Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* GitHub & ZIP Direct Export Box */}
      <div className="bg-slate-900 border border-indigo-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <FolderGit2 className="w-4 h-4" />
              <span>Export Direct GitHub & Archive Source</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Publier sur votre profil GitHub (<span className="text-indigo-400 font-mono">chelmooz</span>)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Téléchargez l'archive complète du projet (code source React + Express + 36 fiches techniques + pipelines RAG) en un clic, puis importez-la instantanément dans votre dépôt GitHub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="/api/download-zip"
              download="tuteur-scolastique-ai-engineer.zip"
              className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger l'Archive .ZIP</span>
            </a>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-4 py-3 rounded-xl transition cursor-pointer"
            >
              <span>Créer le repo sur GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Command Box */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Commandes pour pousser sur github.com/chelmooz :</span>
            </span>
            <button
              onClick={() => {
                const cmd = `unzip tuteur-scolastique-ai-engineer.zip -d tuteur-scolastique && cd tuteur-scolastique\ngit init\ngit add .\ngit commit -m "feat: Tuteur Scolastique RAG, gamification et blueprints"\ngit branch -M main\ngit remote add origin https://github.com/chelmooz/tuteur-scolastique-rag.git\ngit push -u origin main`;
                navigator.clipboard.writeText(cmd);
                setCopiedId('git-push');
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center space-x-1 border border-slate-700 transition cursor-pointer"
            >
              {copiedId === 'git-push' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>Copier les commandes</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto select-all leading-relaxed">
{`unzip tuteur-scolastique-ai-engineer.zip -d tuteur-scolastique && cd tuteur-scolastique
git init
git add .
git commit -m "feat: Tuteur Scolastique RAG, gamification et blueprints"
git branch -M main
git remote add origin https://github.com/chelmooz/tuteur-scolastique-rag.git
git push -u origin main`}
          </pre>
        </div>
      </div>

      {/* Progress Card when Exporting */}
      {exportProgress.step !== 'idle' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {exportProgress.step === 'complete' ? (
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : exportProgress.step === 'error' ? (
                <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-5 h-5" />
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-white">
                  {exportProgress.step === 'creating_folder' && 'Création du dossier sur votre Google Drive...'}
                  {exportProgress.step === 'uploading_files' && `Téléversement des fichiers : ${exportProgress.currentFileName || ''}`}
                  {exportProgress.step === 'complete' && 'Succès ! Tous les fichiers ont été déposés sur votre Google Drive.'}
                  {exportProgress.step === 'error' && "Erreur lors de l'exportation sur Google Drive"}
                </h3>
                <p className="text-xs text-slate-400">
                  {exportProgress.step === 'complete'
                    ? `${exportProgress.completedFiles} fichiers créés dans le dossier dédié.`
                    : `${exportProgress.completedFiles} / ${exportProgress.totalFiles} fichiers traités`}
                </p>
              </div>
            </div>

            {exportProgress.folderUrl && (
              <a
                href={exportProgress.folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <span>Ouvrir dans Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                exportProgress.step === 'error' ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{
                width: `${
                  exportProgress.totalFiles > 0
                    ? Math.round((exportProgress.completedFiles / exportProgress.totalFiles) * 100)
                    : 0
                }%`,
              }}
            />
          </div>

          {exportProgress.error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {exportProgress.error}
            </div>
          )}

          {/* Uploaded Files Links */}
          {exportProgress.uploadedFiles.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-medium text-slate-400 block mb-2">Fichiers transférés :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {exportProgress.uploadedFiles.map((f) => (
                  <a
                    key={f.id}
                    href={f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <span className="truncate">{f.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Package Files List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Inventaire des Fichiers du Pack (8 éléments)</h3>
            <p className="text-xs text-slate-400">
              Chaque élément a été compilé à partir des 31 documents du dossier source Google Drive.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFiles.map((file, idx) => {
            const isHtml = file.name.endsWith('.html');
            const isSh = file.name.endsWith('.sh');
            return (
              <div
                key={file.name}
                className={`bg-slate-900/80 border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  isHtml
                    ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {isHtml ? (
                        <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                          <FileCode className="w-4 h-4" />
                        </span>
                      ) : isSh ? (
                        <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <Terminal className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                          <FileText className="w-4 h-4" />
                        </span>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100 font-mono">
                          {file.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">{file.sizeEstimate}</span>
                      </div>
                    </div>

                    {isHtml && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Site Autonome
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {file.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPreviewFile(file)}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>

                  <button
                    onClick={() => downloadFileLocally(file)}
                    className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal (MANDATORY per Workspace Skill) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-indigo-400">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirmation de création sur Google Drive</h3>
                <p className="text-xs text-slate-400">Compte : {user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p>
                L'application va exécuter les opérations suivantes sur votre compte Google Drive :
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>Créer un dossier intitulé <strong className="text-slate-200">« Tuteur Scolastique IA - Pack AI Engineer »</strong>.</li>
                <li>Déposer le fichier <strong className="text-indigo-400">site-complet-tuteur-scolastique.html</strong> (site web interactif complet).</li>
                <li>Déposer les 6 fiches d'instructions Markdown (Diagnostic, Roadmap, Kit survie, 31 Sources RAG, Lab IA).</li>
                <li>Déposer le script bash d'automatisation d'environnement.</li>
              </ul>
              <p className="text-[11px] text-emerald-400 pt-1">
                ✓ Cette action n'écrase ni ne supprime aucun fichier existant sur votre Drive.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleExecuteDriveExport}
                className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Confirmer et déposer sur mon Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Content Preview Modal */}
      {selectedPreviewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-sm font-bold text-white">
                  {selectedPreviewFile.name}
                </span>
                <span className="text-xs text-slate-500">({selectedPreviewFile.mimeType})</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadFileLocally(selectedPreviewFile)}
                  className="inline-flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={() => setSelectedPreviewFile(null)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300">
              <pre className="whitespace-pre-wrap">{selectedPreviewFile.getContent()}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
