// FOUNDRY_VERSION: 10.291

import Document, { DocumentMetadata } from "../abstract/document.mjs";
import * as CONST from "../constants.mjs";
import * as fields from "../data/fields.mjs";
import type { documents } from "../module.mjs";

declare global {
  type TableResultData = BaseTableResult.Properties;
}

/**
 * The Document definition for a TableResult.
 * Defines the DataSchema and common behaviors for a TableResult which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseTableResult extends BaseTableResult.Properties {}
declare class BaseTableResult extends Document<BaseTableResult.SchemaField, BaseTableResult.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Table Result
   * @param context - Construction context options
   */
  constructor(data: BaseTableResult.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseTableResult.Metadata>;

  static override defineSchema(): BaseTableResult.Schema;

  static override migrateData(source: object): object;
}
export default BaseTableResult;

declare namespace BaseTableResult {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "TableResult";
      collection: "results";
      label: "DOCUMENT.TableResult";
      labelPlural: "DOCUMENT.TableResults";
      coreTypes: ["0", "1", "2"];
      permissions: {
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this TableResult embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * A result subtype from CONST.TABLE_RESULT_TYPES
     * @defaultValue `CONST.TABLE_RESULT_TYPES.TEXT`
     */
    type: fields.NumberField<{
      required: true;
      choices: CONST.TABLE_RESULT_TYPES[];
      initial: typeof CONST.TABLE_RESULT_TYPES.TEXT;
      validationError: "must be a value in CONST.TABLE_RESULT_TYPES";
    }>;

    /**
     * The text which describes the table result
     * @defaultValue see {@link fields.HTMLField}
     */
    text: fields.HTMLField;

    /**
     * An image file url that represents the table result
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * A named collection from which this result is drawn
     * @defaultValue `""`
     */
    documentCollection: fields.StringField;

    /**
     * The _id of a Document within the collection this result references
     * @defaultValue `null`
     */
    documentId: fields.ForeignDocumentField<Document, { idOnly: true }>;

    /**
     * The probabilistic weight of this result relative to other results
     * @defaultValue `1`
     */
    weight: fields.NumberField<{ required: true; integer: true; positive: true }>;

    /**
     * A length 2 array of ascending integers which defines the range of dice roll
     * @defaultValue `[]`
     */
    range: fields.ArrayField<
      fields.NumberField<{ integer: true }>,
      {
        validate: (r: [start: number, end: number]) => boolean;
        validationError: "must be a length-2 array of ascending integers";
      }
    >;

    /**
     * Has this result already been drawn (without replacement)
     * @defaultValue `false`
     */
    drawn: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"TableResult">;
  }
}
