import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Use import.meta.url in ESM (dev), fallback to process.cwd() in CJS (prod build)
const getDirname = (): string => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (error) {
    console.error('getDirname() failed, falling back to process.cwd():', error);
    return path.join(process.cwd(), 'src', 'services');
  }
};

const __dirname = getDirname();
const DB_PATH = process.env.STUDENT_DB_PATH || path.join(__dirname, '..', '..', 'data', 'student_state.db');

interface StudentState {
  sessionId: string;
  studentId: string;
  targetConcept: string;
  masteredConcepts: string[];
  currentFrustration: number;
  hintsGivenCount: number;
  pedagogicalStep: 'exploration' | 'friction' | 'remediation' | 'consolidation';
  messageCount: number;
  lastActive: number;
  createdAt: number;
}

const db = new Database(DB_PATH);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS student_sessions (
    session_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    target_concept TEXT NOT NULL,
    mastered_concepts TEXT NOT NULL DEFAULT '[]',
    current_frustration INTEGER NOT NULL DEFAULT 1,
    hints_given_count INTEGER NOT NULL DEFAULT 0,
    pedagogical_step TEXT NOT NULL DEFAULT 'exploration',
    message_count INTEGER NOT NULL DEFAULT 0,
    last_active INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_student_id ON student_sessions(student_id);
  CREATE INDEX IF NOT EXISTS idx_last_active ON student_sessions(last_active);
`);

export class StudentStore {
  private static instance: StudentStore;
  
  static getInstance(): StudentStore {
    if (!StudentStore.instance) {
      StudentStore.instance = new StudentStore();
    }
    return StudentStore.instance;
  }

  createSession(studentId: string, targetConcept: string): StudentState {
    const sessionId = uuidv4();
    const now = Date.now();
    
    const state: StudentState = {
      sessionId,
      studentId,
      targetConcept,
      masteredConcepts: [],
      currentFrustration: 1,
      hintsGivenCount: 0,
      pedagogicalStep: 'exploration',
      messageCount: 0,
      lastActive: now,
      createdAt: now,
    };

    const stmt = db.prepare(`
      INSERT INTO student_sessions 
      (session_id, student_id, target_concept, mastered_concepts, current_frustration, hints_given_count, pedagogical_step, message_count, last_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      state.sessionId,
      state.studentId,
      state.targetConcept,
      JSON.stringify(state.masteredConcepts),
      state.currentFrustration,
      state.hintsGivenCount,
      state.pedagogicalStep,
      state.messageCount,
      state.lastActive,
      state.createdAt
    );

    return state;
  }

  getSession(sessionId: string): StudentState | null {
    const row = db.prepare('SELECT * FROM student_sessions WHERE session_id = ?').get(sessionId);
    if (!row) return null;
    return this.mapRowToState(row);
  }

  getSessionByStudentId(studentId: string): StudentState | null {
    const row = db.prepare('SELECT * FROM student_sessions WHERE student_id = ? ORDER BY last_active DESC LIMIT 1').get(studentId);
    if (!row) return null;
    return this.mapRowToState(row);
  }

  updateSession(state: StudentState): void {
    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE student_sessions SET
        target_concept = ?,
        mastered_concepts = ?,
        current_frustration = ?,
        hints_given_count = ?,
        pedagogical_step = ?,
        message_count = ?,
        last_active = ?
      WHERE session_id = ?
    `);
    
    stmt.run(
      state.targetConcept,
      JSON.stringify(state.masteredConcepts),
      state.currentFrustration,
      state.hintsGivenCount,
      state.pedagogicalStep,
      state.messageCount,
      now,
      state.sessionId
    );
    
    state.lastActive = now;
  }

  incrementMessageCount(sessionId: string): void {
    db.prepare('UPDATE student_sessions SET message_count = message_count + 1, last_active = ? WHERE session_id = ?')
      .run(Date.now(), sessionId);
  }

  incrementHintsGiven(sessionId: string): void {
    db.prepare('UPDATE student_sessions SET hints_given_count = hints_given_count + 1, last_active = ? WHERE session_id = ?')
      .run(Date.now(), sessionId);
  }

  updateFrustration(sessionId: string, frustration: number): void {
    db.prepare('UPDATE student_sessions SET current_frustration = ?, last_active = ? WHERE session_id = ?')
      .run(frustration, Date.now(), sessionId);
  }

  updatePedagogicalStep(sessionId: string, step: StudentState['pedagogicalStep']): void {
    db.prepare('UPDATE student_sessions SET pedagogical_step = ?, last_active = ? WHERE session_id = ?')
      .run(step, Date.now(), sessionId);
  }

  addMasteredConcept(sessionId: string, concept: string): void {
    const state = this.getSession(sessionId);
    if (state && !state.masteredConcepts.includes(concept)) {
      state.masteredConcepts.push(concept);
      this.updateSession(state);
    }
  }

  private mapRowToState(row: any): StudentState {
    return {
      sessionId: row.session_id,
      studentId: row.student_id,
      targetConcept: row.target_concept,
      masteredConcepts: JSON.parse(row.mastered_concepts || '[]'),
      currentFrustration: row.current_frustration,
      hintsGivenCount: row.hints_given_count,
      pedagogicalStep: row.pedagogical_step,
      messageCount: row.message_count,
      lastActive: row.last_active,
      createdAt: row.created_at,
    };
  }

  // Cleanup old sessions (older than 30 days)
  cleanupOldSessions(days = 30): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const result = db.prepare('DELETE FROM student_sessions WHERE last_active < ?').run(cutoff);
    return result.changes;
  }
}

export const studentStore = StudentStore.getInstance();