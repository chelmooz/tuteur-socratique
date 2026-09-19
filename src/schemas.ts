import { z } from "zod";

export const QuizItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string()
});

export const QuizArraySchema = z.array(QuizItemSchema);

export const OutputGateSchema = z.object({
  isLeak: z.boolean(),
  isJailbreak: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string()
});

export const QUIZ_JSON_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
      correctIndex: { type: "integer", minimum: 0, maximum: 3 },
      explanation: { type: "string" }
    },
    required: ["question", "options", "correctIndex", "explanation"]
  }
};

export const OUTPUT_GATE_JSON_SCHEMA = {
  type: "object",
  properties: {
    isLeak: { type: "boolean" },
    isJailbreak: { type: "boolean" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    reason: { type: "string" }
  },
  required: ["isLeak", "isJailbreak", "confidence", "reason"]
};
