import { assertType, expectTypeOf } from "vitest";
import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import ChatInputPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-input-plugin.mts";
import ChatMenuPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-menu-plugin.mts";
import type ChatLog from "../../../../../src/foundry/client/applications/sidebar/tabs/chat.d.mts";

assertType<typeof ChatInputPlugin>(foundry.prosemirror.plugins.chat.ChatInputPlugin);
assertType<typeof ChatMenuPlugin>(foundry.prosemirror.plugins.chat.ChatMenuPlugin);

declare const inputPlugin: ChatInputPlugin;
expectTypeOf(inputPlugin.chat).toEqualTypeOf<ChatLog>();
expectTypeOf(inputPlugin.sendMessage).parameter(0).toEqualTypeOf<EditorView>();

// Subclasses can override the protected hooks.
class CustomChatInputPlugin extends ChatInputPlugin {
  protected override _inspectTransactions(
    transactions: Transaction[],
    oldState: EditorState,
    newState: EditorState,
  ): void {
    void transactions;
    void oldState;
    void newState;
  }

  protected override _onKeyDown(view: EditorView, event: KeyboardEvent): boolean | void {
    void view;
    void event;
  }
}
assertType<typeof ChatInputPlugin>(CustomChatInputPlugin);

class CustomChatMenuPlugin extends ChatMenuPlugin {
  protected override _editSource(): void {}
}
assertType<typeof ChatMenuPlugin>(CustomChatMenuPlugin);
