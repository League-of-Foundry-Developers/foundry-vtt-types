import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import * as CONST from '../constants.mjs';
import type { DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseJournalEntryPageTextSchema extends DataSchema {
  /** The content of the JournalEntryPage in a format appropriate for its type. */
  content: fields.HTMLField<{ required: false; initial: undefined }>;

  /** The format of the page's content, if any, in {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS} */
  format: fields.NumberField<{
    label: 'JOURNALENTRYPAGE.Format';
    initial: typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
    choices: ValueOf<typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS>[];
  }>;
}

interface BaseJournalEntryPageVideoSchema extends DataSchema {
  /** Automatically loop the video? */
  loop: fields.BooleanField<{ required: false; initial: undefined }>;

  /** Should the video play automatically? */
  autoplay: fields.BooleanField<{ required: false; initial: undefined }>;

  /** The volume level of any audio that the video file contains. */
  volume: fields.AlphaField<{ required: false; step: 0.01; initial: undefined }>;

  /** The starting point of the video, in seconds. */
  timestamp: fields.NumberField<{ required: false; positive: true; initial: undefined }>;
}

interface BaseJournalEntryPageSchema extends DataSchema {
  /** The _id which uniquely identifies this JournalEntryPage embedded document. */
  _id: fields.DocumentIdField<{}>;

  /** The text name of this page. */
  name: fields.StringField<{ required: true; blank: false; label: 'JOURNALENTRYPAGE.PageTitle' }>;

  /** The type of this page, in {@link BaseJournalEntryPage.TYPES}. */
  type: fields.StringField<{
    required: true;
    label: 'JOURNALENTRYPAGE.Type';
    choices: () => typeof BaseJournalEntryPage.TYPES;
    initial: 'text';
    validationError: 'The JournalEntryPage type must be in the array of types supported by the game system.';
  }>;

  /**
   * Data particular to text journal entry pages.
   */
  text: fields.SchemaField<BaseJournalEntryPageTextSchema, {}>;

  /**
   * Data particular to video journal entry pages.
   */
  video: fields.SchemaField<BaseJournalEntryPageVideoSchema, {}>;

  /**
   * The URI of the image or other external media to be used for this page.
   */
  src: fields.FilePathField<{ categories: ['IMAGE', 'VIDEO']; base64: true; label: 'JOURNALENTRYPAGE.Source' }>;

  /**
   * The numeric sort value which orders this page relative to its siblings.
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures the ownership of this page.
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags.
   */
  flags: FlagsField<'JournalEntryPage', {}>;
}

type BaseJournalEntryPageMetadata = Merge<
  DocumentMetadata,
  {
    name: 'JournalEntryPage';
    collection: 'pages';
    label: 'DOCUMENT.JournalEntryPage';
    labelPlural: 'DOCUMENT.JournalEntryPages';
    coreTypes: ['image', 'pdf', 'text', 'video'];
  }
>;

/**
 * The Document definition for a JournalEntryPage.
 * Defines the data schema and common behaviours for a JournalEntryPage which are shared between both client and server.
 */
declare class BaseJournalEntryPage extends Document<BaseJournalEntryPageSchema, null, BaseJournalEntryPageMetadata> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseJournalEntryPageMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseJournalEntryPageSchema;

  /**
   * The allowed set of JournalEntryPageData types which may exist.
   *
   * (initialized: `game.documentTypes?.JournalEntryPage || []`)
   */
  static get TYPES(): string[];

  /** {@inheritdoc} */
  override getUserLevel(user: documents.BaseUser): foundry.CONST.DOCUMENT_PERMISSION_LEVELS | null;
}

export default BaseJournalEntryPage;
