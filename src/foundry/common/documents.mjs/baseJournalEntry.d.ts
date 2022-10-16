import * as data from "../data/data.mjs";
import { Document } from "../abstract/module.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";

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
 * The base JournalEntry model definition which defines common behavior of an JournalEntry document between both client and server.
 */
export declare class BaseJournalEntry extends Document<data.JournalEntryData, null, JournalEntryMetadata> {
  static override get schema(): typeof data.JournalEntryData;

  static override get metadata(): JournalEntryMetadata;

  // FIXME when DataModel is updated for v10
  // @ts-expect-error inherit from DataModel
  static migrateData(data);

  // FIXME when DataModel is updated for v10
  // @ts-expect-error inherit from DataModel
  static shimData(data, options);

  // FIXME when DataModel is updated for v10
  // @ts-expect-error inherit from DataModel
  _initializeSource(source, options);

  /**
   * Migrate old content and img field to individual pages.
   * @param source - Old source data which will be mutated in-place
   * @returns Page data that should be added to the document
   * @deprecated since v10
   */
  static migrateContentToPages(source: object): data.JournalEntryPageData[];
}
