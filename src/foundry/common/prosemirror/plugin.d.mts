import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { AnyObject } from "../../../types/utils.d.mts";

export default ProseMirrorPlugin;
declare abstract class ProseMirrorPlugin {
  /**
   * An abstract class for building a ProseMirror Plugin.
   * @see Plugin
   * @param schema - The schema to build the plugin against.
   */
  constructor(schema: Schema);

  /** The schema to build the plugin against. */
  schema: Schema;

  /**
   * Build the plugin.
   * @param schema - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to pass to the plugin.
   * @virtual
   */
  static build(schema: Schema, options?: AnyObject): Plugin;
}
