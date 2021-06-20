import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BaseActor } from './baseActor';
import { BaseItem } from './baseItem';
import { BaseUser } from './baseUser';

/**
 * The base ActiveEffect model definition which defines common behavior of an ActiveEffect document between both client and server.
 */
export declare class BaseActiveEffect extends Document<
  data.ActiveEffectData,
  InstanceType<ConfiguredDocumentClass<typeof BaseActor>> | InstanceType<ConfiguredDocumentClass<typeof BaseItem>>
> {
  static get schema(): ConstructorOf<data.ActiveEffectData>;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'ActiveEffect';
      collection: 'effects';
      label: 'DOCUMENT.ActiveEffect';
      isEmbedded: true;
    }
  >;

  protected _preCreate(
    data: Parameters<data.ActiveEffectData['_initializeSource']>[0],
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.EntityPermission,
    { exact }: { exact?: boolean }
  ): boolean;
}
