import { expectTypeOf } from "vitest";
import StringTree from "../../../../src/foundry/common/utils/string-tree.mjs";

declare const s: StringTree;
declare const node: StringTree.StringTreeNode;

expectTypeOf(s.addLeaf(["a"], node)).toEqualTypeOf<StringTree.StringTreeNode>();
expectTypeOf(s.lookup(["a"], { limit: 4 })).toEqualTypeOf<StringTree.StringTreeNode[]>();
expectTypeOf(s.nodeAtPrefix(["a"])).toEqualTypeOf<StringTree.StringTreeNode | void>();
