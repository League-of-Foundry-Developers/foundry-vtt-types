import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type ItemData = BaseItem.Properties;
}

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
declare class BaseItem extends Document<BaseItem.Schema, BaseItem.Metadata, Actor.ConfiguredInstance | null> {
  /**
   * @param data    - Initial data from which to construct the Item
   * @param context - Construction context options
   */
  constructor(data: BaseItem.ConstructorData, context?: DocumentConstructionContext);

  override _source: BaseItem.Source;

  static override metadata: Readonly<BaseItem.Metadata>;

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

  /**
   * The allowed set of Item types which may exist.
   */
  static get TYPES(): BaseItem.TypeNames[];

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

  static override shimData(
    data: AnyObject,
    options: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}
export default BaseItem;

declare namespace BaseItem {
  type TypeNames = fields.TypeDataField.TypeNames<typeof BaseItem>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Item";
      collection: "items";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: { ActiveEffect: "effects" };
      label: "DOCUMENT.Item";
      labelPlural: "DOCUMENT.Items";
      permissions: { create: "ITEM_CREATE" };

      /**
       * @deprecated since v10, BaseItem.metadata.types is deprecated since v10 in favor of BaseItem.TYPES.
       */
      types: typeof BaseItem.TYPES;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this Item document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Item */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** An Item subtype which configures the system data model applied */
    type: fields.StringField<
      {
        required: true;
        choices: () => typeof BaseItem.TYPES;
        validationError: "must be in the array of Item types defined by the game system";
      },
      TypeName,
      TypeName,
      TypeName
    >;

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
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

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
