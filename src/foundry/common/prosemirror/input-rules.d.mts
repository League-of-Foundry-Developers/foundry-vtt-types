import type { InputRule } from "prosemirror-inputrules";
import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type ProseMirrorPlugin from "./plugin.d.mts";

export declare namespace ProseMirrorInputRules {
  export interface ProseMirrorInputRulesOptions {
    /**
     * The minimum heading level to start from when generating heading input rules.
     * The resulting heading level for a heading rule is equal to the number of
     * leading hashes minus this number.
     * @defaultValue `0`
     */
    minHeadingLevel?: number;
  }
}

export default ProseMirrorInputRules;
/**
 * A class responsible for building the input rules for the ProseMirror editor.
 */
declare class ProseMirrorInputRules extends ProseMirrorPlugin {
  /**
   * Build the plugin.
   * @param schema  - The ProseMirror schema to build the plugin against.
   * @param options - Additional options to pass to the plugin.
   * */
  static build(schema: Schema, options?: ProseMirrorInputRules.ProseMirrorInputRulesOptions): Plugin;

  /**
   * Build input rules for node types present in the schema.
   */
  buildRules(): InputRule[];
}
