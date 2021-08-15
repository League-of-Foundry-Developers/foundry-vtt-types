import type { JournalEntryDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/journalEntryData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const journal = new Journal();
expectType<JournalEntry>(journal.get('', { strict: true }));
expectType<PropertiesToSource<JournalEntryDataProperties>[]>(journal.toJSON());
expectType<JournalDirectory | undefined>(journal.directory);
