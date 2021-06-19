import { expectType } from 'tsd';
import { Metadata } from '../../../../../src/foundry/common/abstract/document.mjs';
import { BaseJournalEntry } from '../../../../../src/foundry/common/documents.mjs';

const metadata: Metadata<BaseJournalEntry> = {
  name: 'JournalEntry',
  collection: 'none',
  label: 'label',
  types: [],
  hasSystemData: false,
  pack: 'none',
  embedded: null as any,
  permissions: {
    create: '',
    delete: '',
    update: ''
  }
};

const compendiumCollection = new CompendiumCollection(metadata);
expectType<foundry.documents.BaseJournalEntry>(compendiumCollection.get('', { strict: true }));
expectType<any[]>(compendiumCollection.toJSON());
