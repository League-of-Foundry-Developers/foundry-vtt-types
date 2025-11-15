import { describe, expectTypeOf, test } from "vitest";

import CompendiumFolderCollection = foundry.documents.collections.CompendiumFolderCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare const folderCreateDataArray: Folder.CreateData[];
declare const actorPack: CompendiumCollection<"Actor">;
declare const itemPack: CompendiumCollection<"Item">;

describe("CompendiumFolderCollection Tests", () => {
  test("Construction", () => {
    expectTypeOf(new CompendiumFolderCollection(actorPack)).toEqualTypeOf<CompendiumFolderCollection<"Actor">>();
    expectTypeOf(new CompendiumFolderCollection(actorPack, folderCreateDataArray)).toEqualTypeOf<
      CompendiumFolderCollection<"Actor">
    >();
    expectTypeOf(new CompendiumFolderCollection(itemPack)).toEqualTypeOf<CompendiumFolderCollection<"Item">>();
    expectTypeOf(new CompendiumFolderCollection(itemPack, folderCreateDataArray)).toEqualTypeOf<
      CompendiumFolderCollection<"Item">
    >();
  });

  const actorPackFolders = new CompendiumFolderCollection(actorPack, folderCreateDataArray);

  test("Miscellaneous", () => {
    expectTypeOf(actorPackFolders.pack).toEqualTypeOf<CompendiumCollection<"Actor">>();

    // `CompendiumFolderCollection` doesn't set its `static documentName`, so it'll always be `undefined` at runtime
    expectTypeOf(CompendiumFolderCollection.documentName).toEqualTypeOf<string | undefined>();
    // It does have an override for the instance getter though
    expectTypeOf(actorPackFolders.documentName).toEqualTypeOf<"Folder">();

    // No type changes from `DocumentCollection`, thorough tests can be found there.
    expectTypeOf(actorPackFolders.render(true, { classes: ["foo"], left: 7 }));
  });

  // TODO: updateAll and _onModifyContents tests on the db-ops branch
});
