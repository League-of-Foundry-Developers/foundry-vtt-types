// FOUNDRY_VERSION: 10.291

import type { ConfiguredDocumentClass } from "../../../types/helperTypes.js";
import type Document from "../abstract/document.mjs";
import type { DocumentMetadata } from "../abstract/document.mjs";
import type * as fields from "../data/fields.mjs";
import type { CONST } from "../module.mjs.js";
import type * as documents from "./module.mjs";

declare global {
  type ItemData<TypeName extends BaseItem.TypeNames = BaseItem.TypeNames> = BaseItem.Properties<TypeName>;
}

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseItem<TypeName extends BaseItem.TypeNames = BaseItem.TypeNames> extends BaseItem.Properties<TypeName> {}
declare class BaseItem<TypeName extends BaseItem.TypeNames = BaseItem.TypeNames> extends Document<
  BaseItem.SchemaField<TypeName>,
  BaseItem.Metadata,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | null
> {
  /**
   * @param data    - Initial data from which to construct the Item
   * @param context - Construction context options
   */
  constructor(data: BaseItem.ConstructorData<TypeName>, context?: DocumentConstructionContext);

  override _source: BaseItem.Source<TypeName>;

  static override metadata: Readonly<BaseItem.Metadata>;

  static override defineSchema(): BaseItem.Schema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Item types which may exist.
   */
  static get TYPES(): BaseItem.TypeNames[];

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

  static override shimData(
    data: object,
    {
      embedded
    }?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    }
  ): object;
}
export default BaseItem;

declare namespace BaseItem {
  type TypeNames = fields.SystemDataField.TypeNames<typeof BaseItem>;

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

  type SchemaField<TypeName extends TypeNames> = fields.SchemaField<Schema<TypeName>>;
  type ConstructorData<TypeName extends TypeNames> = UpdateData<TypeName> &
    Required<Pick<UpdateData<TypeName>, "name" | "type">>;
  type UpdateData<TypeName extends TypeNames> = fields.SchemaField.InnerAssignmentType<Schema<TypeName>>;
  type Properties<TypeName extends TypeNames> = fields.SchemaField.InnerInitializedType<Schema<TypeName>>;
  type Source<TypeName extends TypeNames> = fields.SchemaField.InnerPersistedType<Schema<TypeName>>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this Item document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Item */
    name: fields.StringField<{ required: true; blank: false }>;

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
    img: fields.FilePathField<{ categories: "IMAGE"[]; initial: () => typeof BaseItem.DEFAULT_ICON }>;

    /**
     * The system data object which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.SystemDataField<typeof BaseItem, TypeName>;

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
