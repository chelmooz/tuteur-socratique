import { Router, Response } from "express";
import { ollamaService } from "../services/ollamaService";
import { opencodeFallback } from "../services/opencodeFallback";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res: Response) => {
  const ollamaOk = await ollamaService.healthCheck();
  const models = ollamaOk ? await ollamaService.listModels() : [];
  const opencodeOk = await opencodeFallback.isEnabled();
  
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      ollama: { available: ollamaOk, models: ollamaOk ? models.length : 0 },
      opencode: { available: opencodeOk }
    }
  });
});
