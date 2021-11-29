import { expectError, expectType } from 'tsd';

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

expectType<{ _id: string } & Partial<foundry.data.JournalEntryData['_source']>>(
  (await compendiumCollection.getIndex()).get('some id', { strict: true })
);

const itemCollection = new CompendiumCollection({
  entity: 'Item',
  label: 'Important items',
  name: 'items',
  package: 'other-package',
  path: 'path/to/items',
  private: false
});
expectType<{ _id: string } & Partial<foundry.data.ItemData['_source']>>(
  (await itemCollection.getIndex()).get('some id', { strict: true })
);
expectType<{ _id: string } & Partial<foundry.data.ItemData['_source']>>(
  (await itemCollection.getIndex({ fields: ['name', 'effects', 'data'] })).get('some id', { strict: true })
);

expectError(await itemCollection.getIndex({ fields: ['nonExistentField'] }));

expectType<StoredDocument<Item>[]>(await itemCollection.getDocuments()); // get all items
expectType<StoredDocument<Item>[]>(await itemCollection.getDocuments({})); // get all items
expectType<StoredDocument<Item>[]>(await itemCollection.getDocuments({ name: 'foo' })); // get all items called 'foo'
expectType<StoredDocument<Item>[]>(
  await itemCollection.getDocuments({ $or: [{ name: 'baz' }, { name: 'bar' }], effects: { $size: 2 } }) // only get items called 'baz' or 'bar' that have exactly 2 effects
);
