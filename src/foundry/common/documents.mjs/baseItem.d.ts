import * as data from "../data/data.mjs";
import { Document } from "../abstract/module.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";
import { BaseActor } from "./baseActor";
import { BaseActiveEffect } from "./baseActiveEffect";
import { BaseUser } from "./baseUser";
import { ConfiguredDocumentClass } from "../../../types/helperTypes";

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
 * The base Item model definition which defines common behavior of an Item document between both client and server.
 */
export declare class BaseItem extends Document<
  data.ItemData,
  InstanceType<ConfiguredDocumentClass<typeof BaseActor>>,
  ItemMetadata
> {
  static override get schema(): typeof data.ItemData;

  static override get metadata(): ItemMetadata;

  /**
   * A reference to the Collection of ActiveEffect instances in the Item document, indexed by _id.
   */
  get effects(): this["data"]["effects"];

  /**
   * The sub-type of Item.
   */
  get type(): this["data"]["type"];

  override canUserModify(user: BaseUser, action: "create" | "update" | "delete", data?: object): boolean;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;
}
