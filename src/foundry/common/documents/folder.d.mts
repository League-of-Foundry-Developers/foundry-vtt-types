// import type { ConfiguredDocumentClassForName } from "../../../types/helperTypes.d.mts";
import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.mts";
import type { CONST } from "../module.mts";

declare global {
  type FolderData = BaseFolder.Properties;
}

/**
 * The Document definition for a Folder.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
interface BaseFolder extends BaseFolder.Properties {}
declare class BaseFolder extends Document<BaseFolder.SchemaField, BaseFolder.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Folder
   * @param context - Construction context options
   */
  constructor(data: BaseFolder.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseFolder.Metadata>;

  static override defineSchema(): BaseFolder.Schema;

  static override validateJoint(data: fields.SchemaField.InnerAssignmentType<BaseFolder.Schema>): void;

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

  static override migrateData(source: object): object;

  static override shimData(
    data: object,
    {
      embedded,
    }?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): object;

  // TODO: `'Folder' is referenced directly or indirectly in its own base expression.`
  // static override get(
  //   documentId: string,
  //   options: InexactPartial<{ pack: string }>,
  // ): InstanceType<ConfiguredDocumentClassForName<"Folder">> | null;
}
export default BaseFolder;

declare namespace BaseFolder {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Folder";
      collection: "folders";
      label: "DOCUMENT.Folder";
      labelPlural: "DOCUMENT.Folders";
      coreTypes: typeof CONST.FOLDER_DOCUMENT_TYPES;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData & Required<Pick<UpdateData, "name" | "type">>;
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
    type: fields.StringField<{ required: true; choices: CONST.FOLDER_DOCUMENT_TYPES[] }>;

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
