import type { Schema, Slice } from "prosemirror-model";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { EmptyObject } from "../../../types/utils.d.mts";

export default ProseMirrorPasteTransformer;

/**
 * A class responsible for applying transformations to content pasted inside the editor.
 */
declare class ProseMirrorPasteTransformer extends ProseMirrorPlugin {
  static override build(schema: Schema, options?: EmptyObject | undefined): Plugin;

  /**
   * Transform content before it is injected into the ProseMirror document.
   * @param slice - The content slice.
   * @param view  - The ProseMirror editor view.
   * @returns The transformed content.
   */
  _onPaste(slice: Slice, view: EditorView): Slice;
}
