import type { AnyObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

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

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Item";

  override parent: Item.Parent;

  override system: Document.SystemFor<"Item", SubType>;

  static get TYPES(): BaseItem.SubType[];

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Item.Implementation | Item.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Item.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Item.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Item.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Item.DatabaseOperation.Update>,
  ): Promise<Item.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Item.DatabaseOperation.Delete>,
  ): Promise<Item.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Item.CreateData | Item.CreateData[],
    operation?: Document.Database.CreateOperation<Item.DatabaseOperation.Create<Temporary>>,
  ): Promise<Item.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Item.Implementation | null;

  protected _preCreate(
    data: Item.CreateData,
    options: Item.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Item.CreateData, options: Item.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Item.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Item.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Item.Implementation[],
    operation: Item.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Item.UpdateData,
    options: Item.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Item.UpdateData,
    options: Item.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

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

  protected _preDelete(
    options: Item.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Item.DatabaseOperation.OnDeleteOperation, userId: string): void;

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

  protected static _schema: SchemaField<Item.Schema>;

  static get schema(): SchemaField<Item.Schema>;

  static validateJoint(data: Item.Source): void;

  static override fromSource(
    source: Item.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Item.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Item.Schema, DataModel.Any | null>;
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
  interface Properties extends SchemaField.InitializedData<Schema> {}

  /**
   * @deprecated {@link BaseItem.SubType | `BaseItem.SubType`}
   */
  type TypeNames = Game.Model.TypeNames<"Item">;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseItem.Schema>`}
   */
  interface SchemaField extends foundry.data.fields.SchemaField<Schema> {}

  /**
   * @deprecated {@link BaseItem.CreateData | `BaseItem.CreateData`}
   */
  interface ConstructorData extends SchemaField.CreateData<Schema> {}
}
