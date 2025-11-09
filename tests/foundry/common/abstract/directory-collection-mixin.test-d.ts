import { test, describe, expectTypeOf } from "vitest";

import DirectoryCollectionMixin = foundry.documents.abstract.DirectoryCollectionMixin;
import DocumentCollection = foundry.documents.abstract.DocumentCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare const actorCreateDataArray: Actor.CreateData[];
declare const actorSourceDataArray: Actor.Source[];
declare const compendia: Array<[string, CompendiumCollection.Any]>;

class DCMTestActors extends DirectoryCollectionMixin(DocumentCollection)<"Actor"> {
  /**
   * This override is required because of necessary widening of the type in the mixin, see
   * {@linkcode DirectoryCollectionMixin.AnyMixed._getVisibleTreeContents | DirectoryCollection#_getVisibleTreeContents}.
   */
  protected override _getVisibleTreeContents() {
    return this.contents;
  }
}
class DCMTestCompendia extends DirectoryCollectionMixin(Collection)<CompendiumCollection.Any> {}

describe("DirectoryCollectionMixin Tests", () => {
  test("Construction", () => {
    new DCMTestActors();
    new DCMTestActors(actorSourceDataArray);
    new DCMTestActors(actorCreateDataArray);

    new DCMTestCompendia(compendia);
  });

  const dcm = new DCMTestActors(actorCreateDataArray);

  test("Contents", () => {
    expectTypeOf(dcm.contents).toEqualTypeOf<Actor.Stored[]>();

    const tree = dcm.tree;
    if (tree) {
      expectTypeOf(tree).toEqualTypeOf<DirectoryCollectionMixin.TreeNode<Actor.Stored>>();
      expectTypeOf(tree.children).toEqualTypeOf<DirectoryCollectionMixin.TreeNode<Actor.Stored>[]>();
      expectTypeOf(tree.entries).toEqualTypeOf<Actor.Stored[]>();
    }

    expectTypeOf(dcm["_getVisibleTreeContents"]()).toEqualTypeOf<Actor.Stored[]>();
  });

  test("Miscellaneous", () => {
    expectTypeOf(DCMTestActors["_sortAlphabetical"]({ name: "foo" }, { name: "bar" })).toBeNumber();
    expectTypeOf(DCMTestActors["_sortStandard"]({ sort: 5 }, { sort: 7 })).toBeNumber();
  });
});
