// /src/lib/ai-builder/agent.ts

import { OpenRouterClient, OpenRouterMessage } from "./router";
import { buildAIContext } from "./context";
import { applyPatches } from "./diff";

interface AgentOptions {
  rootPath: string;
  apiKey: string;
  model: string;
  userPrompt: string;
  onToken?: (token: string) => void;
}

export async function runAIAgent(options: AgentOptions) {
  const ctx = await buildAIContext(options.rootPath);

  const messages: OpenRouterMessage[] = [
    { role: "system", content: ctx.systemPrompt },
    { role: "user", content: options.userPrompt }
  ];

  const client = new OpenRouterClient({
    apiKey: options.apiKey,
    model: options.model,
    stream: true
  });

  let rawOutput = "";

  const final = await client.chat(messages, {
    onToken: (t) => {
      rawOutput += t;
      options.onToken?.(t);
    }
  });

  let patches: any[] = [];

  try {
    patches = JSON.parse(final);
  } catch {
    return { success: false, error: "Invalid JSON patch format" };
  }

  await applyPatches(options.rootPath, patches);

  return { success: true, patches };
}
