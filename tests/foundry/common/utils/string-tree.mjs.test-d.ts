import { expectTypeOf } from "vitest";

const s = new foundry.utils.StringTree();
const node = {} as foundry.utils.StringTree.StringTreeNode;

expectTypeOf(s.addLeaf(["a"], node)).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode>();
expectTypeOf(s.lookup(["a"], { limit: 4 })).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode[]>();
expectTypeOf(s.nodeAtPrefix(["a"])).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode | void>();
