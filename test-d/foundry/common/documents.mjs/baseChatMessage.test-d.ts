import { expectType } from "tsd";

expectType<Promise<StoredDocument<ChatMessage> | undefined>>(foundry.documents.BaseChatMessage.create({}));
expectType<Promise<StoredDocument<ChatMessage>[]>>(foundry.documents.BaseChatMessage.createDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.updateDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.deleteDocuments([]));

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectType<foundry.data.ChatMessageData>(chat.data);
}
