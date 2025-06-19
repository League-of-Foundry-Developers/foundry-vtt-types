import type { Schema } from "prosemirror-model";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { Plugin } from "prosemirror-state";
import type { AnyObject } from "#utils";

/**
 * A class responsible for applying transformations to content pasted inside the editor.
 */
declare class ProseMirrorPasteTransformer extends ProseMirrorPlugin {
  /** @remarks `options` is unused */
  static override build(schema: Schema, options?: AnyObject): Plugin;

  #ProseMirrorPasteTransformer: true;
}

export default ProseMirrorPasteTransformer;
