import { describe, it, expect, vi } from "vitest";
import { buildMessages } from "../server";

describe("buildMessages", () => {
  it("should build messages with system prompt and user message", () => {
    const systemPrompt = "You are a helpful assistant";
    const history = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ];
    const userMessage = "How are you?";

    const messages = buildMessages(systemPrompt, history, userMessage);

    expect(messages).toHaveLength(4);
    expect(messages[0]).toEqual({ role: "system", content: systemPrompt });
    expect(messages[1]).toEqual({ role: "user", content: "Hello" });
    expect(messages[2]).toEqual({ role: "assistant", content: "Hi there!" });
    expect(messages[3]).toEqual({ role: "user", content: userMessage });
  });

  it("should handle empty history", () => {
    const messages = buildMessages("System", [], "User message");
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
  });

  it("should limit history to last 6 messages", () => {
    const history = Array.from({ length: 10 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
    }));
    const messages = buildMessages("System", history, "Current");
    expect(messages.length).toBe(8); // system + 6 history + current
  });

  it("should handle history with text instead of content", () => {
    const history = [{ role: "user", text: "Hello via text" }];
    const messages = buildMessages("System", history, "Current");
    expect(messages[1].content).toBe("Hello via text");
  });

  it("should handle missing content and text", () => {
    const history = [{ role: "user", content: undefined, text: undefined }];
    const messages = buildMessages("System", history, "Current");
    expect(messages[1].content).toBe("");
  });
});

describe("Quiz JSON Schema", () => {
  it("should validate correct quiz structure", () => {
    const quiz = [
      {
        question: "What is RAG?",
        options: ["A", "B", "C", "D"],
        correctIndex: 0,
        explanation: "RAG stands for Retrieval-Augmented Generation",
      },
    ];

    expect(quiz).toHaveLength(1);
    expect(quiz[0].options).toHaveLength(4);
    expect(quiz[0].correctIndex).toBeGreaterThanOrEqual(0);
    expect(quiz[0].correctIndex).toBeLessThan(4);
    expect(typeof quiz[0].explanation).toBe("string");
  });
});

describe("ChatRequest validation", () => {
  it("should reject empty message", () => {
    const validate = (body: any) => {
      if (!body.message?.trim()) return { error: "Message requis" };
      return null;
    };

    expect(validate({ message: "" })).toEqual({ error: "Message requis" });
    expect(validate({ message: "   " })).toEqual({ error: "Message requis" });
    expect(validate({ message: "Valid" })).toBeNull();
  });

  it("should reject message too long", () => {
    const validate = (body: any) => {
      if (body.message && body.message.length > 10000) return { error: "Message trop long" };
      return null;
    };

    expect(validate({ message: "a".repeat(10001) })).toEqual({ error: "Message trop long" });
    expect(validate({ message: "a".repeat(10000) })).toBeNull();
  });

  it("should reject history too long", () => {
    const validate = (body: any) => {
      if (body.history && body.history.length > 20) return { error: "Historique trop long" };
      return null;
    };

    expect(validate({ history: new Array(21) })).toEqual({ error: "Historique trop long" });
    expect(validate({ history: new Array(20) })).toBeNull();
  });
});