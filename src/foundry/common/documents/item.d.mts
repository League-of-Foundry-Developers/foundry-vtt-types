import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

interface _Schema extends Item.Schema {
  // For performance reasons don't bother calculating the `system` field.
  // This is overridden anyways.
  system: any;
}

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseItem<out SubType extends Item.SubType = Item.SubType> extends Document<
  "Item",
  _Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the Item
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: BaseItem.ConstructorData, context?: Document.ConstructionContext<BaseItem.Parent>);

  static override metadata: BaseItem.Metadata;

  static override defineSchema(): BaseItem.Schema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided item data.
   * @param itemData - The source item data
   * @returns Candidate item image
   */
  static getDefaultArtwork(itemData: BaseItem.CreateData): { img: string };

  override canUserModify(user: User.Implementation, action: "create" | "delete" | "update", data?: AnyObject): boolean;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  static override migrateData(source: AnyObject): AnyObject;

  /**
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overrideable.
   */

  static " __fvtt_types_internal_document_name_static": "Item";

  override parent: Item.Parent;

  override system: Document.SystemFor<"Item", SubType>;

  static get TYPES(): BaseItem.SubType[];

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Item.Implementation | Item.CreateData> | undefined,
    operation?: Item.DatabaseOperation.Create<Temporary>,
  ): Promise<Array<Document.StoredIf<Item.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Item.UpdateData[] | undefined,
    operation?: Item.DatabaseOperation.Update,
  ): Promise<Item.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Item.DatabaseOperation.Delete,
  ): Promise<Item.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Item.CreateData | Item.CreateData[],
    operation?: Item.DatabaseOperation.Create<Temporary>,
  ): Promise<Item.Implementation | undefined>;

  static get(documentId: string, options?: Item.DatabaseOperation.Get): Item.Implementation | null;

  protected static _preCreateOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected static _preUpdateOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected static _preDeleteOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;
}

export default BaseItem;

declare namespace BaseItem {
  export import Metadata = Item.Metadata;
  export import SubType = Item.SubType;
  export import Parent = Item.Parent;
  export import Stored = Item.Stored;
  export import Source = Item.Source;
  export import PersistedData = Item.PersistedData;
  export import CreateData = Item.CreateData;
  export import InitializedData = Item.InitializedData;
  export import UpdateData = Item.UpdateData;
  export import Schema = Item.Schema;
  export import DatabaseOperation = Item.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  interface Properties extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * @deprecated {@link BaseItem.SubType | `BaseItem.SubType`}
   */
  type TypeNames = Game.Model.TypeNames<"Item">;

  /**
   * @deprecated {@link fields.SchemaField | `fields.SchemaField<BaseItem.Schema>`}
   */
  interface SchemaField extends fields.SchemaField<Schema> {}

  /**
   * @deprecated {@link BaseItem.CreateData | `BaseItem.CreateData`}
   */
  interface ConstructorData extends fields.SchemaField.CreateData<Schema> {}
}
