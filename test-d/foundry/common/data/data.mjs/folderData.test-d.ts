import { expectError, expectType } from "tsd";

expectError(new foundry.data.FolderData());
expectError(new foundry.data.FolderData({}));
expectError(new foundry.data.FolderData({ name: "foo", type: "foo" }));
expectType<foundry.data.FolderData>(
  new foundry.data.FolderData({ name: "foo", type: foundry.CONST.FOLDER_DOCUMENT_TYPES[0] }),
);
