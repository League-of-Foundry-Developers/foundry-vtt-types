import type { Schema } from "prosemirror-model";
import type { EditorState, Plugin, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "../plugin.d.mts";
import type ChatLog from "#client/applications/sidebar/tabs/chat.d.mts";

/**
 * A plugin for the chat message editor which handles interactivity.
 */
declare class ChatInputPlugin extends ProseMirrorPlugin {
  /**
   * @param schema - The ProseMirror schema to build the plugin against.
   * @param chat   - The ChatLog instance this plugin belongs to.
   */
  constructor(schema: Schema, chat?: ChatLog);

  /** The ChatLog instance this plugin belongs to. */
  get chat(): ChatLog;

  /**
   * Build the plugin.
   * @param schema  - The ProseMirror schema to build the plugin against.
   * @param options - Build options.
   */
  static override build(schema: Schema, options?: ChatInputPlugin.BuildOptions): Plugin;

  /**
   * Inspect transactions and update pending state if they involve insertions or deletions.
   * @param transactions - The transactions.
   * @param oldState     - The editor state before.
   * @param newState     - The editor state after.
   */
  protected _inspectTransactions(transactions: Transaction[], oldState: EditorState, newState: EditorState): void;

  /**
   * Handle keydown events.
   * @param view  - The editor view.
   * @param event - The keyboard event.
   */
  protected _onKeyDown(view: EditorView, event: KeyboardEvent): boolean | void;

  /**
   * Handle sending a chat message.
   * @param view - The editor view.
   */
  sendMessage(view: EditorView): Promise<void>;

  /**
   * Set the contents of the chat input to the given value.
   * @param view    - The editor view.
   * @param message - The message to set.
   * @param meta    - Any metadata to append to the transaction.
   */
  setMessage(view: EditorView, message: string, meta?: unknown): void;
}

declare namespace ChatInputPlugin {
  interface BuildOptions {
    chat?: ChatLog | undefined;
  }
}

export default ChatInputPlugin;
