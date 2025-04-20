import { expectTypeOf } from "vitest";

const doc = new Item.implementation({ name: "foo", type: "base" });

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(doc.migrateSystemData()).toEqualTypeOf<object>(); // Base-Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // ClientDocumentMixin
expectTypeOf(doc.transferredEffects).toEqualTypeOf<ActiveEffect.Implementation[]>(); // class itself

// Test the inheritance of static members
expectTypeOf(Item.documentName).toEqualTypeOf<string>(); // Document
expectTypeOf(Item.createDialog()).toEqualTypeOf<Promise<Item.Implementation | null | undefined>>(); // ClientDocumentMixin

// Properties
// TODO: change to <InstanceType<ConfiguredSheetClass<Item>> | null> once the circular reference problem has been solved
expectTypeOf(doc.sheet).toEqualTypeOf<FormApplication.Any | null>();

// ensure source can be used to create a new document with createDialog
expectTypeOf(Item.createDialog(doc.toObject())).toEqualTypeOf<Promise<Item.Implementation | null | undefined>>();
