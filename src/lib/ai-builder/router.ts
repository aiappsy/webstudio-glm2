// /src/lib/ai-builder/router.ts

import { Readable } from "stream";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant" | "developer";
  content: string;
}

export interface OpenRouterClientOptions {
  apiKey: string;
  model: string;
  stream?: boolean;
}

export interface StreamHandlers {
  onToken?: (token: string) => void;
  onDone?: () => void;
}

export class OpenRouterClient {
  private apiKey: string;
  private model: string;
  private stream: boolean;

  constructor(options: OpenRouterClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.stream = options.stream ?? true;
  }

  async chat(messages: OpenRouterMessage[], handlers?: StreamHandlers): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: this.stream
      })
    });

    if (!this.stream) {
      const json = await response.json();
      return json.choices?.[0]?.message?.content ?? "";
    }

    const reader = (response.body as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();
    let finalText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.replace("data:", "").trim();
        if (payload === "[DONE]") {
          handlers?.onDone?.();
          return finalText;
        }

        try {
          const json = JSON.parse(payload);
          const token = json?.choices?.[0]?.delta?.content;
          if (token) {
            finalText += token;
            handlers?.onToken?.(token);
          }
        } catch {
          // silent fail — no logs
        }
      }
    }

    handlers?.onDone?.();
    return finalText;
  }
}
