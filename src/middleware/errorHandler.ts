import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";

export function errorHandler(err: Error, req: AuthenticatedRequest, res: Response, _next: NextFunction): void {
  const requestId = req.requestId || 'unknown';
  console.error(`[${requestId}] Error:`, err);
  
  if (!res.headersSent) {
    res.status(500).json({ 
      error: "Erreur interne du serveur",
      requestId 
    });
  }
}
