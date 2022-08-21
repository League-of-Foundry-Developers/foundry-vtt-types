import type ProseMirrorPlugin from "./plugin.mjs";
import type { Schema } from "prosemirror-model";
import type { EditorState, Plugin, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

/**
 * @param state    - The current editor state.
 * @param dispatch - A function to dispatch a transaction.
 * @param view     - Escape-hatch for when the command needs to interact directly with the UI.
 * @returns Whether the command has performed any action and consumed the event.
 */
export type ProseMirrorCommand = (
  state: EditorState,
  dispatch: (transaction: Transaction) => void,
  view: EditorView
) => boolean;
export namespace ProseMirrorKeyMaps {
  export interface Options {
    /** The parent sheet that houses the ProseMirror instance. */
    sheet?: FormApplication;
  }
}
/**
 * A class responsible for building the keyboard commands for the ProseMirror editor.
 */
export default class ProseMirrorKeyMaps extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema to build keymaps for.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options?: ProseMirrorKeyMaps.Options);

  /**
   * The parent sheet that houses the ProseMirror instance.
   */
  readonly sheet: FormApplication;

  /** {@inheritdoc} */
  static build(schema: Schema): Plugin;

  /**
   * Build keyboard commands for nodes and marks present in the schema.
   * @returns An object of keyboard shortcuts to editor functions.
   */
  buildMapping(): Record<string, ProseMirrorCommand>;
}
