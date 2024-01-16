import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type ProseMirrorPlugin from "./plugin.d.mts";

export default ProseMirrorDirtyPlugin;
/**
 * A simple plugin that records the dirty state of the editor.
 */
declare class ProseMirrorDirtyPlugin extends ProseMirrorPlugin {
  /** {@inheritdoc} */
  static build(schema: Schema, options?: Record<string, never>): Plugin;
}
