import { expectType } from 'tsd';

const messages = new Messages();
expectType<ChatMessage>(messages.get('', { strict: true }));
expectType<any[]>(messages.toJSON()); // TODO: Adjust as soon as ChatMessageData and BaseChatMessage have been typed
expectType<null>(messages.directory);
