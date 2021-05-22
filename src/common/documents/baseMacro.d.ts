import * as data from '../data/data';
import { Document } from '../abstract/module';
import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document';
import * as documents from '../documents';

/**
 * The Macro document model.
 */
export declare class BaseMacro extends Document<data.MacroData> {
  static get schema(): typeof data.MacroData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      collection: 'macros';
      isPrimary: true;
      label: 'DOCUMENT.Macro';
      name: 'Macro';
      permissions: {
        create: 'PLAYER';
        delete: (user: documents.BaseUser, doc: BaseMacro) => boolean;
        update: (user: documents.BaseUser, doc: BaseMacro, data: any) => boolean;
      };
      types: ['script', 'chat']; // TODO: Automatically infer from CONST.MACRO_TYPES
    }
  >;

  /**
   * Is a user able to delete an existing Macro document?
   */
  protected static _canDelete(user: documents.BaseUser, doc: BaseMacro): boolean;

  /**
   * Is a user able to update an existing Macro document?
   */
  protected static _canUpdate(user: documents.BaseUser, doc: BaseMacro, data: unknown): boolean;

  protected _preCreate(
    data: data.MacroData,
    options: DocumentModificationOptions,
    user: documents.BaseUser
  ): Promise<void>;
}
