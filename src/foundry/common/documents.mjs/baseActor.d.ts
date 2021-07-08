import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseActiveEffect } from './baseActiveEffect';
import { BaseItem } from './baseItem';
import * as data from '../data/data.mjs';
import { BaseUser } from './baseUser';
import { ConstructorDataType } from '../../../types/helperTypes';

//TODO Add Token as parent class once it is available
/**
 * The base Actor model definition which defines common behavior of an Actor document between both client and server.
 */
export declare class BaseActor extends Document<data.ActorData, Document<any, any>> {
  static get schema(): typeof data.ActorData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Actor';
      collection: 'actors';
      label: 'DOCUMENT.Actor';
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
   * Migrate the system data object to conform to data model defined by the current system version.
   * @see mergeObject
   * @param options - Options which customize how the system data is migrated.
   * @returns The migrated system data object, not yet saved to the database
   */
  migrateSystemData(options?: MigrateSystemDataOptions): object;

  /**
   * Perform preliminary operations before a Document of this type is created.
   * Pre-creation operations only occur for the client which requested the operation.
   * @param data    - The initial data used to create the document
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   */
  protected _preCreate(
    data: ConstructorDataType<data.ActorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param changed - The differential data that is changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   */
  protected _preUpdate(
    changed: DeepPartial<ConstructorDataType<data.ActorData>>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;
}

interface MigrateSystemDataOptions {
  /**
   * Retain keys which exist in the current data, but not the model
   * @defaultValue `false`
   */
  insertKeys?: boolean;

  /**
   * Retain inner-object values which exist in the current data, but not the model
   * @defaultValue `true`
   */
  insertValues?: boolean;

  /**
   * Require that data types match the model exactly to be retained
   * @defaultValue `false`
   */
  enforceTypes?: boolean;
}
