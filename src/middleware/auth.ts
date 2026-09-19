import { randomBytes, timingSafeEqual } from "crypto";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";

const API_KEY = process.env.API_KEY || "dev-secret-change-me";

if (process.env.NODE_ENV === "production" && !process.env.API_KEY) {
  console.error("ERREUR CRITIQUE: API_KEY doit être définie en production");
  process.exit(1);
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader?.replace('Bearer ', '');
  
  if (!apiKey || !safeCompare(apiKey, API_KEY)) {
    res.status(401).json({ error: "Non autorisé - API key invalide ou manquante" });
    return;
  }
  
  req.user = { id: "local-user", apiKey };
  next();
}
