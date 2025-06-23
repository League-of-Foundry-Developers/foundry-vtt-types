import { expectTypeOf } from "vitest";

import DocumentIndex = foundry.helpers.DocumentIndex;

const docindex = new DocumentIndex();

expectTypeOf(docindex.trees).toEqualTypeOf<Record<string, foundry.utils.WordTree.Any>>();
expectTypeOf(docindex.uuids).toEqualTypeOf<Record<string, foundry.utils.StringTree.Node<DocumentIndex.Leaf>>>();
expectTypeOf(docindex.ready).toEqualTypeOf<Promise<void> | null>();
expectTypeOf(docindex.index()).toEqualTypeOf<Promise<void>>();

expectTypeOf(docindex.lookup("")).toEqualTypeOf<Record<string, foundry.utils.WordTree.Entry.Any[]>>();

declare const doc: JournalEntry.Implementation;

expectTypeOf(docindex.addDocument(doc)).toEqualTypeOf<void>();
expectTypeOf(docindex.removeDocument(doc)).toEqualTypeOf<void>();
expectTypeOf(docindex.replaceDocument(doc)).toEqualTypeOf<void>();
