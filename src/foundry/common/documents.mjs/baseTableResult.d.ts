import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseRollTable } from './baseRollTable';
import { BaseUser } from './baseUser';

/**
 * The base TableResult model definition which defines common behavior of an TableResult document between both client and server.
 */
export declare class BaseTableResult extends Document<
  foundry.data.TableResultData,
  InstanceType<ConfiguredDocumentClass<typeof BaseRollTable>>
> {
  static get schema(): typeof foundry.data.TableResultData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'TableResult';
      collection: 'results';
      label: 'DOCUMENT.TableResult';
      types: typeof CONST.TABLE_RESULT_TYPES;
      permissions: {
        update: (user: BaseUser, doc: any, data?: object) => boolean;
      };
    }
  >;

  /**
   * Is a user able to update an existing TableResult?
   * @internal
   */
  protected static _canUpdate(user: BaseUser, doc: BaseTableResult, data?: object): boolean;

  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;
}
