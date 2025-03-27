import { expectTypeOf } from "vitest";

const docindex = new DocumentIndex();

expectTypeOf(docindex.trees).toEqualTypeOf<Record<string, foundry.utils.WordTree>>();
expectTypeOf(docindex.uuids).toEqualTypeOf<
  Record<string, foundry.utils.StringTree.StringTreeNode<DocumentIndex.Leaf>>
>();
expectTypeOf(docindex.ready).toEqualTypeOf<Promise<void> | null>();
expectTypeOf(docindex.index()).toEqualTypeOf<Promise<void>>();

expectTypeOf(docindex.lookup("")).toEqualTypeOf<Record<string, foundry.utils.WordTree.WordTreeEntry[]>>();

declare const doc: JournalEntry;

expectTypeOf(docindex.addDocument(doc)).toEqualTypeOf<void>();
expectTypeOf(docindex.removeDocument(doc)).toEqualTypeOf<void>();
expectTypeOf(docindex.replaceDocument(doc)).toEqualTypeOf<void>();
