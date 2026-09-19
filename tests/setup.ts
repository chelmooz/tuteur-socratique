import { vi } from "vitest";

class MockChromaCollection {
  add = vi.fn().mockResolvedValue(undefined);
  query = vi.fn().mockResolvedValue({
    ids: [[]],
    documents: [[]],
    metadatas: [[]],
    distances: [[]],
  });
  count = vi.fn().mockResolvedValue(0);
}

class MockChromaClient {
  getOrCreateCollection = vi.fn().mockResolvedValue(new MockChromaCollection());
  deleteCollection = vi.fn().mockResolvedValue(undefined);
}

vi.mock("chromadb", () => ({
  ChromaClient: MockChromaClient,
}));

vi.mock("./src/services/ollamaService", () => ({
  ollamaService: {
    healthCheck: vi.fn().mockResolvedValue(true),
    listModels: vi.fn().mockResolvedValue(["test-model"]),
    embed: vi.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
    chat: vi.fn().mockResolvedValue("Test response"),
    chatJSON: vi.fn().mockResolvedValue([{ question: "Test?", options: ["A", "B", "C", "D"], correctIndex: 0, explanation: "Test" }]),
    getModelForMode: vi.fn().mockReturnValue("test-model"),
    isModelAvailable: vi.fn().mockReturnValue(true),
  },
}));

vi.mock("./src/services/opencodeFallback", () => ({
  opencodeFallback: {
    isEnabled: vi.fn().mockResolvedValue(false),
    chat: vi.fn().mockResolvedValue("Fallback response"),
    chatJSON: vi.fn().mockResolvedValue({}),
    healthCheck: vi.fn().mockResolvedValue(false),
  },
}));