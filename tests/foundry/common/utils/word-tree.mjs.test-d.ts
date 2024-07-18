import { expectTypeOf } from "vitest";
import WordTree from "../../../../src/foundry/common/utils/word-tree.mjs";

declare const w: WordTree;
declare const entry: WordTree.WordTreeEntry;

expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<WordTree.WordTreeEntry>();
expectTypeOf(w.lookup("a", { limit: 4 })).toEqualTypeOf<WordTree.WordTreeEntry[]>();
expectTypeOf(w.nodeAtPrefix("a")).toEqualTypeOf<WordTree.WordTreeEntry>();
