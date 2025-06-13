import { expectTypeOf } from "vitest";
import { ChatMessages } from "#client/documents/collections/_module.mjs";

const messages = new ChatMessages([]);
expectTypeOf(messages.get("", { strict: true })).toEqualTypeOf<ChatMessage.Stored>();
expectTypeOf(messages.toJSON()).toEqualTypeOf<ChatMessage.Stored["_source"][]>();
expectTypeOf(messages.directory).toEqualTypeOf<foundry.applications.sidebar.tabs.ChatLog.Any | undefined>();
