import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { AuthenticatedRequest } from "../types";

function getClientIp(req: AuthenticatedRequest): string {
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown");
}

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Trop de requêtes, réessayez plus tard" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Limite de taux dépassée pour cette opération" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
});
