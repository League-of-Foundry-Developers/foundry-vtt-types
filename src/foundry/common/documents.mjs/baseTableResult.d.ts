import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The TableResult document model.
 */
export declare class BaseTableResult extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'TableResult';
      collection: 'results';
      label: 'DOCUMENT.TableResult';
      types: typeof CONST.TABLE_RESULT_TYPES;
      permissions: {
        update: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
