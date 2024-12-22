import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const messages = new Messages([]);
expectTypeOf(messages.get("", { strict: true })).toEqualTypeOf<Document.Stored<ChatMessage>>();
expectTypeOf(messages.toJSON()).toEqualTypeOf<Document.Stored<ChatMessage>["_source"][]>();
expectTypeOf(messages.directory).toEqualTypeOf<ChatLog>();
