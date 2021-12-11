import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import * as data from '../data/data.mjs';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseScene } from './baseScene';
import { BaseUser } from './baseUser';

/**
 * The base MeasuredTemplate model definition which defines common behavior of an MeasuredTemplate document between both client and server.
 */
export declare class BaseMeasuredTemplate extends Document<
  data.MeasuredTemplateData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>
> {
  /** @override */
  static get schema(): typeof data.MeasuredTemplateData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'MeasuredTemplate';
      collection: 'templates';
      label: 'DOCUMENT.MeasuredTemplate';
      labelPlural: 'DOCUMENT.MeasuredTemplates';
      isEmbedded: true;
      permissions: {
        create: 'TEMPLATE_CREATE';
        update: typeof BaseMeasuredTemplate['_canModify'];
        delete: typeof BaseMeasuredTemplate['_canModify'];
      };
    }
  >;

  /** @override */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   */
  protected static _canModify(user: BaseUser, doc: BaseMeasuredTemplate, data: unknown): boolean;
}
