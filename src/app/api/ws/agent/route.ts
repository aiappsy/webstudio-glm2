// /src/app/api/ws/agent/route.ts

import { runAIAgent } from "@/lib/ai-builder";
import path from "path";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") || "";
  const apiKey = searchParams.get("apiKey") || "";
  const model = searchParams.get("model") || "";

  if (!apiKey || !model || !prompt) {
    return new Response("Missing parameters", { status: 400 });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const rootPath = path.join(process.cwd(), "workspace");

  runAIAgent({
    rootPath,
    apiKey,
    model,
    userPrompt: prompt,
    onToken(token) {
      writer.write(encoder.encode(token));
    }
  }).then(() => {
    writer.close();
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

const encoder = new TextEncoder();
