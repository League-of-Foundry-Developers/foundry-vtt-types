import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(foundry.documents.BaseFolder.create({ name: "Some Folder", type: "Item" })).toEqualTypeOf<
  Promise<Document.Stored<Folder> | undefined>
>();
expectTypeOf(foundry.documents.BaseFolder.createDocuments([])).toEqualTypeOf<Promise<Document.Stored<Folder>[]>>();
expectTypeOf(foundry.documents.BaseFolder.updateDocuments([])).toEqualTypeOf<Promise<Folder[]>>();
expectTypeOf(foundry.documents.BaseFolder.deleteDocuments([])).toEqualTypeOf<Promise<Folder[]>>();

const folder = await foundry.documents.BaseFolder.create(
  { name: "Another Folder", type: "Actor" },
  { temporary: true },
);
if (folder) {
  expectTypeOf(folder.name).toEqualTypeOf<string>();
  expectTypeOf(folder.type).toEqualTypeOf<foundry.CONST.FOLDER_DOCUMENT_TYPES>();
}
