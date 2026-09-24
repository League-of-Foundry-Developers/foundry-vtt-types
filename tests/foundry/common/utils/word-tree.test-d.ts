import { expectTypeOf, test } from "vitest";

import WordTree = foundry.utils.WordTree;

declare const someActor: Actor.Implementation;

test("foundry/common/utils/word-tree", () => {
  type ActorEntry = WordTree.Entry<"Actor">;
  type ActorEntryNode = WordTree.EntryNode<"Actor">;

  const w = new WordTree<"Actor">();
  const entry = {
    entry: someActor,
    documentName: "Actor",
    uuid: "Actor.XXXXXSomeIDXXXXX",
    pack: "some.pack",
  } satisfies ActorEntry; // necessary to make `"Actor"` a `Document.Type`

  expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<ActorEntryNode>();
  expectTypeOf(w.addLeaf(["a", "b"], entry)).toEqualTypeOf<ActorEntryNode>();

  expectTypeOf(w.lookup("a")).toEqualTypeOf<ActorEntry[]>();
  expectTypeOf(w.lookup("a", {})).toEqualTypeOf<ActorEntry[]>();
  expectTypeOf(
    w.lookup("a", {
      limit: 4,
      filterEntries: (entry: ActorEntry) => entry.uuid.length > 5,
    }),
  ).toEqualTypeOf<ActorEntry[]>();
  expectTypeOf(w.lookup("a", { limit: undefined, filterEntries: undefined })).toEqualTypeOf<ActorEntry[]>();

  expectTypeOf(w.nodeAtPrefix("a")).toEqualTypeOf<ActorEntryNode | undefined>();

  // `lookup` and `nodeAtPrefix` lower-case the prefix, so it must be a string
  // @ts-expect-error arrays are not accepted
  w.lookup(["a"]);
  // @ts-expect-error arrays are not accepted
  w.nodeAtPrefix(["a"]);
});
