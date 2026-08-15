import type { Schema } from "prosemirror-model";
import type { Plugin, PluginKey } from "prosemirror-state";

declare abstract class ProseMirrorPlugin {
  /**
   * An abstract class for building a ProseMirror Plugin.
   * @see {@linkcode Plugin}
   * @param schema - The schema to build the plugin against.
   */
  constructor(schema: Schema);

  /**
   * The ProseMirror schema to build the plugin against.
   *
   * @privateRemarks Defined during construction with `writable: false`.
   */
  readonly schema: Schema;

  /**
   * Build the plugin.
   * @param schema  - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to pass to the plugin.
   * @abstract
   * @remarks
   * @throws If not overridden.
   */
  static build(schema: Schema, options: never): Plugin;

  /**
   * A unique key for this plugin that can be used to identify a plugin instance in any given editor.
   */
  static get key(): PluginKey;
}

export default ProseMirrorPlugin;
