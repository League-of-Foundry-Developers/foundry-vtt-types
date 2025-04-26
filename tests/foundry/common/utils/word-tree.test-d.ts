import { expectTypeOf } from "vitest";

import WordTree = foundry.utils.WordTree;
import StringTree = foundry.utils.StringTree;

const w = new WordTree();
declare const entry: WordTree.WordTreeEntry;

expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<StringTree.StringTreeNode<WordTree.WordTreeEntry>>();

// @ts-expect-error - An array of strings may be valid in other trees but not in a `WordTree`.
w.addLeaf(["a"], entry);

expectTypeOf(w.lookup("a", { limit: 4 })).toEqualTypeOf<WordTree.WordTreeEntry[]>();
expectTypeOf(w.nodeAtPrefix("a")).toEqualTypeOf<StringTree.StringTreeNode<WordTree.WordTreeEntry> | void>();
