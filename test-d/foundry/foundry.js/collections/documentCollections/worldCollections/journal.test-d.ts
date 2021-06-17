import { expectType } from 'tsd';
import { JournalEntryDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/journalEntryData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const journal = new Journal();
expectType<JournalEntry>(journal.get('', { strict: true }));
expectType<PropertiesToSource<JournalEntryDataProperties>[]>(journal.toJSON());
expectType<JournalDirectory | undefined>(journal.directory);
