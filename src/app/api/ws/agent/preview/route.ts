// /src/app/api/ws/preview/route.ts

export const config = { runtime: "edge" };

export default async function handler() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  previewEmitter.on("update", (msg) => {
    writer.write(encoder.encode(msg));
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

import { EventEmitter } from "events";
export const previewEmitter = new EventEmitter();

const encoder = new TextEncoder();
