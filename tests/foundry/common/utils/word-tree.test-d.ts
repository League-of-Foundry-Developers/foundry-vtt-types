import { expectTypeOf } from "vitest";

import WordTree = foundry.utils.WordTree;

type ActorEntry = WordTree.Entry<"Actor">;
type ActorEntryNode = WordTree.EntryNode<"Actor">;

const w = new WordTree<"Actor">();
declare const someActor: Actor.Implementation;
const entry = {
  entry: someActor,
  documentName: "Actor",
  uuid: "Actor.XXXXXSomeIDXXXXX",
  pack: "some.pack",
} satisfies ActorEntry; // necessary to make `"Actor"` a `Document.Type`

expectTypeOf(w.addLeaf("a", entry)).toEqualTypeOf<ActorEntryNode>();

// @ts-expect-error An array of strings may be valid in other trees but not in a `WordTree`.
w.addLeaf(["a"], entry);

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
