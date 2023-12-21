import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as CONST from "../constants.mts";
import type * as data from "../data/data.mjs/index.mts";

type FolderMetadata = Merge<
  DocumentMetadata,
  {
    name: "Folder";
    collection: "folders";
    label: "DOCUMENT.Folder";
    labelPlural: "DOCUMENT.Folders";
    isPrimary: true;
    types: typeof CONST.FOLDER_DOCUMENT_TYPES;
  }
>;

/**
 * The base Folder model definition which defines common behavior of an Folder document between both client and server.
 */
export declare class BaseFolder extends Document<data.FolderData, BaseFolder, FolderMetadata> {
  static override get schema(): typeof data.FolderData;

  static override get metadata(): FolderMetadata;

  /**
   * The type of Document contained within this Folder.
   */
  get type(): CONST.FOLDER_DOCUMENT_TYPES;
}
