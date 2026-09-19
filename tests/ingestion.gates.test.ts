/**
 * Gates RED/GREEN — D3, D5, D6 (audit du 2026-09-19).
 * À copier dans tests/ingestion.gates.test.ts du projet.
 *
 * Règle : chaque describe contient 1 test témoin (doit être VERT avant ET après le correctif,
 * il prouve que les mocks fonctionnent) + les tests RED (doivent échouer avant, passer après).
 * Aucun service externe : Ollama, Chroma et officeparser sont mockés.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// --- Mocks partagés (vi.hoisted : disponibles dans les factories vi.mock hoistées) ---
const mocks = vi.hoisted(() => ({
  embed: vi.fn(),
  deleteByFilename: vi.fn(),
  addChunks: vi.fn(),
  parseOffice: vi.fn(),
}));

vi.mock("../src/services/ollamaService", () => ({
  ollamaService: { embed: mocks.embed },
}));
vi.mock("../src/services/vectorStore", () => ({
  vectorStore: { deleteByFilename: mocks.deleteByFilename, addChunks: mocks.addChunks },
}));
vi.mock("officeparser", () => ({ parseOffice: mocks.parseOffice }));

// Import STATIQUE : CORPUS_DIR est figé au chargement du module (cwd = racine du projet).
import { ingestDocument, ingestCustomDocument } from "../src/services/ingestion";
import { DETAILED_DOCUMENTS_MAP } from "../src/data/documentsDetailData";

const LONG_TEXT = "Phrase de test suffisamment longue pour produire au moins un chunk valide. ".repeat(40);

function fakeEmbeddings(chunks: string[]): number[][] {
  return chunks.map(() => [0.1, 0.2, 0.3]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.embed.mockImplementation(async (chunks: string[]) => fakeEmbeddings(chunks));
  mocks.deleteByFilename.mockResolvedValue(0);
  mocks.addChunks.mockResolvedValue(undefined);
  mocks.parseOffice.mockResolvedValue({ content: [{ text: LONG_TEXT }] });
});

// ---------------------------------------------------------------------------
describe("D3 — ré-ingestion atomique (delete APRÈS embed)", () => {
  it("D3-control: chemin nominal ingère et retourne success", async () => {
    const result = await ingestCustomDocument("gate-d3.md", LONG_TEXT);
    expect(result.success).toBe(true);
    expect(mocks.addChunks).toHaveBeenCalledTimes(1);
  });

  it("D3-a: ne supprime JAMAIS les anciens chunks si embed échoue", async () => {
    mocks.embed.mockRejectedValue(new Error("ollama down"));
    // Indépendant de l'implémentation : lève ou retourne {success:false}, les deux sont acceptables.
    await ingestCustomDocument("gate-d3.md", LONG_TEXT).then(
      (value) => value,
      (error) => error,
    );
    expect(mocks.deleteByFilename).not.toHaveBeenCalled();
    expect(mocks.addChunks).not.toHaveBeenCalled();
  });

  it("D3-b: ordre des appels = embed, puis delete, puis add", async () => {
    await ingestCustomDocument("gate-d3.md", LONG_TEXT);
    const embedAt = mocks.embed.mock.invocationCallOrder[0];
    const deleteAt = mocks.deleteByFilename.mock.invocationCallOrder[0];
    const addAt = mocks.addChunks.mock.invocationCallOrder[0];
    expect(embedAt).toBeLessThan(deleteAt);
    expect(deleteAt).toBeLessThan(addAt);
  });
});

// ---------------------------------------------------------------------------
describe("D5 — images standalone exclues de l'ingestion par extension", () => {
  const imageFilenames = Object.keys(DETAILED_DOCUMENTS_MAP).filter((name) => /\.jpe?g$/i.test(name));

  it("D5-control: la map contient bien des images JPEG", () => {
    expect(imageFilenames).toHaveLength(52);
  });

  it("D5-a: ingestAllCorpus ignore les images (skipped: true)", async () => {
    const { ingestAllCorpus } = await import("../src/services/ingestion");
    const results = await ingestAllCorpus();
    const imageResults = results.filter(r => /\.jpe?g$/i.test(r.filename));
    expect(imageResults).toHaveLength(0);
  });

  it("D5-b: ingestDocument sur une image renvoie skipped: true", async () => {
    const { ingestDocument } = await import("../src/services/ingestion");
    const result = await ingestDocument("10competencesia.jpeg");
    expect(result.success).toBe(true);
    expect(result.skipped).toBe(true);
    expect(result.chunksCreated).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe("D6 — pas de tentative d'OCR sans eng.traineddata dans le cwd", () => {
  const pptxFilename = "AI_Engineering_Blueprint.pptx";

  async function ingestFromCwd(cwd: string): Promise<void> {
    const previousCwd = process.cwd();
    process.chdir(cwd);
    try {
      await ingestDocument(pptxFilename).then(
        (value) => value,
        (error) => error,
      );
    } finally {
      process.chdir(previousCwd);
    }
  }

  function ocrRequested(): boolean {
    return mocks.parseOffice.mock.calls.some(([, config]) => Boolean(config && config.ocr));
  }

  it("D6-control: avec eng.traineddata présent, l'OCR reste activé", async () => {
    const withLangData = fs.mkdtempSync(path.join(os.tmpdir(), "gate-d6-ok-"));
    fs.writeFileSync(path.join(withLangData, "eng.traineddata"), "dummy");
    await ingestFromCwd(withLangData);
    expect(ocrRequested()).toBe(true);
  });

  it("D6-a: sans eng.traineddata, parseOffice n'est jamais appelé avec ocr:true", async () => {
    const withoutLangData = fs.mkdtempSync(path.join(os.tmpdir(), "gate-d6-ko-"));
    await ingestFromCwd(withoutLangData);
    expect(ocrRequested()).toBe(false);
  });
});