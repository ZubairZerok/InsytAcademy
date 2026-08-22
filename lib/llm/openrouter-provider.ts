// lib/llm/openrouter-provider.ts
import type { LLMChatParams, LLMProvider } from "./types";

export class OpenRouterProvider implements LLMProvider {
  readonly mode = "live" as const;
  readonly name = "OpenRouter (GPT-4o-mini / Llama 3.3)";

  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "openai/gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(params: LLMChatParams): Promise<string> {
    const messages = [
      { role: "system", content: params.system },
      ...params.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://insyt.bau.edu.bd",
          "X-Title": "INSYT BAU Academic OS",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: params.temperature ?? 0.4,
          max_tokens: params.maxTokens ?? 1200,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`OpenRouter returned status ${res.status}: ${errText.slice(0, 150)}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OpenRouter returned empty choices.");
      }

      return content;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }
}
