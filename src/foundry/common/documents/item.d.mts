import type { AnyObject, InexactPartial } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseItem extends Document<"Item", BaseItem.Schema, any> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseItem.TypeNames[];
  /**
   * @param data    - Initial data from which to construct the Item
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: BaseItem.ConstructorData, context?: Document.ConstructionContext<BaseItem.Parent>);

  override parent: BaseItem.Parent;

  override _source: BaseItem.Source;

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
  static getDefaultArtwork(itemData: BaseItem.ConstructorData): { img: string };

  override canUserModify(user: documents.BaseUser, action: "create" | "delete" | "update", data?: AnyObject): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  static override migrateData(source: AnyObject): AnyObject;
}

export default BaseItem;

declare namespace BaseItem {
  type Parent = Actor.ConfiguredInstance | null;

  type TypeNames = Game.Model.TypeNames<"Item">;

  type Metadata = Document.MetadataFor<BaseItem>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Item document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Item */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** An Item subtype which configures the system data model applied */
    type: fields.DocumentTypeField<typeof BaseItem>;

    /**
     * An image file path which provides the artwork for this Item
     * @defaultValue `null`
     */
    img: fields.FilePathField<{
      categories: "IMAGE"[];
      initial: (data: unknown) => string;
    }>;

    /**
     * The system data object which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseItem>;

    /**
     * A collection of ActiveEffect embedded Documents
     * @defaultValue `[]`
     */
    effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, Item.ConfiguredInstance>;

    /**
     * The _id of a Folder which contains this Item
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Item relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Item
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Item">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
