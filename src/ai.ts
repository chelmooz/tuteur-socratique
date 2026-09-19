import path from "path";
import fs from "fs";
import { z } from "zod";
import { ollamaService } from "./services/ollamaService";
import { opencodeFallback } from "./services/opencodeFallback";
import { AIMessage, ChatRequest } from "./types";
import { OutputGateSchema, OUTPUT_GATE_JSON_SCHEMA } from "./schemas";

export function loadPrompt(name: string): string {
  const filePath = path.join(process.cwd(), "prompts", `${name}.txt`);
  return fs.readFileSync(filePath, "utf-8");
}

export const SYSTEM_PROMPTS: Record<string, string> = {
  default: loadPrompt("default"),
  tuteur_eleve: loadPrompt("tuteur_eleve"),
  expert_rag: loadPrompt("expert_rag")
};

export const SKEPTIC_SYSTEM_PROMPT = loadPrompt("skeptic");
export const QUIZ_SYSTEM_PROMPT = loadPrompt("quiz");

export function buildMessages(systemPrompt: string, history: ChatRequest['history'], userMessage: string): AIMessage[] {
  const messages: AIMessage[] = [{ role: 'system', content: systemPrompt }];
  
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: String(h.content || h.text || '')
      });
    }
  }
  
  messages.push({ role: 'user', content: userMessage || "Analyse le projet Tuteur Scolastique." });
  return messages;
}

export async function generateWithFallback(messages: AIMessage[], model: string, options: { temperature?: number; format?: 'json' } = {}): Promise<string> {
  try {
    if (await ollamaService.healthCheck()) {
      if (ollamaService.isModelAvailable(model)) {
        console.log(`[AI] Using Ollama: ${model}`);
        return await ollamaService.chat(messages, { model, ...options });
      } else {
        console.warn(`[AI] Model ${model} not available in Ollama, trying fallback`);
      }
    }
  } catch (e) {
    console.warn('[AI] Ollama failed:', e instanceof Error ? e.message : e);
  }

  try {
    if (await opencodeFallback.isEnabled()) {
      console.log(`[AI] Fallback to opencode`);
      return await opencodeFallback.chat(messages, { model: options.format === 'json' ? 'auto' : undefined, format: options.format, temperature: options.temperature });
    }
  } catch (e) {
    console.warn('[AI] Opencode fallback failed:', e instanceof Error ? e.message : e);
  }

  throw new Error('Aucun service IA disponible (Ollama et opencode indisponibles)');
}

export async function generateJSONWithFallback<T>(messages: AIMessage[], model: string, schema: object, zodSchema?: z.ZodType<T>): Promise<T> {
  try {
    if (await ollamaService.healthCheck() && ollamaService.isModelAvailable(model)) {
      console.log(`[AI] Using Ollama JSON: ${model}`);
      return await ollamaService.chatJSON<T>(messages, model, schema, zodSchema);
    }
  } catch (e) {
    console.warn('[AI] Ollama JSON failed:', e instanceof Error ? e.message : e);
  }

  try {
    if (await opencodeFallback.isEnabled()) {
      console.log(`[AI] Fallback to opencode JSON`);
      return await opencodeFallback.chatJSON<T>(messages, { temperature: 0.3 });
    }
  } catch (e) {
    console.warn('[AI] Opencode JSON fallback failed:', e instanceof Error ? e.message : e);
  }

  throw new Error('Aucun service IA disponible pour JSON');
}

export async function checkOutputGate(response: string, mode: string): Promise<{ isLeak: boolean; isJailbreak: boolean; safeResponse: string }> {
  if (mode !== 'tuteur_eleve') {
    return { isLeak: false, isJailbreak: false, safeResponse: '' };
  }

  try {
    const model = ollamaService.getModelForMode('expert_rag');
    const result = await generateJSONWithFallback<{ isLeak: boolean; isJailbreak: boolean; confidence: number; reason: string }>(
      [{ role: 'system', content: SKEPTIC_SYSTEM_PROMPT }, { role: 'user', content: `Réponse à évaluer :\n${response}` }],
      model,
      OUTPUT_GATE_JSON_SCHEMA,
      OutputGateSchema
    );

    if (result.isLeak || result.isJailbreak) {
      const safeResponse = "Je ne peux pas te donner la réponse directement. Essaie de raisonner par toi-même : quelle serait la première étape pour aborder ce problème ?";
      return { isLeak: result.isLeak, isJailbreak: result.isJailbreak, safeResponse };
    }

    return { isLeak: false, isJailbreak: false, safeResponse: '' };
  } catch (error) {
    console.warn(`[OutputGate] Erreur de vérification: ${error}`);
    return { isLeak: false, isJailbreak: false, safeResponse: '' };
  }
}
