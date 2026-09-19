import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpencodeOptions {
  model?: string;
  temperature?: number;
  format?: 'json';
}

export class OpencodeFallback {
  private enabled: boolean;
  private opencodePath: string;
  private timeout: number;

  constructor() {
    this.enabled = process.env.OPENCODE_FALLBACK_ENABLED === 'true';
    this.opencodePath = process.env.OPENCODE_PATH || 'opencode';
    this.timeout = parseInt(process.env.OPENCODE_TIMEOUT || '120000', 10);
  }

  async isEnabled(): Promise<boolean> {
    if (!this.enabled) return false;
    return this.checkOpencodeAvailable();
  }

  private async checkOpencodeAvailable(): Promise<boolean> {
    try {
      await this.runOpencode(['--version']);
      return true;
    } catch {
      return false;
    }
  }

  private async runOpencode(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(this.opencodePath, args, {
      timeout: this.timeout,
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  }

  async chat(messages: Message[], options: { model?: string; temperature?: number; format?: 'json' } = {}): Promise<string> {
    if (!(await this.isEnabled())) {
      throw new Error('Opencode fallback not available');
    }

    const systemPrompt = this.buildSystemPrompt(messages);
    const userPrompt = this.extractUserPrompt(messages);
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const args = [
      'run',
      '--model', options.model || 'auto',
      '--temperature', String(options.temperature ?? 0.7),
      '--no-stream',
      combinedPrompt
    ];

    if (options.format === 'json') {
      args.push('--format', 'json');
    }

    const output = await this.runOpencode(args);
    return this.cleanOutput(output);
  }

  async chatJSON<T>(messages: Message[], _options: { model?: string; temperature?: number } = {}): Promise<T> {
    const content = await this.chat(messages, { format: 'json', temperature: 0.3 });
    try {
      return JSON.parse(content) as T;
    } catch (e) {
      console.error('Failed to parse JSON from opencode:', content);
      throw new Error(`Invalid JSON response from opencode: ${e}`);
    }
  }

  private buildSystemPrompt(messages: Message[]): string {
    const systemMsg = messages.find(m => m.role === 'system');
    if (systemMsg) return systemMsg.content;
    
    return `Tu es un assistant IA expert pour le projet "Tuteur Scolastique" (apprentissage IA/RAG/Architecture).
Réponds en français, avec clarté et rigueur technique.
Encourage la compréhension profonde plutôt que le copier-coller.`;
  }

  private extractUserPrompt(messages: Message[]): string {
    const userMessages = messages.filter(m => m.role === 'user');
    return userMessages.map(m => m.content).join('\n\n');
  }

  private cleanOutput(output: string): string {
    return output
      .replace(/^.*?\{/, '{')
      .replace(/\}.*?$/, '}')
      .trim();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.runOpencode(['--version']);
      return true;
    } catch {
      return false;
    }
  }
}

export const opencodeFallback = new OpencodeFallback();