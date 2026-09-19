import { ChromaClient, Collection } from "chromadb";

const CHROMA_HOST = process.env.CHROMA_HOST || "http://localhost:8000";
const COLLECTION_NAME = "tuteur-scolastique-corpus";
const EMBEDDING_MODEL = process.env.OLLAMA_MODEL_EMBEDDING || "bge-m3:latest";

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    filename: string;
    category: string;
    title: string;
    format: string;
    importance: string;
    chunkIndex: number;
    totalChunks: number;
    sourceType: "corpus" | "custom";
  };
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: DocumentChunk["metadata"];
  distance: number;
}

export class VectorStore {
  private client: ChromaClient;
  private collection: Collection | null = null;

  constructor() {
    this.client = new ChromaClient({ path: CHROMA_HOST });
  }

  async initialize(): Promise<void> {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: COLLECTION_NAME,
        metadata: { "hnsw:space": "cosine" },
      });
      console.log(`[VectorStore] Collection "${COLLECTION_NAME}" ready`);
    } catch (error) {
      console.error("[VectorStore] Failed to initialize:", error);
      throw error;
    }
  }

  async addChunks(chunks: DocumentChunk[], embeddings: number[][]): Promise<void> {
    if (!this.collection) await this.initialize();
    if (!this.collection) throw new Error("Collection not initialized");

    const ids = chunks.map(c => c.id);
    const documents = chunks.map(c => c.content);
    const metadatas = chunks.map(c => c.metadata);

    await this.collection.add({
      ids,
      embeddings,
      documents,
      metadatas,
    });
    console.log(`[VectorStore] Added ${chunks.length} chunks`);
  }

  async search(queryEmbedding: number[], topK = 5): Promise<SearchResult[]> {
    if (!this.collection) await this.initialize();
    if (!this.collection) throw new Error("Collection not initialized");

    const results = await this.collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      include: ["documents", "metadatas", "distances"],
    });

    const searchResults: SearchResult[] = [];
    if (results.ids[0] && results.documents[0] && results.metadatas[0] && results.distances[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        const id = results.ids[0][i];
        const content = results.documents[0][i];
        const metadata = results.metadatas[0][i];
        const distance = results.distances[0][i];
        if (id && content && metadata && distance !== null && distance !== undefined) {
          searchResults.push({
            id,
            content,
            metadata: metadata as DocumentChunk["metadata"],
            distance,
          });
        }
      }
    }
    return searchResults;
  }

  async getCollectionStats(): Promise<{ count: number }> {
    if (!this.collection) await this.initialize();
    if (!this.collection) throw new Error("Collection not initialized");
    const count = await this.collection.count();
    return { count };
  }

  async clear(): Promise<void> {
    if (!this.collection) await this.initialize();
    if (!this.collection) throw new Error("Collection not initialized");
    await this.client.deleteCollection({ name: COLLECTION_NAME });
    this.collection = null;
    await this.initialize();
  }

  async deleteByFilename(filename: string): Promise<number> {
    if (!this.collection) await this.initialize();
    if (!this.collection) throw new Error("Collection not initialized");

    // First, get all IDs for this filename
    const results = await this.collection.get({
      where: { filename },
      include: ["metadatas"],
    });

    const ids = results.ids;
    if (ids.length > 0) {
      await this.collection.delete({ ids });
      console.log(`[VectorStore] Deleted ${ids.length} chunks for ${filename}`);
    }
    return ids.length;
  }
}

export const vectorStore = new VectorStore();