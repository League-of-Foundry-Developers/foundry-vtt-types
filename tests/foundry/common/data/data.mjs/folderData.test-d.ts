import { expectTypeOf } from "vitest";

// @ts-expect-error - FolderData requires data.
new foundry.data.FolderData();

// @ts-expect-error - FolderData requires a name and type.
new foundry.data.FolderData({});

// @ts-expect-error - foo is not a configured type for a Folder.
new foundry.data.FolderData({ name: "foo", type: "foo" });

expectTypeOf(
  new foundry.data.FolderData({ name: "foo", type: foundry.CONST.FOLDER_DOCUMENT_TYPES[0] }),
).toEqualTypeOf<foundry.data.FolderData>();
