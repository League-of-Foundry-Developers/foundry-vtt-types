// FOUNDRY_VERSION: 10.291

import Document, { DocumentMetadata } from "../abstract/document.mjs";
import * as documents from "./module.mjs";
import * as fields from "../data/fields.mjs";

declare global {
  type RollTableData = BaseRollTable.Properties;
}

/**
 * The Document definition for a RollTable.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseRollTable extends BaseRollTable.Properties {}
declare class BaseRollTable extends Document<BaseRollTable.SchemaField, BaseRollTable.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Roll Table
   * @param context - Construction context options
   */
  constructor(data: BaseRollTable.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseRollTable.Metadata>;

  static override defineSchema(): BaseRollTable.Schema;

  static override migrateData(source: object): object;

  /**
   * The default icon used for newly created Macro documents
   */
  static DEFAULT_ICON: "icons/svg/d20-grey.svg";
}
export default BaseRollTable;

declare namespace BaseRollTable {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "RollTable";
      collection: "tables";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort"];
      embedded: { TableResult: "results" };
      label: "DOCUMENT.RollTable";
      labelPlural: "DOCUMENT.RollTables";
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
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
    name: fields.StringField<{ required: true; blank: false }>;

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
    description: fields.StringField;

    /**
     * A Collection of TableResult embedded documents which belong to this RollTable
     * @defaultValue `[]`
     */
    results: fields.EmbeddedCollectionField<documents.BaseTableResult>;

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
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

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
