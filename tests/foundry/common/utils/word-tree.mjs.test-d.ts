import { expectTypeOf } from "vitest";

const w = new foundry.utils.WordTree();
declare const entry: foundry.utils.WordTree.WordTreeEntry;

expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode>();
expectTypeOf(w.addLeaf(["a"], entry)).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode>();
expectTypeOf(w.lookup("a", { limit: 4 })).toEqualTypeOf<foundry.utils.WordTree.WordTreeEntry[]>();
expectTypeOf(w.nodeAtPrefix("a")).toEqualTypeOf<foundry.utils.WordTree.WordTreeEntry>();
