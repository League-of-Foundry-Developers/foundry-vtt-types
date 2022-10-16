import * as data from "../data/data.mjs";
import { Document } from "../abstract/module.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";
import type {
  JournalEntryDataConstructorData,
  JournalEntryDataSchema,
  JournalEntryDataSource
} from "../data/data.mjs/journalEntryData.js";

type JournalEntryMetadata = Merge<
  DocumentMetadata,
  {
    name: "JournalEntry";
    collection: "journal";
    label: "DOCUMENT.JournalEntry";
    labelPlural: "DOCUMENT.JournalEntries";
    isPrimary: true;
    permissions: {
      create: "JOURNAL_CREATE";
    };
  }
>;

/**
 * The Document definition for a JournalEntry.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
export declare class BaseJournalEntry extends Document<data.JournalEntryData, null, JournalEntryMetadata> {
  /**
   * @param data    - Initial data from which to construct the JournalEntry (default: `{}`)
   * @param context - Construction context options (default: `{}`)
   */
  constructor(data?: JournalEntryDataConstructorData, context?: DocumentConstructionContext);

  static readonly metadata: Readonly<JournalEntryMetadata>;

  static defineSchema(): JournalEntryDataSchema;

  static migrateData(data: object): data.JournalEntryData;

  // FIXME when DataModel is updated for v10
  // @ts-expect-error use options type from DataModel once it's updated
  static shimData(data: data.JournalEntryData, options): object;

  // FIXME when DataModel is updated for v10
  // @ts-expect-error use options type from DataModel once it's updated
  protected override _initializeSource(
    source: JournalEntryDataConstructorData,
    options?: object
  ): JournalEntryDataSource;

  /**
   * Migrate old content and img field to individual pages.
   * @param source - Old source data which will be mutated in-place
   * @returns Page data that should be added to the document
   * @deprecated since v10
   */
  static migrateContentToPages(source: object): data.JournalEntryPageData[];
}
