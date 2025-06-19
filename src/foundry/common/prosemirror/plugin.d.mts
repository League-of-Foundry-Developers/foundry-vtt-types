import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";

declare abstract class ProseMirrorPlugin {
  /**
   * An abstract class for building a ProseMirror Plugin.
   * @see {@linkcode Plugin}
   * @param schema - The schema to build the plugin against.
   */
  constructor(schema: Schema);

  /**
   * The schema to build the plugin against.
   * @remarks `defineProperty`'d in construction, and without the property existing prior, it defaults to `writable: false`
   */
  readonly schema: Schema;

  /**
   * Build the plugin.
   * @param schema - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to pass to the plugin.
   * @abstract
   * @remarks Throws if not overridden
   */
  static build(schema: Schema, options: never): Plugin;
}

export default ProseMirrorPlugin;
