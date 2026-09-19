import { z } from 'zod';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatOptions {
  model: string;
  temperature?: number;
  format?: 'json';
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface OllamaEmbedOptions {
  model: string;
  input: string | string[];
}

export interface OllamaHealthResponse {
  models: string[];
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_TUTEUR = process.env.OLLAMA_MODEL_TUTEUR || 'qwen2.5:7b';
const MODEL_EXPERT = process.env.OLLAMA_MODEL_EXPERT || 'qwen2.5:7b';
const MODEL_EMBEDDING = process.env.OLLAMA_MODEL_EMBEDDING || 'bge-m3:latest';

const DEFAULT_TIMEOUT = 60000;
const HEALTH_CHECK_TTL = 10000; // 10 seconds

function getHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = DEFAULT_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export class OllamaService {
  private baseUrl: string;
  private availableModels: string[] = [];
  private healthCheckCache: { value: boolean; timestamp: number } | null = null;

  constructor(baseUrl = OLLAMA_HOST) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async healthCheck(): Promise<boolean> {
    // Return cached result if within TTL
    if (this.healthCheckCache && Date.now() - this.healthCheckCache.timestamp < HEALTH_CHECK_TTL) {
      return this.healthCheckCache.value;
    }

    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/api/tags`, { method: 'GET' }, 5000);
      const result = response.ok;
      if (result) {
        const data = await response.json() as { models: Array<{ name: string }> };
        this.availableModels = data.models?.map(m => m.name) || [];
      }
      this.healthCheckCache = { value: result, timestamp: Date.now() };
      return result;
    } catch {
      this.healthCheckCache = { value: false, timestamp: Date.now() };
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    if (this.availableModels.length === 0) {
      await this.healthCheck();
    }
    return this.availableModels;
  }

  async chat(messages: Message[], options: OllamaChatOptions): Promise<string> {
    const { model, temperature = 0.7, format, stream = false } = options;
    
    const ollamaMessages: OllamaMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const payload = {
      model,
      messages: ollamaMessages,
      stream,
      options: { temperature },
      ...(format === 'json' && { format: 'json' })
    };

    const response = await fetchWithTimeout(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      throw new Error(`Ollama chat failed (${response.status}): ${error}`);
    }

    if (stream && options.onToken) {
      return this.handleStream(response, options.onToken);
    }

    const data = await response.json() as { message: { content: string } };
    return data.message?.content || '';
  }

  private async handleStream(response: Response, onToken: (token: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim());
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            const token = parsed.message?.content || '';
            if (token) {
              fullContent += token;
              onToken(token);
            }
            if (parsed.done) break;
          } catch {
            // Ignore parse errors for partial chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullContent;
  }

  async chatJSON<T>(messages: Message[], model: string, jsonSchema: object, zodSchema?: z.ZodType<T>): Promise<T> {
    const content = await this.chat(messages, { model, format: 'json', temperature: 0.3 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON from Ollama:', content);
      throw new Error(`Invalid JSON response from ${model}: ${e}`);
    }
    if (zodSchema) {
      const result = zodSchema.safeParse(parsed);
      if (!result.success) {
        console.error('Zod validation failed:', result.error.format(), 'raw:', content);
        throw new Error(`Schema validation failed: ${result.error.issues.map(i => i.message).join(', ')}`);
      }
      return result.data;
    }
    return parsed as T;
  }

  async *stream(messages: Message[], model: string, options: Partial<OllamaChatOptions> = {}): AsyncGenerator<string> {
    const { temperature = 0.7 } = options;
    
    const ollamaMessages: OllamaMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await fetchWithTimeout(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model,
        messages: ollamaMessages,
        stream: true,
        options: { temperature }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama stream failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim());
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            const token = parsed.message?.content || '';
            if (token) yield token;
            if (parsed.done) return;
          } catch {
            // Ignore parse errors
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async embed(input: string | string[], model = MODEL_EMBEDDING): Promise<number[][]> {
    const inputs = Array.isArray(input) ? input : [input];
    const response = await fetchWithTimeout(`${this.baseUrl}/api/embed`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ model, input: inputs })
    });

    if (!response.ok) {
      throw new Error(`Ollama embed failed: ${response.status}`);
    }

    const data = await response.json() as { embeddings: number[][] };
    return data.embeddings || [];
  }

  getModelForMode(mode: string): string {
    switch (mode) {
      case 'tuteur_eleve':
        return MODEL_TUTEUR;
      case 'expert_rag':
      case 'quiz':
      case 'test-prompt':
      default:
        return MODEL_EXPERT;
    }
  }

  isModelAvailable(model: string): boolean {
    return this.availableModels.some(m => m === model || m.startsWith(model.split(':')[0]));
  }
}

export const ollamaService = new OllamaService();