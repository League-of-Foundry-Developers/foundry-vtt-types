import { expectTypeOf } from "vitest";

declare const documentDirectory: DocumentDirectory<"Actor">;

expectTypeOf(DocumentDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(documentDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(documentDirectory.getData()).toEqualTypeOf<Promise<object>>();

expectTypeOf(documentDirectory.documents).toEqualTypeOf<Actor[]>();
expectTypeOf(documentDirectory.folders).toEqualTypeOf<(Folder & { type: "Actor" })[] | null>();
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

expectTypeOf(itemDocumentDirectory.documents).toEqualTypeOf<Item[]>();
expectTypeOf(itemDocumentDirectory.folders).toEqualTypeOf<(Folder & { type: "Item" })[] | null>();

// test with a non-document type
declare const compendiumDocumentDirectory: DocumentDirectory<"Compendium">;

expectTypeOf(compendiumDocumentDirectory.documents).toEqualTypeOf<undefined>();
expectTypeOf(compendiumDocumentDirectory.folders).toEqualTypeOf<(Folder & { type: "Compendium" })[] | null>();
