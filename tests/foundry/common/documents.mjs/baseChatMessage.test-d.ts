import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseChatMessage.create({})).toEqualTypeOf<
  Promise<StoredDocument<ChatMessage> | undefined>
>();
expectTypeOf(foundry.documents.BaseChatMessage.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<ChatMessage>[]>
>();
expectTypeOf(foundry.documents.BaseChatMessage.updateDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();
expectTypeOf(foundry.documents.BaseChatMessage.deleteDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectTypeOf(chat.data).toEqualTypeOf<foundry.data.ChatMessageData>();
}
