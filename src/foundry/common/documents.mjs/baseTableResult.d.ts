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
  /** @override */
  static get schema(): typeof foundry.data.TableResultData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'TableResult';
      collection: 'results';
      label: 'DOCUMENT.TableResult';
      labelPlural: 'DOCUMENT.TableResults';
      types: [
        `${typeof CONST.TABLE_RESULT_TYPES.TEXT}`,
        `${typeof CONST.TABLE_RESULT_TYPES.DOCUMENT}`,
        `${typeof CONST.TABLE_RESULT_TYPES.COMPENDIUM}`
      ];
      permissions: {
        update: (user: BaseUser, doc: any, data?: object) => boolean;
      };
    }
  >;

  /**
   * Is a user able to update an existing TableResult?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseTableResult, data?: object): boolean;

  /** @override */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;
}
