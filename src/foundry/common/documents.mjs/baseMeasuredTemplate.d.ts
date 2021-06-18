import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The base MeasuredTemplate model definition which defines common behavior of an MeasuredTemplate document between both client and server.
 */
export declare class BaseMeasuredTemplate extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'MeasuredTemplate';
      collection: 'templates';
      label: 'DOCUMENT.MeasuredTemplate';
      isEmbedded: true;
      permissions: {
        create: 'TEMPLATE_CREATE';
        update: (user: BaseUser, doc: any, data: any) => boolean;
        delete: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
