import type { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes.d.mts";
import type { ValueOf } from "../../../../types/utils.d.mts";
import type DocumentData from "../../abstract/data.d.mts";
import type * as documents from "../../documents.mjs/index.d.mts";
import type * as fields from "../fields.d.mts";

export interface FolderDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  type: DocumentField<foundry.CONST.FOLDER_DOCUMENT_TYPES> & {
    type: String;
    required: true;
    validate: (t: unknown) => t is foundry.CONST.FOLDER_DOCUMENT_TYPES;
    validationError: "Invalid Folder type provided";
  };
  description: fields.StringField;
  parent: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sorting: DocumentField<SortingModes> & {
    type: String;
    required: true;
    default: "a";
    validate: (mode: unknown) => mode is SortingModes;
    validationError: "Invalid Folder sorting mode";
  };
  sort: fields.IntegerSortField;
  color: fields.ColorField;
  flags: fields.ObjectField;
}

export interface FolderDataProperties {
  /**
   * The _id which uniquely identifies this Folder document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this Folder
   */
  name: string;

  /**
   * The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES
   */
  type: Exclude<foundry.CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;

  /**
   * An HTML description of the contents of this folder
   */
  description?: string | undefined;

  /**
   * The _id of a parent Folder which contains this Folder
   * @defaultValue `null`
   */
  parent: string | null;

  /**
   * The sorting mode used to organize documents within this Folder, in ["a", "m"]
   * @defaultValue `"a"`
   */
  sorting: SortingModes;

  /**
   * The numeric sort value which orders this Folder relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * A color string used for the background color of this Folder
   */
  color: string | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Folder">;
}

export interface FolderDataConstructorData {
  /**
   * The _id which uniquely identifies this Folder document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this Folder
   */
  name: string;

  /**
   * The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES
   */
  type: foundry.CONST.FOLDER_DOCUMENT_TYPES;

  /**
   * An HTML description of the contents of this folder
   */
  description?: string | null | undefined;

  /**
   * The _id of a parent Folder which contains this Folder
   * @defaultValue `null`
   */
  parent?: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseFolder>> | string | null | undefined;

  /**
   * The sorting mode used to organize documents within this Folder, in ["a", "m"]
   * @defaultValue `"a"`
   */
  sorting?: SortingModes | null | undefined;

  /**
   * The numeric sort value which orders this Folder relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * A color string used for the background color of this Folder
   */
  color?: string | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Folder"> | null | undefined;
}

export type FolderDataSource = PropertiesToSource<FolderDataProperties>;

/**
 * The data schema for a Folder document.
 */
export declare class FolderData extends DocumentData<
  FolderDataSchema,
  FolderDataProperties,
  FolderDataSource,
  FolderDataConstructorData,
  documents.BaseFolder
> {
  constructor(data: FolderDataConstructorData, document?: documents.BaseFolder | null);

  static override defineSchema(): FolderDataSchema;

  static SORTING_MODES: ["a", "m"];
}

export type SortingModes = ValueOf<typeof FolderData.SORTING_MODES>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FolderData extends FolderDataProperties {}
