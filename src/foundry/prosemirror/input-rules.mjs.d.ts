import type { InputRule } from "prosemirror-inputrules";
import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { Options } from "../client/dice/roll";
import ProseMirrorPlugin from "./plugin.mjs";

export namespace ProseMirrorInputRules {
  export interface Options {
    /**
     * The minimum heading level to start from when generating heading input rules.
     * The resulting heading level for a heading rule is equal to the number of
     * leading hashes minus this number.
     */
    minHeadingLevel?: number;
  }
}
/**
 * A class responsible for building the input rules for the ProseMirror editor.
 */
export default class ProseMirrorInputRules extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options?: ProseMirrorInputRules.Options);
  readonly options: Options;

  /**
   * Build the plugin.
   * @param schema  - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to pass to the plugin.
   * */
  static build(schema: Schema, options?: ProseMirrorInputRules.Options): Plugin;

  /**
   * Build input rules for node types present in the schema.
   */
  buildRules(): InputRule[];
}
