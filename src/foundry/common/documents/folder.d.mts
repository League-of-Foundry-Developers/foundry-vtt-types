import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Folder Document.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFolder<SubType extends BaseFolder.TypeNames = BaseFolder.TypeNames> extends Document<
  "Folder",
  BaseFolder.Schema,
  any
> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseFolder.TypeNames[];

  type: SubType;

  /**
   * @param data    - Initial data from which to construct the Folder
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseFolder.ConstructorData, context?: Document.ConstructionContext<BaseFolder.Parent>);

  override parent: BaseFolder.Parent;

  static override metadata: BaseFolder.Metadata;

  static override defineSchema(): BaseFolder.Schema;

  // NOTE(LukeAbby): The `validateJoint` method override was left off because it didn't change the signature and it also seemed to cause a loop.
  // See: https://gist.github.com/LukeAbby/43ee5c2a39cd33f3fac693d1d4a5653f

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

  // Doesn't affect type, "Return Type circularly references itself"
  // static override get(documentId: string, options: NullishProps<{ pack: string }>): Folder.ConfiguredInstance | null;

  static " __fvtt_types_internal_document_name": "Folder";
}

export default BaseFolder;

declare namespace BaseFolder {
  type Parent = null;

  type TypeNames = Game.Model.TypeNames<"Folder">;

  type Metadata = Document.MetadataFor<"Folder">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Folder document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Folder */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES */
    type: fields.DocumentTypeField<typeof BaseFolder>;

    /**
     * An HTML description of the contents of this folder
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * The _id of a parent Folder which contains this Folder
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof BaseFolder>;

    /**
     * The sorting mode used to organize documents within this Folder, in ["a", "m"]
     * @defaultValue `"a"`
     */
    sorting: fields.StringField<{ required: true; initial: "a"; choices: typeof BaseFolder.SORTING_MODES }>;

    /**
     * The numeric sort value which orders this Folder relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * A color string used for the background color of this Folder
     * @defaultValue `null`
     */
    color: fields.ColorField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Folder">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
