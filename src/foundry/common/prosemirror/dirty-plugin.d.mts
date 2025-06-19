import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { AnyObject } from "#utils";

export default ProseMirrorDirtyPlugin;

/**
 * A simple plugin that records the dirty state of the editor.
 */
declare class ProseMirrorDirtyPlugin extends ProseMirrorPlugin {
  static override build(schema: Schema, options?: AnyObject): Plugin;
}
