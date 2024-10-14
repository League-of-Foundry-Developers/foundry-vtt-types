import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type TableResultData = BaseTableResult.Properties;
}

/**
 * The Document definition for a TableResult.
 * Defines the DataSchema and common behaviors for a TableResult which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseTableResult extends Document<BaseTableResult.Schema, BaseTableResult.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Table Result
   * @param context - Construction context options
   */
  constructor(data: BaseTableResult.ConstructorData, context?: Document.ConstructionContext<BaseTableResult.Parent>);

  override parent: BaseTableResult.Parent;

  static override metadata: Readonly<BaseTableResult.Metadata>;

  static override defineSchema(): BaseTableResult.Schema;

  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
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
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BaseTableResult;

declare namespace BaseTableResult {
  type Parent = RollTable.ConfiguredInstance | null;

  // TODO: Remove "base" in v12
  type TypeNames = (typeof foundry.documents.BaseMacro)["metadata"]["coreTypes"][number] | "base";

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "TableResult";
      collection: "results";
      label: string;
      labelPlural: string;
      coreTypes: ["0", "1", "2"];
      permissions: {
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
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
    type: fields.StringField<{
      required: true;
      choices: CONST.TABLE_RESULT_TYPES[];
      initial: typeof CONST.TABLE_RESULT_TYPES.TEXT;
      validationError: "must be a value in CONST.TABLE_RESULT_TYPES";
    }>;

    /**
     * The text which describes the table result
     * @defaultValue `""`
     */
    text: fields.HTMLField<{ textSearch: true }>;

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
    documentId: fields.ForeignDocumentField<Document<DataSchema, any>, { idOnly: true }>;

    /**
     * The probabilistic weight of this result relative to other results
     * @defaultValue `null`
     */
    weight: fields.NumberField<{ required: true; integer: true; positive: true; nullable: false; initial: 1 }>;

    /**
     * A length 2 array of ascending integers which defines the range of dice roll
     * @defaultValue `[]`
     */
    range: fields.ArrayField<
      fields.NumberField<{ integer: true }>,
      fields.ArrayField.AssignmentElementType<fields.NumberField<{ integer: true }>>,
      fields.ArrayField.InitializedElementType<fields.NumberField<{ integer: true }>>,
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
