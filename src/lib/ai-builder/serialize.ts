// /src/lib/ai-builder/serialize.ts

import { EditorBlock } from "@/state/editorStore";

export function serializeToHtml(blocks: EditorBlock[]): string {
  function render(block: EditorBlock): string {
    switch (block.type) {
      case "section":
        return `<section>${(block.children || []).map(render).join("")}</section>`;
      case "text":
        return `<p>${block.props.text || ""}</p>`;
      case "image":
        return `<img src="${block.props.src || ""}" alt="${block.props.alt || ""}" />`;
      case "button":
        return `<a href="${block.props.link || "#"}" class="btn">${block.props.text || "Button"}</a>`;
      default:
        return "";
    }
  }

  return `
<html>
  <head>
    <title>Preview</title>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      section { margin-bottom: 20px; padding: 20px; border: 1px solid #ccc; }
      img { max-width: 100%; }
      .btn {
        background: #2563eb;
        color: white;
        padding: 10px 18px;
        border-radius: 4px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    ${blocks.map(render).join("")}
  </body>
</html>
`;
}
