// lib/llm/deepseek-provider.ts
// Live DeepSeek integration (OpenAI-compatible /chat/completions).
//
// Security: the system prompt is sent in its OWN system-role message — user code
// and queries live strictly in user-role turns. This closes the prompt-injection
// hole where the previous code concatenated the system prompt into a user turn.

import type { LLMProvider, LLMChatParams } from "./types";

interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string; // e.g. https://api.deepseek.com
  model: string; // e.g. deepseek-chat
}

export class DeepSeekProvider implements LLMProvider {
  readonly mode = "live" as const;
  readonly name = "deepseek";
  private cfg: DeepSeekConfig;

  constructor(cfg: DeepSeekConfig) {
    this.cfg = cfg;
  }

  async chat(params: LLMChatParams): Promise<string> {
    const messages = [
      { role: "system" as const, content: params.system },
      ...params.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch(`${this.cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: this.cfg.model,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1500,
        stream: false,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      // Log detail server-side; surface nothing sensitive upstream.
      const body = await res.text().catch(() => "");
      console.error("[DeepSeek] error", res.status, body.slice(0, 500));
      throw new Error("LLM request failed");
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("LLM returned empty content");
    return text;
  }
}
