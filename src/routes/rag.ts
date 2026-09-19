import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { vectorStore } from "../services/vectorStore";
import { strictRateLimiter } from "../middleware/rateLimiters";

export const ragRouter = Router();

ragRouter.post("/ingest", strictRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filename, content } = req.body;
    
    if (filename) {
      const { ingestDocument } = await import("../services/ingestion");
      const result = content 
        ? await ingestDocument(filename, content)
        : await ingestDocument(filename);
      return res.json(result);
    }
    
    const { ingestAllCorpus } = await import("../services/ingestion");
    const results = await ingestAllCorpus();
    const success = results.filter(r => r.success).length;
    res.json({ 
      total: results.length, 
      success, 
      failed: results.length - success,
      results 
    });
  } catch (error: unknown) {
    console.error(`[${req.requestId}] Ingestion error:`, error);
    res.status(500).json({ error: "Erreur lors de l'ingestion", requestId: req.requestId });
  }
});

ragRouter.get("/stats", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await vectorStore.getCollectionStats();
    res.json(stats);
  } catch (error: unknown) {
    console.error(`[${req.requestId}] Stats error:`, error);
    res.status(500).json({ error: "Erreur lors de la récupération des stats", requestId: req.requestId });
  }
});
