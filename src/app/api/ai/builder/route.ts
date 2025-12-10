// /src/app/api/ai/builder/route.ts

import { NextResponse } from "next/server";
import { runAIAgent } from "@/lib/ai-builder";
import path from "path";

export async function POST(req: Request) {
  try {
    const { prompt, apiKey, model } = await req.json();

    if (!prompt || !apiKey || !model) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rootPath = path.join(process.cwd(), "workspace");

    const result = await runAIAgent({
      rootPath,
      apiKey,
      model,
      userPrompt: prompt
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
