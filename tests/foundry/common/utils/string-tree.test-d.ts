import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

const s = new foundry.utils.StringTree();
declare const node: foundry.utils.StringTree.StringTreeNode<AnyObject>;

expectTypeOf(s.addLeaf(["a"], node)).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode<AnyObject>>();
expectTypeOf(s.lookup(["a"], { limit: 4 })).toEqualTypeOf<AnyObject[]>();
expectTypeOf(s.nodeAtPrefix(["a"])).toEqualTypeOf<foundry.utils.StringTree.StringTreeNode<AnyObject> | void>();
