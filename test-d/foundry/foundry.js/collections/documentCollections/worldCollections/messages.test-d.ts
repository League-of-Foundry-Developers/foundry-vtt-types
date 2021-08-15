import type { ChatMessageDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/chatMessageData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const messages = new Messages();
expectType<ChatMessage>(messages.get('', { strict: true }));
expectType<PropertiesToSource<ChatMessageDataProperties>[]>(messages.toJSON());
expectType<null | SidebarDirectory<'ChatMessage'> | undefined>(messages.directory);
