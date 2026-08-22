// lib/llm/llm-gateway.ts
// Dynamic provider selection. Valid DEEPSEEK_API_KEY -> live DeepSeek; otherwise
// the mock provider. Unlike payments, mock is permitted in all environments
// (a fake answer is harmless; a fake charge is not) but is clearly labelled.

import type { LLMProvider } from "./types";
import { DeepSeekProvider } from "./deepseek-provider";
import { MockLLMProvider } from "./mock-llm-provider";

function isPlaceholder(v: string | undefined): boolean {
  if (!v) return true;
  const t = v.trim().toLowerCase();
  return t === "" || t.includes("your_") || t.includes("placeholder") || t === "xxx";
}

function buildProvider(): LLMProvider {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!isPlaceholder(apiKey)) {
    // eslint-disable-next-line no-console
    console.log("[LLMGateway] Initialized in LIVE mode (DeepSeek)");
    return new DeepSeekProvider({
      apiKey: apiKey!,
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
