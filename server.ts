import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { requestIdMiddleware } from "./src/middleware/requestId";
import { requireAuth } from "./src/middleware/auth";
import { errorHandler } from "./src/middleware/errorHandler";
import { aiRateLimiter } from "./src/middleware/rateLimiters";
import { sessionMiddleware } from "./src/middleware/session";
import { healthRouter } from "./src/routes/health";
import { aiRouter } from "./src/routes/ai";
import { ragRouter } from "./src/routes/rag";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3001', 10);

  app.use(express.json({ limit: "5mb" }));
  app.use(requestIdMiddleware);

  app.use("/api/health", healthRouter);

  const protectedRouter = express.Router();
  protectedRouter.use(requireAuth);
  protectedRouter.use(aiRateLimiter);
  protectedRouter.use(sessionMiddleware);

  protectedRouter.use("/ai", aiRouter);
  protectedRouter.use("/rag", ragRouter);

  app.use("/api", protectedRouter);
  app.use(errorHandler);

  const corpusPath = path.join(process.cwd(), "data", "corpus");
  app.use(express.static(corpusPath));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur Tuteur Scolastique actif sur http://0.0.0.0:${PORT}`);
    console.log(`  API Health: http://localhost:${PORT}/api/health (public)`);
    console.log(`  API AI Chat: http://localhost:${PORT}/api/ai/chat (protégé)`);
    console.log(`  API Quiz: http://localhost:${PORT}/api/ai/quiz-generate (protégé)`);
    console.log(`  API Test Prompt: http://localhost:${PORT}/api/ai/test-prompt (protégé)`);
    console.log(`  API Embed: http://localhost:${PORT}/api/ai/embed (protégé)`);
    console.log(`  Auth: Bearer token dans header Authorization`);
  });
}

startServer();
