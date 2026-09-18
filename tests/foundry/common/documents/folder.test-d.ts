import { expectTypeOf, test } from "vitest";

test("foundry/common/documents/folder", async () => {
  expectTypeOf(foundry.documents.BaseFolder.create({ name: "Some Folder", type: "Item" })).toEqualTypeOf<
    Promise<Folder.Stored | undefined>
  >();
  expectTypeOf(foundry.documents.BaseFolder.createDocuments([])).toEqualTypeOf<Promise<Folder.Stored[]>>();
  expectTypeOf(foundry.documents.BaseFolder.updateDocuments([])).toEqualTypeOf<Promise<Folder.Stored[]>>();
  expectTypeOf(foundry.documents.BaseFolder.deleteDocuments([])).toEqualTypeOf<Promise<Folder.Stored[]>>();

  const folder = await foundry.documents.BaseFolder.create({ name: "Another Folder", type: "Actor" });
  if (folder) {
    expectTypeOf(folder.name).toEqualTypeOf<string>();
    expectTypeOf(folder.type).toEqualTypeOf<foundry.CONST.FOLDER_DOCUMENT_TYPES>();
  }
});
