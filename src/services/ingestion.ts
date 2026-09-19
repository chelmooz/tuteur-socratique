import { ollamaService } from "./ollamaService";
import { vectorStore, DocumentChunk } from "./vectorStore";
import { DETAILED_DOCUMENTS_MAP } from "../data/documentsDetailData";
import * as fs from "fs";
import * as path from "path";
import { parseOffice } from "officeparser";

const CORPUS_DIR = process.env.CORPUS_DIR || path.join(process.cwd(), "data", "corpus");
const CHUNK_MAX_TOKENS = 400;
const CHUNK_OVERLAP_TOKENS = 80;

export interface IngestionResult {
  filename: string;
  chunksCreated: number;
  success: boolean;
  error?: string;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

export function chunkText(text: string, maxTokens = CHUNK_MAX_TOKENS, overlapTokens = CHUNK_OVERLAP_TOKENS): string[] {
  const paragraphs = splitIntoParagraphs(text);
  const chunks: string[] = [];
  let currentChunk = "";
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const sentences = splitIntoSentences(paragraph);
    
    for (const sentence of sentences) {
      const sentenceTokens = estimateTokens(sentence);
      
      if (currentTokens + sentenceTokens > maxTokens && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        
        const overlapText = getOverlapText(currentChunk, overlapTokens);
        currentChunk = overlapText + " " + sentence;
        currentTokens = estimateTokens(currentChunk);
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
        currentTokens += sentenceTokens;
      }
    }
    
    if (currentChunk.length > 0) {
      currentChunk += "\n\n";
      currentTokens += 2;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.trim().length > 100);
}

function getOverlapText(text: string, overlapTokens: number): string {
  const sentences = splitIntoSentences(text).reverse();
  let overlap = "";
  let tokens = 0;
  
  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);
    if (tokens + sentenceTokens > overlapTokens) break;
    overlap = sentence + (overlap ? " " + overlap : "");
    tokens += sentenceTokens;
  }
  
  return overlap;
}

function extractTextFromOfficeParserContent(content: unknown): string {
  const texts: string[] = [];
  
  function traverse(node: unknown) {
    if (!node || typeof node !== "object") return;
    
    const obj = node as Record<string, unknown>;
    
    if (typeof obj.text === "string" && obj.text.trim().length > 0) {
      texts.push(obj.text.trim());
    }
    
    if (Array.isArray(obj.children)) {
      for (const child of obj.children) {
        traverse(child);
      }
    }
    
    if (Array.isArray(obj.notes)) {
      for (const note of obj.notes) {
        traverse(note);
      }
    }
  }
  
  if (Array.isArray(content)) {
    for (const item of content) {
      traverse(item);
    }
  }
  
  return texts.join("\n\n");
}

async function extractTextFromFile(filepath: string, format: string): Promise<string> {
  const ext = path.extname(filepath).toLowerCase();

  const supportedByOfficeParser = [".pdf", ".pptx", ".docx", ".odt", ".odp", ".ods", ".odg", ".rtf", ".csv", ".md", ".html", ".epub"];
  if (supportedByOfficeParser.includes(ext)) {
    try {
      const config = (ext === ".pptx" || ext === ".pdf") ? { ocr: true, extractAttachments: true } : {};
      const result = await parseOffice(filepath, config);
      if (result && result.content) {
        const extractedText = extractTextFromOfficeParserContent(result.content);
        if (extractedText.trim().length > 0) {
          return extractedText;
        }
      }
      console.warn(`[Ingestion] officeparser returned empty content for ${filepath}`);
    } catch (error) {
      console.warn(`[Ingestion] officeparser failed for ${filepath}:`, error);
    }
  }

  switch (ext) {
    case ".html":
    case ".htm":
      const htmlContent = fs.readFileSync(filepath, "utf-8");
      return htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    case ".md":
    case ".txt":
      return fs.readFileSync(filepath, "utf-8");
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".tiff":
    case ".bmp":
      return `[Image format ${ext} not directly supported - skipping OCR for standalone images]`;
    default:
      return `[Format ${format} (${ext}) not supported for text extraction]`;
  }
}

async function deleteExistingChunks(filename: string): Promise<void> {
  await vectorStore.deleteByFilename(filename);
}

export async function ingestDocument(
  filename: string,
  customContent?: string
): Promise<IngestionResult> {
  const docMeta = DETAILED_DOCUMENTS_MAP[filename];
  if (!docMeta && !customContent) {
    return { filename, chunksCreated: 0, success: false, error: "Document metadata not found" };
  }

  const meta = docMeta || {
    filename,
    category: "Custom",
    title: filename,
    format: "TXT",
    importance: "Moyenne",
    description: "",
    chunkingStrategy: "custom",
  };

  let text = customContent;
  if (!text) {
    const filepath = path.join(CORPUS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return { filename, chunksCreated: 0, success: false, error: "File not found" };
    }
    text = await extractTextFromFile(filepath, meta.format);
  }

  if (!text || text.trim().length < 100) {
    return { filename, chunksCreated: 0, success: false, error: "Insufficient content after extraction" };
  }

  const chunks = chunkText(text);
  if (chunks.length === 0) {
    return { filename, chunksCreated: 0, success: false, error: "No valid chunks generated" };
  }

  const embeddings = await ollamaService.embed(chunks);

  await deleteExistingChunks(filename);

  const documentChunks: DocumentChunk[] = chunks.map((chunk, i) => ({
    id: `${filename}_chunk_${i}_${Date.now()}`,
    content: chunk,
    metadata: {
      filename: meta.filename,
      category: meta.category,
      title: meta.title,
      format: meta.format,
      importance: meta.importance,
      chunkIndex: i,
      totalChunks: chunks.length,
      sourceType: customContent ? "custom" : "corpus",
    },
  }));

  await vectorStore.addChunks(documentChunks, embeddings);

  return { filename, chunksCreated: chunks.length, success: true };
}

export async function ingestAllCorpus(): Promise<IngestionResult[]> {
  const results: IngestionResult[] = [];
  const filenames = Object.keys(DETAILED_DOCUMENTS_MAP);
  
  for (const filename of filenames) {
    try {
      console.log(`[Ingestion] Processing ${filename}...`);
      const result = await ingestDocument(filename);
      results.push(result);
      if (!result.success) {
        console.warn(`[Ingestion] Failed ${filename}: ${result.error}`);
      } else {
        console.log(`[Ingestion] ✓ ${filename}: ${result.chunksCreated} chunks`);
      }
    } catch (error) {
      results.push({ 
        filename, 
        chunksCreated: 0, 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
  return results;
}

export async function ingestCustomDocument(filename: string, content: string): Promise<IngestionResult> {
  return ingestDocument(filename, content);
}