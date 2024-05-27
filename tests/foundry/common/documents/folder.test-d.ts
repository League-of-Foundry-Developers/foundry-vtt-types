import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseFolder.create({ name: "Some Folder", type: "Item" })).toEqualTypeOf<
  Promise<StoredDocument<Folder> | undefined>
>();
expectTypeOf(foundry.documents.BaseFolder.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Folder>[]>>();
expectTypeOf(foundry.documents.BaseFolder.updateDocuments([])).toEqualTypeOf<Promise<Folder[]>>();
expectTypeOf(foundry.documents.BaseFolder.deleteDocuments([])).toEqualTypeOf<Promise<Folder[]>>();

const folder = await foundry.documents.BaseFolder.create(
  { name: "Another Folder", type: "Actor" },
  { temporary: true },
);
if (folder) {
  expectTypeOf(folder.type).toEqualTypeOf<foundry.CONST.FOLDER_DOCUMENT_TYPES>();
}
