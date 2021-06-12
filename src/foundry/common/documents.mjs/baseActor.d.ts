import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseActiveEffect } from './baseActiveEffect';
import { BaseItem } from './baseItem';
import * as data from '../data/data.mjs';

export declare class BaseActor extends Document<data.ActorData, null> {
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
