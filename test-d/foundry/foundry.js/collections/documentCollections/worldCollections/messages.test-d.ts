import { expectType } from 'tsd';
import { ChatMessageDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/chatMessageData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const messages = new Messages();
expectType<ChatMessage>(messages.get('', { strict: true }));
expectType<PropertiesToSource<ChatMessageDataProperties>[]>(messages.toJSON());
expectType<null>(messages.directory);
