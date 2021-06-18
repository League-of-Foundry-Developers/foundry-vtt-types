import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The base Drawing model definition which defines common behavior of an Drawing document between both client and server.
 */
export declare class BaseDrawing extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Drawing';
      collection: 'drawings';
      label: 'DOCUMENT.Drawing';
      isEmbedded: true;
      permissions: {
        create: 'TEMPLATE_CREATE';
        update: (user: BaseUser, doc: any, data: any) => boolean;
        delete: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
