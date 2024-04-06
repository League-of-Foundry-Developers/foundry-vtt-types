import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as CONST from "../constants.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";

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
  get type(): Exclude<CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;
}
