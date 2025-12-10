// /src/lib/ai-builder/context.ts

import { listProjectFiles, readProjectFile } from "./files";

export interface FileSummary {
  path: string;
  size: number;
}

export interface AIContext {
  systemPrompt: string;
  files: FileSummary[];
  readFile: (path: string) => Promise<string>;
}

export async function buildAIContext(rootPath: string): Promise<AIContext> {
  const files = await listProjectFiles(rootPath);

  const systemPrompt = `
You are an AI Website Builder agent.
You receive: user instructions + project file tree + selected files.
Your job: generate or modify files to build a complete working website.
Never output explanations. Only output JSON patches or file content.
Use minimal changes. Preserve existing structure.
  `.trim();

  return {
    systemPrompt,
    files,
    readFile: (path: string) => readProjectFile(rootPath, path)
  };
}
