import ProseMirrorPlugin from "./plugin.mjs";
import { Plugin } from "prosemirror-state";
import type { Schema } from "prosemirror-model";

/**
 * A simple plugin that records the dirty state of the editor.
 */
export default class ProseMirrorDirtyPlugin extends ProseMirrorPlugin {
  /** {@inheritdoc} */
  static build(schema: Schema, options?: Record<string, never>): Plugin;
}
