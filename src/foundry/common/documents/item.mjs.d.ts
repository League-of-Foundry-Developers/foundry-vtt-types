import type { ConfiguredDocumentClass } from "../../../types/helperTypes.js";
import type Document from "../abstract/document.mjs";
import type { DocumentMetadata } from "../abstract/document.mjs";
import type * as fields from "../data/fields.mjs";
import type { CONST } from "../module.mjs.js";
import type * as documents from "./module.mjs";

declare global {
  type ItemData<Name extends keyof ItemSourceConfig = keyof ItemSourceConfig> = BaseItem.Properties<Name>;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ItemPropertiesConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ItemSourceConfig {}
}

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseItem<Name extends keyof ItemSourceConfig = keyof ItemSourceConfig> extends BaseItem.Properties<Name> {}
declare class BaseItem<Name extends keyof ItemSourceConfig = keyof ItemSourceConfig> extends Document<
  BaseItem.SchemaField<Name>,
  BaseItem.Metadata,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | null
> {
  /**
   * @param data    - Initial data from which to construct the Item
   * @param context - Construction context options
   */
  constructor(data: BaseItem.ConstructorData<Name>, context?: DocumentConstructionContext);

  _source: BaseItem.Source<Name>;

  static override metadata: Readonly<BaseItem.Metadata>;

  static override defineSchema(): BaseItem.Schema<keyof ItemSourceConfig>;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Item types which may exist.
   */
  static get TYPES(): string[];

  override canUserModify(
    user: documents.BaseUser,
    action: "create" | "delete" | "update",
    data?: object | undefined
  ): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    {
      exact
    }?: {
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact?: boolean;
    }
  ): boolean;

  static override migrateData(source: object): object;

  static override shimData(data: object, { embedded }?: { embedded?: boolean } | undefined): object;
}
export default BaseItem;

declare namespace BaseItem {
  type ConfigName = "Item";

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Item";
      collection: "items";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort"];
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

  type SchemaField<Name extends keyof ItemSourceConfig> = fields.SchemaField<Schema<Name>>;
  type ConstructorData<Name extends keyof ItemSourceConfig> = UpdateData<Name> &
    Required<Pick<UpdateData<Name>, "name" | "type">>;
  type UpdateData<Name extends keyof ItemSourceConfig> = fields.SchemaField.AssignmentType<Schema<Name>>;
  type Properties<Name extends keyof ItemSourceConfig> = fields.SchemaField.InitializedType<Schema<Name>>;
  type Source<Name extends keyof ItemSourceConfig> = fields.SchemaField.PersistedType<Schema<Name>>;

  interface Schema<Name extends keyof ItemSourceConfig = keyof ItemSourceConfig> extends DataSchema {
    /**
     * The _id which uniquely identifies this Item document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this Item
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false }>;

    /**
     * An Item subtype which configures the system data model applied
     * @defaultValue `""`
     */
    type: fields.StringField<
      {
        required: true;
        choices: () => typeof BaseItem.TYPES;
        validationError: "must be in the array of Item types defined by the game system";
      },
      Name,
      Name,
      Name
    >;

    /**
     * An image file path which provides the artwork for this Item
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: "IMAGE"[]; initial: () => typeof BaseItem.DEFAULT_ICON }>;

    /**
     * The system data object which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.SystemDataField<
      typeof BaseItem,
      {},
      DeepPartial<ItemSourceConfig[Name]>,
      ItemPropertiesConfig[Name],
      ItemSourceConfig[Name]
    >;

    /**
     * A collection of ActiveEffect embedded Documents
     * @defaultValue `[]`
     */
    effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect<documents.BaseItem>>;

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
     * @defaultValue `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Item">;

    /**
     * An object of creation and access information
     * @defaultValue
     * ```typescript
     * {
     *   systemId: null,
     *   systemVersion: null,
     *   coreVersion: null,
     *   createdTime: null,
     *   modifiedTime: null,
     *   lastModifiedBy: null
     * }
     * ```
     */
    _stats: fields.DocumentStatsField;
  }
}
