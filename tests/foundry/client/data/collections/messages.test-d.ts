import { expectTypeOf } from "vitest";

const messages = new Messages([]);
expectTypeOf(messages.get("", { strict: true })).toEqualTypeOf<ChatMessage.Stored>();
expectTypeOf(messages.toJSON()).toEqualTypeOf<ChatMessage.Stored["_source"][]>();
expectTypeOf(messages.directory).toEqualTypeOf<ChatLog | undefined>();
