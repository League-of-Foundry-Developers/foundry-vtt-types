import { expectTypeOf } from "vitest";

declare const documentDirectory: DocumentDirectory<"Actor">;

expectTypeOf(DocumentDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(documentDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(documentDirectory.getData()).toEqualTypeOf<Promise<object>>();

expectTypeOf(documentDirectory.documents).toEqualTypeOf<Actor.Implementation[]>();
expectTypeOf(documentDirectory.folders).toEqualTypeOf<(Folder.Implementation & { type: "Actor" })[] | null>();
expectTypeOf(DocumentDirectory.documentName).toEqualTypeOf<string>();
expectTypeOf(documentDirectory.entryType).toEqualTypeOf<string>();
expectTypeOf(documentDirectory.title).toEqualTypeOf<string>();
expectTypeOf(documentDirectory.id).toEqualTypeOf<string>();
expectTypeOf(documentDirectory.tabName).toEqualTypeOf<string>();
expectTypeOf(documentDirectory.collection).toEqualTypeOf<DocumentCollection.Any>();
expectTypeOf(documentDirectory.canCreateEntry).toEqualTypeOf<boolean>();
expectTypeOf(documentDirectory.canCreateFolder).toEqualTypeOf<boolean>();

// test with a different document type
declare const itemDocumentDirectory: DocumentDirectory<"Item">;

expectTypeOf(itemDocumentDirectory.documents).toEqualTypeOf<Item.Implementation[]>();
expectTypeOf(itemDocumentDirectory.folders).toEqualTypeOf<(Folder.Implementation & { type: "Item" })[] | null>();

// test with a non-document type
declare const compendiumDocumentDirectory: DocumentDirectory<"Compendium">;

expectTypeOf(compendiumDocumentDirectory.documents).toEqualTypeOf<undefined>();
expectTypeOf(compendiumDocumentDirectory.folders).toEqualTypeOf<
  (Folder.Implementation & { type: "Compendium" })[] | null
>();
