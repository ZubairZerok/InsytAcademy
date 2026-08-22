import type { LLMProvider } from "./types";
import { OpenRouterProvider } from "./openrouter-provider";
import { GeminiLLMProvider } from "./gemini-provider";
import { DeepSeekProvider } from "./deepseek-provider";
import { MockLLMProvider } from "./mock-llm-provider";

function isPlaceholder(v: string | undefined): boolean {
  if (!v) return true;
  const t = v.trim().toLowerCase();
  return t === "" || t.includes("your_") || t.includes("placeholder") || t === "xxx";
}

function buildProvider(): LLMProvider {
  const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!isPlaceholder(openRouterKey)) {
    // eslint-disable-next-line no-console
    console.log("[LLMGateway] Initialized in LIVE mode (OpenRouter - GPT-4o-mini)");
    return new OpenRouterProvider(openRouterKey!.trim());
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!isPlaceholder(geminiKey) && geminiKey!.trim().startsWith("AIzaSy")) {
    // eslint-disable-next-line no-console
    console.log("[LLMGateway] Initialized in LIVE mode (Google Gemini)");
    return new GeminiLLMProvider();
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!isPlaceholder(deepseekKey)) {
    // eslint-disable-next-line no-console
    console.log("[LLMGateway] Initialized in LIVE mode (DeepSeek)");
    return new DeepSeekProvider({
      apiKey: deepseekKey!,
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    });
  }

  // eslint-disable-next-line no-console
  console.log("[LLMGateway] Initialized in MOCK mode");
  return new MockLLMProvider();
}

let _gateway: LLMProvider | null = null;
export function getLLMGateway(): LLMProvider {
  if (!_gateway) _gateway = buildProvider();
  return _gateway;
}
