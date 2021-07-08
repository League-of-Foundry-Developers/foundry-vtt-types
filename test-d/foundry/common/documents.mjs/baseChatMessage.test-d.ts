import { expectType } from 'tsd';

expectType<Promise<ChatMessage | undefined>>(foundry.documents.BaseChatMessage.create({}));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.createDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.updateDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.deleteDocuments([]));

const chat = await foundry.documents.BaseChatMessage.create({});
if (chat) {
  expectType<foundry.data.ChatMessageData>(chat.data);
}
