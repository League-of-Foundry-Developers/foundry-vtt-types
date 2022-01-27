import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { Context, DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import type { WallDataConstructorData } from '../data/data.mjs/wallData.js';
import { BaseScene } from './baseScene';
import { BaseUser } from './baseUser';

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
 */
export declare class BaseWall extends Document<data.WallData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  constructor(
    data: WallDataConstructorData,
    context?: Context<InstanceType<ConfiguredDocumentClass<typeof BaseScene>>>
  );

  /** @override */
  static get schema(): typeof data.WallData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Wall';
      collection: 'walls';
      label: 'DOCUMENT.Wall';
      labelPlural: 'DOCUMENT.Walls';
      isEmbedded: true;
      permissions: {
        update: typeof BaseWall._canUpdate;
      };
    }
  >;

  /**
   * Is a user able to update an existing Wall?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseWall, data: DeepPartial<WallDataConstructorData>): boolean;
}
