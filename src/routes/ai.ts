import { Router, Response } from "express";
import { AuthenticatedRequest, ChatRequest, QuizRequest, TestPromptRequest, AIMessage } from "../types";
import { SYSTEM_PROMPTS, buildMessages, generateWithFallback, generateJSONWithFallback, checkOutputGate, QUIZ_SYSTEM_PROMPT } from "../ai";
import { ollamaService } from "../services/ollamaService";
import { generateRAGResponse } from "../services/ragService";
import { studentStore } from "../services/studentStore";
import { strictRateLimiter } from "../middleware/rateLimiters";
import { QuizArraySchema, QUIZ_JSON_SCHEMA } from "../schemas";

export const aiRouter = Router();

aiRouter.post("/chat", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, history, mode } = req.body as ChatRequest;
    
    console.log(`[${req.requestId}] /api/ai/chat - mode: ${mode}, message: ${message?.substring(0, 50)}`);
    
    const session = req.studentSession!;
    studentStore.incrementMessageCount(session.sessionId);
    
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message requis" });
    }
    if (message.length > 10000) {
      return res.status(400).json({ error: "Message trop long (max 10000 caractères)" });
    }
    if (history && history.length > 20) {
      return res.status(400).json({ error: "Historique trop long (max 20 messages)" });
    }

    let response: string;
    let context: unknown = null;

    if (mode === 'expert_rag') {
      try {
        const formattedHistory = (history || []).map(h => ({ role: h.role, content: h.content || h.text || '' }));
        const ragResult = await generateRAGResponse(message, formattedHistory, { topK: 5 });
        response = ragResult.response;
        context = ragResult.context;
      } catch (ragError) {
        console.warn(`[${req.requestId}] RAG failed, falling back to standard:`, ragError);
        const systemPrompt = SYSTEM_PROMPTS.expert_rag;
        const messages = buildMessages(systemPrompt, history, message);
        const model = ollamaService.getModelForMode('expert_rag');
        response = await generateWithFallback(messages, model, { temperature: 0.7 });
      }
    } else {
      const systemPrompt = SYSTEM_PROMPTS[mode || 'default'] || SYSTEM_PROMPTS.default;
      const messages = buildMessages(systemPrompt, history, message);
      const model = ollamaService.getModelForMode(mode || 'default');
      
      console.log(`[${req.requestId}] Using model: ${model}, messages: ${messages.length}`);
      response = await generateWithFallback(messages, model, { temperature: 0.7 });
    }
    
    console.log(`[${req.requestId}] Response received, length: ${response.length}`);
    
    const gateResult = await checkOutputGate(response, mode || 'default');
    if (gateResult.isLeak || gateResult.isJailbreak) {
      console.log(`[${req.requestId}] OutputGate BLOCKED: leak=${gateResult.isLeak} jailbreak=${gateResult.isJailbreak}`);
      studentStore.incrementHintsGiven(session.sessionId);
      studentStore.updateFrustration(session.sessionId, Math.min(session.currentFrustration + 1, 5));
      return res.json({ text: gateResult.safeResponse, context, blocked: true });
    }
    
    studentStore.incrementMessageCount(session.sessionId);
    
    if (session.messageCount >= 10 && session.pedagogicalStep === 'exploration') {
      studentStore.updatePedagogicalStep(session.sessionId, 'friction');
    } else if (session.messageCount >= 20 && session.pedagogicalStep === 'friction') {
      studentStore.updatePedagogicalStep(session.sessionId, 'remediation');
    }
    
    res.json({ text: response, context, sessionId: session.sessionId, pedagogicalStep: session.pedagogicalStep, frustrationLevel: session.currentFrustration });
  } catch (error: unknown) {
    console.error(`[${req.requestId}] AI Chat error:`, error);
    res.status(500).json({ error: "Erreur lors de la génération IA", requestId: req.requestId });
  }
});

aiRouter.post("/quiz-generate", strictRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, difficulty } = req.body as QuizRequest;

    if (topic && topic.length > 200) {
      return res.status(400).json({ error: "Sujet trop long (max 200 caractères)" });
    }

    const userPrompt = `Génère 3 questions d'évaluation technique à choix multiples (QCM) pour un étudiant qui apprend à devenir AI Engineer avec le Tuteur Scolastique (RAG, Arch Linux, Ollama, MCP, bases vectorielles, architecture en 7 couches).
Thème : ${topic || "Architecture RAG et Agents"}
Niveau : ${difficulty || "Intermédiaire"}

Format JSON strict attendu (tableau d'objets) :
[
  {
    "question": "Texte précis de la question",
    "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
    "correctIndex": 0,
    "explanation": "Explication pédagogique et socratique de la réponse"
  }
]`;

    const messages: AIMessage[] = [
      { role: 'system', content: QUIZ_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ];

    const model = ollamaService.getModelForMode('quiz');
    const quiz = await generateJSONWithFallback<{ question: string; options: string[]; correctIndex: number; explanation: string }[]>(messages, model, QUIZ_JSON_SCHEMA, QuizArraySchema);
    
    res.json({ quiz });
  } catch (error: unknown) {
    console.error(`[${req.requestId}] AI Quiz error:`, error);
    res.status(500).json({ error: "Erreur lors de la génération du quiz", requestId: req.requestId });
  }
});

aiRouter.post("/test-prompt", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userQuery, withCtx, withCot, withRtoc, withPed } = req.body as TestPromptRequest;

    if (!userQuery?.trim()) {
      return res.status(400).json({ error: "userQuery requis" });
    }
    if (userQuery.length > 5000) {
      return res.status(400).json({ error: "Requête trop longue (max 5000 caractères)" });
    }

    let assembledPrompt = "";
    if (withCtx) {
      assembledPrompt += `Contexte : débutant total en Python et Git, projet tuteur-scolastique, dossier ${process.cwd()}.\n`;
    }
    if (withCot) {
      assembledPrompt += `CoT : raisonne étape par étape AVANT d'agir, en écrivant : 1) le but, 2) les étapes prévues, 3) les commandes exactes.\n`;
    }
    if (withRtoc) {
      assembledPrompt += `RTOC : Run chaque commande une par une et valide le résultat avant la suivante.\n`;
    }
    if (withPed) {
      assembledPrompt += `Pédagogie : Explique chaque commande ou ligne de code en commentaire français simple AVANT de la lancer.\n`;
    }

    assembledPrompt += `\nDemande utilisateur :\n${userQuery}`;

    const messages: AIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPTS.default },
      { role: 'user', content: assembledPrompt }
    ];

    const model = ollamaService.getModelForMode('test-prompt');
    const result = await generateWithFallback(messages, model, { temperature: 0.4 });

    res.json({ assembledPrompt, result });
  } catch (error: unknown) {
    console.error(`[${req.requestId}] Prompt test error:`, error);
    res.status(500).json({ error: "Erreur lors du test de prompt", requestId: req.requestId });
  }
});

aiRouter.post("/embed", strictRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "input requis" });
    
    const inputArray = Array.isArray(input) ? input : [input];
    if (inputArray.length > 50) {
      return res.status(400).json({ error: "Trop d'entrées (max 50)" });
    }
    if (inputArray.some((s: string) => s.length > 8000)) {
      return res.status(400).json({ error: "Entrée trop longue (max 8000 caractères par entrée)" });
    }

    if (!(await ollamaService.healthCheck())) {
      return res.status(503).json({ error: "Ollama indisponible pour embeddings" });
    }

    const embeddings = await ollamaService.embed(inputArray);
    res.json({ embeddings });
  } catch (error: unknown) {
    console.error(`[${req.requestId}] Embedding error:`, error);
    res.status(500).json({ error: "Erreur lors de l'embedding", requestId: req.requestId });
  }
});
