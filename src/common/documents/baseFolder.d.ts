import * as data from '../data/data';
import { Document } from '../abstract/module';
import { DocumentMetadata } from '../abstract/document';

/**
 * The Folder Document model.
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
