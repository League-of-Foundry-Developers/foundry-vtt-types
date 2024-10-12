import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./module.mts";

declare global {
  type RollTableData = BaseRollTable.Properties;
}

/**
 * The Document definition for a RollTable.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseRollTable extends Document<BaseRollTable.Schema, BaseRollTable.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Roll Table
   * @param context - Construction context options
   */
  constructor(data: BaseRollTable.ConstructorData, context?: Document.ConstructionContext<BaseRollTable.Parent>);

  override parent: BaseRollTable.Parent;

  static override metadata: Readonly<BaseRollTable.Metadata>;

  static override defineSchema(): BaseRollTable.Schema;

  /**
   * The default icon used for newly created Macro documents
   */
  static DEFAULT_ICON: "icons/svg/d20-grey.svg";

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BaseRollTable;

declare namespace BaseRollTable {
  type Parent = null;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "RollTable";
      collection: "tables";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      embedded: { TableResult: "results" };
      label: "DOCUMENT.RollTable";
      labelPlural: "DOCUMENT.RollTables";
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RollTable document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this RollTable
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image file path which provides the thumbnail artwork for this RollTable
     * @defaultValue `BaseRollTable.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: () => typeof BaseRollTable.DEFAULT_ICON;
    }>;

    /**
     * The HTML text description for this RollTable document
     * @defaultValue `""`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * A Collection of TableResult embedded documents which belong to this RollTable
     * @defaultValue `[]`
     */
    results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult, RollTable.ConfiguredInstance>;

    /**
     * The Roll formula which determines the results chosen from the table
     * @defaultValue `""`
     */
    formula: fields.StringField;

    /**
     * Are results from this table drawn with replacement?
     * @defaultValue `true`
     */
    replacement: fields.BooleanField<{ initial: true }>;

    /**
     * Is the Roll result used to draw from this RollTable displayed in chat?
     * @defaultValue `true`
     */
    displayRoll: fields.BooleanField<{ initial: true }>;

    /**
     * The _id of a Folder which contains this RollTable
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

    /**
     * The numeric sort value which orders this RollTable relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this RollTable
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"RollTable">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
