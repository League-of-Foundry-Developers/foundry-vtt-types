import * as data from '../data/data.mjs';
import { Document } from '../abstract/module.mjs';
import { DocumentMetadata } from '../abstract/document.mjs';

type JournalEntryMetadata = Merge<
  DocumentMetadata,
  {
    name: 'JournalEntry';
    collection: 'journal';
    label: 'DOCUMENT.JournalEntry';
    labelPlural: 'DOCUMENT.JournalEntries';
    isPrimary: true;
    permissions: {
      create: 'JOURNAL_CREATE';
    };
  }
>;

/**
 * The base JournalEntry model definition which defines common behavior of an JournalEntry document between both client and server.
 */
export declare class BaseJournalEntry extends Document<data.JournalEntryData, null, JournalEntryMetadata> {
  /** @override */
  static get schema(): typeof data.JournalEntryData;

  /** @override */
  static get metadata(): JournalEntryMetadata;
}
