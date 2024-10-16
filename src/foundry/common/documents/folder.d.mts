import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

declare global {
  type FolderData = BaseFolder.Properties;
}

/**
 * The Document definition for a Folder.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseFolder extends Document<BaseFolder.Schema, BaseFolder.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Folder
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseFolder.ConstructorData, context?: Document.ConstructionContext<BaseFolder.Parent>);

  override parent: BaseFolder.Parent;

  static override metadata: Readonly<BaseFolder.Metadata>;

  static override defineSchema(): BaseFolder.Schema;

  static override validateJoint(data: fields.SchemaField.InnerAssignmentType<BaseFolder.Schema>): void;

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

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

  // TODO: `Return type annotation circularly references itself.`
  // static override get(documentId: string, options: InexactPartial<{ pack: string }>): Folder.ConfiguredInstance | null;
}

export default BaseFolder;

declare namespace BaseFolder {
  type Parent = null;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "Folder";
      collection: "folders";
      label: string;
      labelPlural: string;
      coreTypes: typeof CONST.FOLDER_DOCUMENT_TYPES;
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
     * The _id which uniquely identifies this Folder document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Folder */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES */
    type: fields.StringField<{ required: true; choices: foundry.CONST.FOLDER_DOCUMENT_TYPES[] }>;

    /**
     * An HTML description of the contents of this folder
     * @defaultValue `""`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * The _id of a parent Folder which contains this Folder
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<BaseFolder>;

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
