import { Context } from '../abstract/document.mjs';
import { ConfiguredDocumentClass, ConstructorDataType } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseScene } from './baseScene';
import { BaseUser } from './baseUser';
import * as data from '../data/data.mjs';

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
 */
export declare class BaseWall extends Document<data.WallData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  constructor(
    data: ConstructorDataType<data.WallData>,
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
  protected static _canUpdate(
    user: BaseUser,
    doc: BaseWall,
    data?: Partial<ConstructorDataType<data.WallData>>
  ): boolean;
}
