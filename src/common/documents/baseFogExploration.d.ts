import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';

/**
 * The FogExploration Document model.
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
