import * as data from '../data/data.mjs';
import { Document } from '../abstract/module.mjs';
import { DocumentMetadata } from '../abstract/document.mjs';

/**
 * The base Folder model definition which defines common behavior of an Folder document between both client and server.
 */
export declare class BaseFolder extends Document<data.FolderData, BaseFolder> {
  static get schema(): typeof data.FolderData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Folder';
      collection: 'folders';
      label: 'DOCUMENT.Folder';
      isPrimary: true;
      types: typeof CONST.FOLDER_ENTITY_TYPES;
    }
  >;
}
