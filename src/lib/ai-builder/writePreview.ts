// /src/lib/ai-builder/writePreview.ts

import fs from "fs/promises";
import path from "path";
import { serializeToHtml } from "./serialize";
import { EditorBlock } from "@/state/editorStore";
import { previewEmitter } from "@/app/api/ws/preview/route";

export async function writePreview(blocks: EditorBlock[]) {
  const html = serializeToHtml(blocks);

  const previewDir = path.join(process.cwd(), "workspace/preview");
  const filePath = path.join(previewDir, "index.html");

  await fs.mkdir(previewDir, { recursive: true });
  await fs.writeFile(filePath, html, "utf-8");

  // Tell the preview iframe to reload
  previewEmitter.emit("update", "preview-updated");
}
