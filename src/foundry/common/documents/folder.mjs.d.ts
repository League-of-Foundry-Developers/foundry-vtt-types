import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as fields from '../data/fields.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import type { DocumentStatsSchema } from '../data/data.mjs.js';
import type { FlagsField } from '../data/flagsField.js';

interface BaseFolderSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Folder document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this Folder
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES
   */
  type: fields.StringField<{ required: true; choices: CONST.FOLDER_DOCUMENT_TYPES[] }>;

  /**
   * An HTML description of the contents of this folder
   */
  description: fields.StringField<{}>;

  /**
   * The _id of a parent Folder which contains this Folder
   */
  folder: fields.ForeignDocumentField<typeof BaseFolder, {}>;

  /**
   * The sorting mode used to organize documents within this Folder, in ["a", "m"]
   * (default: `a`)
   */
  sorting: fields.StringField<{ required: true; initial: 'a'; choices: typeof BaseFolder.SORTING_MODES }>;

  /**
   * The numeric sort value which orders this Folder relative to its siblings
   */
  sort: typeof BaseFolder.SORT_FIELD;

  /**
   * A color string used for the background color of this Folder
   */
  color: fields.ColorField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Folder', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseFolderMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Folder';
    collection: 'folders';
    label: 'DOCUMENT.Folder';
    labelPlural: 'DOCUMENT.Folders';
    coreTypes: CONST.FOLDER_DOCUMENT_TYPES;
  }
>;

type BaseFolderShims = {
  /**
   * Remove parent collision
   * @deprecated since v10
   */
  parent: BaseFolder['folder'];
};

declare namespace BaseFolder {
  export interface SortingModes {
    ALPHABETICAL: 'a';
    MANUAL: 'm';
  }
}

/**
 * The Document definition for a Folder.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
declare class BaseFolder extends Document<
  BaseFolderSchema,
  // BaseFolder,
  null,
  BaseFolderMetadata,
  BaseFolderShims
> {
  /* ---------------------------------------- */
  /*  Model Configuration                     */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseFolderMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseFolderSchema;

  /**
   * Allow folder sorting modes
   */
  static SORTING_MODES: ValueOf<BaseFolder.SortingModes>[];

  /**
   * A reusable sort field definition that other document data types can re-purpose.
   */
  static SORT_FIELD: fields.NumberField<{
    required: true;
    nullable: false;
    integer: true;
    initial: 0;
    label: 'FOLDER.DocumentSort';
    hint: 'FOLDER.DocumentSortHint';
  }>;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseFolder;
