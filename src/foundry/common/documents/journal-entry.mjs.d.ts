import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import * as CONST from '../constants.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseJournalEntrySchema extends DataSchema {
  /**
   * The _id which uniquely identifies this JournalEntry document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this JournalEntry
   */
  name: fields.StringField<{ required: true; blank: false }>;

  pages: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryPage, {}>;

  /**
   * The _id of a Folder which contains this JournalEntry
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The numeric sort value which orders this JournalEntry relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this JournalEntry
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'JournalEntry', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseJournalEntryMetadata = Merge<
  DocumentMetadata,
  {
    name: 'JournalEntry';
    collection: 'journal';
    compendiumIndexFields: ['_id', 'name', 'sort'];
    embedded: { JournalEntryPage: 'pages' };
    label: 'DOCUMENT.JournalEntry';
    labelPlural: 'DOCUMENT.JournalEntries';
    permissions: {
      create: 'JOURNAL_CREATE';
    };
  }
>;

type BaseJournalEntryShims = {
  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseJournalEntry['ownership'];
};

declare namespace BaseJournalEntry {
  export type Page =
    | { name: string; type: 'image'; src: string }
    | { name: string; type: 'text'; text: { format: typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML; content: string } };
}

/**
 * The Document definition for a JournalEntry.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
declare class BaseJournalEntry extends Document<
  BaseJournalEntrySchema,
  null,
  BaseJournalEntryMetadata,
  BaseJournalEntryShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseJournalEntryMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseJournalEntrySchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  protected override _initializeSource(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options?: object
  ): DataModel.SchemaToSource<this['schema']>;

  /* -------------------------------------------- */

  /**
   * Migrate old content and img field to individual pages.
   * @param source - Old source data which will be mutated in-place
   * @returns Page data that should be added to the document
   * @deprecated since v10
   */
  static migrateContentToPages(source: Record<string, unknown>): BaseJournalEntry.Page;
}

export default BaseJournalEntry;
