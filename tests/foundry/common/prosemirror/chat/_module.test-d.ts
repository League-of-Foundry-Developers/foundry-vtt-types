import { assertType, expectTypeOf, test } from "vitest";
import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Schema } from "prosemirror-model";
import ChatInputPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-input-plugin.mts";
import ChatMenuPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-menu-plugin.mts";
import type ChatLog from "../../../../../src/foundry/client/applications/sidebar/tabs/chat.d.mts";

declare const inputPlugin: ChatInputPlugin;

declare const schema: Schema;
declare const chatLog: ChatLog;
declare const view: EditorView;

test("foundry/common/prosemirror/chat/_module", () => {
  assertType<typeof ChatInputPlugin>(foundry.prosemirror.plugins.chat.ChatInputPlugin);
  assertType<typeof ChatMenuPlugin>(foundry.prosemirror.plugins.chat.ChatMenuPlugin);
  expectTypeOf(inputPlugin.chat).toEqualTypeOf<ChatLog | undefined>();
  expectTypeOf(inputPlugin.sendMessage).parameter(0).toEqualTypeOf<EditorView>();
  new ChatInputPlugin(schema);
  new ChatInputPlugin(schema, chatLog);
  expectTypeOf(ChatInputPlugin.build(schema, { chat: chatLog })).toEqualTypeOf<foundry.prosemirror.Plugin>();
  expectTypeOf(inputPlugin.sendMessage(view)).toEqualTypeOf<Promise<void>>();
  expectTypeOf(inputPlugin.setMessage(view, "Hello", { noHistory: true })).toBeVoid();
  expectTypeOf(ChatMenuPlugin.key).toEqualTypeOf<foundry.prosemirror.PluginKey>();

  // Subclasses can override the protected hooks.
  class CustomChatInputPlugin extends ChatInputPlugin {
    protected override _inspectTransactions(
      _transactions: readonly Transaction[],
      _oldState: EditorState,
      _newState: EditorState,
    ): void {}

    protected override _onKeyDown(_view: EditorView, _event: KeyboardEvent): boolean | void {}
  }
  assertType<typeof ChatInputPlugin>(CustomChatInputPlugin);

  class CustomChatMenuPlugin extends ChatMenuPlugin {
    protected override _editSource(): void {}
  }
  assertType<typeof ChatMenuPlugin>(CustomChatMenuPlugin);
});
