import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const messages = new Messages();
expectTypeOf(messages.get("", { strict: true })).toEqualTypeOf<StoredDocument<ChatMessage>>();
expectTypeOf(messages.toJSON()).toEqualTypeOf<StoredDocument<ChatMessage>["_source"][]>();
expectTypeOf(messages.directory).toEqualTypeOf<undefined | ChatLog>();
