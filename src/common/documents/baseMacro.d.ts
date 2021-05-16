import * as data from '../data/data';
import { Document } from '../abstract/module';
import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document';
import * as documents from '../documents';

export declare class BaseMacro extends Document<data.MacroData> {
  static get schema(): typeof data.MacroData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Macro';
      collection: 'macros';
      label: 'DOCUMENT.Macro';
      isPrimary: true;
      types: ['script', 'chat']; // TODO: Automatically infer from CONST.MACRO_TYPES
      permissions: {
        create: 'PLAYER';
        update: (user: documents.BaseUser, doc: BaseMacro, data: any) => boolean;
        delete: (user: documents.BaseUser, doc: BaseMacro) => boolean;
      };
    }
  >;

  protected _preCreate(
    data: data.MacroData,
    options: DocumentModificationOptions,
    user: documents.BaseUser
  ): Promise<void>;

  /**
   * Is a user able to update an existing Macro document?
   */
  protected static _canUpdate(user: documents.BaseUser, doc: BaseMacro, data: unknown): boolean;

  /**
   * Is a user able to delete an existing Macro document?
   */
  protected static _canDelete(user: documents.BaseUser, doc: BaseMacro): boolean;
}
