import { expectTypeOf } from "vitest";

import DocumentIndex = foundry.helpers.DocumentIndex;
import WordTree = foundry.utils.WordTree;
import StringTree = foundry.utils.StringTree;

const docIndex = new DocumentIndex();

expectTypeOf(docIndex.trees).toEqualTypeOf<DocumentIndex.WordTrees>();
expectTypeOf(docIndex.uuids).toEqualTypeOf<Record<string, StringTree.Node<DocumentIndex.Leaf>>>();
expectTypeOf(docIndex.ready).toEqualTypeOf<Promise<void> | null>();
expectTypeOf(docIndex.index()).toEqualTypeOf<Promise<void>>();

expectTypeOf(docIndex.lookup("Val")).toEqualTypeOf<DocumentIndex.LookupReturn>();
expectTypeOf(docIndex.lookup("Val", {})).toEqualTypeOf<DocumentIndex.LookupReturn>();
// @ts-expect-error Only documents with `indexed: true` in their metadata are allowed
expectTypeOf(docIndex.lookup("Val", { documentTypes: ["Region"] })).toEqualTypeOf<DocumentIndex.LookupReturn>();
expectTypeOf(
  docIndex.lookup("Val", {
    documentTypes: ["Actor", "Playlist"],
    filterEntries: (entry: WordTree.Entry.Any) => entry.entry?.type === "npc",
    limit: 5,
    ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
  }),
).toEqualTypeOf<DocumentIndex.LookupReturn>();
expectTypeOf(
  docIndex.lookup("Val", {
    documentTypes: undefined,
    filterEntries: undefined,
    limit: undefined,
    ownership: undefined,
  }),
).toEqualTypeOf<DocumentIndex.LookupReturn>();

declare const je: JournalEntry.Implementation;
declare const tile: TileDocument.Implementation;

expectTypeOf(docIndex.addDocument(je)).toEqualTypeOf<void>();
// @ts-expect-error Only documents with `indexed: true` in their metadata are allowed
expectTypeOf(docIndex.addDocument(tile));

expectTypeOf(docIndex.removeDocument(je)).toEqualTypeOf<void>();
expectTypeOf(docIndex.replaceDocument(je)).toEqualTypeOf<void>();

declare const someCompendium: foundry.documents.collections.CompendiumCollection<"JournalEntry">;
expectTypeOf(docIndex["_addLeaf"](je)).toBeVoid();
expectTypeOf(docIndex["_addLeaf"](je, {})).toBeVoid();
expectTypeOf(docIndex["_addLeaf"](je, { pack: someCompendium })).toBeVoid();
expectTypeOf(docIndex["_addLeaf"](je, { pack: undefined })).toBeVoid();

expectTypeOf(docIndex["_indexCompendium"](someCompendium)).toBeVoid();
expectTypeOf(docIndex["_indexEmbeddedDocuments"](je)).toBeVoid();
expectTypeOf(docIndex["_indexWorldCollection"]("Macro")).toBeVoid();
