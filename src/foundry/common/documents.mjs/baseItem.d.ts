import * as data from "../data/data.mjs";
import { Document } from "../abstract/module.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";
import { BaseActor } from "./baseActor";
import { BaseActiveEffect } from "./baseActiveEffect";
import { BaseUser } from "./baseUser";
import { ConfiguredDocumentClass, DocumentSubTypes } from "../../../types/helperTypes";
import type { ItemDataConstructorData, ItemDataSchema } from "../data/data.mjs/itemData.js";

type ItemMetadata = Merge<
  DocumentMetadata,
  {
    name: "Item";
    collection: "items";
    label: "DOCUMENT.Item";
    labelPlural: "DOCUMENT.Items";
    embedded: {
      ActiveEffect: typeof BaseActiveEffect;
    };
    isPrimary: true;
    hasSystemData: true;
    types: string[];
    permissions: {
      create: "ITEM_CREATE";
    };
  }
>;

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
export declare class BaseItem extends Document<
  data.ItemData,
  InstanceType<ConfiguredDocumentClass<typeof BaseActor>>,
  ItemMetadata
> {
  /**
   * @param data    - Initial data from which to construct the Item (default `{}`)
   * @param context - Construction context options (default `{}`)
   */
  constructor(data?: ItemDataConstructorData, context?: DocumentConstructionContext);

  static override readonly metadata: Readonly<ItemMetadata>;

  static defineSchema(): ItemDataSchema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Item types which may exist.
   */
  static get TYPES(): DocumentSubTypes<"Item">[];

  override canUserModify(user: BaseUser, action: "create" | "update" | "delete", data?: object): boolean;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;

  // FIXME: inherit from ancestor class once it's updated
  static migrateData(data: object): data.ItemData;

  // FIXME: inherit from ancestor class once it's updated; 'options' should point to a namespaced interface for the shimData options object
  static shimData(data: data.ItemData, options: object): object;
}
