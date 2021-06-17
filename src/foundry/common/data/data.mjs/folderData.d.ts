import DocumentData from '../../abstract/data.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import { PropertiesToSource } from '../../../../types/helperTypes';

interface FolderDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: DocumentField<ValueOf<typeof CONST.FOLDER_ENTITY_TYPES>> & {
    type: String;
    required: true;
    validate: (t: unknown) => t is ValueOf<typeof CONST.FOLDER_ENTITY_TYPES>;
    validationError: 'Invalid Folder type provided';
  };
  description: typeof fields.STRING_FIELD;
  parent: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sorting: DocumentField<ValueOf<typeof FolderData.SORTING_MODES>> & {
    type: String;
    required: true;
    default: 'a';
    validate: (mode: unknown) => mode is ValueOf<typeof FolderData.SORTING_MODES>;
    validationError: 'Invalid Folder sorting mode';
  };
  sort: typeof fields.INTEGER_SORT_FIELD;
  color: typeof fields.COLOR_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface FolderDataProperties {
  /**
   * The _id which uniquely identifies this Folder document
   */
  _id: string | null;

  /**
   * The name of this Folder
   */
  name: string;

  /**
   * The document type which this Folder contains, from CONST.FOLDER_ENTITY_TYPES
   */
  type: ValueOf<typeof CONST.FOLDER_ENTITY_TYPES>;

  /**
   * An HTML description of the contents of this folder
   */
  description?: string;

  /**
   * The _id of a parent Folder which contains this Folder
   * @defaultValue `null`
   */
  parent: string | null;

  /**
   * The sorting mode used to organize documents within this Folder, in ["a", "m"]
   * @defaultValue `'a'`
   */
  sorting: ValueOf<typeof FolderData.SORTING_MODES>;

  /**
   * The numeric sort value which orders this Folder relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * A color string used for the background color of this Folder
   */
  color?: string | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

/**
 * The data schema for a Folder document.
 */
export declare class FolderData extends DocumentData<
  FolderDataSchema,
  FolderDataProperties,
  PropertiesToSource<FolderDataProperties>,
  documents.BaseFolder
> {
  static defineSchema(): FolderDataSchema;

  static SORTING_MODES: ['a', 'm'];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface FolderData extends FolderDataProperties {}
