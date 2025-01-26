import { expectTypeOf } from "vitest";

const chatLog = new ChatLog();

expectTypeOf(ChatLog.defaultOptions).toEqualTypeOf<ChatLogOptions>();
expectTypeOf(chatLog.options).toEqualTypeOf<ChatLogOptions>();
expectTypeOf(chatLog.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(chatLog.render(true)).toEqualTypeOf<ChatLog>();

expectTypeOf(chatLog.isAtBottom).toEqualTypeOf<boolean>();
expectTypeOf(chatLog.collection).toEqualTypeOf<Messages>();
expectTypeOf(chatLog.createPopout()).toEqualTypeOf<ChatLog>();
