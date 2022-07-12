import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import { DataModel, DataSchema } from '../abstract/module.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseRollTableSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this RollTable document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this RollTable
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   */
  img: fields.FilePathField<{ categories: ['IMAGE']; initial: () => typeof BaseRollTable.DEFAULT_ICON }>;

  /**
   * The HTML text description for this RollTable document
   */
  description: fields.StringField<{}>;

  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   * (default: `[]`)
   */
  results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult, {}>;

  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula: fields.StringField<{}>;

  /**
   * Are results from this table drawn with replacement?
   * (default: `true`)
   */
  replacement: fields.BooleanField<{ initial: true }>;

  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   * (default: `true`)
   */
  displayRoll: fields.BooleanField<{ initial: true }>;

  /**
   * The _id of a Folder which contains this RollTable
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this RollTable
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'RollTable', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseRollTableMetadata = Merge<
  DocumentMetadata,
  {
    name: 'RollTable';
    collection: 'tables';
    compendiumIndexFields: ['_id', 'name', 'sort'];
    embedded: { TableResult: 'results' };
    label: 'DOCUMENT.RollTable';
    labelPlural: 'DOCUMENT.RollTables';
  }
>;

type BaseRollTableShims = {
  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseRollTable['ownership'];
};

/**
 * The Document definition for a RollTable.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
declare class BaseRollTable extends Document<BaseRollTableSchema, null, BaseRollTableMetadata, BaseRollTableShims> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritDoc} */
  static override readonly metadata: BaseRollTableMetadata;

  /** {@inheritDoc DataModel.defineSchema} */
  static override defineSchema(): BaseRollTableSchema;

  /**
   * The default icon used for newly created Macro documents
   *
   * (initialized: `'icons/svg/d20-grey.svg'`)
   */
  static DEFAULT_ICON: string;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritDoc DataModel.migrateData} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseRollTable;
