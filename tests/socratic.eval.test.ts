import { describe, it, expect, vi, beforeEach } from "vitest";

const { checkOutputGate, generateJSONWithFallback } = vi.hoisted(() => ({
  checkOutputGate: vi.fn(),
  generateJSONWithFallback: vi.fn(),
}));

vi.mock("../src/ai", () => ({
  checkOutputGate,
  generateJSONWithFallback,
}));

describe("Socratic eval tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("detects leak", async () => {
    generateJSONWithFallback.mockResolvedValue({
      isLeak: true,
      isJailbreak: false,
      confidence: 0.9,
      reason: "leak",
    });

    checkOutputGate.mockResolvedValue({
      isLeak: true,
      isJailbreak: false,
      safeResponse: "safe",
    });

    const result = await checkOutputGate("test", "tuteur_eleve");
    expect(result.isLeak).toBe(true);
  });

  it("detects no leak", async () => {
    checkOutputGate.mockResolvedValue({
      isLeak: false,
      isJailbreak: false,
      safeResponse: "",
    });

    const result = await checkOutputGate("test", "tuteur_eleve");
    expect(result.isLeak).toBe(false);
  });

  it("detects jailbreak", async () => {
    checkOutputGate.mockResolvedValue({
      isLeak: false,
      isJailbreak: true,
      safeResponse: "safe",
    });

    const result = await checkOutputGate("test", "tuteur_eleve");
    expect(result.isJailbreak).toBe(true);
  });
});
