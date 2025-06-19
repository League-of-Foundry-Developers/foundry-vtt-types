import type { Schema } from "prosemirror-model";
import type { EditorState, Plugin, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "./plugin.d.mts";

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
   * @remarks `defineProperty`'d in construction, explicitly `writable: false`
   */
  readonly onSave: (() => void) | undefined;

  static override build(schema: Schema, options?: ProseMirrorKeyMaps.Options): Plugin;

  /**
   * Build keyboard commands for nodes and marks present in the schema.
   * @returns An object of keyboard shortcuts to editor functions.
   */
  buildMapping(): Record<string, ProseMirrorKeyMaps.Command>;

  #ProseMirrorKeyMaps: true;
}

declare namespace ProseMirrorKeyMaps {
  interface Options {
    /** A function to call when Ctrl+S is pressed. */
    onSave?: (() => void) | undefined;
  }

  /**
   * @param state    - The current editor state.
   * @param dispatch - A function to dispatch a transaction.
   * @param view     - Escape-hatch for when the command needs to interact directly with the UI.
   * @returns Whether the command has performed any action and consumed the event.
   */
  type Command = (state: EditorState, dispatch: (transaction: Transaction) => void, view: EditorView) => boolean;
}

export default ProseMirrorKeyMaps;
