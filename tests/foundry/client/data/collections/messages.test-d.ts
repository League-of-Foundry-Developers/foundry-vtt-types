import { expectTypeOf } from "vitest";

const messages = new Messages();
expectTypeOf(messages.get("", { strict: true })).toEqualTypeOf<StoredDocument<ChatMessage>>();
expectTypeOf(messages.toJSON()).toEqualTypeOf<StoredDocument<ChatMessage>["data"]["_source"][]>();
expectTypeOf(messages.directory).toEqualTypeOf<undefined | ChatLog>();
