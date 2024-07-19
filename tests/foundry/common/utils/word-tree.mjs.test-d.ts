import { expectTypeOf } from "vitest";

const w = new foundry.utils.WordTree();
const entry = {} as foundry.utils.WordTree.WordTreeEntry;

expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<foundry.utils.WordTree.WordTreeEntry>();
expectTypeOf(w.lookup("a", { limit: 4 })).toEqualTypeOf<foundry.utils.WordTree.WordTreeEntry[]>();
expectTypeOf(w.nodeAtPrefix("a")).toEqualTypeOf<foundry.utils.WordTree.WordTreeEntry>();
