import { expectType } from 'tsd';

const metadata = {
  entity: 'JournalEntry' as const,
  label: 'Important Plotholes',
  name: 'plotholes',
  package: 'some-package',
  path: 'path/to/file',
  private: false
};

const compendiumCollection = new CompendiumCollection(metadata);
expectType<StoredDocument<JournalEntry>>(compendiumCollection.get('', { strict: true }));
expectType<Array<StoredDocument<foundry.documents.BaseJournalEntry>['data']['_source']>>(compendiumCollection.toJSON());
