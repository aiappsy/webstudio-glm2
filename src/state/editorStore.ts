// /src/state/editorStore.ts

import { create } from "zustand";

export interface EditorBlock {
  id: string;
  type: string;
  props: any;
  children?: EditorBlock[];
}

interface EditorState {
  blocks: EditorBlock[];
  selectedBlockId: string | null;

  selectBlock: (id: string) => void;
  addBlock: (block: EditorBlock, parentId?: string) => void;
  updateBlock: (id: string, props: any) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  selectedBlockId: null,

  selectBlock(id) {
    set({ selectedBlockId: id });
  },

  addBlock(block, parentId) {
    const { blocks } = get();

    if (!parentId) {
      set({ blocks: [...blocks, block] });
      return;
    }

    // recursive utility
    function addChild(list: EditorBlock[]): EditorBlock[] {
      return list.map((b) => {
        if (b.id === parentId) {
          return {
            ...b,
            children: [...(b.children ?? []), block]
          };
        }
        return {
          ...b,
          children: b.children ? addChild(b.children) : []
        };
      });
    }

    set({ blocks: addChild(blocks) });
  },

  updateBlock(id, props) {
    const { blocks } = get();

    function update(list: EditorBlock[]): EditorBlock[] {
      return list.map((b) => {
        if (b.id === id) return { ...b, props: { ...b.props, ...props } };
        return {
          ...b,
          children: b.children ? update(b.children) : []
        };
      });
    }

    set({ blocks: update(blocks) });
  },

  removeBlock(id) {
    const { blocks } = get();

    function remove(list: EditorBlock[]): EditorBlock[] {
      return list
        .filter((b) => b.id !== id)
        .map((b) => ({
          ...b,
          children: b.children ? remove(b.children) : []
        }));
    }

    set({ blocks: remove(blocks) });
  },

  setBlocks(blocks) {
    set({ blocks });
  }
}));
