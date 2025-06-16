import { expectTypeOf } from "vitest";
import type { AnyObject } from "#utils";
import StringTree = foundry.utils.StringTree;

const s = new StringTree<AnyObject>();
declare const node: StringTree.Node<AnyObject>;

// can't test the unique symbol StringTree.leaves

expectTypeOf(s.addLeaf(["a"], node)).toEqualTypeOf<StringTree.Node<AnyObject>>();

expectTypeOf(s.lookup(["a"])).toEqualTypeOf<AnyObject[]>();
expectTypeOf(s.lookup(["a"], {})).toEqualTypeOf<AnyObject[]>();
expectTypeOf(
  s.lookup(["a"], {
    limit: 4,
    filterEntries: (entry: AnyObject) => Object.keys(entry).length > 5,
  }),
).toEqualTypeOf<AnyObject[]>();
expectTypeOf(s.lookup(["a"], { limit: undefined, filterEntries: undefined })).toEqualTypeOf<AnyObject[]>();

expectTypeOf(s.nodeAtPrefix(["a"])).toEqualTypeOf<StringTree.Node<AnyObject> | undefined>();
expectTypeOf(s.nodeAtPrefix(["a"], {})).toEqualTypeOf<StringTree.Node<AnyObject> | undefined>();
expectTypeOf(s.nodeAtPrefix(["a"], { hasLeaves: true })).toEqualTypeOf<StringTree.Node<AnyObject> | undefined>();
expectTypeOf(s.nodeAtPrefix(["a"], { hasLeaves: undefined })).toEqualTypeOf<StringTree.Node<AnyObject> | undefined>();

expectTypeOf(s["_breadthFirstSearch"](node, [{ foo: 7 }, { bar: "hi" }], [])).toBeVoid();
