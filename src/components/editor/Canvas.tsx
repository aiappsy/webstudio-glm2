// /src/components/editor/Canvas.tsx

import React from "react";
import { useEditorStore } from "@/state/editorStore";
import SectionBlock from "./blocks/SectionBlock";
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import ButtonBlock from "./blocks/ButtonBlock";

const blockMap: any = {
  section: SectionBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock
};

export default function Canvas() {
  const blocks = useEditorStore((s) => s.blocks);

  function renderBlock(block: any) {
    const Component = blockMap[block.type];
    if (!Component) return null;

    return (
      <Component
        key={block.id}
        id={block.id}
        {...block.props}
        childrenBlocks={block.children}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-10 bg-gray-100">
      {blocks.map((b) => renderBlock(b))}
    </div>
  );
}
