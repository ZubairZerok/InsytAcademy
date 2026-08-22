// lib/llm/types.ts
// Provider-agnostic LLM abstraction. App code talks to LLMProvider; the concrete
// implementation (live DeepSeek vs. mock) is chosen at runtime by llm-gateway.ts.

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMChatParams {
  /** System instruction — passed via the API's dedicated system role (not concatenated into user turns). */
  system: string;
  /** Prior conversation turns (already validated/sanitized by the caller). */
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  readonly mode: "live" | "mock";
  readonly name: string;
  chat(params: LLMChatParams): Promise<string>;
}
