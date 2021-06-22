import { expectType } from 'tsd';

const compendiumCollection = new CompendiumCollection(foundry.documents.BaseJournalEntry.metadata);
expectType<JournalEntry>(compendiumCollection.get('', { strict: true }));
expectType<Array<foundry.documents.BaseJournalEntry['data']['_source']>>(compendiumCollection.toJSON());
