import { expectTypeOf } from "vitest";
import type * as data from "../../../../../src/foundry/common/data/data.mjs/index.mts";

const doc = new Item();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(doc.migrateSystemData()).toEqualTypeOf<object>(); // Base-Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // ClientDocumentMixin
expectTypeOf(doc.transferredEffects).toEqualTypeOf<ActiveEffect[]>(); // class itself

// Test the inheritance of static members
expectTypeOf(Item.documentName).toEqualTypeOf<string>(); // Document
expectTypeOf(Item.schema).toEqualTypeOf<typeof data.ItemData>(); // Base-Document
expectTypeOf(Item.createDialog()).toEqualTypeOf<Promise<Item | null | undefined>>(); // ClientDocumentMixin

// Properties
// TODO: change to <InstanceType<ConfiguredSheetClass<Item>> | null> once the circular reference problem has been solved
expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication | null>();

// ensure source can be used to create a new document with createDialog
expectTypeOf(Item.createDialog(doc.toObject())).toEqualTypeOf<Promise<Item | null | undefined>>();
