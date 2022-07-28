import { expectType } from 'tsd';

const messages = new Messages();
expectType<StoredDocument<ChatMessage>>(messages.get('', { strict: true }));
expectType<StoredDocument<ChatMessage>['_source'][]>(messages.toJSON());
expectType<undefined | ChatLog>(messages.directory);
