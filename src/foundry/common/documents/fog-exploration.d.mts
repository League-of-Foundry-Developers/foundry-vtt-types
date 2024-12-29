import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The FogExploration Document.
 * Defines the DataSchema and common behaviors for FogExploration which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseFogExploration extends Document<"FogExploration", BaseFogExploration.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the FogExploration
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data?: BaseFogExploration.ConstructorData,
  //   context?: Document.ConstructionContext<BaseFogExploration.Parent>,
  // );

  override parent: BaseFogExploration.Parent;

  static override metadata: BaseFogExploration.Metadata;

  static override defineSchema(): BaseFogExploration.Schema;

  static #canModify(user: documents.BaseUser, doc: BaseFogExploration);

  /**
   * @privateRemarks _preUpdate is overridden but with no signature changes.
   * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
   */
}

export default BaseFogExploration;

declare namespace BaseFogExploration {
  type Parent = null;

  type Metadata = Document.MetadataFor<BaseFogExploration>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this FogExploration document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the Scene document to which this fog applies
     * @defaultValue `canvas?.scene?.id`
     */
    scene: fields.ForeignDocumentField<typeof documents.BaseScene, { initial: () => string | undefined }>;

    /**
     * The _id of the User document to which this fog applies
     * @defaultValue `null`
     */
    user: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

    /**
     * The base64 image/jpeg of the explored fog polygon
     * @defaultValue `null`
     */
    explored: fields.FilePathField<{ categories: ["IMAGE"]; required: true; base64: true }>;

    /**
     * The object of scene positions which have been explored at a certain vision radius
     * @defaultValue `{}`
     */
    positions: fields.ObjectField;

    /**
     * The timestamp at which this fog exploration was last updated
     * @defaultValue `Date.now()`
     */
    timestamp: fields.NumberField<{ nullable: false; initial: ReturnType<typeof Date.now> }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"FogExploration">;

    _stats: fields.DocumentStatsField;
  }
}
