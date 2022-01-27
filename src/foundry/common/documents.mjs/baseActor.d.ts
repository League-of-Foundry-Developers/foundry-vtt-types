import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import type { ActorDataConstructorData } from '../data/data.mjs/actorData';
import { BaseActiveEffect } from './baseActiveEffect';
import { BaseItem } from './baseItem';
import { BaseToken } from './baseToken';
import { BaseUser } from './baseUser';

/**
 * The base Actor model definition which defines common behavior of an Actor document between both client and server.
 */
export declare class BaseActor extends Document<
  data.ActorData,
  InstanceType<ConfiguredDocumentClass<typeof BaseToken>>
> {
  /** @override */
  static get schema(): typeof data.ActorData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Actor';
      collection: 'actors';
      label: 'DOCUMENT.Actor';
      labelPlural: 'DOCUMENT.Actors';
      embedded: {
        ActiveEffect: typeof BaseActiveEffect;
        Item: typeof BaseItem;
      };
      isPrimary: true;
      hasSystemData: true;
      permissions: {
        create: 'ACTOR_CREATE';
      };
      types: string[];
    }
  >;
  /*
   * A reference to the Collection of embedded ActiveEffect instances in the Actor document, indexed by _id.
   */
  get effects(): this['data']['effects'];

  /**
   * A reference to the Collection of embedded Item instances in the Actor document, indexed by _id.
   */
  get items(): this['data']['items'];

  /**
   * The sub-type of Actor.
   */
  get type(): data.ActorData['type'];

  /** @override */
  protected _preCreate(
    data: ActorDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /** @override */
  protected _preUpdate(
    changed: DeepPartial<ActorDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;
}
