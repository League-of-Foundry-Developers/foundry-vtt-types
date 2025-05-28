import { expectTypeOf } from "vitest";

const chatLog = new ChatLog();

expectTypeOf(ChatLog.defaultOptions).toEqualTypeOf<ChatLog.Options>();
expectTypeOf(chatLog.options).toEqualTypeOf<ChatLog.Options>();
expectTypeOf(chatLog.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(chatLog.render(true)).toEqualTypeOf<ChatLog>();

expectTypeOf(chatLog.isAtBottom).toEqualTypeOf<boolean>();
expectTypeOf(chatLog.collection).toEqualTypeOf<Messages>();
expectTypeOf(chatLog.createPopout()).toEqualTypeOf<ChatLog>();
