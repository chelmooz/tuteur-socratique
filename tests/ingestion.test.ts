import { describe, it, expect, vi, beforeEach } from "vitest";
import { chunkText } from "../src/services/ingestion";

describe("chunkText", () => {
  it("should split text into chunks respecting token limits", () => {
    // Create text with proper sentences (~160 chars each * 30 = ~4800 chars = ~1200 tokens)
    const sentence = "This is a test sentence that is long enough to be a proper sentence. ";
    const text = sentence.repeat(30); // ~30 sentences
    const chunks = chunkText(text, 400, 80); // maxTokens=400, overlapTokens=80
    
    expect(chunks.length).toBeGreaterThan(1);
    // Token-based: 400 tokens * 4 chars/token ≈ 1600 chars max per chunk
    chunks.forEach(chunk => {
      expect(chunk.length).toBeLessThanOrEqual(1700); // token estimate allows ~1600 chars
    });
  });

  it("should handle text smaller than chunk size", () => {
    // Must be > 100 chars to pass the minimum chunk filter
    const text = "This is a short text that is longer than fifty characters to pass the filter. It ends with a period. Adding more content to exceed the minimum chunk size threshold.";
    const chunks = chunkText(text, 400, 80);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("should filter out very small chunks", () => {
    const text = "Short. " + "This is a long sentence that will create a valid chunk because it has enough words and characters to pass the minimum length filter. " + "Also short.";
    const chunks = chunkText(text, 400, 80);
    chunks.forEach(chunk => {
      expect(chunk.trim().length).toBeGreaterThan(100); // min chunk filter is 100 chars
    });
  });

  it("should handle empty text", () => {
    const chunks = chunkText("", 400, 80);
    expect(chunks).toHaveLength(0);
  });
});

describe("Ingestion service", () => {
  it("should be importable", async () => {
    const mod = await import("../src/services/ingestion");
    expect(mod.ingestDocument).toBeDefined();
    expect(mod.ingestAllCorpus).toBeDefined();
    expect(mod.ingestCustomDocument).toBeDefined();
  });
});