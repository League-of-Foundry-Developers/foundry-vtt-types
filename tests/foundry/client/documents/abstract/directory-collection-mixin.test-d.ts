import { test, describe, expectTypeOf } from "vitest";

import DirectoryCollectionMixin = foundry.documents.abstract.DirectoryCollectionMixin;
import DocumentCollection = foundry.documents.abstract.DocumentCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import Document = foundry.abstract.Document;

describe("DirectoryCollectionMixin Tests", () => {
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

  const actorSource = new Actor.implementation({
    name: "DirectoryCollectionMixin Test Actor",
    type: "base",
  }).toObject();

  const compendia: Array<[string, CompendiumCollection.Any]> = game.packs!.contents.map((p) => [p.metadata.name, p]);

  test("Construction", () => {
    new DCMTestActors();
    new DCMTestActors([actorSource]);

    new DCMTestCompendia(compendia);
  });

  const dcm = new DCMTestActors([actorSource]);

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
    expectTypeOf(dcm["_formatFolderSelectOptions"]()).toExtend<{ id: string; name: string }[]>();
    expectTypeOf(dcm["_formatFolderSelectOptions"]()).toEqualTypeOf<Document.DialogFoldersChoices[]>();

    expectTypeOf(DCMTestActors["_sortAlphabetical"]({ name: "foo" }, { name: "bar" })).toBeNumber();
    expectTypeOf(DCMTestActors["_sortStandard"]({ sort: 5 }, { sort: 7 })).toBeNumber();
  });
});
