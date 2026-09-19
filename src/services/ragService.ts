import { ollamaService } from "./ollamaService";
import { vectorStore, SearchResult } from "./vectorStore";

export interface RAGContext {
  query: string;
  retrievedChunks: SearchResult[];
  contextText: string;
}

export async function retrieveContext(
  query: string,
  topK = 5,
  categoryFilter?: string
): Promise<RAGContext> {
  const queryEmbedding = await ollamaService.embed(query);
  
  let results = await vectorStore.search(queryEmbedding[0], topK * 2);
  
  if (categoryFilter) {
    results = results.filter(r => r.metadata.category === categoryFilter);
  }
  
  results = results.slice(0, topK);

  const contextText = results
    .map((r, i) => `[Source ${i + 1}: ${r.metadata.filename} (${r.metadata.category})]\n${r.content}`)
    .join("\n\n---\n\n");

  return {
    query,
    retrievedChunks: results,
    contextText,
  };
}

const RAG_SYSTEM_PROMPT = `Tu es l'expert RAG du Tuteur Scolastique. Tu réponds en t'appuyant UNIQUEMENT sur les extraits de documents fournis dans le contexte.

Règles strictes :
1. Cite tes sources avec [Source X] après chaque affirmation
2. Si l'information n'est pas dans le contexte, dis-le explicitement
3. Ne hallucine pas - utilise uniquement le contexte fourni
4. Réponds en français, avec rigueur technique et pédagogie
5. Si plusieurs sources contredisent, signale-le`;

export async function generateRAGResponse(
  query: string,
  history: Array<{ role: string; content: string }>,
  options: { topK?: number; categoryFilter?: string } = {}
): Promise<{ response: string; context: RAGContext }> {
  const { topK = 5, categoryFilter } = options;
  
  const context = await retrieveContext(query, topK, categoryFilter);
  
  const messages = [
    { role: "system" as const, content: RAG_SYSTEM_PROMPT },
    ...history.slice(-4).map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
    { role: "user" as const, content: `Contexte documentaire :\n${context.contextText}\n\nQuestion : ${query}` }
  ];

  const model = ollamaService.getModelForMode("expert_rag");
  const response = await ollamaService.chat(messages, { model, temperature: 0.3 });

  return { response, context };
}