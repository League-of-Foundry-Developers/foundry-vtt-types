import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';

/**
 * The Drawing embedded document model.
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
