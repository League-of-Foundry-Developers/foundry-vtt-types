import * as data from '../data/data';
import { Document } from '../abstract/module';
import { DocumentMetadata } from '../abstract/document';
import { BaseActor } from './baseActor';
import { BaseActiveEffect } from './baseActiveEffect';
import { BaseUser } from './baseUser';
import { ConfiguredDocumentClass } from '../abstract/helperTypes';

/**
 * The Item document model.
 */
export declare class BaseItem extends Document<data.ItemData, InstanceType<ConfiguredDocumentClass<typeof BaseActor>>> {
  static get schema(): typeof data.ItemData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Item';
      collection: 'items';
      label: 'DOCUMENT.Item';
      embedded: {
        ActiveEffect: typeof BaseActiveEffect;
      };
      isPrimary: true;
      hasSystemData: true;
      types: string[];
      permissions: {
        create: 'ITEM_CREATE';
      };
    }
  >;

  /**
   * A reference to the Collection of ActiveEffect instances in the Item document, indexed by _id.
   */
  get effects(): this['data']['effects'];

  canUserModify(user: BaseUser, action: string, data?: object): boolean;

  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | foundry.CONST.EntityPermission,
    { exact }: { exact?: boolean }
  ): boolean;

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
