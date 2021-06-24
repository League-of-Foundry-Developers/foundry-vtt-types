import { expectType } from 'tsd';
import * as data from '../../../src/foundry/common/data/data.mjs';

const doc = new Item();

// Test the inheritance
expectType<string>(doc.documentName); // Document
expectType<object>(doc.migrateSystemData()); // Base-Document
expectType<string>(doc.uuid); // ClientDocumentMixin
expectType<ActiveEffect[]>(doc.transferredEffects); // class itself

// Test the inheritance of static members
expectType<string>(Item.documentName); // Document
expectType<typeof data.ItemData>(Item.schema); // Base-Document
expectType<Promise<Item | undefined>>(Item.createDialog()); // ClientDocumentMixin

// Properties
// TODO: change to <InstanceType<ConfiguredSheetClass<Item>> | null> once the circular reference problem has been solved
expectType<FormApplication | null>(doc.sheet);
