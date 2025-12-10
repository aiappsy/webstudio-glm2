// /hooks/useBuilderStream.ts

import { useState } from "react";

export function useBuilderStream() {
  const [output, setOutput] = useState("");

  function start(prompt: string, apiKey: string, model: string) {
    const url =
      `/api/ws/agent?prompt=${encodeURIComponent(prompt)}&apiKey=${apiKey}&model=${model}`;

    const es = new EventSource(url);

    es.onmessage = (e) => {
      setOutput((prev) => prev + e.data);
    };

    es.onerror = () => es.close();
  }

  return { output, start };
}
