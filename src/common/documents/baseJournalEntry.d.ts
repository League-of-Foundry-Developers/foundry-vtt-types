import * as data from '../data/data';
import { Document } from '../abstract/module';
import { DocumentMetadata } from '../abstract/document';

/**
 * The JournalEntry document model.
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
