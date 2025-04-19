import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseFolder.create({ name: "Some Folder", type: "Item" })).toEqualTypeOf<
  Promise<Folder.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseFolder.createDocuments([])).toEqualTypeOf<Promise<Folder.Stored[]>>();
expectTypeOf(foundry.documents.BaseFolder.updateDocuments([])).toEqualTypeOf<Promise<Folder.Implementation[]>>();
expectTypeOf(foundry.documents.BaseFolder.deleteDocuments([])).toEqualTypeOf<Promise<Folder.Implementation[]>>();

const folder = await foundry.documents.BaseFolder.create(
  { name: "Another Folder", type: "Actor" },
  { temporary: true },
);
if (folder) {
  expectTypeOf(folder.name).toEqualTypeOf<string>();
  expectTypeOf(folder.type).toEqualTypeOf<foundry.CONST.FOLDER_DOCUMENT_TYPES>();
}
