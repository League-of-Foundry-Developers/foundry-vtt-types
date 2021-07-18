import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseScene } from './baseScene';
import { BaseUser } from './baseUser';
import * as data from '../data/data.mjs';

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
 */
export declare class BaseWall extends Document<data.WallData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Wall';
      collection: 'walls';
      label: 'DOCUMENT.Wall';
      isEmbedded: true;
      permissions: {
        update: (user: BaseUser, doc: any, data?: object) => boolean;
      };
    }
  >;
}
