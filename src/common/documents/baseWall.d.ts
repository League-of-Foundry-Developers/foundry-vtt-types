import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';

/**
 * The Wall embedded document model.
 */
export declare class BaseWall extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Wall';
      collection: 'walls';
      label: 'DOCUMENT.Wall';
      isEmbedded: true;
      permissions: {
        update: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
