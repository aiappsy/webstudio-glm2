// /src/components/editor/blocks/ImageBlock.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";

export default function ImageBlock({
  id,
  src = "https://placehold.co/600x300?text=Image",
  alt = "Image",
  ...props
}: any) {
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-md my-4 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
    />
  );
}
