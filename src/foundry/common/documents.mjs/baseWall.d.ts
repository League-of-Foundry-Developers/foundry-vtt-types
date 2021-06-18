import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
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
