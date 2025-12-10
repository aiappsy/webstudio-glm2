// /src/components/editor/PreviewFrame.tsx

import React, { useEffect, useRef } from "react";

export default function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const es = new EventSource("/api/ws/preview");

    es.onmessage = () => {
      // Reload preview iframe on any update
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src; 
      }
    };

    return () => es.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/workspace/preview/index.html"
      className="w-full h-full border-none"
    />
  );
}
