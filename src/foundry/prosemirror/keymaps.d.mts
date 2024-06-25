import type { Schema } from "prosemirror-model";
import type { EditorState, Plugin, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "./plugin.d.mts";

/**
 * @param state    - The current editor state.
 * @param dispatch - A function to dispatch a transaction.
 * @param view     - Escape-hatch for when the command needs to interact directly with the UI.
 * @returns Whether the command has performed any action and consumed the event.
 */
export type ProseMirrorCommand = (
  state: EditorState,
  dispatch: (transaction: Transaction) => void,
  view: EditorView,
) => boolean;
export declare namespace ProseMirrorKeyMaps {
  export interface Options {
    /** A function to call when Ctrl+S is pressed. */
    onSave?: Function;
  }
}

export default ProseMirrorKeyMaps;
/**
 * A class responsible for building the keyboard commands for the ProseMirror editor.
 */
declare class ProseMirrorKeyMaps extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema to build keymaps for.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options?: ProseMirrorKeyMaps.Options);

  /**
   * A function to call when Ctrl+S is pressed.
   */
  readonly onSave: Function;

  static override build(schema: Schema, options?: ProseMirrorKeyMaps.Options): Plugin;

  /**
   * Build keyboard commands for nodes and marks present in the schema.
   * @returns An object of keyboard shortcuts to editor functions.
   */
  buildMapping(): Record<string, ProseMirrorCommand>;
}
