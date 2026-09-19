import { Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../types";
import { studentStore } from "../services/studentStore";

export function sessionMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const studentId = req.user?.id || 'anonymous';
  const sessionId = (req.headers['x-session-id'] as string) || uuidv4();
  
  res.setHeader('X-Session-ID', sessionId);
  
  let session = studentStore.getSessionByStudentId(studentId);
  if (!session) {
    session = studentStore.createSession(studentId, 'general');
  }
  
  req.studentSession = session;
  req.sessionId = session.sessionId;
  
  next();
}
