import * as data from '../data/data.mjs';
import { Document } from '../abstract/module.mjs';
import { DocumentMetadata } from '../abstract/document.mjs';

/**
 * The base JournalEntry model definition which defines common behavior of an JournalEntry document between both client and server.
 */
export declare class BaseJournalEntry extends Document<data.JournalEntryData> {
  static get schema(): typeof data.JournalEntryData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'JournalEntry';
      collection: 'journal';
      label: 'DOCUMENT.JournalEntry';
      isPrimary: true;
      permissions: {
        create: 'JOURNAL_CREATE';
      };
    }
  >;
}
