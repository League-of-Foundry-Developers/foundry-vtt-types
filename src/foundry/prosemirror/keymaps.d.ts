import type ProseMirrorPlugin from './plugin';
import type { Schema } from 'prosemirror-model';
import type { EditorState, Plugin, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

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

/**
 * A class responsible for building the keyboard commands for the ProseMirror editor.
 */
export default class ProseMirrorKeyMaps extends ProseMirrorPlugin {
  /** {@inheritdoc} */
  static build(schema: Schema): Plugin;

  /**
   * Build keyboard commands for nodes and marks present in the schema.
   * @returns An object of keyboard shortcuts to editor functions.
   */
  buildMapping(): Record<string, ProseMirrorCommand>;
}
