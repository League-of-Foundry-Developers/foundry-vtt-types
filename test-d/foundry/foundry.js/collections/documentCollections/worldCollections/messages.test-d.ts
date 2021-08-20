import { expectType } from 'tsd';

const messages = new Messages();
expectType<StoredDocument<ChatMessage>>(messages.get('', { strict: true }));
expectType<StoredDocument<ChatMessage>['data']['_source'][]>(messages.toJSON());
expectType<null | SidebarDirectory<'ChatMessage'> | undefined>(messages.directory);
