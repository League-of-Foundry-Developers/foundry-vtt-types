import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The base FogExploration model definition which defines common behavior of an FogExploration document between both client and server.
 */
export declare class BaseFogExploration extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'FogExploration';
      collection: 'fog';
      label: 'DOCUMENT.FogExploration';
      isPrimary: true;
      permissions: {
        create: 'PLAYER';
        update: (user: BaseUser, doc: any, data: any) => boolean;
        delete: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
