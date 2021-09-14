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

expectType<{
  _id: string;
  name: string;
  img: string | null | undefined;
}>((await compendiumCollection.getIndex()).get('some id', { strict: true }));

const itemCollection = new CompendiumCollection({
  entity: 'Item',
  label: 'Important items',
  name: 'items',
  package: 'other-package',
  path: 'path/to/items',
  private: false
});
expectType<{ _id: string; name: string; img: string | null; type: 'armor' | 'weapon' }>(
  (await itemCollection.getIndex()).get('some id', { strict: true })
);
